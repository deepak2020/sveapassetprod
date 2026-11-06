import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const GRADE_TONE = {
  A: "bg-emerald-500",
  B: "bg-emerald-600",
  C: "bg-emerald-700",
  D: "bg-amber-500",
  E: "bg-amber-600",
  F: "bg-red-500",
};

export default function PracticeFeedback({ result, onRetry, onBack, skillLabel }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
        <div className="flex items-start gap-3">
          <span
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0 ${
              GRADE_TONE[result.grade] || "bg-primary"
            }`}
          >
            {result.grade}
          </span>
          <div className="space-y-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Bedömning · {skillLabel}
            </p>
            <p className="text-sm leading-relaxed">{result.summary}</p>
          </div>
        </div>

        {result.task_completion && (
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Uppgiften</p>
            <p className="text-sm">{result.task_completion}</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.strengths?.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600 mb-1">Bra</p>
              <ul className="space-y-1 text-sm">
                {result.strengths.map((item) => (
                  <li key={item} className="flex gap-1.5">
                    <span className="text-emerald-500">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {result.improvements?.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-600 mb-1">Att förbättra</p>
              <ul className="space-y-1 text-sm">
                {result.improvements.map((item) => (
                  <li key={item} className="flex gap-1.5">
                    <span className="text-amber-500">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {result.transcript && (
        <div className="rounded-2xl border border-border/50 bg-muted/40 p-4 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Så här läste vi din text
          </p>
          <p className="text-sm whitespace-pre-wrap">{result.transcript}</p>
        </div>
      )}

      {result.corrections?.length > 0 && (
        <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Rättelser</p>
          <div className="space-y-2">
            {result.corrections.map((fix, i) => (
              <div key={i} className="rounded-xl bg-muted/40 p-3 text-sm space-y-1">
                <p>
                  <span className="text-red-600 line-through">{fix.wrong}</span>
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="font-medium text-emerald-700 dark:text-emerald-400">{fix.correct}</span>
                </p>
                {fix.rule && <p className="text-xs text-muted-foreground">{fix.rule}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {result.vocab_used?.length > 0 && (
        <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Ord från listan som du använde
          </p>
          <div className="flex flex-wrap gap-1.5">
            {result.vocab_used.map((word) => (
              <span key={word} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={onRetry} className="flex-1 gap-2">
          <RotateCcw className="w-4 h-4" /> Försök igen
        </Button>
        <Button onClick={onBack} variant="outline" className="flex-1 gap-2">
          <ArrowLeft className="w-4 h-4" /> Fler ämnen
        </Button>
      </div>

      <p className="text-center text-xs italic text-muted-foreground">AI-bedömning, endast vägledande</p>
    </div>
  );
}