import { useState } from "react";
import { ArrowRight, Check, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SpeakButton from "@/components/shared/SpeakButton";
import { fillBlank, sameSentence } from "@/lib/writingMissions";

// Stage 3 — only the English sentence is shown. The learner writes the whole
// Swedish sentence from memory instead of picking a word from a word bank.
export default function SentencesStage({ mission, missed = [], onDone }) {
  const frames = mission.frames || [];
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);

  const frame = frames[index];
  const fullSentence = fillBlank(frame.sentence_with_blank, frame.answer);
  const correct = sameSentence(input, fullSentence);
  const usesMissedWord = missed.includes(frame.answer);

  const check = () => {
    if (input.trim()) setChecked(true);
  };

  const retry = () => {
    setInput("");
    setChecked(false);
  };

  const next = () => {
    if (index + 1 >= frames.length) {
      onDone();
      return;
    }
    setIndex((i) => i + 1);
    setInput("");
    setChecked(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Mening {index + 1} / {frames.length}
        </span>
        {usesMissedWord && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
            <Lightbulb className="w-3 h-3" /> Ord från quizet
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Översätt till svenska · <span className="italic normal-case">translate into Swedish</span>
          </p>
          <p className="text-lg font-medium leading-relaxed">{frame.sentence_en}</p>
        </div>

        <Input
          value={input}
          onChange={(e) => !checked && setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") check();
          }}
          disabled={checked}
          placeholder="Skriv hela meningen på svenska…"
          className="text-base"
        />

        {checked && (
          <div
            className={`rounded-xl p-3 space-y-1 ${
              correct ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-amber-50 dark:bg-amber-950/30"
            }`}
          >
            <p className="flex items-center gap-1.5 text-sm font-medium">
              {correct ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" /> Rätt!
                </>
              ) : (
                <>Rätt mening:</>
              )}
            </p>
            <div className="flex items-start gap-2">
              <p className="flex-1 text-sm">{fullSentence}</p>
              <SpeakButton text={fullSentence} ariaLabel="Lyssna på meningen" />
            </div>
          </div>
        )}
      </div>

      {!checked && (
        <Button onClick={check} disabled={!input.trim()} className="w-full">
          Kontrollera
        </Button>
      )}

      {checked && correct && (
        <Button onClick={next} className="w-full gap-2">
          {index + 1 >= frames.length ? "Till Bygg" : "Nästa mening"} <ArrowRight className="w-4 h-4" />
        </Button>
      )}

      {checked && !correct && (
        <div className="flex items-center gap-2">
          <Button onClick={retry} className="flex-1">
            Försök igen
          </Button>
          <Button onClick={next} variant="ghost">
            Gå vidare <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )}

      {!checked && (
        <button
          type="button"
          onClick={next}
          className="w-full text-xs text-muted-foreground hover:text-foreground"
        >
          Hoppa över meningen
        </button>
      )}
    </div>
  );
}