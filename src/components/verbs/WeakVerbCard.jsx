import { ArrowRight, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const SHOWN = 6;

// The verbs this learner keeps getting wrong, with a drill for exactly those.
export default function WeakVerbCard({ items, onPractice }) {
  if (!items.length) return null;
  const shown = items.slice(0, SHOWN);

  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
          <Target className="w-5 h-5 text-destructive" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">Verb du behöver träna mer</p>
          <p className="text-xs text-muted-foreground">
            Verbs you keep getting wrong <span className="italic">· {items.length} verb</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {shown.map(({ verb, wrong }) => (
          <div key={verb.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-card px-3 py-2">
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{verb.infinitive}</p>
              <p className="text-xs italic text-muted-foreground truncate">{verb.english}</p>
            </div>
            <span className="text-xs font-semibold text-destructive whitespace-nowrap shrink-0">
              {wrong} fel <span className="font-normal italic text-muted-foreground">· wrong</span>
            </span>
          </div>
        ))}
      </div>

      {items.length > shown.length && (
        <p className="text-xs text-muted-foreground mt-2">+{items.length - shown.length} verb till</p>
      )}

      <Button className="w-full gap-2 mt-3" onClick={onPractice}>
        Öva på dessa verb <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}