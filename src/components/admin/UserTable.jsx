import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Flame, Zap, ArrowUpDown, MailX, MailCheck } from "lucide-react";

function daysSince(dateStr) {
  if (!dateStr) return null;
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function statusFor(user) {
  const d = daysSince(user.last_active_date);
  if (d === null) return { label: "Never", color: "bg-slate-100 text-slate-600" };
  if (d <= 1) return { label: "Active", color: "bg-emerald-100 text-emerald-700" };
  if (d <= 7) return { label: "Idle", color: "bg-amber-100 text-amber-700" };
  if (d <= 14) return { label: "At risk", color: "bg-orange-100 text-orange-700" };
  return { label: "Churned", color: "bg-red-100 text-red-700" };
}

export default function UserTable({ users }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("last_active");
  const [sortDir, setSortDir] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    let list = users.filter(u => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (u.email?.toLowerCase().includes(q) || u.full_name?.toLowerCase().includes(q));
    });
    if (statusFilter !== "all") {
      list = list.filter(u => statusFor(u).label.toLowerCase() === statusFilter);
    }
    list = [...list].sort((a, b) => {
      let av, bv;
      if (sortBy === "last_active") { av = a.last_active_date || ""; bv = b.last_active_date || ""; }
      else if (sortBy === "xp") { av = a.xp_total || 0; bv = b.xp_total || 0; }
      else if (sortBy === "streak") { av = a.streak_days || 0; bv = b.streak_days || 0; }
      else if (sortBy === "created") { av = a.created_date || ""; bv = b.created_date || ""; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [users, search, sortBy, sortDir, statusFilter]);

  const toggleSort = (key) => {
    if (sortBy === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(key); setSortDir("desc"); }
  };

  const SortBtn = ({ k, children }) => (
    <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 hover:text-foreground transition-colors">
      {children} <ArrowUpDown className="w-3 h-3 opacity-50" />
    </button>
  );

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-1 flex-wrap">
            {["all", "active", "idle", "at risk", "churned", "never"].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                  statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border">
                <th className="text-left font-semibold py-2 pr-3">User</th>
                <th className="text-left font-semibold py-2 pr-3">SFI</th>
                <th className="text-left font-semibold py-2 pr-3">Status</th>
                <th className="text-left font-semibold py-2 pr-3"><SortBtn k="last_active">Last active</SortBtn></th>
                <th className="text-left font-semibold py-2 pr-3"><SortBtn k="streak">Streak</SortBtn></th>
                <th className="text-left font-semibold py-2 pr-3"><SortBtn k="xp">XP</SortBtn></th>
                <th className="text-left font-semibold py-2 pr-3"><SortBtn k="created">Joined</SortBtn></th>
                <th className="text-left font-semibold py-2">Emails</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 200).map(u => {
                const status = statusFor(u);
                const days = daysSince(u.last_active_date);
                return (
                  <tr key={u.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-2.5 pr-3">
                      <div className="font-medium truncate max-w-[180px]">{u.full_name || "—"}</div>
                      <div className="text-xs text-muted-foreground truncate max-w-[180px]">{u.email}</div>
                    </td>
                    <td className="py-2.5 pr-3 text-xs">{u.sfi_level || "—"}</td>
                    <td className="py-2.5 pr-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
                    </td>
                    <td className="py-2.5 pr-3 text-xs text-muted-foreground">
                      {days === null ? "Never" : days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days}d ago`}
                    </td>
                    <td className="py-2.5 pr-3">
                      {u.streak_days > 0 ? (
                        <span className="inline-flex items-center gap-1 text-orange-600 font-semibold">
                          <Flame className="w-3 h-3" /> {u.streak_days}
                        </span>
                      ) : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className="inline-flex items-center gap-1 text-primary font-semibold">
                        <Zap className="w-3 h-3" /> {(u.xp_total || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-2.5 pr-3 text-xs text-muted-foreground">
                      {u.created_date ? new Date(u.created_date).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-2.5">
                      {u.email_reminders_disabled
                        ? <MailX className="w-4 h-4 text-red-500" title="Unsubscribed" />
                        : <MailCheck className="w-4 h-4 text-emerald-600" title="Subscribed" />}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length > 200 && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              Showing first 200 of {filtered.length} matching users
            </p>
          )}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No users match your filter</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}