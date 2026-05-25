import { useState, useRef, useEffect } from "react";
import { CheckCircle2, XCircle, RotateCcw, Trophy, Lightbulb, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useExerciseProgress } from "@/hooks/useExerciseProgress";
import { useWritingRevision } from "@/hooks/useWritingRevision";
import { normalizeAnswer } from "@/lib/normalizeAnswer";
import { base44 } from "@/api/base44Client";
import { awardXP, XP_REWARDS } from "@/lib/xp";
import SpeakButton from "@/components/shared/SpeakButton";

// Allow 1-2 character differences (typos)
function isCloseEnough(input, answer) {
  const a = normalizeAnswer(input);
  const b = normalizeAnswer(answer);
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 2) return false;
  let diff = 0;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  for (let i = 0; i < longer.length; i++) {
    if (longer[i] !== shorter[i]) diff++;
    if (diff > 2) return false;
  }
  return true;
}

// Reveal the correct answer word by word
function ProgressiveHint({ answer }) {
  const [revealed, setRevealed] = useState(0);
  const words = answer?.split(" ") ?? [];
  if (!answer) return null;
  const allShown = revealed >= words.length;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
      {!allShown && (
        <button
          onClick={() => setRevealed((r) => Math.min(r + 1, words.length))}
          className="text-xs text-violet-500 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
        >
          {revealed === 0 ? "Hint" : "More"}
        </button>
      )}
      {revealed > 0 && (
        <>
          <span className="text-xs font-mono text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/30 px-2 py-0.5 rounded-md">
            {words.slice(0, revealed).join(" ")}{!allShown ? " …" : ""}
          </span>
          <button
            onClick={() => setRevealed(0)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            reset
          </button>
        </>
      )}
      {revealed === 0 && (
        <span className="text-xs text-muted-foreground">Need a nudge? Reveal word by word.</span>
      )}
    </div>
  );
}

