import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, Circle, Trash2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function TodaysPlanCard({ plan, onDelete, getDayNumber, getProgress, getTodaysLessons }) {
  const todayLessonIds = getTodaysLessons();
  const dayNumber = getDayNumber();
  const progress = getProgress();
  const completed = plan.completed_lesson_ids || [];

  const allCourses = [plan.course, ...(plan.include_courses || [])];

  const { data: todayLessons = [] } = useQuery({
    queryKey: ["planner-today-lessons", todayLessonIds],
    queryFn: async () => {
      if (!todayLessonIds.length) return [];
      let all = [];
      for (const c of allCourses) {
        const lessons = await base44.entities.Lesson.filter({ sfi_course: c }, "order", 500);
        all = [...all, ...lessons];
      }
      return all.filter(l => todayLessonIds.includes(l.id));
    },
    enabled: todayLessonIds.length > 0,
  });

  // A lesson to anchor speaking/writing practice on (first of today's).
  const practiceId = todayLessons[0]?.id || todayLessonIds[0];

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

        {/* Today's lessons */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Today's lessons</p>
          {todayLessonIds.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">No lessons scheduled for today 🎉</p>
          ) : todayLessons.length === 0 ? (
            <div className="space-y-2">
              {todayLessonIds.map(id => (
                <div key={id} className="h-10 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {todayLessons.map(lesson => {
                const isDone = completed.includes(lesson.id);
                return (
                  <Link
                    key={lesson.id}
                    to={`/language/${lesson.id}`}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${isDone ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-background border-border hover:border-primary/50"}`}
                  >
                    {isDone
                      ? <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
                      : <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isDone ? "line-through text-muted-foreground" : ""}`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{lesson.skill || lesson.category} · Kurs {lesson.sfi_course}</p>
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
