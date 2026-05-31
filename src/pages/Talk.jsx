import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SpeakButton from "@/components/shared/SpeakButton";
import { normalizeAnswer } from "@/lib/normalizeAnswer";
import { TALK_TOPICS, LEVELS, LEVEL_LABELS, COUNT_OPTIONS } from "@/data/talkTopics";
import { base44 } from "@/api/base44Client";
import { getCachedFeedback, setCachedFeedback, translateCacheKey } from "@/lib/aiCache";

// ─── Fuzzy match (allow 1-2 char diff) ───────────────────────────────────────
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

// ─── AI explanation ───────────────────────────────────────────────────────────
async function explainSentence(en, sv) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a Swedish language teacher. Explain the key words and grammar in this correct Swedish sentence so a learner understands WHY each word is used.

English: "${en}"
Swedish: "${sv}"

For each meaningful word or phrase explain its meaning, grammar role, or why Swedish uses it this way (e.g. "hittade — past tense of hitta = to find").

Return JSON:
- issues: array of { correct: string (the word/phrase), explanation: string (max 15 words) }

Cover 3-5 important or non-obvious words. Skip very simple common words.`,
    response_json_schema: {
      type: "object",
      properties: {
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
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

async function getExplanation(topicId, level, idx, en, sv) {
  const key = translateCacheKey(`talk-${topicId}-${level}`, idx);
  const cached = await getCachedFeedback(base44, key);
  if (cached) return cached;
  const issues = await explainSentence(en, sv);
  await setCachedFeedback(base44, key, issues);
  return issues;
}

// ─── Grammar card ─────────────────────────────────────────────────────────────
function GrammarCard({ issue }) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 px-3 py-2">
      <p className="text-xs font-mono font-semibold text-green-700 dark:text-green-400 mb-0.5">{issue.correct}</p>
      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">💡 {issue.explanation}</p>
    </div>
  );
}

// ─── Progressive hint ─────────────────────────────────────────────────────────
function ProgressiveHint({ answer }) {
  const [revealed, setRevealed] = useState(0);
  const words = answer?.split(" ") ?? [];
  if (!answer) return null;
  const allShown = revealed >= words.length;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-amber-500 text-sm">💡</span>
      {!allShown && (
        <button
          onClick={() => setRevealed(r => Math.min(r + 1, words.length))}
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
          <button onClick={() => setRevealed(0)} className="text-xs text-muted-foreground hover:text-foreground">reset</button>
        </>
      )}
      {revealed === 0 && <span className="text-xs text-muted-foreground">Need a nudge? Reveal word by word.</span>}
    </div>
  );
}

// ─── Exercise step ────────────────────────────────────────────────────────────
function TalkExercise({ sentences, topicId, level, onBack, onDone }) {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [explanation, setExplanation] = useState({ issues: [], loading: false });

  const ex = sentences[current];
  const isCorrect = submitted && isCloseEnough(input, ex.sv);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setSubmitted(true);
    if (isCloseEnough(input, ex.sv)) {
      setScore(s => s + 1);
    } else {
      setWrongCount(w => w + 1);
      setExplanation({ issues: [], loading: true });
      getExplanation(topicId, level, current, ex.en, ex.sv)
        .then(issues => setExplanation({ issues, loading: false }))
        .catch(() => setExplanation({ issues: [], loading: false }));
    }
  };

  const handleNext = () => {
    if (current + 1 >= sentences.length) {
      setFinished(true);
      onDone?.(score + (isCorrect ? 1 : 0), sentences.length);
    } else {
      setCurrent(c => c + 1);
      setInput("");
      setSubmitted(false);
      setExplanation({ issues: [], loading: false });
    }
  };

  const restart = () => {
    setCurrent(0); setInput(""); setSubmitted(false);
    setScore(0); setWrongCount(0); setFinished(false);
    setExplanation({ issues: [], loading: false });
  };

  if (finished) {
    const finalScore = score + (isCorrect ? 0 : 0); // already updated in handleNext path
    const pct = Math.round((score / sentences.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto">
        <Card className="border-border/50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-1">
              {pct >= 80 ? "Excellent! 🎉" : pct >= 60 ? "Good job! 👍" : "Keep practising! 💪"}
            </h3>
            <p className="text-4xl font-bold text-primary my-3">{pct}%</p>
            <p className="text-muted-foreground mb-6">{score} / {sentences.length} correct</p>
            <div className="space-y-2">
              <Button onClick={restart} className="w-full gap-2">
                <RotateCcw className="w-4 h-4" /> Try again
              </Button>
              <Button onClick={onBack} variant="outline" className="w-full gap-2">
                <ArrowLeft className="w-4 h-4" /> Choose another topic
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {current + 1} / {sentences.length}
            </CardTitle>
            <span className="text-sm text-muted-foreground">Score: {score}</span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full mt-2">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${((current + 1) / sentences.length) * 100}%` }}
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
              {/* English prompt */}
              <div className="bg-muted/40 rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Translate to Swedish:</p>
                <p className="text-lg font-semibold text-foreground">{ex.en}</p>
              </div>

              {/* Listen bar */}
              <div className="flex items-center gap-3 p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200/60 dark:border-blue-800/30">
                <SpeakButton text={ex.sv} lang="sv-SE" />
                <span className="text-xs text-blue-700 dark:text-blue-300">Listen to the Swedish, then write it</span>
              </div>

              {/* Input */}
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={submitted}
                placeholder="Type the Swedish translation…"
                rows={2}
                aria-label="Type the Swedish translation"
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (!submitted) handleSubmit(); } }}
                className="w-full rounded-xl border-2 border-border/50 bg-background px-4 py-3 text-sm resize-none focus:outline-none focus:border-primary/60 disabled:opacity-60 transition-colors"
              />

              {/* Progressive hint */}
              {!submitted && <ProgressiveHint answer={ex.sv} />}

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
                      {isCorrect ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-red-500" />}
                      <span className={`font-semibold text-sm ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {isCorrect ? "Correct!" : "Not quite"}
                      </span>
                    </div>
                    <SpeakButton text={ex.sv} lang="sv-SE" />
                  </div>
                  {!isCorrect && (
                    <div className="mt-2 space-y-2.5">
                      <p className="text-sm text-foreground">Correct: <span className="font-semibold">{ex.sv}</span></p>
                      {explanation.loading && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Loader2 className="w-3 h-3 animate-spin" /> Explaining the differences…
                        </div>
                      )}
                      {!explanation.loading && explanation.issues.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-amber-500" /> Why these words?
                          </p>
                          {explanation.issues.map((issue, i) => <GrammarCard key={i} issue={issue} />)}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center pt-1">
            {!submitted
              ? <Button onClick={handleSubmit} disabled={!input.trim()} className="ml-auto">Check</Button>
              : <Button onClick={handleNext} className="ml-auto">{current + 1 >= sentences.length ? "See Results" : "Next →"}</Button>
            }
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Talk page ───────────────────────────────────────────────────────────
export default function Talk() {
  // step: "topics" | "config" | "exercise"
  const [step, setStep] = useState("topics");
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCount, setSelectedCount] = useState(10);
  const [sentences, setSentences] = useState([]);

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setSelectedLevel(null);
    setStep("config");
  };

  const handleStart = () => {
    const pool = selectedTopic.levels[selectedLevel] ?? [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    setSentences(shuffled.slice(0, Math.min(selectedCount, shuffled.length)));
    setStep("exercise");
  };

  const backToTopics = () => {
    setStep("topics");
    setSelectedTopic(null);
    setSelectedLevel(null);
    setSentences([]);
  };

  const backToConfig = () => {
    setStep("config");
    setSentences([]);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32">

      {/* ── Header ── */}
      <div className="mb-8">
        {step !== "topics" && (
          <button
            onClick={step === "exercise" ? backToConfig : backToTopics}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === "exercise" ? "Change settings" : "All topics"}
          </button>
        )}
        <h1 className="font-display text-3xl font-bold text-foreground leading-tight">
          🗨️ Talk to Me
        </h1>
        <p className="text-muted-foreground mt-1">
          Choose a topic, pick your level, and practise translating everyday Swedish sentences.
        </p>
      </div>

      <AnimatePresence mode="wait">

        {/* ── Step 1: Topic grid ── */}
        {step === "topics" && (
          <motion.div key="topics" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {TALK_TOPICS.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic)}
                  className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all hover:scale-[1.02] hover:shadow-md text-left ${topic.colorClass}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-2xl mb-3 ${topic.iconBg}`}>
                    {topic.emoji}
                  </div>
                  <p className="font-bold text-sm text-foreground leading-tight">{topic.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{topic.titleEn}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Level + count config ── */}
        {step === "config" && selectedTopic && (
          <motion.div key="config" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="max-w-lg mx-auto space-y-6">

            {/* Topic badge */}
            <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${selectedTopic.colorClass}`}>
              <span className="text-3xl">{selectedTopic.emoji}</span>
              <div>
                <p className="font-bold text-foreground">{selectedTopic.title}</p>
                <p className="text-xs text-muted-foreground">{selectedTopic.titleEn}</p>
              </div>
            </div>

            {/* Level selector */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Choose difficulty</p>
              <div className="grid grid-cols-2 gap-2">
                {LEVELS.map(lvl => {
                  const info = LEVEL_LABELS[lvl];
                  const count = selectedTopic.levels[lvl]?.length ?? 0;
                  const isSelected = selectedLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      onClick={() => setSelectedLevel(lvl)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border hover:border-primary/40 hover:bg-muted/50"
                      }`}
                    >
                      <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border mb-1 ${info.color}`}>{lvl}</span>
                      <p className="text-xs font-semibold text-foreground leading-tight">{info.label}</p>
                      <p className="text-xs text-muted-foreground">{info.labelEn} · {count} sentences</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Count selector */}
            {selectedLevel && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-sm font-semibold text-foreground mb-3">How many sentences?</p>
                <div className="flex gap-2 flex-wrap">
                  {COUNT_OPTIONS.map(n => {
                    const available = selectedTopic.levels[selectedLevel]?.length ?? 0;
                    const disabled = n > available;
                    return (
                      <button
                        key={n}
                        disabled={disabled}
                        onClick={() => setSelectedCount(n)}
                        className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                          selectedCount === n && !disabled
                            ? "border-primary bg-primary text-primary-foreground"
                            : disabled
                            ? "border-border/40 text-muted-foreground/40 cursor-not-allowed"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setSelectedCount(selectedTopic.levels[selectedLevel]?.length ?? 0)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                      selectedCount === (selectedTopic.levels[selectedLevel]?.length ?? 0)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    All ({selectedTopic.levels[selectedLevel]?.length ?? 0})
                  </button>
                </div>
              </motion.div>
            )}

            <Button
              onClick={handleStart}
              disabled={!selectedLevel}
              className="w-full text-base py-6"
            >
              Start practice →
            </Button>
          </motion.div>
        )}

        {/* ── Step 3: Exercise ── */}
        {step === "exercise" && (
          <motion.div key="exercise" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <TalkExercise
              sentences={sentences}
              topicId={selectedTopic?.id}
              level={selectedLevel}
              onBack={backToTopics}
              onDone={() => {}}
            />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