export default function SentenceTranslation({ wordPairs, onComplete, storageKey, userId, lessonId, tab, initialProgress, previousResult }) {
  const { load, save, clear } = useExerciseProgress(storageKey, userId, lessonId, tab);
  const { addToRevision, removeFromRevision } = useWritingRevision();
  const remoteApplied = useRef(false);

  const allExercises = (wordPairs || []).filter(wp => wp.example_en && wp.example_sv);
  const [exercisePool, setExercisePool] = useState(allExercises);
  const [wrongIndices, setWrongIndices] = useState([]);
  const [current, setCurrent] = useState(() => previousResult ? 0 : (initialProgress?.current ?? load()?.current ?? 0));
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(() => previousResult ? (previousResult.score ?? 0) : (initialProgress?.score ?? load()?.score ?? 0));
  const [finished, setFinished] = useState(() => !!previousResult);

  useEffect(() => {
    if (remoteApplied.current || finished || initialProgress == null) return;
    remoteApplied.current = true;
    const localIdx = load()?.current ?? 0;
    const remoteIdx = initialProgress.current ?? 0;
    if (remoteIdx > localIdx) { setCurrent(remoteIdx); setScore(initialProgress.score ?? 0); }
  }, [initialProgress]);

  if (!allExercises.length) {
    return <p className="text-muted-foreground text-sm">No sentence translation exercises available for this lesson.</p>;
  }

  const ex = exercisePool[current];
  const isCorrect = submitted && isCloseEnough(input, ex.example_sv);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setSubmitted(true);
    if (isCloseEnough(input, ex.example_sv)) {
      setScore(s => { save({ current, score: s + 1 }); return s + 1; });
      awardXP(base44, XP_REWARDS.translate_correct);
      if (lessonId) removeFromRevision(`translate-${lessonId}`, current);
    } else {
      save({ current, score });
      setWrongIndices(prev => [...prev, current]);
      awardXP(base44, XP_REWARDS.translate_wrong);
      if (lessonId) {
        addToRevision({
          lessonId: `translate-${lessonId}`,
          promptIndex: current,
          promptText: ex.example_en,
          exampleAnswer: ex.example_sv,
          userAnswer: input,
          grammarIssues: [],
        });
      }
    }
  };

  const handleNext = () => {
    if (current + 1 >= exercisePool.length) {
      clear();
      setFinished(true);
      onComplete?.(score, exercisePool.length);
    } else {
      const next = current + 1;
      save({ current: next, score });
      setCurrent(next);
      setInput("");
      setSubmitted(false);
    }
  };

  const wrongCount = wrongIndices.length;

  const restart = () => {
    clear();
    const retryPool = wrongCount > 0
      ? wrongIndices.map(i => exercisePool[i])
      : allExercises;
    setExercisePool(retryPool);
    setWrongIndices([]);
    setCurrent(0); setInput(""); setSubmitted(false);
    setScore(0); setFinished(false);
  };

  if (finished) {
    const fromPrev = wrongIndices.length === 0 && score === 0 && !!previousResult;
    const displayPct = fromPrev ? previousResult.percentage : Math.round((score / exercisePool.length) * 100);
    const displayScore = fromPrev ? previousResult.score : score;
    const displayTotal = fromPrev ? previousResult.total : exercisePool.length;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="border-border/50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-1">
              {fromPrev ? "Already completed! ✓" : displayPct >= 80 ? "Excellent! 🎉" : displayPct >= 60 ? "Good job! 👍" : "Keep going! 💪"}
            </h3>
            {fromPrev && <p className="text-sm text-muted-foreground italic mb-2">Your last score</p>}
            <p className="text-4xl font-bold text-primary my-2">{displayPct}%</p>
            <p className="text-muted-foreground mb-6">{displayScore} / {displayTotal} correct</p>
            {!fromPrev && wrongCount > 0 && (
              <Button onClick={restart} className="gap-2 mb-3 w-full">
                <RotateCcw className="w-4 h-4" /> Retry {wrongCount} wrong answer{wrongCount !== 1 ? "s" : ""}
              </Button>
            )}
            <Button onClick={restart} variant="outline" className="gap-2 w-full">
              <RotateCcw className="w-4 h-4" /> {fromPrev ? "Try again" : wrongCount > 0 ? "Start over" : "Try Again"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Translate to Swedish — {current + 1} / {exercisePool.length}
          </CardTitle>
          <span className="text-sm text-muted-foreground" aria-label={`Score: ${score} out of ${exercisePool.length}`}>
            Score: {score}
          </span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full mt-2">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(((current + 1) / exercisePool.length) * 100)}
            aria-label="Translation exercise progress"
            style={{ width: `${((current + 1) / exercisePool.length) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {/* English sentence */}
            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Translate this sentence to Swedish:</p>
              <p className="text-lg font-semibold text-foreground">{ex.example_en}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Word: <span className="font-medium">{ex.english} → {ex.swedish}</span>
              </p>
            </div>

            {/* Dictation helper */}
            <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200/60 dark:border-blue-800/30">
              <SpeakButton text={ex.example_sv} lang="sv-SE" />
              <span className="text-xs text-blue-700 dark:text-blue-300">
                Listen to the Swedish sentence, then write it
              </span>
            </div>

            {/* Input */}
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={submitted}
              placeholder="Type the Swedish translation..."
              rows={2}
              aria-label="Type the Swedish translation"
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!submitted) handleSubmit(); } }}
              className="w-full rounded-xl border-2 border-border/50 bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary/60 disabled:opacity-60 transition-colors"
            />

            {/* Progressive hint while typing */}
            {!submitted && <ProgressiveHint answer={ex.example_sv} />}

            {/* Feedback */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                aria-live="polite"
                className={`rounded-xl p-4 border-2 ${isCorrect ? "bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700" : "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-700"}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {isCorrect
                      ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                      : <XCircle className="w-5 h-5 text-red-500" />}
                    <span className={`font-semibold text-sm ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {isCorrect ? "Correct!" : "Not quite"}
                    </span>
                  </div>
                  <SpeakButton text={ex.example_sv} lang="sv-SE" />
                </div>
                {!isCorrect && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-foreground">
                      Correct: <span className="font-semibold">{ex.example_sv}</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      Added to your revision queue — you'll see this again.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center pt-1">
          {!submitted ? (
            <Button onClick={handleSubmit} disabled={!input.trim()} className="ml-auto">
              Check
            </Button>
          ) : (
            <Button onClick={handleNext} className="ml-auto">
              {current + 1 >= exercisePool.length ? "See Results" : "Next →"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
