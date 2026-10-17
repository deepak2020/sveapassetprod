import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, PenSquare, RotateCcw, Trophy, XCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { awardXP } from "@/lib/xp";
import { FORM_RULES, FORM_SV, buildFormsSession, isCorrectAnswer } from "@/lib/verbs";

const QUIZ_SIZE = 10;
const XP_PER_VERB = 2;

// Reflexive verbs are stored with "sig" (skyndar sig), but a learner writing
// about themselves naturally types "skyndar mig" — accept both.
function isFormCorrect(typed, verb, form) {
  const expected = (verb[form] || "").trim();
  if (isCorrectAnswer(typed, expected)) return true;
  return /\bsig\b/.test(expected) && isCorrectAnswer(typed, expected.replace(/\bsig\b/g, "mig"));
}

// The infinitive is given; the learner writes the other three forms themselves.
export default function VerbFormsQuiz({ verbs, groupLabel, onRecord, onExit, isAuthenticated }) {
  const [questions, setQuestions] = useState(() => buildFormsSession(verbs, QUIZ_SIZE));
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState({});
  const [checked, setChecked] = useState(false);
  const [missed, setMissed] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const scoreRef = useRef(0);

  const question = questions[index];
  const forms = question?.forms || [];
  const filled = forms.every((form) => (typed[form] || "").trim());
  const results = forms.map((form) => ({
    form,
    correct: question ? isFormCorrect(typed[form], question.verb, form) : false,
  }));
  const allCorrect = results.length > 0 && results.every((r) => r.correct);
  const wrongForms = results.filter((r) => !r.correct).map((r) => r.form);

  const restart = () => {
    scoreRef.current = 0;
    setQuestions(buildFormsSession(verbs, QUIZ_SIZE));
    setIndex(0);
    setTyped({});
    setChecked(false);
    setMissed([]);
    setCorrect(0);
    setDone(false);
  };

  const check = () => {
    if (checked || !filled) return;
    setChecked(true);
    onRecord(question.verb.id, allCorrect);
    if (allCorrect) {
      scoreRef.current += 1;
      setCorrect(scoreRef.current);
    } else {
      setMissed((prev) => [...prev, { verb: question.verb, wrong: wrongForms }]);
    }
  };

  const handleNext = () => {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setTyped({});
      setChecked(false);
      return;
    }
    setDone(true);
    if (isAuthenticated) awardXP(base44, scoreRef.current * XP_PER_VERB, "Alla former klara!");
  };

  const header = (
    <div className="flex items-center justify-between gap-3 mb-4">
      <Button variant="ghost" size="sm" className="gap-1 -ml-2" onClick={onExit}>
        <ArrowLeft className="w-4 h-4" /> Tillbaka
      </Button>
      <span className="text-xs text-muted-foreground">{groupLabel}</span>
    </div>
  );

  if (!questions.length) {
    return (
      <div className="max-w-2xl mx-auto">
        {header}
        <p className="text-center text-sm text-muted-foreground py-8">Det finns inga verb att öva på här än.</p>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((scoreRef.current / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto">
        {header}
        <div className="rounded-2xl border-2 border-border/50 bg-card p-6 text-center">
          <div className="text-4xl mb-3">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
          <h2 className="text-xl font-bold mb-1">
            {scoreRef.current} av {questions.length} rätt
          </h2>
          <p className="text-sm text-muted-foreground mb-1">{pct}%</p>
          {isAuthenticated && scoreRef.current > 0 && (
            <p className="text-xs font-semibold text-primary mb-4">+{scoreRef.current * XP_PER_VERB} XP</p>
          )}
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
            <Button className="gap-2" onClick={restart}><RotateCcw className="w-4 h-4" /> Nytt quiz</Button>
            <Button variant="outline" onClick={onExit}>Tillbaka till listan</Button>
          </div>
        </div>

        {missed.length > 0 && (
          <div className="mt-4 rounded-2xl border border-border/50 bg-card p-4">
            <p className="text-sm font-semibold mb-3">
              Verb du missade <span className="font-normal italic text-muted-foreground">· verbs to review</span>
            </p>
            <div className="space-y-3">
              {missed.map(({ verb, wrong }) => (
                <div key={verb.id} className="flex items-start justify-between gap-3 border-b border-border/40 last:border-0 pb-3 last:pb-0">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{verb.infinitive}</p>
                    <p className="text-xs italic text-muted-foreground">{verb.english}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {["present", "past", "supine"].filter((form) => (verb[form] || "").trim()).map((form) => (
                      <p key={form} className={`text-xs ${wrong.includes(form) ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                        {FORM_SV[form]}: {verb[form]}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {header}
      <div className="rounded-2xl border-2 border-border/50 bg-card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <span className="text-xs font-semibold text-muted-foreground">Fråga {index + 1} av {questions.length}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary whitespace-nowrap">
            <PenSquare className="w-3.5 h-3.5" /> Skriv alla former
          </span>
        </div>

        <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-4">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${(index / questions.length) * 100}%` }} />
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Infinitiv</p>
          <p className="text-2xl font-bold leading-tight">{question.verb.infinitive}</p>
          <p className="text-sm italic text-muted-foreground">{question.verb.english}</p>
        </div>

        <div className="space-y-3">
          {forms.map((form) => {
            const value = typed[form] || "";
            const ok = checked && isFormCorrect(value, question.verb, form);
            return (
              <div key={form}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{FORM_SV[form]}</p>
                <Input
                  value={value}
                  onChange={(e) => setTyped((prev) => ({ ...prev, [form]: e.target.value }))}
                  onKeyDown={(e) => { if (e.key === "Enter") check(); }}
                  disabled={checked}
                  placeholder={`Skriv ${FORM_SV[form].toLowerCase()}…`}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  className={`h-11 text-base mt-1 ${checked ? (ok ? "border-emerald-500" : "border-destructive") : ""}`}
                />
                {checked && !ok && (
                  <p className="text-xs mt-1">
                    Rätt: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{question.verb[form]}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          {checked ? (
            <Button className="h-11 gap-2 sm:px-6" onClick={handleNext}>
              {index + 1 === questions.length
                ? <>Visa resultat <Trophy className="w-4 h-4" /></>
                : <>Nästa <ArrowRight className="w-4 h-4" /></>}
            </Button>
          ) : (
            <Button className="h-11 sm:px-6" onClick={check} disabled={!filled}>Kontrollera</Button>
          )}
        </div>

        {checked && (
          <div className={`mt-4 rounded-xl border p-3 text-sm ${
            allCorrect ? "border-emerald-500/40 bg-emerald-500/10" : "border-destructive/40 bg-destructive/10"
          }`}>
            <p className="font-semibold flex items-center gap-1.5">
              {allCorrect ? (
                <><CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Alla former rätt! <span className="font-normal italic text-muted-foreground">All forms correct!</span></>
              ) : (
                <><XCircle className="w-4 h-4 text-destructive" /> {results.filter((r) => r.correct).length} av {forms.length} former rätt</>
              )}
            </p>
            {!allCorrect && <p className="text-xs text-muted-foreground mt-1 break-words">{FORM_RULES[wrongForms[0]]}</p>}
            <div className="mt-2 space-y-1">
              {forms.map((form) => (question.verb[`${form}_sentence`] ? (
                <p key={form} className="text-xs break-words">
                  <span className="italic text-muted-foreground">{FORM_SV[form]}: </span>
                  {question.verb[`${form}_sentence`]}
                </p>
              ) : null))}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-3 break-words">
        Hela verbet rätt ger {XP_PER_VERB} XP · {XP_PER_VERB} XP for a fully correct verb ({correct} rätt)
      </p>
    </div>
  );
}