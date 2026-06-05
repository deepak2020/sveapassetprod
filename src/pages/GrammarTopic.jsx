import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy, Sparkles, Loader2, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GRAMMAR_CATEGORIES } from "@/data/grammarTopics";
import { supabase } from "@/api/supabaseClient";
import { base44 } from "@/api/base44Client";
import { awardXP, XP_REWARDS } from "@/lib/xp";

const COLOR = {
  green:  { bar: "bg-green-500", badge: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300", correct: "border-green-400 bg-green-50 dark:bg-green-950/30", ai: "bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800" },
  amber:  { bar: "bg-amber-500",  badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",  correct: "border-green-400 bg-green-50 dark:bg-green-950/30", ai: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800"  },
  violet: { bar: "bg-violet-500", badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300", correct: "border-green-400 bg-green-50 dark:bg-green-950/30", ai: "bg-violet-50 border-violet-200 dark:bg-violet-950/30 dark:border-violet-800" },
};

const aiCache = new Map();

async function getAIExplanation(question, correctAnswer, userAnswer, rule) {
  const key = `${question}||${userAnswer}`;
  if (aiCache.has(key)) return aiCache.get(key);
  try {
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `A student is practising Swedish grammar.

Grammar rule being tested: ${rule}

Question: ${question}
Correct answer: ${correctAnswer}
Student's wrong answer: ${userAnswer}

Give a short, friendly explanation (2-3 sentences max) of WHY the correct answer is right and what mistake the student made. Use one simple example. No bullet points — just clear natural English.`,
      add_context_from_history: false,
      response_json_schema: {
        type: "object",
        properties: { explanation: { type: "string" } },
        required: ["explanation"],
      },
    });
    const text = result?.explanation || result?.choices?.[0]?.message?.content || "";
    aiCache.set(key, text);
    return text;
  } catch {
    return null;
  }
}

function saveProgress(topicId, done, total, completed) {
  try {
    localStorage.setItem(`grammar:progress:${topicId}`, JSON.stringify({ done, total, completed }));
  } catch {}
}

