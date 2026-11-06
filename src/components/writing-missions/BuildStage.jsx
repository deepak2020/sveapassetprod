import { useEffect, useState } from "react";
import { ArrowRight, Check, Lightbulb, Loader2, RotateCcw, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SpeakButton from "@/components/shared/SpeakButton";
import { CONNECTORS, sameSentence, puzzleHint, shortFeedback } from "@/lib/writingMissions";

// Stage 4 — word-order puzzles, then one own sentence with a connector.
export default function BuildStage({ mission, onDone }) {
  const puzzles = mission.puzzles || [];
  const [phase, setPhase] = useState(puzzles.length ? "puzzle" : "write");
  const [index, setIndex] = useState(0);
  const [pool, setPool] = useState([]);
  const [arranged, setArranged] = useState([]);
  const [status, setStatus] = useState(null);

  const [connector, setConnector] = useState("");
  const [sentence, setSentence] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const puzzle = puzzles[index];

  useEffect(() => {
    setPool((puzzle?.tokens || []).map((token, i) => ({ id: `${i}-${token}`, token })));
    setArranged([]);
    setStatus(null);
  }, [index, puzzle]);

  const check = () => {
    const built = arranged.map((a) => a.token).join(" ");
    setStatus(sameSentence(built, puzzle.answer) ? "ok" : "wrong");
  };

  const retry = () => {
    setPool((puzzle?.tokens || []).map((token, i) => ({ id: `${i}-${token}`, token })));
    setArranged([]);
    setStatus(null);
  };

  const nextPuzzle = () => {
    if (index + 1 >= puzzles.length) {
      setPhase("write");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setIndex((i) => i + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const askSvea = async () => {
    setBusy(true);
    setError("");
    try {
      const data = await shortFeedback({
        mission,
        text: sentence,
        step: `Skriv en egen mening om "${mission.topic}" med bindeordet "${connector}"`,
      });
      setFeedback(data);
    } catch {
      setError("Svea kunde inte svara just nu. Försök igen.");
    } finally {
      setBusy(false);
    }
  };

  if (phase === "write") {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Din egen mening · <span className="italic normal-case">your own sentence</span>
            </p>
            <p className="text-sm">
              Skriv en mening om {mission.topic.toLowerCase()}. Använd ett bindeord.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {CONNECTORS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setConnector(option)}
                className={`rounded-full border-2 px-3.5 py-2 text-sm font-medium transition-colors ${
                  connector === option ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <Textarea
            value={sentence}
            onChange={(e) => {
              setSentence(e.target.value);
              setFeedback(null);
            }}
            placeholder={connector ? `Skriv en mening med "${connector}"…` : "Välj ett bindeord först…"}
            className="min-h-[90px]"
          />

          <Button
            onClick={askSvea}
            disabled={!sentence.trim() || !connector || busy}
            className="w-full gap-2"
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {busy ? "Svea läser…" : "Fråga Svea"}
          </Button>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        {feedback && (
          <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 space-y-2">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {feedback.ok ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-amber-600" />}
              Svea
            </p>
            <p className="text-sm">{feedback.comment}</p>
            {feedback.correction && (
              <div className="flex items-start gap-2 rounded-xl bg-card p-2.5">
                <p className="flex-1 text-sm font-medium">{feedback.correction}</p>
                <SpeakButton text={feedback.correction} ariaLabel="Lyssna på meningen" />
              </div>
            )}
          </div>
        )}

        <Button onClick={onDone} disabled={!feedback} variant={feedback ? "default" : "outline"} className="w-full gap-2">
          Nästa: Stycke <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Pussel {index + 1} / {puzzles.length}
        </span>
        <span>Tryck på orden i rätt ordning</span>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
        <div className="min-h-[60px] rounded-xl border-2 border-dashed border-border/70 p-3">
          {arranged.length === 0 ? (
            <p className="text-xs italic text-muted-foreground">Bygg meningen här…</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {arranged.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  disabled={status !== null}
                  onClick={() => {
                    setArranged((prev) => prev.filter((_, idx) => idx !== i));
                    setPool((prev) => [...prev, item]);
                  }}
                  className="rounded-lg border border-primary/40 bg-primary/5 px-2.5 py-1.5 text-sm"
                >
                  {item.token}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {pool.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={status !== null}
              onClick={() => {
                setPool((prev) => prev.filter((p) => p.id !== item.id));
                setArranged((prev) => [...prev, item]);
              }}
              className="rounded-lg border border-border px-2.5 py-1.5 text-sm hover:border-primary/50"
            >
              {item.token}
            </button>
          ))}
        </div>

        {status === null && (
          <Button onClick={check} disabled={pool.length > 0} className="w-full">
            Kontrollera
          </Button>
        )}

        {status === "ok" && (
          <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-950/30">
            <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-800 dark:text-emerald-200">
              <Check className="w-4 h-4" /> Rätt!
            </p>
          </div>
        )}

        {status === "wrong" && (
          <div className="rounded-xl bg-amber-50 p-3 space-y-1.5 dark:bg-amber-950/30">
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Rätt mening:</p>
            <div className="flex items-start gap-2">
              <p className="flex-1 text-sm">{puzzle.answer}</p>
              <SpeakButton text={puzzle.answer} ariaLabel="Lyssna på meningen" />
            </div>
            <p className="flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-200">
              <Lightbulb className="w-3.5 h-3.5" /> {puzzleHint(puzzle.answer)}
            </p>
            <Button size="sm" variant="outline" onClick={retry} className="gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Försök igen
            </Button>
          </div>
        )}

        {status !== null && (
          <Button onClick={nextPuzzle} className="w-full gap-2">
            {index + 1 >= puzzles.length ? "Skriv en egen mening" : "Nästa pussel"} <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}