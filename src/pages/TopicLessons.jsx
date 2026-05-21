import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function getLessonProgress(lessonId) {
  try {
    const raw = localStorage.getItem(`svenska:lesson_progress:${lessonId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getAvailableKeys(lesson) {
  const hasTranslate = (lesson.word_pairs || []).some((wp) => wp.example_en && wp.example_sv);
  return [
    lesson.word_pairs?.length && "learn",
    lesson.fill_in_blanks?.length && "practice",
    lesson.match_pairs?.length && "match",
    lesson.writing_prompts?.length && "writing",
    lesson.speaking_phrases?.length && "speaking",
    lesson.listening_phrases?.length && "listening",
    hasTranslate && "translate",
    lesson.review_questions?.length && "review",
    lesson.quiz_questions?.length && "quiz",
  ].filter(Boolean);
}

const SKILL_META = {
  vocabulary:    { label: "Vocabulary",    labelSv: "Ordförråd",   emoji: "📝" },
  grammar:       { label: "Grammar",       labelSv: "Grammatik",   emoji: "🔤" },
  reading:       { label: "Reading",       labelSv: "Läsning",     emoji: "📖" },
  writing:       { label: "Writing",       labelSv: "Skrivning",   emoji: "✍️" },
  speaking:      { label: "Speaking",      labelSv: "Tal",         emoji: "🗣️" },
  listening:     { label: "Listening",     labelSv: "Lyssning",    emoji: "👂" },
  phrases:       { label: "Phrases",       labelSv: "Fraser",      emoji: "💬" },
  pronunciation: { label: "Pronunciation", labelSv: "Uttal",       emoji: "🔊" },
};

export default function TopicLessons() {
  const { course, topic: encodedTopic } = useParams();
  const topic = decodeURIComponent(encodedTopic || "");

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["topic-lessons", course, topic],
    queryFn: () =>
      base44.entities.Lesson.filter({ sfi_course: course, topic }, "order", 200),
    enabled: !!course && !!topic,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="space-y-3">
          {[1, 2, 3].map((n) => <Skeleton key={n} className="h-20 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!lessons.length) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-muted-foreground">No lessons found for this topic.</p>
        <Link to="/language">
          <Button variant="outline" className="mt-4 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to topics
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/language" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to topics
      </Link>

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">SFI {course} · Topic</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground">{topic}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {lessons.length} lektioner · <span className="italic">{lessons.length} lessons</span>
        </p>
      </div>

      <ol className="space-y-3">
        {lessons.map((lesson, idx) => {
          const available = getAvailableKeys(lesson);
          const completed = getLessonProgress(lesson.id);
          const doneCount = available.filter((k) => completed.includes(k)).length;
          const pct = available.length ? Math.round((doneCount / available.length) * 100) : 0;
          const isDone = available.length > 0 && doneCount === available.length;
          const skill = lesson.skill || lesson.category;
          const meta = SKILL_META[skill] || { label: lesson.title, labelSv: lesson.title_sv, emoji: "📄" };

          return (
            <li key={lesson.id}>
              <Link
                to={`/language/${lesson.id}`}
                className={`group flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-md hover:border-primary/40 transition-all ${
                  isDone
                    ? "border-green-300/60 dark:border-green-700/40 bg-green-50/30 dark:bg-green-950/20"
                    : "border-border/50"
                }`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 text-xl ${
                  isDone ? "bg-green-100 dark:bg-green-900/40" : "bg-muted"
                }`}>
                  {isDone ? <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" /> : meta.emoji}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-base">{meta.labelSv}</p>
                  <p className="text-xs text-muted-foreground italic mb-1.5">{meta.label}</p>
                  {available.length > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${isDone ? "bg-green-500" : "bg-primary"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {isDone ? "Klar!" : `${doneCount}/${available.length}`}
                      </span>
                    </div>
                  )}
                </div>

                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}