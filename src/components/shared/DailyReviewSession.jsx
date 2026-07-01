import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Trophy, ArrowLeft, Zap, Loader2, Sparkles, Flame, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { normalizeAnswer } from "@/lib/normalizeAnswer";
import { XP_REWARDS } from "@/lib/xp";
import { base44 } from "@/api/base44Client";
import { getCachedFeedback, setCachedFeedback } from "@/lib/aiCache";
import SpeakButton from "@/components/shared/SpeakButton";
import { useSpeech } from "@/hooks/useSpeech";

async function explainVocabAnswer(english, swedish, userAnswer) {
  return base44.integrations.Core.InvokeLLM({
    prompt: `You are a friendly Swedish teacher for SFI students.

English word/phrase: "${english}"
Correct Swedish: "${swedish}"
Student wrote: "${userAnswer || "(nothing)"}"

In simple English, explain in 1-2 sentences why "${swedish}" is the correct translation.
Focus on what's useful: word type, any grammar rule, or why this specific word is used.
Then give one short memory tip to remember this word.

Return JSON:
- explanation: string (1-2 sentences, why this is correct)
- tip: string (one short memory trick)`,
    response_json_schema: {
      type: "object",
      properties: {
        explanation: { type: "string" },
        tip: { type: "string" },
      },
    },
  });
}

// Pick 3 distractors from the same pool, falling back to a small generic set.
// Critical: also exclude anything that overlaps with the answer's accepted
// alternatives (e.g. answer "de / dom" — neither "de" nor "dom" may be a distractor).
const FALLBACK_WORDS = ["hus", "bil", "katt", "hund", "bok", "vatten", "mat", "stol", "dag", "natt"];
function splitAlternatives(s) {
  return (s || "").split(/[\/,;]| eller /i).map(x => x.trim().toLowerCase()).filter(Boolean);
}
function buildDistractors(item, pool) {
  const forbidden = new Set(splitAlternatives(item.swedish));
  const others = pool
    .filter(p => p.id !== item.id && p.swedish)
    .map(p => p.swedish)
    .filter(sv => {
      const alts = splitAlternatives(sv);
      // skip if any alternative collides with the answer's alternatives
      return alts.length > 0 && !alts.some(a => forbidden.has(a));
    });
  // dedupe by lowercase first form
  const seen = new Set();
  const unique = [];
  for (const sv of others) {
    const key = (sv || "").trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(sv);
  }
  // shuffle
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }
  const picked = unique.slice(0, 3);
  let i = 0;
  while (picked.length < 3) {
    const f = FALLBACK_WORDS[(i++) % FALLBACK_WORDS.length];
    if (!forbidden.has(f.toLowerCase()) && !picked.some(p => p.toLowerCase() === f.toLowerCase())) picked.push(f);
  }
  return picked;
}

// Decide question type for each item: rotate typing → multiple choice → listening.
function pickMode(index) {
  const mods = ["type", "choice", "listen"];
  return mods[index % mods.length];
}

