import { Check } from "lucide-react";
import { typeMeta } from "@/lib/writingPractice";

// The task itself: Swedish instructions plus the points as a tickable checklist.
export default function PromptBrief({ prompt, points, checked, onToggle }) {
  const meta = typeMeta(prompt.type);

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold leading-tight">{prompt.title}</h1>
        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border shrink-0 ${meta.tone}`}>
          {meta.label}
        </span>
      </div>

      <p className="text-sm text-foreground">{prompt.instructions}</p>

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Ta med det här · <span className="italic normal-case">Include these points</span>
        </p>
        <ul className="space-y-1.5">
          {points.map((point) => {
            const on = checked.includes(point);
            return (
              <li key={point}>
                <button
                  type="button"
                  onClick={() => onToggle(point)}
                  className="flex w-full items-start gap-2.5 text-left"
                >
                  <span
                    className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      on ? "bg-emerald-500 border-emerald-500 text-white" : "border-border"
                    }`}
                  >
                    {on && <Check className="w-3 h-3" strokeWidth={3} />}
                  </span>
                  <span className={`text-sm leading-snug ${on ? "text-muted-foreground line-through" : ""}`}>
                    {point}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}