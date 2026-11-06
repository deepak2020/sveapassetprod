import { useState } from "react";
import { ArrowRight, Check, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpeakButton from "@/components/shared/SpeakButton";
import { fillBlank } from "@/lib/writingMissions";

// Stage 3 — fill in the blank by tapping a word from the word bank.
export default function SentencesStage({ mission, missed = [], onDone }) {
  const frames = mission.frames || [];
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);

  const frame = frames[index];
  const answered = picked !== null;
  const correct = picked === frame.answer;
  const fullSentence = fillBlank(frame.sentence_with_blank, frame.answer);
  const usesMissedWord = missed.includes(frame.answer);

  const next = () => {
    if (index + 1 >= frames.length) {
      onDone();
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
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
        <p className="text-base leading-relaxed">
          {frame.sentence_with_blank.split("___").map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <span
                  className={`mx-1 inline-block min-w-[70px] border-b-2 text-center font-semibold ${
                    answered
                      ? correct
                        ? "border-emerald-500 text-emerald-700 dark:text-emerald-400"
                        : "border-red-400 text-red-700 dark:text-red-400"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {picked || "…"}
                </span>
              )}
            </span>
          ))}
        </p>

        <div className="flex flex-wrap gap-2">
          {(frame.word_bank || []).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => !answered && setPicked(option)}
              disabled={answered}
              className={`rounded-full border-2 px-3.5 py-2 text-sm font-medium transition-colors ${
                answered && option === frame.answer
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                  : answered && option === picked
                  ? "border-red-400 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-200"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {answered && (
          <div
            className={`rounded-xl p-3 space-y-1 ${
              correct
                ? "bg-emerald-50 dark:bg-emerald-950/30"
                : "bg-amber-50 dark:bg-amber-950/30"
            }`}
          >
            <p className="flex items-center gap-1.5 text-sm font-medium">
              {correct ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" /> Rätt!
                </>
              ) : (
                <>Rätt ord är: {frame.answer}</>
              )}
            </p>
            <div className="flex items-start gap-2">
              <p className="flex-1 text-sm">{fullSentence}</p>
              <SpeakButton text={fullSentence} ariaLabel="Lyssna på meningen" />
            </div>
          </div>
        )}
      </div>

      {answered && (
        <Button onClick={next} className="w-full gap-2">
          {index + 1 >= frames.length ? "Till Bygg" : "Nästa mening"} <ArrowRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}