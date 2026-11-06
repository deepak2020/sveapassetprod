import { useState } from "react";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SpeakButton from "@/components/shared/SpeakButton";
import { buildQuiz, normalizeAnswer, wordLabel } from "@/lib/writingMissions";

const PASS_PERCENT = 70;

// Stage 2 — flashcards for the 12 words, then a 10-question quiz.
export default function WordsStage({ mission, onDone }) {
  const words = mission.words || [];
  const [phase, setPhase] = useState("cards");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [questions, setQuestions] = useState(() => buildQuiz(words));
  const [qIndex, setQIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [missed, setMissed] = useState([]);
  const [attempts, setAttempts] = useState(0);

  const word = words[cardIndex];
  const question = questions[qIndex];
  const score = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
  const passed = score >= PASS_PERCENT;

  const check = (value) => {
    if (result !== null) return;
    const ok =
      question.kind === "meaning"
        ? value === question.word.en
        : normalizeAnswer(value) === normalizeAnswer(question.word.sv);
    setResult(ok);
    if (ok) setCorrectCount((c) => c + 1);
    else setMissed((m) => (m.includes(question.word.sv) ? m : [...m, question.word.sv]));
  };

  const nextQuestion = () => {
    if (qIndex + 1 >= questions.length) {
      setAttempts((a) => a + 1);
      setPhase("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setQIndex((i) => i + 1);
    setAnswer("");
    setResult(null);
  };

  const restart = () => {
    setQuestions(buildQuiz(words));
    setQIndex(0);
    setAnswer("");
    setResult(null);
    setCorrectCount(0);
    setMissed([]);
    setPhase("quiz");
  };

  if (phase === "cards") {
    return (
      <div className="space-y-4">
        <p className="text-xs italic text-muted-foreground">
          Tryck på kortet för att vända det · tap the card to flip
        </p>

        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="w-full min-h-[210px] rounded-2xl border border-border/60 bg-card p-5 text-left transition-colors hover:border-primary/40"
        >
          {!flipped ? (
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Svenska</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">{wordLabel(word)}</p>
                <SpeakButton text={wordLabel(word)} ariaLabel="Lyssna på ordet" />
              </div>
              <p className="text-xs italic text-muted-foreground">Vad betyder ordet?</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">English</p>
              <p className="text-xl font-semibold">{word.en}</p>
              {word.example && (
                <div className="rounded-xl bg-muted/50 p-3">
                  <div className="flex items-start gap-2">
                    <p className="flex-1 text-sm">{word.example}</p>
                    <SpeakButton text={word.example} ariaLabel="Lyssna på exempelmeningen" />
                  </div>
                </div>
              )}
            </div>
          )}
        </button>

        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setCardIndex((i) => Math.max(0, i - 1));
              setFlipped(false);
            }}
            disabled={cardIndex === 0}
          >
            Föregående
          </Button>
          <p className="text-xs text-muted-foreground">
            {cardIndex + 1} / {words.length}
          </p>
          {cardIndex + 1 < words.length ? (
            <Button
              onClick={() => {
                setCardIndex((i) => i + 1);
                setFlipped(false);
              }}
            >
              Nästa ord
            </Button>
          ) : (
            <Button onClick={() => setPhase("quiz")} className="gap-2">
              <Sparkles className="w-4 h-4" /> Starta quizet
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3 text-center">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Resultat</p>
          <p className={`text-4xl font-bold ${passed ? "text-emerald-600" : "text-amber-600"}`}>{score}%</p>
          <p className="text-sm text-muted-foreground">
            {correctCount} av {questions.length} rätt
          </p>
          {passed ? (
            <p className="text-sm">Bra jobbat! Du kan orden.</p>
          ) : (
            <p className="text-sm">
              Du behöver {PASS_PERCENT}% för att gå vidare.{" "}
              <span className="italic text-muted-foreground">Try the quiz again.</span>
            </p>
          )}
          {missed.length > 0 && (
            <div className="rounded-xl bg-amber-50 p-3 text-left dark:bg-amber-950/30">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                Ord att repetera
              </p>
              <p className="text-sm text-amber-900 dark:text-amber-100">{missed.join(", ")}</p>
              <p className="mt-1 text-[11px] italic text-amber-700/80 dark:text-amber-300/80">
                These words are highlighted in the next stages.
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {passed && (
            <Button onClick={() => onDone(score, missed)} className="gap-2">
              Fortsätt <ArrowRight className="w-4 h-4" />
            </Button>
          )}
          {!passed && attempts < 2 && (
            <Button onClick={restart} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Gör om quizet
            </Button>
          )}
          {!passed && attempts >= 2 && (
            <Button onClick={() => onDone(score, missed)} variant="outline" className="gap-2">
              Fortsätt ändå <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Fråga {qIndex + 1} / {questions.length}
        </span>
        <span>{correctCount} rätt</span>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
        {question.kind === "meaning" ? (
          <>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold">{wordLabel(question.word)}</p>
              <SpeakButton text={wordLabel(question.word)} ariaLabel="Lyssna på ordet" />
            </div>
            <p className="text-sm text-muted-foreground">Vad betyder det?</p>
            <div className="space-y-2">
              {question.options.map((option) => {
                const chosen = result !== null && option === question.word.en;
                const wrong = result === false && option === answer;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setAnswer(option);
                      check(option);
                    }}
                    disabled={result !== null}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                      chosen
                        ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
                        : wrong
                        ? "border-red-400 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">Skriv ordet på svenska (med en/ett om du vill):</p>
            <p className="text-lg font-semibold">{question.word.en}</p>
            <Input
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") check(answer);
              }}
              disabled={result !== null}
              placeholder="Skriv på svenska…"
              autoCapitalize="none"
            />
            {result === null ? (
              <Button onClick={() => check(answer)} disabled={!answer.trim()} className="w-full">
                Svara
              </Button>
            ) : (
              <p className={`text-sm ${result ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                {result ? "Rätt!" : `Rätt svar: ${wordLabel(question.word)}`}
              </p>
            )}
          </>
        )}

        {result !== null && (
          <Button onClick={nextQuestion} className="w-full gap-2">
            {qIndex + 1 >= questions.length ? "Visa resultat" : "Nästa"} <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}