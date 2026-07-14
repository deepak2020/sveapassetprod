import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Puzzle, Volume2, Check, X, Trophy, RotateCw } from "lucide-react";
import PageSEO from "@/components/shared/PageSEO";
import LoginGate from "@/components/shared/LoginGate";
import { useAuth } from "@/lib/AuthContext";
import { useSpeech } from "@/hooks/useSpeech";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { similarityPercent } from "@/lib/similarity";
import { normalizeAnswer } from "@/lib/normalizeAnswer";
import { shuffle } from "@/lib/shuffle";
import MicButton from "@/components/tala/MicButton";

const LEVELS = ["A", "B", "C", "D"];
const ROUND_SIZE = 6;

// Split a Swedish sentence into token pieces to arrange.
function tokenizeForBlocks(sentence) {
  return normalizeAnswer(sentence).split(" ").filter(Boolean);
}

export default function Chunks() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { speak } = useSpeech();

  const [level, setLevel] = useState("A");
  const [phase, setPhase] = useState("intro"); // intro | arrange | speak | feedback | done
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [pieces, setPieces] = useState([]); // { word, id, used }
  const [chosen, setChosen] = useState([]); // ids in order
  const [lastResult, setLastResult] = useState(null);
  const [scores, setScores] = useState([]);

  const { data: sentences = [], isLoading } = useQuery({
    queryKey: ["chunks-sentences", level],
    queryFn: () =>
      base44.entities.ClozeSentence.filter({ sfi_level: level, source: "tatoeba" }, "-created_date", 200),
    enabled: isAuthenticated,
  });

  const current = queue[index];

  const { listening, interim, supported, toggle, stop } = useSpeechRecognition({
    onFinal: (transcript) => handleTranscript(transcript),
  });

  const startRound = () => {
    // Prefer sentences with 4–8 words so arranging stays doable.
    const usable = sentences.filter((s) => {
      const n = tokenizeForBlocks(s.sentence_sv).length;
      return n >= 4 && n <= 8;
    });
    if (!usable.length) return;
    const picked = shuffle(usable).slice(0, ROUND_SIZE);
    setQueue(picked);
    setIndex(0);
    setScores([]);
    loadSentence(picked[0]);
    setPhase("arrange");
  };

  const loadSentence = (sentence) => {
    const words = tokenizeForBlocks(sentence.sentence_sv);
    const shuffled = shuffle(words).map((w, i) => ({ word: w, id: `${i}-${w}`, used: false }));
    setPieces(shuffled);
    setChosen([]);
  };

  const pickPiece = (id) => {
    setPieces((prev) => prev.map((p) => (p.id === id ? { ...p, used: true } : p)));
    setChosen((prev) => [...prev, id]);
  };

  const unpickPiece = (id) => {
    setPieces((prev) => prev.map((p) => (p.id === id ? { ...p, used: false } : p)));
    setChosen((prev) => prev.filter((cid) => cid !== id));
  };

  const clearArrangement = () => {
    setPieces((prev) => prev.map((p) => ({ ...p, used: false })));
    setChosen([]);
  };

  const chosenSentence = chosen
    .map((id) => pieces.find((p) => p.id === id)?.word)
    .filter(Boolean)
    .join(" ");

  const arrangementCorrect = useMemo(() => {
    if (!current) return false;
    return normalizeAnswer(chosenSentence) === normalizeAnswer(current.sentence_sv);
  }, [chosenSentence, current]);

  const checkArrangement = () => {
    if (arrangementCorrect) setPhase("speak");
    // if wrong, we do nothing yet — let them re-arrange
  };

  const handleTranscript = (transcript) => {
    if (!current || phase !== "speak") return;
    if (listening) stop();
    const match = similarityPercent(transcript, current.sentence_sv);
    setLastResult({ match, transcript, target: current.sentence_sv });
    setScores((s) => [...s, match]);

    if (isAuthenticated) {
      base44.entities.SpeakingDrillResult.create({
        station: "chunks",
        prompt: current.sentence_en || current.sentence_sv,
        expected: current.sentence_sv,
        user_response: transcript,
        correct: match >= 70,
        match_percent: match,
        level,
      }).catch(() => {});
    }

    setPhase("feedback");
  };

  const next = () => {
    setLastResult(null);
    if (index + 1 >= queue.length) {
      setPhase("done");
      return;
    }
    const newIndex = index + 1;
    setIndex(newIndex);
    loadSentence(queue[newIndex]);
    setPhase("arrange");
  };

  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const usable = sentences.filter((s) => {
    const n = tokenizeForBlocks(s.sentence_sv).length;
    return n >= 4 && n <= 8;
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <PageSEO title="Chunks · Tala · Sveapasset" description="Bygg svenska meningar och säg dem högt." />
        <LoginGate title="Chunks" description="Log in to build and speak Swedish sentences." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <PageSEO title="Chunks · Tala · Sveapasset" description="Bygg svenska meningar och säg dem högt." />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/tala")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold flex items-center gap-2">
            <Puzzle className="w-5 h-5 text-emerald-500" /> Chunks
          </h1>
          <p className="text-xs text-muted-foreground">
            Bygg meningen — och säg den · <span className="italic">Build it — then say it</span>
          </p>
        </div>
      </div>

      {phase === "intro" && (
        <Card className="border-2 border-emerald-300 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20">
          <CardContent className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 items-center justify-center">
                <Puzzle className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold">Bygg och tala</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Ordna orden i rätt ordning — sedan säger du hela meningen högt.
                Tränar meningsbyggnad och uttal samtidigt.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                SFI-nivå
              </p>
              <div className="grid grid-cols-4 gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`py-2.5 rounded-lg border-2 text-sm font-bold transition-all ${
                      level === l
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-emerald-200 dark:border-emerald-800/60 bg-white/60 dark:bg-black/20 hover:border-emerald-400"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {isLoading ? "Laddar…" : `${usable.length} meningar tillgängliga`}
              </p>
            </div>

            {!supported && (
              <p className="text-xs text-red-600 dark:text-red-400 text-center">
                Din webbläsare stödjer inte röstinspelning. Prova Chrome eller Edge.
              </p>
            )}

            <Button
              onClick={startRound}
              disabled={usable.length < ROUND_SIZE || !supported}
              size="lg"
              className="w-full gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0"
            >
              <Puzzle className="w-4 h-4" /> Starta ({Math.min(ROUND_SIZE, usable.length)} meningar)
            </Button>
          </CardContent>
        </Card>
      )}

      {phase === "arrange" && current && (
        <Card className="border-2 border-emerald-300 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold">{index + 1} / {queue.length}</span>
              <button onClick={clearArrangement} className="flex items-center gap-1 hover:text-foreground">
                <RotateCw className="w-3 h-3" /> Rensa
              </button>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-1">
                Say in Swedish
              </p>
              <p className="font-display text-xl font-semibold">{current.sentence_en}</p>
            </div>

            {/* Assembled sentence slot */}
            <div className="min-h-[3.5rem] rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-800 bg-white/40 dark:bg-black/20 p-3 flex flex-wrap gap-2">
              {chosen.length === 0 ? (
                <span className="text-sm text-muted-foreground italic self-center">
                  Tryck på orden nedan…
                </span>
              ) : (
                chosen.map((id) => {
                  const p = pieces.find((x) => x.id === id);
                  return (
                    <button
                      key={id}
                      onClick={() => unpickPiece(id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-sm font-medium shadow-sm hover:bg-emerald-600"
                    >
                      {p?.word}
                    </button>
                  );
                })
              )}
            </div>

            {/* Available pieces */}
            <div className="flex flex-wrap gap-2">
              {pieces.map((p) =>
                p.used ? null : (
                  <button
                    key={p.id}
                    onClick={() => pickPiece(p.id)}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-black/30 border-2 border-emerald-200 dark:border-emerald-800 text-sm font-medium hover:border-emerald-400"
                  >
                    {p.word}
                  </button>
                )
              )}
            </div>

            <Button
              onClick={checkArrangement}
              disabled={chosen.length !== pieces.length || !arrangementCorrect}
              size="lg"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0"
            >
              {chosen.length !== pieces.length
                ? `Använd alla orden (${chosen.length}/${pieces.length})`
                : arrangementCorrect
                ? "Rätt! Nu — säg det →"
                : "Ordningen är fel — prova igen"}
            </Button>
          </CardContent>
        </Card>
      )}

      {phase === "speak" && current && (
        <Card className="border-2 border-emerald-300 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20">
          <CardContent className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                Nu — säg meningen högt
              </p>
              <p className="font-display text-2xl sm:text-3xl font-semibold leading-snug">
                {current.sentence_sv}
              </p>
              <p className="text-sm text-muted-foreground italic">{current.sentence_en}</p>
              {interim && (
                <p className="pt-2 text-sm italic text-foreground min-h-[1.5rem]">
                  🎙️ {interim}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => speak(current.sentence_sv, "sv-SE")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" /> Hör
              </button>
              <MicButton listening={listening} onToggle={toggle} />
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "feedback" && lastResult && (
        <Card
          className={`border-2 ${
            lastResult.match >= 80
              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
              : lastResult.match >= 50
              ? "border-amber-400 bg-amber-50 dark:bg-amber-950/20"
              : "border-rose-400 bg-rose-50 dark:bg-rose-950/20"
          }`}
        >
          <CardContent className="p-6 space-y-3 text-center">
            <p className="font-display text-4xl font-bold">{lastResult.match}%</p>
            <p className="text-sm">
              {lastResult.match >= 80 ? "Utmärkt! 🎯" : lastResult.match >= 50 ? "Nästan där." : "Prova igen imorgon."}
            </p>
            <p className="text-xs text-muted-foreground pt-2">Du sa:</p>
            <p className="text-sm italic">"{lastResult.transcript || "(inget hörbart)"}"</p>
            <div className="flex justify-center gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => speak(lastResult.target, "sv-SE")} className="gap-1.5">
                <Volume2 className="w-3.5 h-3.5" /> Hör igen
              </Button>
              <Button size="sm" onClick={next} className="gap-1.5">
                Nästa <Check className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "done" && (
        <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-emerald-50 dark:from-primary/15 dark:to-emerald-950/30">
          <CardContent className="p-6 text-center space-y-4">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 items-center justify-center mx-auto">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold">Pass klart!</h2>
            <p className="font-display text-4xl font-bold">{avgScore}%</p>
            <p className="text-sm text-muted-foreground">
              Genomsnitt över {queue.length} meningar
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <Button variant="outline" onClick={() => navigate("/tala")}>
                Till Tala
              </Button>
              <Button onClick={startRound} className="gap-2">
                <Puzzle className="w-4 h-4" /> En runda till
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}