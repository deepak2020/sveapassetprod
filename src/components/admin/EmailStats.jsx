import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, CheckCircle2, Eye, MousePointerClick, AlertCircle, UserMinus } from "lucide-react";

const TAG_LABELS = {
  inactivity_reminder: { label: "Daily inactivity reminders", color: "bg-orange-50 border-orange-200" },
  churned_reminder: { label: "Churned re-engagement", color: "bg-red-50 border-red-200" },
  weekly_summary: { label: "Weekly Sunday summary", color: "bg-blue-50 border-blue-200" },
};

function Metric({ icon: Icon, label, value, total }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>
      <div className="mt-0.5">
        <span className="text-lg font-bold">{value.toLocaleString()}</span>
        {total > 0 && value !== total && (
          <span className="text-xs text-muted-foreground ml-1.5">{pct}%</span>
        )}
      </div>
    </div>
  );
}

export default function EmailStats() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["brevo-stats", 30],
    queryFn: async () => {
      const res = await base44.functions.invoke("getBrevoStats", { days: 30 });
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Email performance</h3>
            <p className="text-xs text-muted-foreground">Last 30 days · powered by Brevo</p>
          </div>
          <a
            href="https://app.brevo.com/statistics/email"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline"
          >
            Open Brevo →
          </a>
        </div>

        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive">Failed to load stats: {error.message}</p>
        )}

        {data?.stats && (
          <div className="space-y-3">
            {Object.entries(TAG_LABELS).map(([tag, meta]) => {
              const s = data.stats[tag];
              if (!s || s.error) {
                return (
                  <div key={tag} className={`rounded-xl border p-4 ${meta.color}`}>
                    <p className="font-semibold text-sm">{meta.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {s?.error ? `Error: ${s.error}` : "No data"}
                    </p>
                  </div>
                );
              }
              const sent = s.requests || 0;
              const delivered = s.delivered || 0;
              const opens = s.uniqueOpens || s.opens || 0;
              const clicks = s.uniqueClicks || s.clicks || 0;
              const bounces = (s.hardBounces || 0) + (s.softBounces || 0);
              const unsubs = s.unsubscribed || 0;

              return (
                <div key={tag} className={`rounded-xl border p-4 ${meta.color}`}>
                  <p className="font-semibold text-sm mb-3">{meta.label}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    <Metric icon={Mail} label="Sent" value={sent} total={sent} />
                    <Metric icon={CheckCircle2} label="Delivered" value={delivered} total={sent} />
                    <Metric icon={Eye} label="Opens" value={opens} total={delivered} />
                    <Metric icon={MousePointerClick} label="Clicks" value={clicks} total={delivered} />
                    <Metric icon={AlertCircle} label="Bounced" value={bounces} total={sent} />
                    <Metric icon={UserMinus} label="Unsubs" value={unsubs} total={delivered} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}