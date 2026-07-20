import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// Horizontal 5-stage progress bar for a speaking mission.
// Stages: briefing → ord → fraser → repetera → live
const STAGES = [
  { id: "briefing", label: "Briefing", short: "Brief" },
  { id: "ord", label: "Ord", short: "Ord" },
  { id: "fraser", label: "Fraser", short: "Fraser" },
  { id: "repetera", label: "Repetera", short: "Öva" },
  { id: "live", label: "Live", short: "Live" },
];

export default function MissionProgressBar({ currentStage, completedStages = [], onJump }) {
  return (
    <div className="flex items-center gap-1 sm:gap-2 w-full">
      {STAGES.map((stage, i) => {
        const isDone = completedStages.includes(stage.id);
        const isCurrent = stage.id === currentStage;
        const isLast = i === STAGES.length - 1;
        return (
          <div key={stage.id} className="flex items-center flex-1">
            <button
              type="button"
              onClick={() => onJump?.(stage.id)}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-colors min-w-0 flex-1 justify-center",
                isCurrent && "bg-primary text-primary-foreground",
                !isCurrent && isDone && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
                !isCurrent && !isDone && "bg-muted text-muted-foreground hover:bg-muted/70"
              )}
            >
              <span
                className={cn(
                  "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 text-[9px] font-bold",
                  isCurrent && "border-primary-foreground bg-primary-foreground/20",
                  !isCurrent && isDone && "border-emerald-600 bg-emerald-600 text-white",
                  !isCurrent && !isDone && "border-muted-foreground/40"
                )}
              >
                {isDone ? <Check className="w-2.5 h-2.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline truncate">{stage.label}</span>
              <span className="sm:hidden truncate">{stage.short}</span>
            </button>
            {!isLast && (
              <div className={cn("h-0.5 w-2 sm:w-3 shrink-0", isDone ? "bg-emerald-400" : "bg-muted")} />
            )}
          </div>
        );
      })}
    </div>
  );
}