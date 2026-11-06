import { useState } from "react";
import { ChevronDown, Lightbulb } from "lucide-react";
import { TEMPLATES } from "@/lib/writingPractice";

// Collapsible template panel (hidden in test mode).
export default function TemplatePanel({ type, onInsert }) {
  const [open, setOpen] = useState(false);
  const lines = TEMPLATES[type] || TEMPLATES.informal_email;

  return (
    <div className="rounded-xl border border-border/60 bg-muted/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          Mallar och fraser
        </span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          <ul className="space-y-1 text-sm text-muted-foreground">
            {lines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
          <p className="text-[11px] italic text-muted-foreground/80">
            Templates and phrases to help you start — write the rest in your own words.
          </p>
          {onInsert && (
            <button
              type="button"
              onClick={() => onInsert(lines.join("\n"))}
              className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline"
            >
              Infoga mallen i texten
            </button>
          )}
        </div>
      )}
    </div>
  );
}