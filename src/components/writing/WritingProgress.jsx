import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Target, TrendingDown } from "lucide-react";

// Weekly goal + development curve (errors per 100 words).
export default function WritingProgress({ submissions }) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const thisWeek = submissions.filter((s) => new Date(s.created_date).getTime() >= weekAgo);
  const shortCount = thisWeek.filter((s) => (s.word_count || 0) < 150).length;
  const longCount = thisWeek.filter((s) => (s.word_count || 0) >= 150).length;

  const chartData = [...submissions]
    .sort((a, b) => new Date(a.created_date) - new Date(b.created_date))
    .slice(-10)
    .map((s) => ({
      label: new Date(s.created_date).toLocaleDateString("sv-SE", { day: "numeric", month: "short" }),
      fel: s.errors_per_100 ?? 0,
    }));

  const goals = [
    { label: "korta texter", en: "short texts", done: Math.min(shortCount, 2), goal: 2 },
    { label: "längre text", en: "longer text", done: Math.min(longCount, 1), goal: 1 },
  ];

  return (
    <div className="rounded-xl border border-border/50 bg-card px-4 py-3 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold">
        <Target className="w-3.5 h-3.5 text-amber-600" />
        Veckans mål
        <span className="font-normal italic text-muted-foreground">Weekly goal</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {goals.map((g) => (
          <div key={g.label} className="rounded-lg bg-muted/40 px-3 py-2">
            <p className="text-sm font-bold tabular-nums">
              {g.done}/{g.goal}{" "}
              <span className="text-[11px] font-normal text-muted-foreground">{g.label}</span>
            </p>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(g.done / g.goal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {chartData.length > 1 && (
        <div className="pt-1">
          <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5 mb-1">
            <TrendingDown className="w-3 h-3" /> Fel per 100 ord · <span className="italic font-normal">Errors per 100 words</span>
          </p>
          <div className="h-32 -ml-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid hsl(var(--border))" }}
                  formatter={(v) => [`${v} fel / 100 ord`, ""]}
                />
                <Line type="monotone" dataKey="fel" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}