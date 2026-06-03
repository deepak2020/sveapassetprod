import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, BookOpen, PlayCircle, RotateCcw } from "lucide-react";

// Mirror of the activity-availability logic in TopicLesson, on merged lessons.
function getAvailableKeys(lessons) {
  const has = (key) => lessons.some((l) => (l[key]?.length || 0) > 0);
  const hasTranslate = lessons.some((l) =>
    (l.word_pairs || []).some((wp) => wp.example_en && wp.example_sv)
  );
  return [
    has("word_pairs") && "learn",
    has("fill_in_blanks") && "practice",
    has("match_pairs") && "match",
    has("writing_prompts") && "writing",
    has("speaking_phrases") && "speaking",
    has("listening_phrases") && "listening",
    hasTranslate && "translate",
    has("review_questions") && "review",
    has("quiz_questions") && "quiz",
  ].filter(Boolean);
}

function readCompletedForLessons(lessons) {
  const union = new Set();
  for (const lesson of lessons) {
    try {
      const raw = localStorage.getItem(`svenska:lesson_progress:${lesson.id}`);
      const keys = raw ? JSON.parse(raw) : [];
      keys.forEach((k) => union.add(k));
    } catch {
      // ignore
    }
  }
  return [...union];
}

export default function TopicCard({ topic, lessons, course, index }) {
  const lessonIds = lessons.map((l) => l.id).join(",");
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    setCompleted(readCompletedForLessons(lessons));
    // Re-read when user returns to the page (e.g. after finishing activities)
    const onFocus = () => setCompleted(readCompletedForLessons(lessons));
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [lessonIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const availableKeys = getAvailableKeys(lessons);
  const doneCount = availableKeys.filter((k) => completed.includes(k)).length;
  const total = availableKeys.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const allDone = total > 0 && doneCount === total;
  const topicSv = lessons[0]?.title_sv?.split(" - ")[0] || topic;

  const totals = lessons.reduce(
    (acc, l) => {
      acc.cards += l.word_pairs?.length || 0;
      acc.blanks += l.fill_in_blanks?.length || 0;
      acc.quiz += l.quiz_questions?.length || 0;
      acc.listening += l.listening_phrases?.length || 0;
      return acc;
    },
    { cards: 0, blanks: 0, quiz: 0, listening: 0 }
  );

  const isNew = doneCount === 0;
  const isInProgress = doneCount > 0 && !allDone;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
    >
      <Link to={`/language/topic/${course}/${encodeURIComponent(topic)}`} className="group block h-full">
        <div className={`h-full rounded-2xl border bg-card p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col gap-3 ${
          allDone
            ? "border-green-300 ring-2 ring-green-200/60 dark:ring-green-900/40"
            : isInProgress
            ? "border-amber-200 dark:border-amber-800/50"
            : "border-border/50"
        }`}>
          {/* Header */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {allDone ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : (
                <BookOpen className={`w-5 h-5 flex-shrink-0 ${isInProgress ? "text-amber-500" : "text-primary"}`} />
              )}
              <div className="min-w-0">
                <h3 className="font-bold text-base truncate">{topic}</h3>
                {topicSv !== topic && (
                  <p className="text-xs italic text-muted-foreground truncate">{topicSv}</p>
                )}
              </div>
            </div>
            {/* Status badge */}
            {allDone ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                ✓ Klar
              </span>
            ) : isInProgress ? (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                {doneCount}/{total}
              </span>
            ) : (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap bg-muted text-muted-foreground">
                {total} aktiviteter
              </span>
            )}
          </div>

          {/* Progress bar */}
          {total > 0 && (
            <div className="space-y-1">
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    allDone ? "bg-green-500" : isInProgress ? "bg-amber-500" : "bg-primary/30"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}

          {/* Content chips */}
          <div className="flex flex-wrap gap-1.5 text-[11px] font-medium">
            {totals.cards > 0 && <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">🃏 {totals.cards}</span>}
            {totals.blanks > 0 && <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">🧩 {totals.blanks}</span>}
            {totals.listening > 0 && <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800">👂 {totals.listening}</span>}
            {totals.quiz > 0 && <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800">🎯 {totals.quiz}</span>}
          </div>

          {/* Footer CTA */}
          <div className="mt-auto flex items-center justify-between pt-2 border-t border-border/40">
            <span className="text-xs text-muted-foreground">{lessons.length} lektioner</span>
            {allDone ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                <RotateCcw className="w-3.5 h-3.5" /> Repetera
              </span>
            ) : isInProgress ? (
              <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 group-hover:text-amber-700 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Fortsätt · <span className="italic font-normal">Continue</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                <PlayCircle className="w-3.5 h-3.5" /> Börja · <span className="italic font-normal">Start</span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}