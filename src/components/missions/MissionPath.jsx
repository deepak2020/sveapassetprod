import { Link } from "react-router-dom";
import { Check, Lock, Play, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useMissionProgress } from "@/hooks/useMissionProgress";

const LEVEL_META = {
  A1: { name: "Överlevnad", tint: "from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/20", accent: "text-rose-700 dark:text-rose-400", ring: "border-rose-200 dark:border-rose-900" },
  A2: { name: "Vardagsservice", tint: "from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20", accent: "text-amber-700 dark:text-amber-400", ring: "border-amber-200 dark:border-amber-900" },
  B1: { name: "Familj & samhälle", tint: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20", accent: "text-emerald-700 dark:text-emerald-400", ring: "border-emerald-200 dark:border-emerald-900" },
  B2: { name: "Jobb & nyanser", tint: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20", accent: "text-blue-700 dark:text-blue-400", ring: "border-blue-200 dark:border-blue-900" },
  C1: { name: "Avancerat", tint: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20", accent: "text-purple-700 dark:text-purple-400", ring: "border-purple-200 dark:border-purple-900" },
};

// Duolingo-style linear unlock path.
// One mission unlocked at a time; complete it to unlock the next.
export default function MissionPath() {
  const { items, completedCount, totalCount, isLoading } = useMissionProgress();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((n) => <Skeleton key={n} className="h-20 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  // Group by level for headers, but keep the linear order.
  const groups = [];
  let currentLevel = null;
  for (const item of items) {
    const lvl = item.mission.level || "A2";
    if (lvl !== currentLevel) {
      groups.push({ level: lvl, items: [] });
      currentLevel = lvl;
    }
    groups[groups.length - 1].items.push(item);
  }

  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-4 h-4 text-primary" />
          <h2 className="font-display text-xl font-bold">
            Uppdrag · <span className="italic font-normal text-muted-foreground text-base">Missions</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <Progress value={progressPct} className="h-2 flex-1" />
          <span className="text-xs font-medium text-muted-foreground tabular-nums shrink-0">
            {completedCount} / {totalCount}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Klara ett uppdrag för att låsa upp nästa.{" "}
          <span className="italic">Complete one mission to unlock the next.</span>
        </p>
      </div>

      {groups.map((group) => {
        const meta = LEVEL_META[group.level] || LEVEL_META.A2;
        return (
          <div key={group.level} className="space-y-2">
            <div className="flex items-baseline gap-2 sticky top-0 bg-background/95 backdrop-blur py-1 z-10">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md bg-gradient-to-br ${meta.tint} border ${meta.ring} ${meta.accent}`}>
                {group.level}
              </span>
              <span className="text-xs font-medium text-muted-foreground">{meta.name}</span>
            </div>
            <div className="space-y-2">
              {group.items.map((item) => (
                <MissionNode key={item.mission.id} item={item} meta={meta} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MissionNode({ item, meta }) {
  const { mission, completed, unlocked, isCurrent } = item;

  const body = (
    <Card
      className={`transition-all border-2 ${
        completed
          ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20"
          : isCurrent
            ? `${meta.ring} bg-gradient-to-br ${meta.tint} shadow-md ring-2 ring-primary/30`
            : unlocked
              ? `${meta.ring} bg-gradient-to-br ${meta.tint} hover:shadow-md`
              : "border-border/60 bg-muted/30 opacity-60"
      }`}
    >
      <CardContent className="p-3.5 flex items-center gap-3">
        <div className="text-2xl shrink-0">{mission.emoji || "🎯"}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className={`font-semibold text-sm leading-tight truncate ${!unlocked ? "text-muted-foreground" : ""}`}>
              {mission.title_sv}
            </p>
            {isCurrent && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary text-primary-foreground shrink-0">
                Nu
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground italic truncate">{mission.title_en}</p>
          {unlocked && mission.goal && (
            <p className="text-[11px] text-foreground/70 mt-1 line-clamp-1">{mission.goal}</p>
          )}
        </div>
        <div className="shrink-0">
          {completed ? (
            <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </div>
          ) : isCurrent ? (
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <Play className="w-4 h-4 text-primary-foreground fill-current" />
            </div>
          ) : unlocked ? (
            <div className="w-9 h-9 rounded-full border-2 border-dashed border-muted-foreground/40 flex items-center justify-center">
              <Play className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (!unlocked) {
    return <div aria-label="Locked mission">{body}</div>;
  }
  return (
    <Link to={`/tala/mission/${mission.id}`} className="block">
      {body}
    </Link>
  );
}