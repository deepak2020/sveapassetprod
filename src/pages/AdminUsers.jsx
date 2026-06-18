import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Users, UserCheck, UserMinus, UserX, Flame, Zap, TrendingUp, MailX } from "lucide-react";
import StatCard from "../components/admin/StatCard";
import ActivityChart from "../components/admin/ActivityChart";
import UserTable from "../components/admin/UserTable";
import EmailStats from "../components/admin/EmailStats";

function daysSince(dateStr) {
  if (!dateStr) return null;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24));
}

export default function AdminUsers() {
  const { data: me, isLoading: meLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-all-users"],
    queryFn: () => base44.entities.User.list("-created_date", 1000),
    enabled: me?.role === "admin",
  });

  if (meLoading) return null;

  if (me?.role !== "admin") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <UserX className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h1 className="font-display text-2xl font-bold">Admins only</h1>
        <p className="text-muted-foreground mt-2">You need admin access to view this page.</p>
      </div>
    );
  }

  // Compute headline stats
  const total = users.length;
  const active24h = users.filter(u => { const d = daysSince(u.last_active_date); return d !== null && d <= 1; }).length;
  const active7d = users.filter(u => { const d = daysSince(u.last_active_date); return d !== null && d <= 7; }).length;
  const atRisk = users.filter(u => { const d = daysSince(u.last_active_date); return d !== null && d > 1 && d <= 14; }).length;
  const churned = users.filter(u => { const d = daysSince(u.last_active_date); return d === null || d > 14; }).length;
  const withStreak = users.filter(u => (u.streak_days || 0) >= 3).length;
  const totalXp = users.reduce((s, u) => s + (u.xp_total || 0), 0);
  const unsubscribed = users.filter(u => u.email_reminders_disabled).length;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const newThisWeek = users.filter(u => u.created_date && u.created_date >= sevenDaysAgo).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">User Activity Board</h1>
        <p className="text-muted-foreground mt-1">Track who's active, who's at risk, and who's churning.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Top row — engagement funnel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={Users} label="Total users" value={total.toLocaleString()} sublabel={`+${newThisWeek} this week`} color="primary" />
            <StatCard icon={UserCheck} label="Active 24h" value={active24h} sublabel={`${total ? Math.round(active24h / total * 100) : 0}% of base`} color="green" />
            <StatCard icon={UserMinus} label="At risk" value={atRisk} sublabel="Inactive 2–14 days" color="orange" />
            <StatCard icon={UserX} label="Churned" value={churned} sublabel="14+ days or never" color="red" />
          </div>

          {/* Second row — engagement health */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={UserCheck} label="Active 7d" value={active7d} sublabel="Weekly active users" color="blue" />
            <StatCard icon={Flame} label="Streaks ≥ 3" value={withStreak} sublabel="Committed learners" color="orange" />
            <StatCard icon={Zap} label="Total XP" value={totalXp.toLocaleString()} sublabel="Across all users" color="primary" />
            <StatCard icon={MailX} label="Unsubscribed" value={unsubscribed} sublabel="Email opt-outs" color="gray" />
          </div>

          {/* Activity chart */}
          <ActivityChart users={users} />

          {/* Email performance */}
          <EmailStats />

          {/* User table */}
          <UserTable users={users} />
        </>
      )}
    </div>
  );
}