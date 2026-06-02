import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Trophy, ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { normalizeAnswer } from "@/lib/normalizeAnswer";
import { XP_REWARDS } from "@/lib/xp";

export default function DailyReviewSession({ items, onComplete, onExit }) {
  const [current, setCurrent] = useState(0);
  const [typed, setTyped] = useState("");
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const item = items[current];

  const handleCheck = () => {
    if (answered || !item) return;
    const isCorrect = normalizeAnswer(typed) === normalizeAnswer(item.swedish);
    setAnswered(true);
    setCorrect(isCorrect);
    if (isCorrect) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= items.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setTyped("");
      setAnswered(false);
      setCorrect(false);
    }
  };

  if (!items.length) return null;

  if (finished) {
    const pct = Math.round((score / items.length) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto px-4 py-16 text-center"
      >
        <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="font-display text-3xl font-bold mb-1">Warm-up done! 🔥</h2>
        <p className="text-5xl font-bold text-primary my-3">{pct}%</p>
        <p className="text-muted-foreground mb-3">{score} / {items.length} correct</p>
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-2 mb-6">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-amber-700 dark:text-amber-400">+{XP_REWARDS.daily_review_bonus} XP bonus earned!</span>
        </div>
        <Button onClick={onComplete} size="lg" className="w-full">
          Continue learning
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onExit}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Exit review
        </button>
        <span className="text-sm text-muted-foreground">{current + 1} / {items.length}</span>
        <span className="text-sm font-semibold text-primary">Score: {score}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted rounded-full">
        <div
          className="h-full bg-amber-500 rounded-full transition-all"
          style={{ width: `${((current + 1) / items.length) * 100}%` }}
        />
      </div>

      <div className="text-center mb-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
          🔥 Daily Warm-up · {item.lessonTitle || "Vocabulary"}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-5">
              {/* English prompt */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 text-center">
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">English</p>
                <p className="text-xl font-semibold text-blue-900 dark:text-blue-100">{item.english}</p>
              </div>

              {/* Swedish input */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Type in Swedish
                </label>
                <input
                  type="text"
                  value={typed}
                  onChange={e => setTyped(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !answered) handleCheck(); }}
                  disabled={answered}
                  placeholder="Skriv på svenska…"
                  autoFocus
                  className="w-full border-2 border-border/50 rounded-xl px-4 py-3 text-base text-foreground bg-transparent focus:outline-none focus:border-primary transition-colors disabled:opacity-60"
                />
                <div className="flex gap-2">
                  {["å", "ä", "ö"].map(c => (
                    <button
                      key={c}
                      onClick={() => setTyped(t => t + c)}
                      className="px-2.5 py-1 border rounded-lg hover:bg-muted transition-colors font-medium text-sm"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Check button */}
              {!answered && (
                <Button onClick={handleCheck} className="w-full min-h-[44px]" disabled={!typed.trim()}>
                  Check
                </Button>
              )}

              {/* Result */}
              {answered && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div className={`p-4 rounded-xl border-2 flex items-start gap-3 ${
                    correct
                      ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800"
                  }`}>
                    {correct
                      ? <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      : <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    }
                    <div>
                      <p className={`font-semibold text-sm ${correct ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                        {correct ? "Correct!" : `Correct answer: ${item.swedish}`}
                      </p>
                      {!correct && typed.trim() && (
                        <p className="text-xs text-muted-foreground mt-0.5">You wrote: {typed}</p>
                      )}
                    </div>
                  </div>
                  <Button onClick={handleNext} className="w-full">
                    {current + 1 >= items.length ? "See Results" : "Next →"}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
