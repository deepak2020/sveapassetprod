import { useState, useRef, useEffect } from "react";
import { CheckCircle2, XCircle, RotateCcw, Trophy, Lightbulb, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useExerciseProgress } from "@/hooks/useExerciseProgress";
import { useWritingRevision } from "@/hooks/useWritingRevision";
import { normalizeAnswer } from "@/lib/normalizeAnswer";
import { base44 } from "@/api/base44Client";
import { awardXP, XP_REWARDS } from "@/lib/xp";
import SpeakButton from "@/components/shared/SpeakButton";
import { getCachedFeedback, setCachedFeedback, translateCacheKey } from "@/lib/aiCache";

// Svea evaluates the student's Swedish translation semantically instead of
// requiring an exact character match against the reference sentence. Accepts
// any grammatical, natural Swedish that faithfully translates the English.
async function evaluateTranslation(englishSentence, modelSwedish, userAnswer) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are Svea, a Swedish language teacher evaluating a student's translation.

English prompt: "${englishSentence}"
Model Swedish translation: "${modelSwedish}"
Student wrote: "${userAnswer}"

CRITICAL RULE — read this twice:
The model translation is ONE possible answer, not THE only answer. If the student's sentence is grammatically correct, natural Swedish, AND faithfully translates the English prompt, it is CORRECT — even if it uses different words, a different preposition, a different article form, or different structure than the model. DO NOT reject valid Swedish just because it differs from the model.

PREPOSITIONS: Swedish often allows multiple prepositions (på/i/från/till/hos/med etc.). Accept any grammatical choice that fits the meaning.

DEFINITE vs INDEFINITE FORMS: If the student's noun form is grammatical in their sentence, accept it.

SYNONYMS & PHRASING: "mycket" vs "så", "ha" vs "bära" (for wearing), "man" vs "du" — accept synonyms and alternative phrasings if they preserve the meaning.

MINOR TYPOS: Single-character typos in an otherwise clearly-correct word (e.g. "hanskar" for "handskar") should be treated as correct but noted in the explanation.

Mark as INCORRECT only if there is a real error: wrong meaning, missing key content, wrong verb form/tense that changes meaning, wrong word order (V2 violation), or the sentence doesn't actually translate the English prompt.

Return JSON:
- correct: boolean (true if the student's sentence is a valid Swedish translation)
- had_typo: boolean (true if there was a minor typo but meaning was clear)
- feedback: string, English, max 20 words. If correct, briefly confirm what makes their choice work (especially if different from model). If wrong, explain what needs fixing.`,
    response_json_schema: {
      type: "object",
      properties: {
        correct: { type: "boolean" },
        had_typo: { type: "boolean" },
        feedback: { type: "string" },
      },
      required: ["correct", "feedback"],
    },
  });
  return result;
}

async function explainTranslation(englishSentence, correctSwedish) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a Swedish language teacher. Explain the key words and grammar in this correct Swedish translation so a learner understands WHY each word is used.

English: "${englishSentence}"
Swedish: "${correctSwedish}"

For each meaningful word or phrase, explain its meaning, grammar role, or why Swedish uses it this way. Be specific (e.g. "hittade — past tense of hitta = to find", "bra — Swedish adjective for good, same form for en/ett", "en platsannons — en-word meaning job advertisement").

Return JSON:
- issues: array of { wrong: string (set to "?"), correct: string (the word/phrase), explanation: string (max 15 words) }

Cover the 3-5 most important or non-obvious words. Skip very simple common words like jag/och/är unless they are the source of confusion.`,
    response_json_schema: {
      type: "object",
      properties: {
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              wrong: { type: "string" },
              correct: { type: "string" },
              explanation: { type: "string" },
            },
          },
        },
      },
    },
  });
  return result?.issues ?? [];
}

async function getExplanation(base44Client, lessonId, promptIndex, englishSentence, correctSwedish) {
  const key = translateCacheKey(lessonId, promptIndex);
  const cached = await getCachedFeedback(base44Client, key);
  if (cached) return cached;
  const issues = await explainTranslation(englishSentence, correctSwedish);
  await setCachedFeedback(base44Client, key, issues);
  return issues;
}

function GrammarIssueCard({ issue }) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 px-3 py-2.5">
      <p className="text-xs font-mono font-semibold text-green-700 dark:text-green-400 mb-1">
        {issue.correct}
      </p>
      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
        💡 {issue.explanation}
      </p>
    </div>
  );
}

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
  const [explanation, setExplanation] = useState({ issues: [], loading: false });

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
  const isCorrect = submitted && (sveaVerdict?.correct === true || (sveaVerdict === null && isCloseEnough(input, ex.example_sv)));

  const handleSubmit = async () => {
    if (!input.trim() || checking) return;
    setChecking(true);

    // Ask Svea to judge the translation semantically. If Svea fails, fall back to string match.
    let verdict = null;
    try {
      verdict = await evaluateTranslation(ex.example_en, ex.example_sv, input);
    } catch {
      verdict = null;
    }
    setSveaVerdict(verdict);
    setChecking(false);
    setSubmitted(true);

    const correct = verdict ? verdict.correct : isCloseEnough(input, ex.example_sv);

    if (correct) {
      setScore(s => { save({ current, score: s + 1 }); return s + 1; });
      awardXP(base44, XP_REWARDS.translate_correct);
      if (lessonId) removeFromRevision(`translate-${lessonId}`, current);
    } else {
      save({ current, score });
      setWrongIndices(prev => [...prev, current]);
      awardXP(base44, XP_REWARDS.translate_wrong);
      // Fetch word-level explanation for the reference sentence
      setExplanation({ issues: [], loading: true });
      getExplanation(base44, lessonId, current, ex.example_en, ex.example_sv)
        .then(issues => setExplanation({ issues, loading: false }))
        .catch(() => setExplanation({ issues: [], loading: false }));
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
      setSveaVerdict(null);
      setExplanation({ issues: [], loading: false });
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
    setCurrent(0); setInput(""); setSubmitted(false); setSveaVerdict(null);
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
                      {isCorrect ? (sveaVerdict?.had_typo ? "Correct (small typo)" : "Correct!") : "Not quite"}
                    </span>
                  </div>
                  <SpeakButton text={ex.example_sv} lang="sv-SE" />
                </div>
                {/* Svea's semantic feedback — shown for both correct and incorrect */}
                {sveaVerdict?.feedback && (
                  <p className={`text-xs mt-2 ${isCorrect ? "text-green-700 dark:text-green-400" : "text-foreground"}`}>
                    <span className="font-semibold">Svea:</span> {sveaVerdict.feedback}
                  </p>
                )}
                {isCorrect && input.trim() && normalizeAnswer(input) !== normalizeAnswer(ex.example_sv) && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Reference: <span className="font-medium text-foreground">{ex.example_sv}</span>
                  </p>
                )}
                {!isCorrect && (
                  <div className="mt-2 space-y-2.5">
                    <p className="text-sm text-foreground">
                      Correct: <span className="font-semibold">{ex.example_sv}</span>
                    </p>

                    {/* AI grammar explanations */}
                    {explanation.loading && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        Explaining the differences…
                      </div>
                    )}
                    {!explanation.loading && explanation.issues.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                          Why these words?
                        </p>
                        {explanation.issues.map((issue, i) => (
                          <GrammarIssueCard key={i} issue={issue} />
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <RotateCcw className="w-3 h-3" />
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
            <Button onClick={handleSubmit} disabled={!input.trim() || checking} className="ml-auto gap-1.5">
              {checking && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {checking ? "Svea is checking…" : "Check"}
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