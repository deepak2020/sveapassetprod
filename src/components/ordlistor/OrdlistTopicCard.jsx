import { Play, RotateCcw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrdlistTopicCard({ level, total, done, mode = "quiz", onStart, onReset }) {
  // Quiz and typing both run through the word list in order, so both resume
  const showProgress = mode === "quiz" || mode === "type";
  const complete = total > 0 && done >= total;
  const started = done > 0 && !complete;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-border/50 bg-card p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {showProgress && complete
            ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            : <span className="text-xs font-semibold text-muted-foreground shrink-0">Nivå {level}</span>}
          <span className="text-xs text-muted-foreground">
            {showProgress ? `${done}/${total} ord` : `${total} ord`}
          </span>
        </div>
        {showProgress && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
            complete
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
              : started
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}>
            {complete ? "Klar" : started ? "Pågår" : "Ny"}
          </span>
        )}
      </div>

      {showProgress && (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${complete ? "bg-emerald-500" : "bg-primary"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button size="sm" onClick={onStart} className="gap-1.5 flex-1">
          {showProgress && complete
            ? <><RotateCcw className="w-3.5 h-3.5" /> Börja om</>
            : <><Play className="w-3.5 h-3.5" /> {showProgress && started ? "Fortsätt" : "Börja"}</>}
        </Button>
        {showProgress && done > 0 && (
          <Button size="sm" variant="ghost" onClick={onReset} title="Nollställ nivån">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}