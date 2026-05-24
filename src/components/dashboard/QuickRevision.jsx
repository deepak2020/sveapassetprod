import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ChevronRight, RotateCcw, Volume2, Loader2, BookOpen, CheckCircle2 } from "lucide-react";
import { playAudio } from "@/lib/speech";
import { Link } from "react-router-dom";

const QUIZ_SIZE = 7;
const TAB_LABELS = { learn: "Vocab", practice: "Practice", quiz: "Quiz", translate: "Translate", listen: "Listen", match: "Match", writing: "Writing", speaking: "Speaking" };

function buildOptions(pairs, correctPair) {
  const others = pairs.filter((p) => p.swedish !== correctPair.swedish);
  const distractors = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
  return [...distractors, correctPair].sort(() => Math.random() - 0.5).map((p) => p.swedish);
}

function QuizMode({ lesson, onClose }) {
  const pairs = (lesson.word_pairs || []).filter((p) => p.english && p.swedish);

  const [questions] = useState(() => {
    if (pairs.length < 2) return [];
    const shuffled = [...pairs].sort(() => Math.random() - 0.5).slice(0, Math.min(QUIZ_SIZE, pairs.length));
    return shuffled.map((pair) => ({ pair, options: buildOptions(pairs, pair) }));
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [pending, setPending] = useState(null);
  const [done, setDone] = useState(false);

  if (pairs.length < 2) {
    return (
      <div className="py-4 text-center space-y-3">
        <p className="text-sm text-muted-foreground">No vocabulary to revise in this lesson.</p>
        <Link to={`/language/${lesson.id}`}>
          <Button size="sm" variant="outline">Open lesson →</Button>
        </Link>
      </div>
    );
  }

  const q = questions[current];
  const isAnswered = answers[current] !== undefined;
  const activeChoice = isAnswered ? answers[current].choice : pending;
  const showResult = isAnswered || pending !== null;
  const score = answers.filter((a) => a?.correct).length;

  const handleAnswer = (choice) => {
    if (pending !== null || isAnswered) return;
    const correct = choice === q.pair.swedish;
    setPending(choice);
    setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[current] = { choice, correct };
      setAnswers(newAnswers);
      setPending(null);
      setTimeout(() => {
        if (current + 1 >= questions.length) setDone(true);
        else setCurrent((c) => c + 1);
      }, 900);
    }, 500);
  };

  const restart = () => {
    setCurrent(0);
    setAnswers([]);
    setPending(null);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="py-2 text-center space-y-3">
        <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center text-2xl ${pct >= 80 ? "bg-emerald-100" : pct >= 60 ? "bg-amber-100" : "bg-red-50"}`}>
          {pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "💪"}
        </div>
        <div>
          <p className="font-bold text-2xl">{pct}%</p>
          <p className="text-sm text-muted-foreground">{score} / {questions.length} correct</p>
        </div>
        <div className="flex gap-2 justify-center flex-wrap">
          <Button size="sm" variant="outline" onClick={onClose}>Done</Button>
          <Button size="sm" onClick={restart} className="gap-1.5">
            <RotateCcw className="w-3 h-3" /> Try again
          </Button>
          <Link to={`/language/${lesson.id}`}>
            <Button size="sm" variant="outline" className="gap-1.5">
              <BookOpen className="w-3 h-3" /> Full lesson
            </Button>
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {questions.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
            i < current ? (answers[i]?.correct ? "bg-emerald-500" : "bg-destructive/70") :
            i === current ? "bg-primary" : "bg-muted"
          }`} />
        ))}
        <span className="text-xs text-muted-foreground ml-2 shrink-0">{current + 1}/{questions.length}</span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.16 }}
          className="space-y-3"
        >
          <div className="bg-muted/40 rounded-xl px-4 py-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Translate to Swedish</p>
            <p className="font-semibold text-base">{q.pair.english}</p>
            {q.pair.example_en && (
              <p className="text-xs text-muted-foreground mt-1 italic">{q.pair.example_en}</p>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt) => {
              const isSelected = activeChoice === opt;
              const isCorrect = opt === q.pair.swedish;
              let cls = "text-left px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ";
              if (showResult && isCorrect)
                cls += "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300";
              else if (showResult && isSelected && !isCorrect)
                cls += "border-destructive bg-destructive/10 text-destructive";
              else if (!showResult)
                cls += "border-border/60 bg-card hover:border-primary/50 hover:bg-primary/5 cursor-pointer";
              else
                cls += "border-border/30 bg-muted/30 text-muted-foreground";
              return (
                <button key={opt} className={cls} onClick={() => handleAnswer(opt)} disabled={showResult}>
                  <span className="flex items-center justify-between gap-1">
                    <span>{opt}</span>
                    {showResult && isCorrect && (
                      <button
                        onClick={(e) => { e.stopPropagation(); playAudio(opt, "sv-SE", 1); }}
                        aria-label={`Hear ${opt}`}
                        className="text-emerald-600 hover:text-emerald-700 shrink-0"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function QuickRevision() {
  const { data: completedTabs = [], isLoading } = useQuery({
    queryKey: ["lesson-tab-results"],
    queryFn: () => base44.entities.QuizResult.filter({ quiz_type: "lesson_tab" }, "-created_date", 300),
    staleTime: 5 * 60 * 1000,
  });

  // Derive unique lessons in recency order, collecting which tabs are done
  const recentLessons = useMemo(() => {
    const map = new Map();
    for (const r of completedTabs) {
      if (!r.source_id || !r.source_title) continue;
      if (!map.has(r.source_id)) {
        map.set(r.source_id, { id: r.source_id, title: r.source_title, skills: new Set(), at: r.created_date });
      }
      if (r.skill) map.get(r.source_id).skills.add(r.skill);
    }
    return [...map.values()]
      .slice(0, 6)
      .map((l) => ({ ...l, skills: [...l.skills] }));
  }, [completedTabs]);

  const [activeId, setActiveId] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const startRevision = async (lessonId) => {
    if (activeId === lessonId) {
      setActiveId(null);
      setActiveLesson(null);
      return;
    }
    setLoadingId(lessonId);
    setActiveId(lessonId);
    setActiveLesson(null);
    try {
      const lesson = await base44.entities.Lesson.get(lessonId);
      setActiveLesson(lesson);
    } catch {
      setActiveId(null);
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) return null;
  if (recentLessons.length === 0) return null;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Snabb repetition
          <span className="text-xs font-normal text-muted-foreground/60 italic">· Quick Revision</span>
        </CardTitle>
        <p className="text-xs text-muted-foreground">Tap a lesson to practise its vocabulary in a quick quiz.</p>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {recentLessons.map((lesson) => {
          const isActive = activeId === lesson.id;
          const isThisLoading = loadingId === lesson.id;
          return (
            <div key={lesson.id} className="rounded-xl border border-border/50 overflow-hidden">
              {/* Lesson row */}
              <button
                onClick={() => startRevision(lesson.id)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors ${isActive ? "bg-primary/5 border-b border-border/40" : "hover:bg-muted/50"}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{lesson.title}</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {lesson.skills.map((s) => (
                      <span key={s} className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-medium">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {TAB_LABELS[s] ?? s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shrink-0 text-muted-foreground">
                  {isThisLoading
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? "rotate-90 text-primary" : ""}`} />
                  }
                </div>
              </button>

              {/* Inline quiz */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 py-4">
                      {activeLesson ? (
                        <QuizMode
                          key={activeLesson.id}
                          lesson={activeLesson}
                          onClose={() => { setActiveId(null); setActiveLesson(null); }}
                        />
                      ) : (
                        <div className="flex justify-center py-4">
                          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
