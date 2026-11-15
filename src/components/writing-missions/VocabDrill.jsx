import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SpeakButton from "@/components/shared/SpeakButton";
import { normalizeAnswer, wordLabel } from "@/lib/writingMissions";
import { shuffle } from "@/lib/shuffle";

const flip = (dir) => (dir === "sv_en" ? "en_sv" : "sv_en");

function startingQueue(words) {
  return shuffle(words).map((word) => ({ word, dir: Math.random() < 0.5 ? "sv_en" : "en_sv" }));
}

function englishOptions(word, words) {
  const distractors = shuffle(words.filter((w) => w.en !== word.en)).slice(0, 3).map((w) => w.en);
  return shuffle([word.en, ...distractors]);
}

// Two-way word drill: a word counts as learned once it has been recognised
// (Swedish → English) AND produced (English → Swedish). Missed words come back.
export default function VocabDrill({ mission }) {
  const words = useMemo(() => mission?.words || [], [mission]);
  const [queue, setQueue] = useState(() => startingQueue(words));
  const [learned, setLearned] = useState({});
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  const card = queue[0];
  const mastered = words.filter((w) => learned[w.sv]?.sv_en && learned[w.sv]?.en_sv).length;
  const finished = words.length > 0 && mastered === words.length;
  const options = useMemo(
    () => (card && card.dir === "sv_en" ? englishOptions(card.word, words) : []),
    [card, words]
  );

  // A correct answer moves on by itself after a short beat.
  useEffect(() => {
    if (result !== true) return;
    const timer = setTimeout(() => {
      setAnswer("");
      setResult(null);
    }, 800);
    return () => clearTimeout(timer);
  }, [result]);

  const check = (value) => {
    if (result !== null || !card) return;
    const ok =
      card.dir === "en_sv"
        ? normalizeAnswer(value) === normalizeAnswer(card.word.sv)
        : value === card.word.en;
    setResult(ok);
    if (!ok) return;
    const record = { ...(learned[card.word.sv] || {}), [card.dir]: true };
    setLearned({ ...learned, [card.word.sv]: record });
    const rest = queue.slice(1);
    setQueue(record.sv_en && record.en_sv ? rest : [...rest, { word: card.word, dir: flip(card.dir) }]);
  };

  const retry = () => {
    setQueue([...queue.slice(1), card]);
    setAnswer("");
    setResult(null);
  };

  const restart = () => {
    setQueue(startingQueue(words));
    setLearned({});
    setAnswer("");
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!words.length) {
    return <p className="text-center text-sm text-muted-foreground">Det finns inga ord i det här uppdraget.</p>;
  }

  if (finished) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card p-6 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-500/15 mx-auto flex items-center justify-center">
          <Check className="w-6 h-6 text-emerald-600" />
        </div>
        <p className="text-lg font-semibold">Alla {words.length} ord sitter</p>
        <p className="text-sm text-muted-foreground">
          Du kan orden åt båda hållen — nu är det lättare att skriva texten.
        </p>
        <div className="flex flex-col gap-2 pt-1">
          <Button asChild className="gap-2">
            <Link to={`/writing-missions/${mission.id}?stage=1`}>
              Skriv uppdraget <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button variant="outline" onClick={restart} className="gap-2">
            <RotateCcw className="w-4 h-4" /> Öva igen
          </Button>
        </div>
      </div>
    );
  }

  const prompt = card.dir === "sv_en" ? wordLabel(card.word) : card.word.en;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{mastered} av {words.length} ord lärda</span>
          <span className="italic">
            {card.dir === "sv_en" ? "svenska → engelska" : "engelska → svenska"}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.round((mastered / words.length) * 100)}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold">{prompt}</p>
          {card.dir === "sv_en" && <SpeakButton text={prompt} ariaLabel="Lyssna på ordet" />}
        </div>

        {card.dir === "sv_en" ? (
          <>
            <p className="text-sm text-muted-foreground">Vad betyder ordet?</p>
            <div className="space-y-2">
              {options.map((option) => {
                const correct = result !== null && option === card.word.en;
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
                      correct
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
            {result === null && (
              <Button onClick={() => check(answer)} disabled={!answer.trim()} className="w-full">
                Svara
              </Button>
            )}
          </>
        )}

        {result === true && <p className="text-sm text-emerald-700 dark:text-emerald-400">Rätt!</p>}
        {result === false && (
          <div className="space-y-2">
            <p className="text-sm text-red-700 dark:text-red-400">Rätt svar: {wordLabel(card.word)}</p>
            <Button onClick={retry} variant="outline" className="w-full">
              Försök igen
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}