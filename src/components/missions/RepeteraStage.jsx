import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, ArrowRight, ArrowLeft, Check, X, Lightbulb } from "lucide-react";
import { playAudio } from "@/lib/speech";
import { cn } from "@/lib/utils";
import { normalizeAnswer } from "@/lib/normalizeAnswer";

// Stage 4 — Repetera. Rehearsal drills (gap_fill + quick_response) before going live.
// Failures don't penalise — this is warm-up.
export default function RepeteraStage({ topic, onNext, onBack }) {
  const drills = topic.rehearsal_drills || [];
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);

  if (drills.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Inga övningar för det här uppdraget.
        </p>
        <Button onClick={onNext} className="w-full gap-2">Till samtalet <ArrowRight className="w-4 h-4" /></Button>
      </div>
    );
  }

  const current = drills[index];
  const isLast = index === drills.length - 1;
  const expected = current.expected_answer_sv || "";
  const isCorrect =
    checked && normalizeAnswer(answer) === normalizeAnswer(expected);

  const advance = () => {
    if (isLast) {
      onNext();
    } else {
      setIndex((i) => i + 1);
      setAnswer("");
      setChecked(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Övning · {index + 1} av {drills.length}
        </p>
        <div className="flex gap-1">
          {drills.map((_, i) => (
            <div key={i} className={cn("h-1.5 w-4 rounded-full", i <= index ? "bg-emerald-500" : "bg-muted")} />
          ))}
        </div>
      </div>

      <Card className="border-2 border-emerald-200 dark:border-emerald-900">
        <CardContent className="p-5 space-y-4">
          {current.type === "gap_fill" ? (
            <GapFillDrill
              drill={current}
              answer={answer}
              setAnswer={setAnswer}
              checked={checked}
              isCorrect={isCorrect}
            />
          ) : (
            <QuickResponseDrill
              drill={current}
              answer={answer}
              setAnswer={setAnswer}
              checked={checked}
              isCorrect={isCorrect}
            />
          )}

          {checked && (
            <div
              className={cn(
                "rounded-md p-3 border text-sm",
                isCorrect
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
                  : "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {isCorrect ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold text-emerald-800 dark:text-emerald-300">Rätt!</span>
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-amber-800 dark:text-amber-300">Nästan</span>
                  </>
                )}
              </div>
              <p className="text-xs">
                <span className="font-semibold">Ett bra svar:</span>{" "}
                <span className="italic">"{expected}"</span>
              </p>
              {current.expected_answer_en && (
                <p className="text-xs text-muted-foreground italic mt-0.5">"{current.expected_answer_en}"</p>
              )}
            </div>
          )}

          {!checked ? (
            <Button
              onClick={() => setChecked(true)}
              disabled={!answer.trim()}
              className="w-full"
            >
              Kontrollera
            </Button>
          ) : (
            <Button onClick={advance} className="w-full gap-1.5">
              {isLast ? "Klart — till Svea!" : "Nästa övning"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka
        </Button>
        <Button variant="ghost" size="sm" onClick={onNext} className="gap-1 text-muted-foreground">
          Hoppa till Svea
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function GapFillDrill({ drill, answer, setAnswer, checked, isCorrect }) {
  const options = drill.options || [];
  return (
    <>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Fyll i luckan</p>
        <p className="text-lg leading-relaxed font-medium">
          {drill.prompt_sv.split("___").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span className="inline-block min-w-[80px] px-2 py-0.5 mx-1 border-b-2 border-primary text-primary font-semibold">
                  {answer || "___"}
                </span>
              )}
            </span>
          ))}
        </p>
        {drill.prompt_en && (
          <p className="text-xs text-muted-foreground italic mt-2">{drill.prompt_en}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            disabled={checked}
            onClick={() => setAnswer(opt)}
            className={cn(
              "px-3 py-2.5 rounded-md border-2 text-sm font-medium transition-colors text-left",
              answer === opt
                ? checked
                  ? isCorrect
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30"
                    : "border-amber-500 bg-amber-50 dark:bg-amber-950/30"
                  : "border-primary bg-primary/10"
                : "border-border hover:border-primary/50",
              checked && "cursor-default"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </>
  );
}

function QuickResponseDrill({ drill, answer, setAnswer, checked }) {
  return (
    <>
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Svea säger</p>
        <div className="flex items-start gap-2 bg-muted/40 rounded-md p-3">
          <p className="text-base font-medium flex-1">"{drill.prompt_sv}"</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => playAudio(drill.prompt_sv, "sv-SE", 0.9)}
            className="shrink-0 h-8 w-8"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
        {drill.prompt_en && (
          <p className="text-xs text-muted-foreground italic">"{drill.prompt_en}"</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Ditt svar
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          disabled={checked}
          placeholder="Skriv ditt svar på svenska…"
          className="w-full min-h-[70px] px-3 py-2 rounded-md border-2 border-border focus:border-primary focus:outline-none text-sm resize-none"
          rows={2}
        />
        {drill.hint_en && !checked && (
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Lightbulb className="w-3 h-3" />
            {drill.hint_en}
          </p>
        )}
      </div>
    </>
  );
}