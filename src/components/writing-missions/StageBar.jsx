import { STAGES } from "@/lib/writingMissions";

// The 1-7 stage bar. Finished stages can be tapped to review them.
export default function StageBar({ stage, completed = [], onSelect }) {
  const current = STAGES.find((s) => s.id === stage) || STAGES[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        {STAGES.map((s) => {
          const done = completed.includes(s.id);
          const active = stage === s.id;
          const clickable = done || s.id < stage;
          return (
            <button
              key={s.id}
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onSelect(s.id)}
              aria-label={`Steg ${s.id}: ${s.label}`}
              aria-current={active ? "step" : undefined}
              className="flex-1 py-1.5"
            >
              <span
                className={`block h-2 rounded-full transition-colors ${
                  active ? "bg-primary" : done ? "bg-emerald-500" : "bg-muted"
                } ${clickable && !active ? "cursor-pointer" : ""}`}
              />
            </button>
          );
        })}
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-sm font-semibold truncate">
          {stage}. {current.label}{" "}
          <span className="text-xs font-normal italic text-muted-foreground">{current.en}</span>
        </p>
        <p className="text-[11px] text-muted-foreground shrink-0">
          Steg {stage} av {STAGES.length}
        </p>
      </div>
    </div>
  );
}