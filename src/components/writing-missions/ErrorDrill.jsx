import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { shuffle } from "@/lib/shuffle";
import { normalizeText } from "@/lib/writingMissions";

// Word-order or typing exercise built from one of the student's own mistakes.
function DrillRow({ row }) {
  const correctTokens = String(row.correct_text || "").split(/\s+/).filter(Boolean);
  const isOrder = correctTokens.length >= 3;
  const [pool, setPool] = useState(() => (isOrder ? shuffle(correctTokens.map((t, i) => ({ id: `${i}-${t}`, t }))) : []));
  const [arranged, setArranged] = useState([]);
  const [typed, setTyped] = useState("");
  const [result, setResult] = useState(null);

  const answer = isOrder ? arranged.map((a) => a.t).join(" ") : typed;
  const expected = row.correct_text;

  const check = () => setResult(normalizeText(answer) === normalizeText(expected));

  const retry = () => {
    setPool(isOrder ? shuffle(correctTokens.map((t, i) => ({ id: `${i}-${t}`, t }))) : []);
    setArranged([]);
    setTyped("");
    setResult(null);
  };

  return (
    <div className="rounded-xl border border-border/60 bg-card p-3 space-y-2">
      <p className="text-xs text-muted-foreground">
        Du skrev: <span className="line-through">{row.wrong_text}</span>
      </p>

      {isOrder ? (
        <>
          <div className="min-h-[42px] rounded-lg border border-dashed border-border/70 p-2 flex flex-wrap gap-1.5">
            {arranged.length === 0 && <span className="text-[11px] italic text-muted-foreground">Bygg meningen…</span>}
            {arranged.map((item, i) => (
              <button
                key={item.id}
                type="button"
                disabled={result !== null}
                onClick={() => {
                  setArranged((prev) => prev.filter((_, idx) => idx !== i));
                  setPool((prev) => [...prev, item]);
                }}
                className="rounded-md border border-primary/40 bg-primary/5 px-2 py-1 text-sm"
              >
                {item.t}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {pool.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={result !== null}
                onClick={() => {
                  setPool((prev) => prev.filter((p) => p.id !== item.id));
                  setArranged((prev) => [...prev, item]);
                }}
                className="rounded-md border border-border px-2 py-1 text-sm hover:border-primary/50"
              >
                {item.t}
              </button>
            ))}
          </div>
        </>
      ) : (
        <Input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          disabled={result !== null}
          placeholder="Skriv rätt version…"
          className="h-9 text-sm"
        />
      )}

      {result === null ? (
        <Button size="sm" onClick={check} disabled={!answer.trim()}>
          Kolla
        </Button>
      ) : (
        <div className="space-y-1">
          <p className={`flex items-center gap-1.5 text-sm ${result ? "text-emerald-700 dark:text-emerald-400" : "text-amber-800 dark:text-amber-200"}`}>
            {result ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            {result ? "Rätt!" : `Rätt svar: ${expected}`}
          </p>
          <Button size="sm" variant="outline" onClick={retry} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Igen
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ErrorDrill({ rows = [] }) {
  return (
    <div className="space-y-2 pt-1">
      {rows.slice(0, 3).map((row) => (
        <DrillRow key={row.id || `${row.wrong_text}-${row.correct_text}`} row={row} />
      ))}
    </div>
  );
}