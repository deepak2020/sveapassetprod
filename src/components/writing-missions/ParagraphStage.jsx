import { useMemo, useState } from "react";
import { ArrowRight, Check, Lightbulb, Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SpeakButton from "@/components/shared/SpeakButton";
import { shortFeedback } from "@/lib/writingMissions";

// Stage 5 — build the paragraph from a 3-4 step frame, then see it as one text.
export default function ParagraphStage({ mission, onDone }) {
  const steps = useMemo(
    () => [...(mission.paragraph_frame || [])].sort((a, b) => a.step - b.step),
    [mission]
  );
  const [answers, setAnswers] = useState({});
  const [tips, setTips] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const complete = steps.length === 0 || steps.every((s) => (answers[s.step] || "").trim());
  const paragraph = steps
    .map((s) => (answers[s.step] || "").trim())
    .filter(Boolean)
    .join(" ");

  const askSvea = async () => {
    setBusy(true);
    setError("");
    try {
      const data = await shortFeedback({
        mission,
        text: paragraph,
        step: "Skriv ett stycke med ramens startfraser",
      });
      setFeedback(data);
    } catch {
      setError("Svea kunde inte svara just nu. Försök igen.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs italic text-muted-foreground">
        Fyll i steg för steg — till slut blir det ett helt stycke. · one step at a time.
      </p>

      {steps.map((step) => (
        <div key={step.step} className="rounded-2xl border border-border/60 bg-card p-4 space-y-2.5">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
              {step.step}
            </span>
            <p className="flex-1 text-sm font-medium leading-snug">{step.starter}</p>
          </div>

          <Textarea
            value={answers[step.step] || ""}
            onChange={(e) => {
              setAnswers((prev) => ({ ...prev, [step.step]: e.target.value }));
              setFeedback(null);
            }}
            placeholder="Skriv meningen här…"
            className="min-h-[70px]"
          />

          {step.hint && (
            <button
              type="button"
              onClick={() => setTips((prev) => ({ ...prev, [step.step]: !prev[step.step] }))}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              {tips[step.step] ? "Dölj tips" : "Visa tips"}
            </button>
          )}

          {tips[step.step] && step.hint && (
            <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">{step.hint}</p>
          )}
        </div>
      ))}

      {complete && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2 dark:border-emerald-900 dark:bg-emerald-950/20">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
            Ditt stycke
          </p>
          <div className="flex items-start gap-2">
            <p className="flex-1 text-sm leading-relaxed">{paragraph}</p>
            <SpeakButton text={paragraph} ariaLabel="Lyssna på stycket" />
          </div>
        </div>
      )}

      {complete && paragraph && !feedback && (
        <Button onClick={askSvea} disabled={busy} className="w-full gap-2">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {busy ? "Svea läser…" : "Få feedback från Svea"}
        </Button>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {feedback && (
        <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 space-y-2">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {feedback.ok ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-amber-600" />}
            Svea
          </p>
          <p className="text-sm">{feedback.comment}</p>
          {feedback.correction && (
            <div className="flex items-start gap-2 rounded-xl bg-card p-2.5">
              <p className="flex-1 text-sm font-medium">{feedback.correction}</p>
              <SpeakButton text={feedback.correction} ariaLabel="Lyssna på stycket" />
            </div>
          )}
        </div>
      )}

      <Button onClick={onDone} disabled={!complete} variant={complete ? "default" : "outline"} className="w-full gap-2">
        Nästa: Skriv fritt <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}