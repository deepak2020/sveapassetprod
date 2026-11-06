import { Link } from "react-router-dom";
import { Check, RotateCcw, Trash2, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TalaLink from "@/components/writing-missions/TalaLink";
import { GRADE_TONE, errorMeta } from "@/lib/writingPractice";

// Stage 7 — the four feedback blocks Svea returns for a full text.
export default function MissionFeedbackStage({ mission, feedback, onRewrite, onDelete }) {
  if (!feedback) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-5 text-center space-y-3">
        <p className="text-sm text-muted-foreground">Ingen text inlämnad än.</p>
        <Button asChild variant="outline">
          <Link to="/writing-missions">Till alla uppdrag</Link>
        </Button>
      </div>
    );
  }

  const points = feedback.points_covered || [];
  const errors = feedback.errors || [];
  const wordsUsed = feedback.words_used || [];
  const totalWords = (mission.words || []).length;

  return (
    <div className="space-y-4">
      {/* 1. Grade */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
        <div className="flex items-start gap-3">
          <span
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0 ${
              GRADE_TONE[feedback.estimated_grade] || "bg-primary"
            }`}
          >
            {feedback.estimated_grade}
          </span>
          <div className="min-w-0 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Uppskattat betyg · <span className="italic normal-case">estimated grade</span>
            </p>
            <p className="text-sm leading-relaxed">{feedback.grade_reason}</p>
          </div>
        </div>
        <p className="text-xs italic text-muted-foreground">
          Detta är en uppskattning. Din lärares bedömning gäller.
        </p>
      </div>

      {/* 2. Points + words */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Punkterna · <span className="italic normal-case">task fulfilment</span>
        </p>
        <ul className="space-y-1.5">
          {points.map((point) => (
            <li key={point.point} className="flex items-start gap-2 text-sm">
              {point.covered ? (
                <Check className="w-4 h-4 mt-0.5 text-emerald-600 shrink-0" strokeWidth={3} />
              ) : (
                <X className="w-4 h-4 mt-0.5 text-red-500 shrink-0" strokeWidth={3} />
              )}
              <span className={point.covered ? "" : "text-muted-foreground"}>{point.point}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-xl bg-muted/50 p-3 space-y-1.5">
          <p className="text-xs font-medium">
            Du använde {wordsUsed.length} av {totalWords} ord från ordlistan
          </p>
          {wordsUsed.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {wordsUsed.map((word) => (
                <span key={word} className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. Errors */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Fel och regler · <span className="italic normal-case">{errors.length} errors</span>
        </p>
        {errors.length === 0 ? (
          <p className="text-sm text-emerald-700 dark:text-emerald-400">Inga språkfel hittade. Bra jobbat!</p>
        ) : (
          <div className="space-y-2">
            {errors.map((fix, i) => (
              <div key={`${fix.wrong}-${i}`} className="rounded-xl bg-muted/40 p-3 space-y-1">
                <p className="text-sm">
                  <span className="text-red-600 line-through">{fix.wrong}</span>
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">{fix.correct}</span>
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {errorMeta(fix.type).label}
                </p>
                {fix.rule && <p className="text-xs text-muted-foreground">{fix.rule}</p>}
              </div>
            ))}
          </div>
        )}

        {feedback.practice_next?.length > 0 && (
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Träna vidare</p>
            <ul className="space-y-1 text-sm">
              {feedback.practice_next.map((pattern) => (
                <li key={pattern} className="flex gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 mt-1 text-primary shrink-0" />
                  <span>{pattern}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 4. Side by side */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Din text och Sveas version · <span className="italic normal-case">original and corrected</span>
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-muted/40 p-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Din text</p>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{feedback.text}</p>
          </div>
          <div className="rounded-xl bg-emerald-50/60 p-3 dark:bg-emerald-950/20">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Rättad text
            </p>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{feedback.corrected_text}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={onRewrite} className="w-full gap-2">
          <RotateCcw className="w-4 h-4" /> Skriv om texten
        </Button>
        <TalaLink topic={mission.topic} />
        <Button asChild variant="outline" className="w-full">
          <Link to="/writing-missions">Till alla uppdrag</Link>
        </Button>
        {feedback.id && (
          <button
            type="button"
            onClick={onDelete}
            className="mx-auto inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5" /> Radera min text
          </button>
        )}
      </div>
    </div>
  );
}