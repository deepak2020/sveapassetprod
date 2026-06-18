import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// Builds last-N-days active-user counts from a list of users with last_active_date.
function buildSeries(users, days = 14) {
  const today = new Date();
  const series = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en", { month: "short", day: "numeric" });
    const count = users.filter(u => u.last_active_date === iso).length;
    series.push({ date: iso, label, count });
  }
  return series;
}

export default function ActivityChart({ users }) {
  const data = buildSeries(users, 14);
  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <h3 className="font-semibold mb-1">Daily active users</h3>
        <p className="text-xs text-muted-foreground mb-4">Last 14 days, based on last_active_date</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}