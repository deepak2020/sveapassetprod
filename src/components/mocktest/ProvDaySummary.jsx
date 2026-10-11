import { Award, Target } from "lucide-react";
import { PART_META, gradeFromPercent, gradeOrder, isWeak, partFocus } from "@/lib/provdag";
import WeakAreaPractice from "./WeakAreaPractice";

function resultText(r) {
  if (r.percent != null && r.total != null) return `${r.score} / ${r.total} · ${r.percent}%`;
  if (r.percent != null) return `${r.percent}%`;
  return "Bedömd";
}

// Grading overview for the day + the follow-up practice for weak areas.
export default function ProvDaySummary({ course, results }) {
  const graded = results
    .map((r) => ({ ...r, finalGrade: r.grade || (r.percent != null ? gradeFromPercent(r.percent) : null) }))
    .filter((r) => r.finalGrade);

  if (graded.length === 0) return null;

  const weak = graded.filter((r) => isWeak({ percent: r.percent, grade: r.finalGrade }));
  const weakest = [...graded].sort((a, b) => gradeOrder(a.finalGrade) - gradeOrder(b.finalGrade))[0];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <h2 className="font-display text-xl font-bold">Rättning & vägledande betyg</h2>
        </div>
        <div className="divide-y divide-border/40">
          {graded.map((r) => (
            <div key={r.part} className="flex items-center gap-3 py-2.5">
              <span className="flex-1 text-sm font-medium">{PART_META[r.part].sv}</span>
              <span className="text-sm text-muted-foreground">{resultText(r)}</span>
              <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                {r.finalGrade}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Svagaste delen: <span className="font-semibold text-foreground">{PART_META[weakest.part].sv}</span> ({weakest.finalGrade}).
          Betyget är vägledande · guiding estimate, not an official result.
        </p>
      </div>

      {weak.length > 0 && (
        <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="font-display text-xl font-bold">Svaga områden</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Där du tappade poäng. Skapa extra övningar och träna samma sak igen i morgon.
          </p>
          <div className="space-y-2">
            {weak.map((w) => (
              <WeakAreaPractice key={w.part} course={course} part={w.part} focus={partFocus(w.part, w.improvements)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}