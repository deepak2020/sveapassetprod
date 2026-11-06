import { Check, X, Info, Sparkles, RotateCcw } from "lucide-react";
import { GRADE_TONE, errorMeta } from "@/lib/writingPractice";

function Block({ title, en, children }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-2">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[11px] italic text-muted-foreground">{en}</p>
      </div>
      {children}
    </div>
  );
}

// Svea's assessment: grade, points, errors and the two texts side by side.
export default function WritingFeedbackView({ feedback, originalText, onRewrite, xpEarned = 0 }) {
  const grade = feedback?.estimated_grade || "E";
  const errors = Array.isArray(feedback?.errors) ? feedback.errors : [];
  const points = Array.isArray(feedback?.points_covered) ? feedback.points_covered : [];

  return (
    <div className="space-y-3">
      {xpEarned > 0 && (
        <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-4 py-2.5 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
          +{xpEarned} XP
        </div>
      )}

      {/* 1. Estimated grade */}
      <Block title="Sveas bedömning" en="Svea's assessment">
        <div className="flex items-start gap-3">
          <div
            className={`w-11 h-11 rounded-full text-white font-bold text-lg flex items-center justify-center shrink-0 ${
              GRADE_TONE[grade] || "bg-primary"
            }`}
          >
            {grade}
          </div>
          <p className="text-sm text-foreground leading-relaxed">{feedback?.grade_reason}</p>
        </div>
      </Block>

      {/* 2. Points covered */}
      <Block title="Punkter i uppgiften" en="Points covered">
        <ul className="space-y-1.5">
          {points.map((p, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              {p.covered ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={3} />
              ) : (
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" strokeWidth={3} />
              )}
              <span className={p.covered ? "" : "text-muted-foreground"}>{p.point}</span>
            </li>
          ))}
          {!points.length && <li className="text-sm text-muted-foreground">—</li>}
        </ul>
      </Block>

      {/* 3. Errors with the rule beside each one */}
      <Block title={`Fel (${errors.length})`} en="What to fix">
        {errors.length ? (
          <ul className="divide-y divide-border/60">
            {errors.map((e, i) => (
              <li key={i} className="py-2 first:pt-0 last:pb-0 space-y-1">
                <p className="text-sm">
                  <span className="text-red-600 dark:text-red-400 line-through">{e.wrong}</span>
                  <span className="mx-1.5 text-muted-foreground">→</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">{e.correct}</span>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  <span className="font-semibold uppercase tracking-wide">{errorMeta(e.type).label}:</span> {e.rule}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <Check className="w-4 h-4" strokeWidth={3} /> Inga fel hittade. Bra jobbat!
          </p>
        )}
      </Block>

      {/* 4. Original and corrected side by side */}
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Din text</p>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{originalText}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
            Sveas rättning
          </p>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{feedback?.corrected_text}</p>
        </div>
      </div>

      {Array.isArray(feedback?.strengths) && feedback.strengths.length > 0 && (
        <Block title="Det här är bra" en="Strengths">
          <ul className="space-y-1">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-sm flex gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-1" /> {s}
              </li>
            ))}
          </ul>
        </Block>
      )}

      {Array.isArray(feedback?.practice_next) && feedback.practice_next.length > 0 && (
        <Block title="Öva nästa gång" en="Practice next">
          <div className="flex flex-wrap gap-2">
            {feedback.practice_next.map((p, i) => (
              <span key={i} className="text-xs rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 px-3 py-1">
                {p}
              </span>
            ))}
          </div>
        </Block>
      )}

      <p className="flex items-start gap-2 text-[11px] text-muted-foreground px-1">
        <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <span>
          Detta är en uppskattning. Din lärares bedömning gäller.{" "}
          <span className="italic">This is an estimate — your teacher's grade decides.</span>
        </span>
      </p>

      {onRewrite && (
        <button
          type="button"
          onClick={onRewrite}
          className="w-full inline-flex items-center justify-center gap-2 rounded-lg border-2 border-amber-500 px-4 py-2.5 text-sm font-semibold text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30"
        >
          <RotateCcw className="w-4 h-4" /> Skriv om texten
          <span className="text-[11px] italic font-normal text-muted-foreground">Rewrite it</span>
        </button>
      )}
    </div>
  );
}