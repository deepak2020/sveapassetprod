import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SpeakButton from "@/components/shared/SpeakButton";
import { normalizeAnswer } from "@/lib/normalizeAnswer";

const sameWord = (typed, target) => {
  const a = normalizeAnswer(typed);
  const b = normalizeAnswer(target);
  if (!a) return false;
  if (a === b) return true;
  // Ignore a leading infinitive marker ("att arbeta" ≈ "arbeta")
  return a.replace(/^att\s+/, "") === b.replace(/^att\s+/, "");
};

export default function WordTyping({ questions, title, onExit, onRestart, onFinish, onProgress }) {
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState("");
  const [result, setResult] = useState(null); // "correct" | "wrong"
  const [score, setScore] = useState(0);

  const finished = idx >= questions.length;
  const q = questions[idx];

  useEffect(() => {
    if (finished && onFinish) onFinish();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  const check = () => {
    if (result || !value.trim()) return;
    const ok = sameWord(value, q.sv);
    setResult(ok ? "correct" : "wrong");
    if (ok) setScore((s) => s + 1);
    // Report progress per answered word so leaving early still counts
    if (onProgress) onProgress(idx + 1);
  };

  const next = () => {
    setResult(null);
    setValue("");
    setIdx((i) => i + 1);
  };

  if (finished) {
    const pct = Math.round((score / Math.max(questions.length, 1)) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 space-y-4">
        <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto">
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold">
          {pct >= 80 ? "Utmärkt! 🎉" : pct >= 50 ? "Bra jobbat! 👍" : "Fortsätt öva! 💪"}
        </h2>
        <p className="text-5xl font-bold text-primary">{pct}%</p>
        <p className="text-muted-foreground">{score} av {questions.length} rätt</p>
        <div className="flex flex-col gap-2 max-w-xs mx-auto pt-2">
          <Button onClick={onRestart} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Ny omgång
          </Button>
          <Button onClick={onExit} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Tillbaka
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <button onClick={onExit} className="flex items-center gap-2 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Avsluta
        </button>
        <span>{idx + 1} / {questions.length}</span>
        <span className="font-semibold text-emerald-600">{score} rätt</span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(idx / questions.length) * 100}%` }} />
      </div>

      <motion.div key={idx} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="rounded-2xl border border-border/50 bg-card p-6 space-y-5">
        <div className="space-y-1 text-center">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Skriv ordet på svenska</p>
          <p className="text-2xl font-bold">{q.en}</p>
          {title && <p className="text-xs text-muted-foreground italic">{q.chapterTitle || title}</p>}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); result ? next() : check(); }}
          className="space-y-3"
        >
          <Input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!!result}
            placeholder="Ditt svar…"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className={`text-center text-lg ${result === "correct" ? "border-emerald-400" : result === "wrong" ? "border-red-400" : ""}`}
          />

          {!result && (
            <Button type="submit" className="w-full" disabled={!value.trim()}>
              Kontrollera
            </Button>
          )}
        </form>

        {result && (
          <div className={`rounded-xl border p-4 text-sm space-y-1 ${
            result === "correct"
              ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100"
              : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100"
          }`}>
            <div className="flex items-center gap-2">
              {result === "correct"
                ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                : <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
              <p className="font-semibold">{result === "correct" ? "Rätt!" : `Rätt svar: ${q.sv}`}</p>
              <SpeakButton text={q.sv} ariaLabel={`Listen to ${q.sv}`} />
            </div>
            <p className="text-muted-foreground">{q.en}</p>
            {result === "wrong" && <p className="text-xs italic">Du skrev: {value.trim()}</p>}
          </div>
        )}

        {result && (
          <Button onClick={next} className="w-full">
            {idx + 1 >= questions.length ? "Se resultat" : "Nästa →"}
          </Button>
        )}
      </motion.div>
    </div>
  );
}