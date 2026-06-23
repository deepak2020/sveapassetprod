import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, Lightbulb } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { awardXP, XP_REWARDS } from "@/lib/xp";
import SpeakButton from "@/components/shared/SpeakButton";
import SveaLogo from "@/components/shared/SveaLogo";
import { useExerciseProgress } from "@/hooks/useExerciseProgress";

// Tiny stable hash of question content. When admins fix a question, the hash
// changes and any stored "you were on Q3, score 0/5" snapshot is abandoned so
// users don't keep seeing their old mistake from before the fix.
function hashQuestions(qs) {
  const src = (qs || []).map(q =>
    `${q.question_sv || ""}|${q.question_en || q.question || ""}|${(q.options || []).join("~")}|${q.correct_index}`
  ).join("§");
  let h = 0;
  for (let i = 0; i < src.length; i++) h = ((h << 5) - h + src.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

export default function QuizRunner({ questions, quizType, sourceId, sourceTitle, onComplete, previousResult, storageKey, userId, tab, initialProgress }) {
  const versionedKey = storageKey ? `${storageKey}:v${hashQuestions(questions)}` : storageKey;
  const { load, save, clear } = useExerciseProgress(versionedKey, userId, sourceId, tab);
  const remoteApplied = useRef(false);
  const [questionPool, setQuestionPool] = useState(questions);
  const [wrongIndices, setWrongIndices] = useState([]);
  const [currentQ, setCurrentQ] = useState(() => {
    if (previousResult) return 0;
    return initialProgress?.current ?? load()?.current ?? 0;
  });
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [aiExplain, setAiExplain] = useState(null);   // LLM teach-on-mistake
  const [explaining, setExplaining] = useState(false);
  const [score, setScore] = useState(() => {
    if (previousResult) return previousResult.score ?? 0;
    return initialProgress?.score ?? load()?.score ?? 0;
  });
  const [finished, setFinished] = useState(() => !!previousResult);

  useEffect(() => {
    if (remoteApplied.current || finished || initialProgress == null) return;
    remoteApplied.current = true;
    const localIdx = load()?.current ?? 0;
    const remoteIdx = initialProgress.current ?? 0;
    if (remoteIdx > localIdx) {
      setCurrentQ(remoteIdx);
      setScore(initialProgress.score ?? 0);
    }
  }, [initialProgress]);

  if (!questions || questions.length === 0) {
    return (
      <Card className="border-border/50">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No quiz questions available for this lesson yet.</p>
        </CardContent>
      </Card>
    );
  }

  const question = questionPool[currentQ];
  const isCorrect = selected === question.correct_index;

  const handleSelect = async (index) => {
    if (answered) return;
    setSelected(index);
    setAnswered(true);
    const correct = index === question.correct_index;
    if (correct) {
      setScore(s => { save({ current: currentQ, score: s + 1 }); return s + 1; });
    } else {
      save({ current: currentQ, score });
      setWrongIndices(prev => [...prev, currentQ]);
    }
    await awardXP(base44, correct ? XP_REWARDS.quiz_correct : 0);
  };

  const handleNext = async () => {
    if (currentQ + 1 >= questionPool.length) {
      const finalScore = score;
      const percentage = Math.round((finalScore / questionPool.length) * 100);
      clear();
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        await base44.entities.QuizResult.create({
          quiz_type: quizType,
          source_id: sourceId,
          source_title: sourceTitle,
          score: finalScore,
          total: questionPool.length,
          percentage,
        });
      }
      setFinished(true);
      if (onComplete) onComplete(finalScore, questionPool.length);
    } else {
      const nextQ = currentQ + 1;
      save({ current: nextQ, score });
      setCurrentQ(nextQ);
      setSelected(null);
      setAnswered(false);
      setAiExplain(null);
      setExplaining(false);
    }
  };

  // Teach-on-mistake: ask the LLM tutor why the correct answer is right.
  const explainMistake = async () => {
    if (explaining || aiExplain) return;
    setExplaining(true);
    try {
      const q = questionPool[currentQ];
      const res = await base44.functions.invoke("coach", {
        kind: "explain",
        question: q.question_sv || q.question_en || q.question,
        userAnswer: q.options?.[selected],
        correctAnswer: q.options?.[q.correct_index],
      });
      if (res.data?.text) setAiExplain(res.data.text);
    } catch { /* non-critical */ }
    setExplaining(false);
  };

  const handleRestart = () => {
    clear();
    const retryPool = wrongIndices.length > 0
      ? wrongIndices.map(i => questionPool[i])
      : questions;
    setQuestionPool(retryPool);
    setWrongIndices([]);
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setAiExplain(null);
    setExplaining(false);
  };

  const wrongCount = wrongIndices.length;

  if (finished) {
    const percentage = Math.round((score / questionPool.length) * 100);
    const retryCount = wrongCount > 0 ? wrongCount : (previousResult ? questionPool.length : 0);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="border-border/50">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Trophy className={`w-10 h-10 ${percentage >= 70 ? "text-secondary" : "text-primary"}`} />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good job!" : "Keep practicing!"}
            </h3>
            <p className="text-4xl font-bold text-primary mb-2">{percentage}%</p>
            <p className="text-muted-foreground mb-6">
              You got {score} out of {questionPool.length} correct
            </p>
            {retryCount > 0 && (
              <Button onClick={handleRestart} variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                {wrongCount > 0 ? `Retry ${wrongCount} wrong answer${wrongCount !== 1 ? "s" : ""}` : "Try Again"}
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Question {currentQ + 1} of {questionPool.length}
          </CardTitle>
          <span
            className="text-sm text-muted-foreground"
            aria-label={`Score: ${score} out of ${questionPool.length}`}
          >
            Score: {score}
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-muted rounded-full mt-2">
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(((currentQ + 1) / questionPool.length) * 100)}
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${((currentQ + 1) / questionPool.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-5">
              {question.question_sv && (
                <>
                  <div className="flex items-start gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground flex-1">{question.question_sv}</h3>
                    <SpeakButton text={question.question_sv} lang="sv-SE" />
                  </div>
                  {question.question_en && (
                    <p className="text-sm text-muted-foreground italic">{question.question_en}</p>
                  )}
                </>
              )}
              {!question.question_sv && (question.question_en || question.question) && (
                <h3 className="text-lg font-semibold text-foreground">{question.question_en || question.question}</h3>
              )}
              {!question.question_sv && !question.question_en && !question.question && (
                <h3 className="text-lg font-semibold text-foreground">Question not available</h3>
              )}
            </div>
            <div className="space-y-3">
              {question.options.map((option, index) => {
                let optionStyle = "border-border/50 hover:border-primary/30 hover:bg-muted/50";
                if (answered) {
                  if (index === question.correct_index) {
                    optionStyle = "border-chart-3/50 bg-chart-3/5";
                  } else if (index === selected && !isCorrect) {
                    optionStyle = "border-destructive/50 bg-destructive/5";
                  } else {
                    optionStyle = "border-border/30 opacity-50";
                  }
                } else if (index === selected) {
                  optionStyle = "border-primary bg-primary/5";
                }

                return (
                  <button
                     key={index}
                     onClick={() => handleSelect(index)}
                     className={`w-full text-left p-4 md:p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 min-h-12 md:min-h-10 ${optionStyle}`}
                     disabled={answered}
                   >
                    <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-medium shrink-0">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-sm font-medium text-foreground">{option}</span>
                    {answered && index === question.correct_index && (
                      <CheckCircle2 className="w-5 h-5 text-chart-3 ml-auto shrink-0" />
                    )}
                    {answered && index === selected && !isCorrect && index !== question.correct_index && (
                      <XCircle className="w-5 h-5 text-destructive ml-auto shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
            className="space-y-3 pt-2"
          >
            {/* Explanation panel */}
            <div className={`p-4 rounded-xl border-l-4 ${
              isCorrect
                ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500"
                : "bg-amber-50 dark:bg-amber-950/20 border-amber-500"
            }`}>
              <div className="flex items-start gap-2">
                <Lightbulb className={`w-5 h-5 mt-0.5 shrink-0 ${
                  isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                }`} />
                <div className="flex-1 text-sm">
                  {isCorrect ? (
                    <p className="font-medium text-foreground">
                      ✓ Korrekt! · <em className="font-normal">Correct!</em>
                    </p>
                  ) : (
                    <>
                      <p className="font-medium text-foreground mb-1">
                        Rätt svar · <em className="font-normal">Correct answer:</em>
                      </p>
                      <p className="text-foreground font-semibold">
                        {question.options[question.correct_index]}
                      </p>
                    </>
                  )}
                  {question.explanation && (
                    <p className="text-muted-foreground mt-2 leading-relaxed">{question.explanation}</p>
                  )}
                  {!isCorrect && (
                    aiExplain ? (
                      <p className="text-foreground/90 mt-2 leading-relaxed">
                        <SveaLogo className="text-xs mr-1.5" />{aiExplain}
                      </p>
                    ) : (
                      <button
                        onClick={explainMistake}
                        disabled={explaining}
                        className="mt-2 text-xs font-semibold text-primary hover:underline disabled:opacity-60 inline-flex items-center gap-1"
                      >
                        {explaining ? (<><SveaLogo className="text-xs" /> tänker…</>) : (<>Fråga <SveaLogo className="text-xs" /> · Why is this the answer?</>)}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext} className="gap-2 h-11 md:h-10">
                {currentQ + 1 >= questionPool.length ? "See Results" : "Next Question"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}