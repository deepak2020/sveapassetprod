import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, ArrowLeft, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpeakButton from "@/components/shared/SpeakButton";

export default function WordDrill({ questions, direction, onExit, onRestart, onFinish, onProgress }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  // The words of the current round: the full set, or only the missed ones when
  // the learner retries their mistakes.
  const [pool, setPool] = useState(questions);
  const [wrong, setWrong] = useState([]);
  const [isRetry, setIsRetry] = useState(false);

  const q = pool[idx];
  const isDone = idx >= pool.length;

  // Let the page record how far the learner got in this topic
  useEffect(() => {
    if (isDone && onFinish) onFinish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDone]);

  const handleAnswer = (i) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.correct) setScore((s) => s + 1);
    else setWrong((w) => [...w, q]);
    // Report progress per answered word so leaving early still counts
    if (onProgress && !isRetry) onProgress(idx + 1);
  };

  const retryWrong = () => {
    setPool(wrong);
    setWrong([]);
    setIsRetry(true);
    setIdx(0);
    setSelected(null);
    setScore(0);
  };

  const handleNext = () => {
    setSelected(null);
    setIdx((i) => i + 1);
  };

  if (isDone) {
    const pct = Math.round((score / Math.max(pool.length, 1)) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-4">
        <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto">
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold">
          {pct >= 80 ? "Utmärkt! 🎉" : pct >= 50 ? "Bra jobbat! 👍" : "Fortsätt öva! 💪"}
        </h2>
        <p className="text-5xl font-bold text-primary">{pct}%</p>
        <p className="text-muted-foreground">{score} av {pool.length} rätt</p>
        <div className="flex flex-col gap-2 max-w-xs mx-auto pt-2">
          {wrong.length > 0 && (
            <Button onClick={retryWrong} className="gap-2">
              <Target className="w-4 h-4" /> Repetera felen ({wrong.length})
            </Button>
          )}
          <Button onClick={onRestart} variant={wrong.length > 0 ? "outline" : "default"} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Ny omgång
          </Button>
          <Button onClick={onExit} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Tillbaka
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <button onClick={onExit} className="flex items-center gap-2 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Avsluta
        </button>
        <span>{idx + 1} / {pool.length}</span>
        <span className="font-semibold text-emerald-600">{score} rätt</span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(idx / pool.length) * 100}%` }} />
      </div>

      <motion.div key={idx} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-border/50 bg-card p-6 space-y-5">
        <div className="space-y-1 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {direction === "en-sv" ? "Välj svenska" : "Choose English"}
          </p>
          <div className="flex items-center justify-center gap-2">
            <p className="text-2xl font-bold">{q.promptText}</p>
            {direction !== "en-sv" && <SpeakButton text={q.sv} ariaLabel={`Listen to ${q.sv}`} />}
          </div>
          <p className="text-xs text-muted-foreground italic">{q.chapterTitle}</p>
        </div>

        <div className="space-y-3">
          {q.options.map((opt, i) => {
            const correct = i === q.correct;
            const wrong = selected === i && !correct;
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className={`w-full px-4 py-3 rounded-xl border-2 text-left font-medium transition-all ${
                  selected !== null
                    ? correct
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100"
                      : wrong
                      ? "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100"
                      : "border-border opacity-50"
                    : "border-border hover:border-primary hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>{opt}</span>
                  {selected !== null && correct && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  {wrong && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4 text-sm text-blue-900 dark:text-blue-100 space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{q.sv}</p>
              <SpeakButton text={q.sv} ariaLabel={`Listen to ${q.sv}`} />
            </div>
            <p className="text-muted-foreground">{q.en}</p>
          </div>
        )}

        {selected !== null && (
          <Button onClick={handleNext} className="w-full">
            {idx + 1 >= pool.length ? "Se resultat" : "Nästa →"}
          </Button>
        )}
      </motion.div>
    </div>
  );
}