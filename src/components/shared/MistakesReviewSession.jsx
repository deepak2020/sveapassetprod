import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, Trophy, RotateCcw, Lightbulb, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMistakeLog } from "@/hooks/useMistakeLog";

// Mistakes from full-sentence writing exercises. Reviewing them with a single
// input box doesn't fit — we send the user to the Skriva page where the proper
// production UI (with Svea's feedback) can re-quiz them.
const PRODUCTION_SOURCES = new Set(["gym_produce", "writing"]);

const SOURCE_LABELS = {
  lesson_quiz: "Lesson Quiz",
  civic_quiz: "Civic Quiz",
  lesson_blank: "Fill Blank",
  gym_cloze: "Gym",
  gym_produce: "Skriva",
  grammar: "Grammar",
  writing: "Writing",
};

function normalize(s) {
  return (s || "").toString().trim().toLowerCase().replace(/[\.\,\!\?\:\;'"]/g, "");
}

export default function MistakesReviewSession({ onExit }) {
  const { mistakes, resolveMistake } = useMistakeLog();
  // Freeze the list at mount so resolving a mistake doesn't reshuffle mid-session.
  // Full-sentence production mistakes are excluded — they're handled on the Skriva page.
  const items = useMemo(
    () => mistakes.filter(m => !PRODUCTION_SOURCES.has(m.source)).slice(0, 20),
    []
  );
  const productionCount = useMemo(
    () => mistakes.filter(m => PRODUCTION_SOURCES.has(m.source)).length,
    []
  );
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (items.length === 0) {
    // Only Skriva/writing mistakes left → send the user to the Skriva page
    if (productionCount > 0) {
      return (
        <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto shadow-md">
            <PenSquare className="w-8 h-8 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold">Öva på Skriva-sidan</h2>
          <p className="text-sm text-muted-foreground">
            Dina {productionCount} skriv-misstag repeteras bäst med hela meningar där Svea rättar dig i realtid.
          </p>
          <div className="flex gap-2 justify-center">
            <Button onClick={onExit} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 gap-2">
              <Link to="/speaking">
                <PenSquare className="w-4 h-4" /> Gå till Skriva
              </Link>
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="text-muted-foreground">No mistakes to review — great work!</p>
        <Button onClick={onExit} className="mt-4">Back</Button>
      </div>
    );
  }

  const item = items[current];

  const handleCheck = () => {
    if (revealed) return;
    const isCorrect = normalize(answer) === normalize(item.correct_answer);
    setCorrect(isCorrect);
    setRevealed(true);
    if (isCorrect) {
      setScore(s => s + 1);
      resolveMistake(item.id);
    }
  };

  const handleNext = () => {
    if (current + 1 >= items.length) {
      setDone(true);
    } else {
      setCurrent(c => c + 1);
      setAnswer("");
      setRevealed(false);
      setCorrect(false);
    }
  };

  const handleMastered = () => {
    resolveMistake(item.id);
    handleNext();
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="font-display text-3xl font-bold mb-1">Bra jobbat! 🎉</h2>
        <p className="text-5xl font-bold text-primary my-3">{score} / {items.length}</p>
        <p className="text-muted-foreground mb-6">mistakes cleared</p>
        <Button onClick={onExit} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onExit} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Exit
        </button>
        <span className="text-sm text-muted-foreground">{current + 1} / {items.length}</span>
        <span className="text-sm font-semibold text-primary">Score: {score}</span>
      </div>

      <div className="w-full h-1.5 bg-muted rounded-full">
        <div className="h-full bg-rose-500 rounded-full transition-all"
          style={{ width: `${((current + 1) / items.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-5">
              {/* Source badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-medium">
                  {SOURCE_LABELS[item.source] || item.source}
                </span>
                {item.source_title && (
                  <span className="text-xs text-muted-foreground truncate">{item.source_title}</span>
                )}
                {item.attempts > 1 && (
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    wrong {item.attempts}× before
                  </span>
                )}
              </div>

              {/* Question */}
              <div className="bg-muted/40 rounded-xl p-4">
                <p className="text-base font-medium leading-relaxed whitespace-pre-line">{item.question}</p>
                {item.question_en && (
                  <p className="text-sm text-muted-foreground italic mt-1">{item.question_en}</p>
                )}
              </div>

              {/* Answer input */}
              {!revealed ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleCheck(); }}
                    placeholder="Your answer..."
                    autoFocus
                    className="w-full border-2 border-border/50 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-primary transition-colors bg-transparent"
                  />
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    {["å", "ä", "ö"].map(c => (
                      <button key={c} onClick={() => setAnswer(a => a + c)}
                        className="px-2.5 py-1 border rounded-lg hover:bg-muted transition-colors font-medium">{c}</button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCheck} disabled={!answer.trim()} className="flex-1">Check</Button>
                    <Button onClick={handleMastered} variant="outline" className="gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> I know it
                    </Button>
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  {/* What the user just typed */}
                  <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">You wrote</p>
                    <p className="text-sm text-foreground">{answer}</p>
                  </div>

                  <div className={`p-3 rounded-lg border ${correct
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
                  }`}>
                    {correct ? (
                      <p className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Correct! Mistake cleared.
                      </p>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 mb-1">
                          <XCircle className="w-4 h-4" /> Not quite
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Correct answer:</span>{" "}
                          <span className="font-bold text-foreground">{item.correct_answer}</span>
                        </p>
                      </>
                    )}
                  </div>

                  {/* Previous attempt — helpful reminder of the original mistake */}
                  {item.user_answer && item.user_answer !== answer && (
                    <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-3">
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
                        Last time you wrote
                      </p>
                      <p className="text-sm text-amber-900 dark:text-amber-100 line-through decoration-amber-500/60">
                        {item.user_answer}
                      </p>
                    </div>
                  )}

                  {/* Svea's explanation (grammar rule / correction reason) */}
                  {item.explanation && (
                    <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-3 flex gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-1">
                          Svea's correction
                        </p>
                        <p className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">{item.explanation}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!correct && (
                      <Button onClick={handleMastered} variant="outline" className="gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Got it — clear
                      </Button>
                    )}
                    <Button onClick={handleNext} className="flex-1 gap-2">
                      {current + 1 >= items.length ? "See Results" : "Next"}
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}