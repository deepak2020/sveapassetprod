import { useState, useEffect } from "react";
import { Mic, Keyboard, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { similarityPercent } from "@/lib/similarity";
import { normalizeAnswer } from "@/lib/normalizeAnswer";
import { cn } from "@/lib/utils";

/**
 * Shared "say it or type it" input used across mission rehearsal stages.
 * User speaks (or types) the Swedish target. We score similarity and call
 * onResult({ correct, transcript, percent }) once the user submits.
 *
 * Props:
 *  - expected: string  — the Swedish target to match
 *  - threshold: number — % similarity to count as correct (default 70)
 *  - placeholder: string
 *  - autoStart: bool   — start listening immediately on mount
 *  - onResult: fn      — called with { correct, transcript, percent }
 *  - onSkip: fn        — user gives up / wants to see answer
 */
export default function SpeakOrTypeInput({
  expected,
  threshold = 70,
  placeholder = "Säg eller skriv på svenska…",
  autoStart = false,
  onResult,
  onSkip,
}) {
  const [mode, setMode] = useState("voice"); // 'voice' | 'text'
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(null); // { correct, transcript, percent }

  const [micNotice, setMicNotice] = useState(null);

  const handleFinal = (transcript) => {
    if (!transcript || !transcript.trim()) {
      // User tapped stop before speaking anything (or Chrome heard silence).
      // Give clear feedback instead of leaving the button looking dead.
      setMicNotice("Hörde inget — försök igen eller skriv istället.");
      return;
    }
    setMicNotice(null);
    submit(transcript);
  };

  const { listening, interim, error, supported, start, stop, toggle } = useSpeechRecognition({
    onFinal: handleFinal,
    lang: "sv-SE",
    continuous: true,
  });

  // Translate low-level SpeechRecognition errors into a friendly Swedish hint.
  useEffect(() => {
    if (!error) return;
    if (error === "not-allowed" || error === "service-not-allowed") {
      setMicNotice("Mikrofonen är blockerad. Tillåt mikrofon i webbläsaren, eller skriv istället.");
    } else if (error === "audio-capture") {
      setMicNotice("Ingen mikrofon hittades. Skriv istället.");
    } else if (error === "network") {
      setMicNotice("Nätverksfel — försök igen eller skriv istället.");
    } else {
      setMicNotice("Något gick fel med mikrofonen. Skriv istället.");
    }
  }, [error]);

  const handleMicPress = () => {
    setMicNotice(null);
    toggle();
  };

  useEffect(() => {
    if (autoStart && supported && mode === "voice") start();
    // Only run when component mounts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!supported && mode === "voice") setMode("text");
  }, [supported, mode]);

  const submit = (raw) => {
    const percent = similarityPercent(raw, expected);
    const exact = normalizeAnswer(raw) === normalizeAnswer(expected);
    const correct = exact || percent >= threshold;
    const result = { correct, transcript: raw.trim(), percent };
    setSubmitted(result);
    onResult?.(result);
  };

  const submitTyped = () => {
    if (!text.trim()) return;
    submit(text);
  };

  const showAnswer = () => {
    setSubmitted({ correct: false, transcript: "", percent: 0, revealed: true });
    onSkip?.();
  };

  // Once submitted, render the feedback pill (parent controls "Next").
  if (submitted) {
    return (
      <div
        className={cn(
          "rounded-md p-3 border text-sm",
          submitted.correct
            ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
            : "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
        )}
      >
        <div className="flex items-center gap-2">
          {submitted.correct ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-emerald-800 dark:text-emerald-300">
                Bra jobbat! {submitted.percent > 0 && `(${submitted.percent}% match)`}
              </span>
            </>
          ) : (
            <>
              <X className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-amber-800 dark:text-amber-300">
                {submitted.revealed ? "Så här säger man" : `Nästan (${submitted.percent}%)`}
              </span>
            </>
          )}
        </div>
        {submitted.transcript && (
          <p className="text-xs mt-1 text-muted-foreground">
            Du sa: <span className="italic">"{submitted.transcript}"</span>
          </p>
        )}
        <p className="text-xs mt-1">
          <span className="font-semibold">Rätt svar:</span>{" "}
          <span className="italic">"{expected}"</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {mode === "voice" ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center py-3">
            <button
              type="button"
              onClick={handleMicPress}
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-md",
                listening
                  ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              )}
              aria-label={listening ? "Stoppa" : "Prata"}
            >
              {listening ? <Loader2 className="w-6 h-6 animate-spin" /> : <Mic className="w-6 h-6" />}
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground min-h-[1.25rem]">
            {listening
              ? interim || "Lyssnar… säg det på svenska"
              : "Tryck och säg det på svenska"}
          </p>
          {micNotice && !listening && (
            <p className="text-center text-[11px] text-amber-700 dark:text-amber-400">
              {micNotice}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitTyped()}
            placeholder={placeholder}
            className="w-full px-3 py-2.5 rounded-md border-2 border-border focus:border-primary focus:outline-none text-sm"
            autoFocus
          />
          <Button
            onClick={submitTyped}
            disabled={!text.trim()}
            className="w-full"
            size="sm"
          >
            Kontrollera
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px]">
        {supported && (
          <button
            type="button"
            onClick={() => {
              if (listening) stop();
              setMode((m) => (m === "voice" ? "text" : "voice"));
            }}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            {mode === "voice" ? (
              <>
                <Keyboard className="w-3 h-3" />
                Skriv istället
              </>
            ) : (
              <>
                <Mic className="w-3 h-3" />
                Prata istället
              </>
            )}
          </button>
        )}
        <button
          type="button"
          onClick={showAnswer}
          className="text-muted-foreground hover:text-foreground ml-auto"
        >
          Visa svaret
        </button>
      </div>
    </div>
  );
}