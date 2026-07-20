import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Lock, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useMissionProgress } from "@/hooks/useMissionProgress";

// Browsable catalog of every mission topic (grouped by CEFR level).
// Users can see what's coming even if it's locked — clicking a locked one
// simply doesn't navigate (badge shows why).
const LEVELS = ["A1", "A2", "B1", "B2", "C1"];

const LEVEL_STYLE = {
  A1: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
  A2: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  B1: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  B2: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  C1: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900",
};

export default function TopicsCatalog() {
  const { items, isLoading } = useMissionProgress();
  const [openLevels, setOpenLevels] = useState(() => new Set(["A1"]));

  const toggle = (lvl) => {
    setOpenLevels((prev) => {
      const next = new Set(prev);
      if (next.has(lvl)) next.delete(lvl);
      else next.add(lvl);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((n) => <Skeleton key={n} className="h-12 rounded-lg" />)}
      </div>
    );
  }

  if (items.length === 0) return null;

  // Group by level, keep linear order within.
  const byLevel = {};
  for (const item of items) {
    const lvl = item.mission.level || "A2";
    if (!byLevel[lvl]) byLevel[lvl] = [];
    byLevel[lvl].push(item);
  }

  return (
    <div className="space-y-2">
      {LEVELS.filter((l) => byLevel[l]?.length > 0).map((lvl) => {
        const group = byLevel[lvl];
        const open = openLevels.has(lvl);
        const doneCount = group.filter((i) => i.completed).length;
        return (
          <div key={lvl} className="border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggle(lvl)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors"
            >
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", LEVEL_STYLE[lvl])}>
                {lvl}
              </span>
              <span className="text-sm font-medium flex-1 text-left">
                {group.length} ämnen
                <span className="text-muted-foreground italic font-normal ml-1.5">· topics</span>
              </span>
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {doneCount} / {group.length}
              </span>
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", open && "rotate-180")} />
            </button>

            {open && (
              <div className="grid sm:grid-cols-2 gap-1.5 p-2 border-t border-border bg-muted/20">
                {group.map((item) => (
                  <TopicCard key={item.mission.id} item={item} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TopicCard({ item }) {
  const { mission, completed, unlocked } = item;

  const inner = (
    <div
      className={cn(
        "flex items-center gap-2.5 p-2.5 rounded-md border transition-colors",
        completed
          ? "border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/20"
          : unlocked
            ? "border-border bg-background hover:border-primary/40 hover:bg-muted/60"
            : "border-border/60 bg-muted/40 opacity-70"
      )}
    >
      <span className="text-lg shrink-0">{mission.emoji || "🎯"}</span>
      <div className="min-w-0 flex-1">
        <p className={cn("text-xs font-semibold leading-tight truncate", !unlocked && "text-muted-foreground")}>
          {mission.title_sv}
        </p>
        <p className="text-[10px] text-muted-foreground italic truncate">{mission.title_en}</p>
      </div>
      <div className="shrink-0">
        {completed ? (
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={3} />
        ) : !unlocked ? (
          <Lock className="w-3 h-3 text-muted-foreground" />
        ) : null}
      </div>
    </div>
  );

  if (!unlocked) return <div aria-label="Locked">{inner}</div>;
  return (
    <Link to={`/tala/mission/${mission.id}`} className="block">
      {inner}
    </Link>
  );
}