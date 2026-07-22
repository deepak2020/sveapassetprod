import { useState, useEffect } from "react";
import { Mic, MicOff, Keyboard, Check, X, RotateCcw } from "lucide-react";
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
      // Show a full result card with a retry button so it's obvious what to do.
      setSubmitted({
        correct: false,
        transcript: "",
        percent: 0,
        noSpeech: true,
      });
      return;
    }
    setMicNotice(null);
    submit(transcript);
  };

  const { listening, interim, finalSoFar, error, supported, start, stop, toggle } = useSpeechRecognition({
    onFinal: handleFinal,
    lang: "sv-SE",
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
    // For very short targets (single Swedish word), Chrome often mishears
    // uncommon words (e.g. "påtår" → "på dör"). Loosen the threshold so
    // phonetically-close attempts still count.
    const expectedWords = normalizeAnswer(expected).split(" ").filter(Boolean).length;
    const effectiveThreshold = expectedWords <= 1 ? Math.min(threshold, 55) : threshold;
    const correct = exact || percent >= effectiveThreshold;
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

  const retry = () => {
    setSubmitted(null);
    setText("");
    setMicNotice(null);
    if (mode === "voice" && supported) {
      // Small delay so the recognition service has time to reset between sessions.
      setTimeout(() => start(), 100);
    }
  };

  // Once submitted, render the feedback pill (parent controls "Next").
  if (submitted) {
    // Allow retry unless the user got a strong match or explicitly asked for the answer.
    // Even "correct" but low-confidence matches (e.g. 57%) should offer a retry so the
    // user isn't locked in on a mic mishearing.
    const strongMatch = submitted.correct && submitted.percent >= 80;
    const canRetry = !strongMatch && !submitted.revealed;
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
                {submitted.revealed
                  ? "Så här säger man"
                  : submitted.noSpeech
                    ? "Hörde inget — försök igen"
                    : `Nästan (${submitted.percent}%)`}
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
        {canRetry && (
          <Button
            onClick={retry}
            size="sm"
            variant="outline"
            className="mt-3 w-full gap-2 bg-white/60 dark:bg-transparent"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Försök igen
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {mode === "voice" ? (
        <div className="space-y-2">
          <div className="flex flex-col items-center justify-center py-3 gap-2">
            <button
              type="button"
              onClick={handleMicPress}
              className={cn(
                "relative w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-md",
                listening
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              )}
              aria-label={listening ? "Tryck för att stoppa" : "Tryck för att prata"}
            >
              {listening && (
                <span className="absolute inset-0 rounded-full bg-red-500/40 animate-ping" />
              )}
              {listening ? <MicOff className="w-7 h-7 relative" /> : <Mic className="w-7 h-7" />}
            </button>
            <p
              className={cn(
                "text-xs font-medium min-h-[1.25rem] text-center",
                listening ? "text-red-600 dark:text-red-400" : "text-muted-foreground"
              )}
            >
              {listening ? "Tryck för att stoppa" : "Tryck och säg det på svenska"}
            </p>
          </div>
          {listening && (finalSoFar || interim) && (
            <p className="text-center text-sm text-foreground italic min-h-[1rem] px-2">
              "{[finalSoFar, interim].filter(Boolean).join(" ")}"
            </p>
          )}
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