import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, ArrowRight } from "lucide-react";

const SKILLS = [
  { key: "vocabulary", emoji: "📝", label: "Vocabulary" },
  { key: "grammar",    emoji: "🔤", label: "Grammar" },
  { key: "reading",   emoji: "📖", label: "Reading" },
  { key: "writing",   emoji: "✍️", label: "Writing" },
  { key: "speaking",  emoji: "🗣️", label: "Speaking" },
  { key: "listening", emoji: "👂", label: "Listening" },
];

export default function WeakAreaCard({ results = [], userSfiLevel }) {
  const langResults = results.filter((r) => r.quiz_type === "language" && r.skill);

  const skillStats = SKILLS.map((s) => {
    const items = langResults.filter((r) => r.skill === s.key);
    if (items.length < 3) return null;
    const avg = Math.round(items.reduce((sum, r) => sum + (r.percentage || 0), 0) / items.length);
    return { ...s, count: items.length, avg };
  }).filter(Boolean);

  // Sort ascending — weakest first
  const weakSkills = [...skillStats].sort((a, b) => a.avg - b.avg).slice(0, 2);
  const weakestKey = weakSkills[0]?.key;

  const { data: recommendedLessons = [] } = useQuery({
    queryKey: ["weak-area-lessons", weakestKey, userSfiLevel],
    queryFn: () =>
      base44.entities.Lesson.filter(
        { skill: weakestKey, ...(userSfiLevel ? { sfi_course: userSfiLevel } : {}) },
        "order",
        3
      ),
    enabled: !!weakestKey,
  });

  if (weakSkills.length === 0) return null;

  return (
    <Card className="border-amber-200/60 bg-amber-50/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-amber-600" />
          Förbättringsområden
          <span className="text-xs font-normal text-muted-foreground/60 italic">· Weak areas</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {weakSkills.map((s) => (
          <div key={s.key}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">{s.emoji} {s.label}</span>
              <span className={`text-sm font-bold ${s.avg < 60 ? "text-destructive" : "text-amber-600"}`}>
                {s.avg}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${s.avg < 60 ? "bg-destructive" : "bg-amber-400"}`}
                style={{ width: `${s.avg}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">avg of {s.count} quizzes</p>
          </div>
        ))}

        {recommendedLessons.length > 0 && (
          <div className="pt-3 border-t border-amber-200/60">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Rekommenderade lektioner ·{" "}
              <span className="italic">Recommended for {weakSkills[0].label.toLowerCase()}</span>
            </p>
            <div className="space-y-1.5">
              {recommendedLessons.slice(0, 3).map((l) => (
                <Link
                  key={l.id}
                  to={`/language/${l.id}`}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-background border border-border/50 hover:border-amber-300 hover:bg-amber-50/50 transition-all"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{l.title}</p>
                    {l.sfi_course && (
                      <p className="text-xs text-muted-foreground">SFI {l.sfi_course}</p>
                    )}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
