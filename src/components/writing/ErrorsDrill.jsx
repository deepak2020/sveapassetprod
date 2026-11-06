import { useState } from "react";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const clean = (s) => String(s || "").trim().toLowerCase().replace(/[.,!?;:]+$/, "");

// Fill-in drill built from the student's own logged errors: they see what they
// wrote and type the correct version.
export default function ErrorsDrill({ rows, onClose }) {
  const items = rows.filter((r) => r.correct_text);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);

  const item = items[index];
  const done = index >= items.length;

  const check = () => {
    const ok = clean(value) === clean(item.correct_text);
    setResult(ok);
    if (ok) setScore((s) => s + 1);
  };

  const next = () => {
    setIndex((i) => i + 1);
    setValue("");
    setResult(null);
  };

  if (!items.length) {
    return <p className="text-sm text-muted-foreground">Inga fel att öva på här ännu.</p>;
  }

  if (done) {
    return (
      <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3 text-center">
        <p className="text-sm font-semibold">
          Klart! {score} av {items.length} rätt.
        </p>
        <Button variant="outline" size="sm" onClick={onClose}>
          Stäng
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20 p-4 space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Rätta meningen · {index + 1}/{items.length}
      </p>
      <p className="text-sm">
        Du skrev: <span className="line-through text-red-600 dark:text-red-400">{item.wrong_text}</span>
      </p>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Skriv rätt version…"
        disabled={result !== null}
        onKeyDown={(e) => {
          if (e.key === "Enter") (result === null ? check : next)();
        }}
      />
      {result !== null && (
        <p className={`text-sm flex items-center gap-2 ${result ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
          {result ? <Check className="w-4 h-4" strokeWidth={3} /> : <X className="w-4 h-4" strokeWidth={3} />}
          {result ? "Rätt!" : `Rätt svar: ${item.correct_text}`}
        </p>
      )}
      {result !== null && item.rule && <p className="text-[11px] text-muted-foreground">{item.rule}</p>}
      <div className="flex gap-2">
        {result === null ? (
          <Button size="sm" onClick={check} disabled={!value.trim()}>
            Kontrollera
          </Button>
        ) : (
          <Button size="sm" onClick={next} className="gap-1">
            Nästa <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
        <Button size="sm" variant="ghost" onClick={onClose}>
          Stäng
        </Button>
      </div>
    </div>
  );
}