export default function GrammarTopic() {
  const { categoryId, topicId } = useParams();
  const navigate = useNavigate();

  // Static fallback
  const staticCat = GRAMMAR_CATEGORIES.find(c => c.id === categoryId);
  const staticTopic = staticCat?.topics.find(t => t.id === topicId);

  const [category, setCategory] = useState(staticCat);
  const [topic, setTopic] = useState(staticTopic);
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    // Try to load topic + exercises from DB
    Promise.all([
      supabase.grammar.getTopics(),
      supabase.grammar.getExercises(topicId),
    ]).then(([topicsRes, exRes]) => {
      const dbTopic = topicsRes.data?.find(t => t.id === topicId);
      if (dbTopic && exRes.data?.length) {
        const dbCat = GRAMMAR_CATEGORIES.find(c => c.id === categoryId) || staticCat;
        setCategory(dbCat);
        setTopic({
          id: dbTopic.id,
          title: dbTopic.title,
          titleSv: dbTopic.title_sv,
          description: dbTopic.description,
          rule: dbTopic.rule,
          exercises: exRes.data.map(e => ({
            q: e.question,
            options: e.options,
            correct: e.correct_index,
            explanation: e.explanation,
          })),
        });
      }
    }).catch(() => {}).finally(() => setDbLoading(false));
  }, [topicId, categoryId]);

  const [view, setView] = useState("lesson"); // lesson | exercise | result
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [aiText, setAiText] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const xpAwarded = useRef(false);

  const c = COLOR[category?.color || "green"];
  const exercises = topic?.exercises || [];
  const ex = exercises[current];
  const total = exercises.length;

  useEffect(() => {
    // reset on topic change
    setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setView("lesson"); xpAwarded.current = false;
  }, [topicId]);

  useEffect(() => {
    if (!answered || selected === ex?.correct) return;
    setAiLoading(true);
    setAiText(null);
    getAIExplanation(ex.q, ex.options[ex.correct], ex.options[selected], topic.rule)
      .then(txt => setAiText(txt))
      .finally(() => setAiLoading(false));
  }, [answered]);

  if (!category || !topic) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Topic not found.</p>
        <Button onClick={() => navigate("/grammar")} className="mt-4" variant="outline">← Back to Grammar</Button>
      </div>
    );
  }

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === ex.correct) {
      setScore(s => s + 1);
      awardXP(base44, XP_REWARDS.quiz_correct || 5);
    }
  };

  const handleNext = () => {
    const nextIdx = current + 1;
    if (nextIdx >= total) {
      const finalScore = score + (selected === ex.correct ? 0 : 0); // already counted
      saveProgress(topic.id, total, total, true);
      if (!xpAwarded.current) {
        xpAwarded.current = true;
        const bonus = Math.round((score / total) * 20);
        if (bonus > 0) awardXP(base44, bonus);
      }
      setView("result");
    } else {
      setCurrent(nextIdx);
      setSelected(null);
      setAnswered(false);
      setAiText(null);
      saveProgress(topic.id, nextIdx, total, false);
    }
  };

  const handleRestart = () => {
    setCurrent(0); setSelected(null); setAnswered(false); setScore(0); setView("exercise");
    xpAwarded.current = false;
    saveProgress(topic.id, 0, total, false);
  };

  // ── LESSON VIEW ──────────────────────────────────────────────────────────
  if (view === "lesson") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-6">
        {/* Back */}
        <button onClick={() => navigate("/grammar")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Grammar
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>{category.emoji} {category.label}</span>
          </div>
          <h1 className="text-2xl font-bold">{topic.title}</h1>
          <p className="text-sm italic text-muted-foreground mt-0.5">{topic.titleSv}</p>
          <p className="text-sm text-muted-foreground mt-2">{topic.description}</p>
        </div>

        {/* Rule card */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">The Rule</h2>
          </div>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
            {topic.rule}
          </div>
        </div>

        {/* Quick examples from exercises */}
        <div className="rounded-2xl border border-border/50 bg-muted/30 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Quick examples from the exercises</p>
          <div className="space-y-2">
            {exercises.slice(0, 3).map((e, i) => (
              <div key={i} className="text-sm">
                <span className="text-muted-foreground">{e.q.replace("\n", " ")} → </span>
                <span className="font-semibold text-foreground">{e.options[e.correct]}</span>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={() => setView("exercise")} size="lg" className="w-full gap-2">
          <ChevronRight className="w-5 h-5" /> Start {total} exercises
        </Button>
      </div>
    );
  }

  // ── RESULT VIEW ──────────────────────────────────────────────────────────
  if (view === "result") {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-4">
          <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto">
            <Trophy className="w-10 h-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold">{pct >= 80 ? "Excellent! 🎉" : pct >= 50 ? "Good work! 👍" : "Keep practising! 💪"}</h2>
          <p className="text-5xl font-bold text-primary">{pct}%</p>
          <p className="text-muted-foreground">{score} of {total} correct</p>
          <div className="flex flex-col gap-2 max-w-xs mx-auto pt-2">
            <Button onClick={handleRestart} className="gap-2"><RotateCcw className="w-4 h-4" /> Try again</Button>
            <Button onClick={() => { setView("lesson"); }} variant="outline" className="gap-2"><BookOpen className="w-4 h-4" /> Review rule</Button>
            <Button onClick={() => navigate("/grammar")} variant="ghost">← All topics</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── EXERCISE VIEW ────────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-6">
      {/* Back */}
      <button onClick={() => setView("lesson")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> {topic.title}
      </button>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{current + 1} / {total}</span>
          <span className="font-semibold">{score} correct</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className={`h-full ${c.bar} rounded-full transition-all duration-500`} style={{ width: `${((current) / total) * 100}%` }} />
        </div>
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="rounded-2xl border border-border/50 bg-card p-6 space-y-5"
        >
          {/* Question */}
          <p className="text-lg font-semibold whitespace-pre-line leading-snug">{ex.q}</p>

          {/* Options */}
          <div className="space-y-3">
            {ex.options.map((opt, idx) => {
              const isCorrect = idx === ex.correct;
              const isSelected = idx === selected;
              const isWrong = answered && isSelected && !isCorrect;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={answered}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-left font-medium transition-all ${
                    answered
                      ? isCorrect
                        ? "border-green-400 bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-100"
                        : isSelected
                        ? "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100"
                        : "border-border opacity-50"
                      : "border-border hover:border-primary hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span>{opt}</span>
                    {answered && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />}
                    {isWrong && <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Static explanation (always shown on answer) */}
          {answered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-xl border bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 p-4 text-sm text-blue-900 dark:text-blue-100"
            >
              <p className="font-semibold text-blue-700 dark:text-blue-300 text-xs uppercase tracking-wide mb-1">Explanation</p>
              {ex.explanation}
            </motion.div>
          )}

          {/* AI explanation on wrong answer */}
          {answered && selected !== ex.correct && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`rounded-xl border p-4 text-sm ${c.ai}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI Explanation</span>
              </div>
              {aiLoading
                ? <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Analysing your answer…</div>
                : <p className="leading-relaxed">{aiText || "Understanding the rule: " + ex.explanation}</p>
              }
            </motion.div>
          )}

          {answered && (
            <Button onClick={handleNext} className="w-full">
              {current + 1 >= total ? "See Results" : "Next →"}
            </Button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
