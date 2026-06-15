import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { supabase } from "@/api/supabaseClient";
import { Link } from "react-router-dom";
import { CalendarDays, CheckCircle2, Circle, Trash2, ArrowRight, History, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDailyReview } from "@/hooks/useDailyReview";
import { skillMastery, weakestSkills, selectDailyLessons, applyPrerequisites } from "@/lib/planner";

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

  // Today's plan is a FIXED set, chosen once per day and remembered — so it
  // doesn't refill endlessly as you finish lessons. Seeded from the intelligent
  // selection; completed lessons stay in the list (checked off).
  const todayStr = new Date().toISOString().slice(0, 10);
  const planKey = `svenska:dayplan:${plan.id || "p"}:${todayStr}`;

  // Prefer the server-stored set (cross-device) when the today_plan column
  // exists and is for today; otherwise fall back to this device's localStorage.
  const hasServerCol = plan && Object.prototype.hasOwnProperty.call(plan, "today_plan");
  const serverToday = hasServerCol && plan.today_plan?.date === todayStr ? plan.today_plan.lesson_ids : null;

  const [todayIds, setTodayIds] = useState(() => {
    if (Array.isArray(serverToday) && serverToday.length) return serverToday;
    try { const s = JSON.parse(localStorage.getItem(planKey) || "null"); return Array.isArray(s) ? s : null; } catch { return null; }
  });

  // Fresh selection used only to seed today's set the first time.
  const seedSelection = applyPrerequisites(
    selectDailyLessons({ lessons: catalog, completedIds: completed, focusSkills: plan.focus_skills || [], mastery, perDay: dailyTarget }),
    catalog, completed, dailyTarget
  );

  useEffect(() => {
    if (todayIds || isLoading || catalog.length === 0 || seedSelection.length === 0) return;
    const ids = seedSelection.map((l) => l.id);
    setTodayIds(ids);
    try { localStorage.setItem(planKey, JSON.stringify(ids)); } catch { /* ignore */ }
    // Persist to the plan row for cross-device consistency (no-op if the
    // today_plan column hasn't been added yet).
    if (hasServerCol && plan.id) {
      supabase.from("study_plans").update(plan.id, { today_plan: { date: todayStr, lesson_ids: ids } });
    }
  }, [todayIds, isLoading, catalog, seedSelection, planKey, hasServerCol, plan.id, todayStr]);

  // Resolve the fixed set into lessons (preserving completed ones, shown done).
  const byId = new Map(catalog.map((l) => [l.id, l]));
  const planned = (todayIds || seedSelection.map((l) => l.id)).map((id) => byId.get(id)).filter(Boolean);
  const doneToday = planned.filter((l) => completed.includes(l.id)).length;
  const allDoneToday = planned.length > 0 && doneToday === planned.length;

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

        {/* Today's lessons — a fixed set, picked by your weakest skill */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {behind > 0 ? "Today's lessons · incl. catch-up" : "Today's lessons · picked for you"}
            </p>
            {!isLoading && planned.length > 0 && (
              <span className="text-xs font-semibold text-muted-foreground">{doneToday}/{planned.length} klart idag</span>
            )}
          </div>
          {allDoneToday && (
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-300 font-medium">
              🎉 Klart för idag! · Done for today — kom tillbaka imorgon för nästa pass.
            </div>
          )}
          {isLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map(i => <div key={i} className="h-10 bg-muted animate-pulse rounded-lg" />)}
            </div>
          ) : planned.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">You've finished everything in your plan 🎉</p>
          ) : (
            <div className="space-y-2">
              {planned.map(lesson => {
                const isDone = completed.includes(lesson.id);
                const lessonSkill = lesson.skill || lesson.category;
                const isWeak = weakestKey && lessonSkill === weakestKey && !isDone && !lesson.prereqFor;
                const isPrereq = !!lesson.prereqFor && !isDone;
                return (
                  <Link
                    key={lesson.id}
                    to={`/language/${lesson.id}`}
                    state={{ from: "/dashboard" }}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${isDone ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : isPrereq ? "bg-background border-blue-300/70 dark:border-blue-700/60 hover:border-blue-400" : isWeak ? "bg-background border-amber-300/70 dark:border-amber-700/60 hover:border-amber-400" : "bg-background border-border hover:border-primary/50"}`}
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
                        {isPrereq && <span className="ml-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">🔗 foundation first</span>}
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

      </CardContent>
    </Card>
  );
}
