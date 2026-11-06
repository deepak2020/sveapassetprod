import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { normalizeText } from "@/lib/writingMissions";

// Quick warm-up built from the student's own past errors: type the correct version.
export default function WarmUp({ pairs = [] }) {
  const items = pairs.slice(0, 2);
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});

  if (!items.length) return null;

  const judge = (index, correct) => {
    setChecked((prev) => ({ ...prev, [index]: normalizeText(answers[index]) === normalizeText(correct) }));
  };

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 space-y-3 dark:border-amber-900 dark:bg-amber-950/20">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-600" />
        <p className="text-sm font-semibold">Värm upp</p>
        <span className="text-[11px] italic text-muted-foreground">warm-up from your own mistakes</span>
      </div>
      {items.map((pair, index) => (
        <div key={`${pair.wrong_text}-${index}`} className="space-y-1.5">
          <p className="text-xs text-muted-foreground">
            Du skrev: <span className="line-through">{pair.wrong_text}</span>
          </p>
          <div className="flex gap-2">
            <Input
              value={answers[index] || ""}
              onChange={(e) => {
                setAnswers((prev) => ({ ...prev, [index]: e.target.value }));
                setChecked((prev) => ({ ...prev, [index]: undefined }));
              }}
              placeholder="Skriv rätt version…"
              className="h-9 text-sm"
            />
            <Button size="sm" variant="outline" onClick={() => judge(index, pair.correct_text)}>
              Kolla
            </Button>
          </div>
          {checked[index] === true && (
            <p className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400">
              <Check className="w-3.5 h-3.5" /> Rätt! {pair.correct_text}
            </p>
          )}
          {checked[index] === false && (
            <p className="text-xs text-amber-800 dark:text-amber-200">Rätt svar: {pair.correct_text}</p>
          )}
        </div>
      ))}
    </div>
  );
}