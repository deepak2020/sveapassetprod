import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Clock, Trophy, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FORM_SV, isCorrectAnswer, normalizeTyped } from "@/lib/verbs";

export default function VerbQuestionCard({ question, index, total, onResult, onNext, isLast }) {
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState(false);
  const questionKey = `${question.verb.id}-${question.form}`;

  useEffect(() => {
    setTyped("");
    setChecked(false);
  }, [questionKey]);

  const correct = isCorrectAnswer(typed, question.answer);
  const [before, after] = question.sentence.split("___");

  const check = () => {
    if (checked || !typed.trim()) return;
    setChecked(true);
    onResult(correct);
  };

  return (
    <div className="rounded-2xl border-2 border-border/50 bg-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold text-muted-foreground">Fråga {index + 1} av {total}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary whitespace-nowrap">
          <Clock className="w-3.5 h-3.5" /> {question.marker} · {FORM_SV[question.form]}
        </span>
      </div>

      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
        <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${(index / total) * 100}%` }} />
      </div>

      <p className="text-base sm:text-lg font-medium leading-relaxed mb-5">
        {before}
        <span
          className={`inline-block min-w-[88px] mx-1 border-b-2 text-center font-semibold ${
            checked
              ? correct
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-destructive text-destructive"
              : "border-primary/50 text-transparent"
          }`}
        >
          {checked ? normalizeTyped(typed) : "______"}
        </span>
        {after}
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") check(); }}
          disabled={checked}
          placeholder="Skriv formen… · Type the form"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="h-11 text-base"
        />
        {checked ? (
          <Button className="h-11 gap-2 sm:px-6" onClick={onNext}>
            {isLast
              ? <>Visa resultat <Trophy className="w-4 h-4" /></>
              : <>Nästa <ArrowRight className="w-4 h-4" /></>}
          </Button>
        ) : (
          <Button className="h-11 sm:px-6" onClick={check} disabled={!typed.trim()}>Kontrollera</Button>
        )}
      </div>

      {checked && (
        <div className={`mt-4 rounded-xl border p-3 text-sm ${
          correct ? "border-emerald-500/40 bg-emerald-500/10" : "border-destructive/40 bg-destructive/10"
        }`}>
          <p className="font-semibold flex items-center gap-1.5">
            {correct ? (
              <><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Rätt! <span className="font-normal italic text-muted-foreground">Correct!</span></>
            ) : (
              <><XCircle className="w-4 h-4 text-destructive" /> Rätt svar: {question.answer}</>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{question.rule}</p>
        </div>
      )}
    </div>
  );
}