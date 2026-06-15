import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge } from "lucide-react";
import { skillMastery, testReadiness, SKILLS } from "@/lib/planner";

const SKILL_KEYS = new Set(SKILLS.map((s) => s.key));

const barColor = (v) => (v >= 80 ? "bg-emerald-500" : v >= 60 ? "bg-amber-500" : "bg-red-500");
const textColor = (v) =>
  v >= 80 ? "text-emerald-600 dark:text-emerald-400"
  : v >= 60 ? "text-amber-600 dark:text-amber-400"
  : "text-red-600 dark:text-red-400";

// Mastery per skill + an overall test-readiness ring, computed from the
// learner's quiz history (same `results` the weak-area card already uses).
export default function MasteryCard({ results = [], targetCourse }) {
  // Map lesson id -> the lesson's SFI skill, so lesson-completion records
  // (whose `skill` is the TAB name, e.g. "learn"/"quiz") count toward the
  // right mastery skill.
  const { data: lessons = [] } = useQuery({
    queryKey: ["lessons"],
    queryFn: () => base44.entities.Lesson.list("order", 500),
  });
  const skillById = {};
  for (const l of lessons) skillById[l.id] = l.skill || l.category;

  const scored = (results || [])
    .filter((r) => typeof r.percentage === "number")
    .map((r) => ({
      ...r,
      // keep records already tagged with a real skill; otherwise resolve from the lesson.
      skill: SKILL_KEYS.has(r.skill) ? r.skill : (skillById[r.source_id] || r.skill),
    }))
    .filter((r) => SKILL_KEYS.has(r.skill));

  const mastery = skillMastery(scored);
  const known = SKILLS.filter((s) => mastery[s.key]?.attempts);
  if (known.length === 0) return null; // nothing to show until the learner has scores

  const readiness = testReadiness(mastery);
  const ringColor = readiness >= 80 ? "#10b981" : readiness >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Gauge className="w-4 h-4 text-primary" />
          Din nivå{targetCourse ? ` — Kurs ${targetCourse}` : ""}
          <span className="text-xs font-normal text-muted-foreground/60 italic">· Mastery &amp; readiness</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={ringColor} strokeWidth="3"
                strokeDasharray={`${readiness} ${100 - readiness}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-foreground">{readiness}%</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold text-foreground text-sm mb-0.5">Provberedskap · Test readiness</p>
            <p>From your scores across {known.length} skill{known.length > 1 ? "s" : ""}. Practise the weak ones to raise it.</p>
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          {SKILLS.map((s) => {
            const m = mastery[s.key];
            return (
              <div key={s.key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="flex items-center gap-1.5">
                    {s.emoji} {s.label}
                    {m?.stale && <span className="text-[10px] font-bold text-amber-500">↓ refresh</span>}
                  </span>
                  <span className={`font-bold ${m ? textColor(m.score) : "text-muted-foreground/50"}`}>
                    {m ? `${m.score}%` : "—"}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${m ? barColor(m.score) : ""}`} style={{ width: `${m?.score ?? 0}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