export default function DailyReviewSession({ items, pool = [], onAnswer, onComplete, onContinue, canContinue = false, onExit }) {
  // Lock the session's question set at mount — the parent rebuilds `items`
  // after every answer (because updateCard triggers a re-rank), which was
  // making the current question swap out the moment the user picked an option.
  const [sessionItems] = useState(() => items);
  const [sessionPool] = useState(() => pool);

  const [current, setCurrent] = useState(0);
  const [typed, setTyped] = useState("");
  const [chosen, setChosen] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const { speak } = useSpeech();

  const item = sessionItems[current];
  const mode = useMemo(() => pickMode(current), [current]);

  // Memo distractors per question — keyed only by the item's id so this
  // never reshuffles mid-question (parent rerenders pass new array refs).
  const options = useMemo(() => {
    if (!item || mode === "type") return [];
    const distractors = buildDistractors(item, sessionPool.length ? sessionPool : sessionItems);
    const all = [item.swedish, ...distractors];
    for (let i = all.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.id, mode]);

  // Auto-play audio for listening questions
  useEffect(() => {
    if (mode === "listen" && item && !answered) {
      const t = setTimeout(() => speak(item.swedish, "sv-SE"), 250);
      return () => clearTimeout(t);
    }
  }, [current, mode, item, answered, speak]);

  useEffect(() => {
    if (!answered || correct || !item) return;
    const cacheKey = `review-vocab-${item.id}`;
    setAiFeedback(null);
    setAiLoading(true);
    (async () => {
      try {
        const cached = await getCachedFeedback(base44, cacheKey);
        if (cached) { setAiFeedback(cached); setAiLoading(false); return; }
        const result = await explainVocabAnswer(item.english, item.swedish, typed || chosen || "");
        if (result?.explanation) {
          setAiFeedback(result);
          await setCachedFeedback(base44, cacheKey, result);
        }
      } catch {}
      setAiLoading(false);
    })();
  }, [answered, correct, current]);

  // Accept both the full string (e.g. "de / dom") and each alternative ("de", "dom")
  // so that the answer tile itself is recognized in multiple-choice mode.
  const acceptableAnswers = useMemo(() => {
    const full = normalizeAnswer(item?.swedish || "");
    const parts = (item?.swedish || "")
      .split(/[\/,;]| eller /i)
      .map(s => normalizeAnswer(s))
      .filter(Boolean);
    return Array.from(new Set([full, ...parts].filter(Boolean)));
  }, [item]);

  const finishAnswer = (isCorrect) => {
    setAnswered(true);
    setCorrect(isCorrect);
    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => {
        const ns = s + 1;
        setBestStreak(b => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
    if (onAnswer && item?.id) onAnswer(item.id, isCorrect ? 2 : 0);
  };

  const handleCheckType = () => {
    if (answered || !item) return;
    const isCorrect = acceptableAnswers.some(a => a === normalizeAnswer(typed));
    finishAnswer(isCorrect);
  };

  const handlePickChoice = (option) => {
    if (answered || !item) return;
    setChosen(option);
    const isCorrect = acceptableAnswers.some(a => a === normalizeAnswer(option));
    finishAnswer(isCorrect);
  };

  const handleNext = () => {
    if (current + 1 >= sessionItems.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setTyped("");
      setChosen(null);
      setAnswered(false);
      setCorrect(false);
      setAiFeedback(null);
      setAiLoading(false);
    }
  };

  if (!sessionItems.length) return null;

  if (finished) {
    const pct = Math.round((score / sessionItems.length) * 100);
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
        <p className="text-muted-foreground mb-1">{score} / {sessionItems.length} correct</p>
        {bestStreak >= 3 && (
          <p className="text-sm text-amber-700 dark:text-amber-400 mb-3 inline-flex items-center gap-1">
            <Flame className="w-4 h-4" /> Best streak: {bestStreak} in a row
          </p>
        )}
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-2 mb-6 mt-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="font-semibold text-amber-700 dark:text-amber-400">+{XP_REWARDS.daily_review_bonus} XP bonus earned!</span>
        </div>
        <div className="space-y-2">
          {canContinue && onContinue && (
            <Button onClick={onContinue} size="lg" className="w-full bg-amber-500 hover:bg-amber-600 text-white gap-2">
              <Flame className="w-4 h-4" /> Keep going — more words
            </Button>
          )}
          <Button onClick={onComplete} size="lg" variant={canContinue ? "outline" : "default"} className="w-full">
            {canContinue ? "I'm done for now" : "Continue learning"}
          </Button>
        </div>
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
        <span className="text-sm text-muted-foreground">{current + 1} / {sessionItems.length}</span>
        <span className="text-sm font-semibold text-primary">Score: {score}</span>
      </div>

      {/* Progress bar + live streak */}
      <div className="space-y-2">
        <div className="w-full h-1.5 bg-muted rounded-full">
          <div
            className="h-full bg-amber-500 rounded-full transition-all"
            style={{ width: `${((current + 1) / sessionItems.length) * 100}%` }}
          />
        </div>
        <AnimatePresence>
          {streak >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{streak} in a row!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center mb-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full">
          🔥 Daily Warm-up · {mode === "type" ? "Type it" : mode === "choice" ? "Multiple choice" : "Listen & pick"}
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
              {/* Prompt area — varies by mode */}
              {mode === "type" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 text-center">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">English</p>
                  <p className="text-xl font-semibold text-blue-900 dark:text-blue-100">{item.english}</p>
                </div>
              )}

              {mode === "choice" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5 text-center">
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">English</p>
                  <p className="text-xl font-semibold text-blue-900 dark:text-blue-100">{item.english}</p>
                  <p className="text-xs text-muted-foreground mt-2">Pick the correct Swedish translation</p>
                </div>
              )}

              {mode === "listen" && (
                <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl p-6 text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Headphones className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">Listen</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Tap to hear the Swedish word again</p>
                  <div className="flex justify-center">
                    <SpeakButton text={item.swedish} className="w-12 h-12 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300" />
                  </div>
                  {answered && (
                    <p className="text-xs text-muted-foreground mt-3">Meaning: <span className="font-medium text-foreground">{item.english}</span></p>
                  )}
                </div>
              )}

              {/* Answer area */}
              {mode === "type" && (
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Type in Swedish
                  </label>
                  <input
                    type="text"
                    value={typed}
                    onChange={e => setTyped(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !answered) handleCheckType(); }}
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
                  {!answered && (
                    <Button onClick={handleCheckType} className="w-full min-h-[44px]" disabled={!typed.trim()}>
                      Check
                    </Button>
                  )}
                </div>
              )}

              {(mode === "choice" || mode === "listen") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {options.map((opt) => {
                    const isAnswerCorrect = acceptableAnswers.some(a => a === normalizeAnswer(opt));
                    const isChosen = chosen === opt;
                    let cls = "border-2 border-border/50 hover:border-primary hover:bg-muted";
                    if (answered) {
                      if (isAnswerCorrect) cls = "border-2 border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300";
                      else if (isChosen) cls = "border-2 border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300";
                      else cls = "border-2 border-border/30 opacity-60";
                    }
                    return (
                      <button
                        key={opt}
                        onClick={() => handlePickChoice(opt)}
                        disabled={answered}
                        className={`px-4 py-3 rounded-xl text-left font-medium transition-colors ${cls}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
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
                      {!correct && mode === "type" && typed.trim() && (
                        <p className="text-xs text-muted-foreground mt-0.5">You wrote: {typed}</p>
                      )}
                      {!correct && mode !== "type" && chosen && (
                        <p className="text-xs text-muted-foreground mt-0.5">You picked: {chosen}</p>
                      )}
                    </div>
                  </div>

                  {/* AI explanation on wrong answers */}
                  {!correct && (
                    <div className="rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                        <span className="text-xs font-semibold text-violet-700 dark:text-violet-300 uppercase tracking-wide">AI Explanation</span>
                      </div>
                      {aiLoading ? (
                        <div className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400">
                          <Loader2 className="w-4 h-4 animate-spin" /> Thinking…
                        </div>
                      ) : aiFeedback ? (
                        <div className="space-y-2 text-sm">
                          <p className="text-foreground leading-relaxed">{aiFeedback.explanation}</p>
                          {aiFeedback.tip && (
                            <p className="text-muted-foreground italic text-xs border-t border-violet-200 dark:border-violet-700 pt-2">
                              💡 {aiFeedback.tip}
                            </p>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}

                  <Button onClick={handleNext} className="w-full">
                    {current + 1 >= sessionItems.length ? "See Results" : "Next →"}
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