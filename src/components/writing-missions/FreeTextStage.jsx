import { useEffect, useState } from "react";
import { Check, Loader2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { countWords } from "@/lib/writingMissions";

// Stage 6 — the real text. Word counter, checklist and an optional timer.
export default function FreeTextStage({ mission, onSubmit, busy, error, initialText = "" }) {
  const totalSeconds = (mission.time_limit_minutes || 25) * 60;
  const min = mission.min_words || 100;
  const max = mission.max_words || 150;
  const minRequired = Math.ceil(min * 0.5);

  const [text, setText] = useState(initialText);
  const [testMode, setTestMode] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [startedAt] = useState(() => Date.now());
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    if (!testMode) return;
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [testMode]);

  const words = countWords(text);
  const used = testMode ? totalSeconds - secondsLeft : Math.round((Date.now() - startedAt) / 1000);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const counterTone =
    words > max ? "text-amber-600" : words >= min ? "text-emerald-600" : "text-muted-foreground";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Switch
            id="test-mode"
            checked={testMode}
            onCheckedChange={(value) => {
              setTestMode(value);
              setSecondsLeft(totalSeconds);
            }}
          />
          <label htmlFor="test-mode" className="text-xs font-medium">
            Prov-läge <span className="italic font-normal text-muted-foreground">· timed</span>
          </label>
        </div>
        {testMode ? (
          <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${secondsLeft === 0 ? "text-destructive" : ""}`}>
            <Timer className="w-4 h-4" /> {mm}:{ss}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Övning · no timer</span>
        )}
      </div>

      {testMode && secondsLeft === 0 && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
          Tiden är slut — lämna in din text nu.
        </p>
      )}

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Din text · <span className="italic normal-case">your text</span>
          </p>
          <p className={`text-xs font-semibold ${counterTone}`}>
            {words} ord <span className="font-normal text-muted-foreground">/ {min}–{max}</span>
          </p>
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Skriv din text här…"
          className="min-h-[240px] leading-relaxed"
        />
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Checklista · <span className="italic normal-case">points to include</span>
        </p>
        {(mission.points_to_include || []).map((point) => {
          const on = checked.includes(point);
          return (
            <button
              key={point}
              type="button"
              onClick={() => setChecked((prev) => (on ? prev.filter((p) => p !== point) : [...prev, point]))}
              className="flex w-full items-start gap-2.5 text-left"
            >
              <span
                className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                  on ? "bg-emerald-500 border-emerald-500 text-white" : "border-border"
                }`}
              >
                {on && <Check className="w-3 h-3" strokeWidth={3} />}
              </span>
              <span className={`text-sm leading-snug ${on ? "text-muted-foreground line-through" : ""}`}>{point}</span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        onClick={() => onSubmit({ text, seconds: used, mode: testMode ? "test" : "practice" })}
        disabled={words < minRequired || busy}
        className="w-full gap-2"
      >
        {busy && <Loader2 className="w-4 h-4 animate-spin" />}
        {busy ? "Svea rättar…" : "Lämna in till Svea"}
      </Button>

      {words < minRequired && (
        <p className="text-center text-xs text-muted-foreground">
          Du behöver minst {minRequired} ord för att lämna in (50 % av {min}).
        </p>
      )}
    </div>
  );
}