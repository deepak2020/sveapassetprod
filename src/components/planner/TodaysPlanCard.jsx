import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, Circle, Trash2, ArrowRight, History, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDailyReview } from "@/hooks/useDailyReview";
import { skillMastery, weakestSkills, selectDailyLessons } from "@/lib/planner";

export default function TodaysPlanCard({ plan, onDelete, getDayNumber, getProgress, getBehindCount, getDailyTarget, results = [] }) {
  const dayNumber = getDayNumber();
  const progress = getProgress();
  const behind = getBehindCount ? getBehindCount() : 0;
  const dailyTarget = getDailyTarget ? getDailyTarget() : 3;
  const completed = plan.completed_lesson_ids || [];

  const allCourses = [plan.course, ...(plan.include_courses || [])];

  // Pull the whole catalog for the plan's courses, then SELECT today's lessons
  // intelligently (weakest skill / foundation first) instead of a fixed schedule.
  const { data: catalog = [], isLoading } = useQuery({
    queryKey: ["planner-catalog", allCourses.join(",")],
    queryFn: async () => {
      let all = [];
      for (const c of allCourses) {
        const lessons = await base44.entities.Lesson.filter({ sfi_course: c }, "order", 500);
        all = [...all, ...lessons];
      }
      return all;
    },
  });

  // ── Adaptive layer ─────────────────────────────────────────────────────
  const { totalDue, isDone } = useDailyReview();
  const mastery = skillMastery((results || []).filter(r => r.skill && typeof r.percentage === "number"));
  const weak = weakestSkills(mastery, 2);
  const weakestKey = weak[0]?.key;

  const orderedLessons = selectDailyLessons({
    lessons: catalog,
    completedIds: completed,
    focusSkills: plan.focus_skills || [],
    mastery,
    perDay: dailyTarget,
  });

  const practiceId = orderedLessons[0]?.id;

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-5 space-y-4">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-sm">Study Plan · Kurs {plan.course}</p>
              <p className="text-xs text-muted-foreground">Day {dayNumber} of {plan.target_days}</p>
            </div>
          </div>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Delete plan"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Overall progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Catch-up notice — unfinished lessons carry forward, never lost */}
        {behind > 0 && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2">
            <History className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              {behind} {behind === 1 ? "lektion" : "lektioner"} efter din takt · <span className="italic">{behind} lesson{behind === 1 ? "" : "s"} behind pace — do a few extra when you can.</span>
            </p>
          </div>
        )}

        {/* Warm-up first — spaced-repetition review before new material */}
        {totalDue > 0 && !isDone && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-3 py-2">
            <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300">
              <span className="font-semibold">Warm up first</span> · {Math.min(totalDue, 10)} word{totalDue === 1 ? "" : "s"} due — do your Daily Warm-up below before new lessons.
            </p>
          </div>
        )}

        {/* Today's lessons — ordered by your weakest skill */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {behind > 0 ? "Today's lessons · picked for you (incl. catch-up)" : "Today's lessons · picked for you"}
          </p>
          {isLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map(i => <div key={i} className="h-10 bg-muted animate-pulse rounded-lg" />)}
            </div>
          ) : orderedLessons.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">You've finished everything in your plan 🎉</p>
          ) : (
            <div className="space-y-2">
              {orderedLessons.map(lesson => {
                const isDone = completed.includes(lesson.id);
                const lessonSkill = lesson.skill || lesson.category;
                const isWeak = weakestKey && lessonSkill === weakestKey && !isDone;
                return (
                  <Link
                    key={lesson.id}
                    to={`/language/${lesson.id}`}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${isDone ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : isWeak ? "bg-background border-amber-300/70 dark:border-amber-700/60 hover:border-amber-400" : "bg-background border-border hover:border-primary/50"}`}
                  >
                    {isDone
                      ? <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                      : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isDone ? "line-through text-muted-foreground" : ""}`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lessonSkill} · Kurs {lesson.sfi_course}
                        {isWeak && <span className="ml-1.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">· weakest skill</span>}
                      </p>
                    </div>
                    {!isDone && <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Daily practice — the skills the lesson schedule doesn't cover */}
        {practiceId && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Daglig övning · Daily practice</p>
            <div className="grid grid-cols-3 gap-2">
              <Link to={`/language/${practiceId}?tab=speaking`} className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-border bg-background hover:border-primary/50 transition-all text-center">
                <span className="text-lg">🗣️</span><span className="text-xs font-medium">Tala</span>
              </Link>
              <Link to={`/language/${practiceId}?tab=writing`} className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-border bg-background hover:border-primary/50 transition-all text-center">
                <span className="text-lg">✍️</span><span className="text-xs font-medium">Skriva</span>
              </Link>
              <Link to={`/listening/${(plan.course || "C").toLowerCase()}`} className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-border bg-background hover:border-primary/50 transition-all text-center">
                <span className="text-lg">🎧</span><span className="text-xs font-medium">Lyssna</span>
              </Link>
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
