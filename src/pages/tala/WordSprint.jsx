import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Zap, Check, X, Volume2, SkipForward, Trophy } from "lucide-react";
import PageSEO from "@/components/shared/PageSEO";
import LoginGate from "@/components/shared/LoginGate";
import { useAuth } from "@/lib/AuthContext";
import { useSpeech } from "@/hooks/useSpeech";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useMistakeLog } from "@/hooks/useMistakeLog";
import { normalizeAnswer } from "@/lib/normalizeAnswer";
import { shuffle } from "@/lib/shuffle";
import MicButton from "@/components/tala/MicButton";

const ROUND_SIZE = 30;
const TIMER_SECONDS = 5; // soft timer; missing it counts as skip but never blocks

function scoreAnswer(said, target) {
  const s = normalizeAnswer(said);
  const t = normalizeAnswer(target);
  if (!s || !t) return false;
  if (s === t) return true;
  // Accept if the target word appears anywhere in what they said (mic often adds filler).
  return s.split(" ").includes(t) || t.split(" ").every(w => s.includes(w));
}

export default function WordSprint() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { speak } = useSpeech();
  const { logMistake } = useMistakeLog();

  const { data: vocab = [], isLoading } = useQuery({
    queryKey: ["user-vocabulary"],
    queryFn: () => base44.entities.UserVocabulary.list("-created_date", 300),
    enabled: isAuthenticated,
  });

  const { mistakes } = useMistakeLog();

  const [phase, setPhase] = useState("intro"); // intro | play | feedback | done
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [lastResult, setLastResult] = useState(null); // { correct, said, target, en }
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const startedAtRef = useRef(0);
  const timerRef = useRef(null);

  const current = queue[index];

  const { listening, interim, supported, toggle, stop } = useSpeechRecognition({
    onFinal: (transcript) => handleAnswer(transcript, false),
  });

  const startRound = () => {
    if (!vocab.length) return;

    // Deduplicate vocab by Swedish word (users often save the same word from multiple lessons).
    const seen = new Set();
    const uniqueVocab = vocab.filter((v) => {
      const key = (v.swedish || "").toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Mix: ~60% weak (words that appear in unresolved mistakes), ~40% random fresh.
    const weakKeys = new Set(
      (mistakes || [])
        .map((m) => (m.correct_answer || "").toLowerCase().trim())
        .filter(Boolean)
    );
    const weakPool = uniqueVocab.filter((v) => weakKeys.has((v.swedish || "").toLowerCase().trim()));
    const freshPool = uniqueVocab.filter((v) => !weakKeys.has((v.swedish || "").toLowerCase().trim()));

    const weakTarget = Math.round(ROUND_SIZE * 0.6);
    const weakPicked = shuffle(weakPool).slice(0, weakTarget);
    const remaining = ROUND_SIZE - weakPicked.length;
    const freshPicked = shuffle(freshPool).slice(0, remaining);

    // If not enough fresh words, top up from unused unique vocab
    let picked = [...weakPicked, ...freshPicked];
    if (picked.length < ROUND_SIZE) {
      const usedIds = new Set(picked.map((p) => p.id));
      const topUp = shuffle(uniqueVocab.filter((v) => !usedIds.has(v.id))).slice(0, ROUND_SIZE - picked.length);
      picked = [...picked, ...topUp];
    }
    picked = shuffle(picked); // interleave weak & fresh

    setQueue(picked);
    setIndex(0);
    setCorrectCount(0);
    setMissCount(0);
    setPhase("play");
  };

  // Timer per question
  useEffect(() => {
    if (phase !== "play" || !current) return;
    setTimeLeft(TIMER_SECONDS);
    startedAtRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0.1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 0.1;
      });
    }, 100);
    return () => clearInterval(timerRef.current);
  }, [phase, index, current]);

  const handleAnswer = (transcript, skipped) => {
    if (!current || phase !== "play") return;
    clearInterval(timerRef.current);
    if (listening) stop();
    const target = current.swedish;
    const correct = !skipped && scoreAnswer(transcript, target);
    const elapsed = Date.now() - startedAtRef.current;

    setLastResult({ correct, said: transcript, target, en: current.english });
    if (correct) setCorrectCount((c) => c + 1);
    else setMissCount((m) => m + 1);

    // Log to drill results (fire-and-forget)
    if (isAuthenticated) {
      base44.entities.SpeakingDrillResult.create({
        station: "sprint",
        prompt: current.english,
        expected: target,
        user_response: transcript || (skipped ? "(skipped)" : ""),
        correct,
        time_ms: elapsed,
      }).catch(() => {});
    }

    // Log misses to unified MistakeLog so weak words resurface everywhere
    if (!correct && current.english) {
      logMistake({
        source: "gym_produce",
        source_id: current.id || "",
        source_title: "Word Sprint",
        question: current.english,
        correct_answer: target,
        user_answer: transcript || "",
      });
    }

    setPhase("feedback");
    // Speak the correct word on miss to reinforce
    if (!correct) setTimeout(() => speak(target, "sv-SE"), 250);
  };

  // Advance from feedback
  const next = () => {
    setLastResult(null);
    if (index + 1 >= queue.length) {
      setPhase("done");
      return;
    }
    setIndex((i) => i + 1);
    setPhase("play");
  };

  const skip = () => handleAnswer("", true);

  const timerFrac = timeLeft / TIMER_SECONDS;

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <PageSEO title="Word Sprint · Tala · Sveapasset" description="Snabb återkallelse av ord." />
        <LoginGate title="Word Sprint" description="Log in to sprint through your vocabulary." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <PageSEO title="Word Sprint · Tala · Sveapasset" description="Snabb återkallelse av ord." />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/tala")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" /> Word Sprint
          </h1>
        </div>
      </div>

      {phase === "intro" && (
        <Card className="border-2 border-amber-300 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20">
          <CardContent className="p-6 space-y-4 text-center">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 items-center justify-center mx-auto">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold">Redo?</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Du ser ett engelskt ord. Säg det på svenska så snabbt du kan — inom {TIMER_SECONDS} sekunder.
              Vi tränar återkallelse under mild tidspress.
            </p>
            {vocab.length === 0 ? (
              <div className="pt-2">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  Du behöver spara några ord först.
                </p>
                <Button variant="outline" className="mt-3" onClick={() => navigate("/language")}>
                  Utforska lektioner
                </Button>
              </div>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">{vocab.length} ord i din ordbank</p>
                {!supported && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Din webbläsare stödjer inte röstinspelning. Prova Chrome eller Edge.
                  </p>
                )}
                <Button size="lg" onClick={startRound} disabled={!supported} className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                  <Zap className="w-4 h-4" /> Starta ({Math.min(ROUND_SIZE, vocab.length)} ord)
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {phase === "play" && current && (
        <Card className="border-2 border-amber-300 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20">
          <CardContent className="p-6 space-y-5">
            {/* Progress + score */}
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-muted-foreground">
                {index + 1} / {queue.length}
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                ✓ {correctCount} · <span className="text-rose-600 dark:text-rose-400">✗ {missCount}</span>
              </span>
            </div>

            {/* Timer bar */}
            <div className="h-1.5 bg-amber-100 dark:bg-amber-950/40 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-100 ${
                  timerFrac > 0.5 ? "bg-emerald-500" : timerFrac > 0.2 ? "bg-amber-500" : "bg-rose-500"
                }`}
                style={{ width: `${Math.max(0, timerFrac * 100)}%` }}
              />
            </div>

            {/* The prompt */}
            <div className="text-center py-6">
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">
                Say in Swedish
              </p>
              <p className="font-display text-4xl sm:text-5xl font-bold">{current.english}</p>
              {interim && (
                <p className="mt-4 text-sm text-muted-foreground italic min-h-[1.5rem]">
                  🎙️ {interim}
                </p>
              )}
            </div>

            {/* Mic + skip */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={skip}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <SkipForward className="w-3.5 h-3.5" /> Skippa
              </button>
              <MicButton listening={listening} onToggle={toggle} />
              <button
                onClick={() => speak(current.swedish, "sv-SE")}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" /> Hör
              </button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Tryck på mikrofonen och säg ordet
            </p>
          </CardContent>
        </Card>
      )}

      {phase === "feedback" && lastResult && (
        <Card
          className={`border-2 ${
            lastResult.correct
              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20"
              : "border-rose-400 bg-rose-50 dark:bg-rose-950/20"
          }`}
        >
          <CardContent className="p-6 space-y-4 text-center">
            <div
              className={`inline-flex w-12 h-12 rounded-full items-center justify-center ${
                lastResult.correct ? "bg-emerald-500" : "bg-rose-500"
              }`}
            >
              {lastResult.correct ? (
                <Check className="w-6 h-6 text-white" />
              ) : (
                <X className="w-6 h-6 text-white" />
              )}
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">{lastResult.en}</p>
              <p className="font-display text-2xl font-bold">{lastResult.target}</p>
              {!lastResult.correct && lastResult.said && (
                <p className="text-sm text-muted-foreground mt-2">
                  Du sa: <em>"{lastResult.said}"</em>
                </p>
              )}
            </div>

            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => speak(lastResult.target, "sv-SE")} className="gap-1.5">
                <Volume2 className="w-3.5 h-3.5" /> Hör igen
              </Button>
              <Button size="sm" onClick={next} className="gap-1.5">
                Nästa <SkipForward className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phase === "done" && (
        <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-blue-50 dark:from-primary/15 dark:to-blue-950/30">
          <CardContent className="p-6 text-center space-y-4">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 items-center justify-center mx-auto">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold">Pass klart!</h2>
            <p className="text-lg">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ {correctCount}</span>
              {" · "}
              <span className="text-rose-600 dark:text-rose-400 font-bold">✗ {missCount}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              {correctCount === queue.length
                ? "Perfekt runda! 🎉"
                : missCount === 0
                ? "Otroligt bra jobbat!"
                : "Bra jobbat — de missade orden dyker upp igen imorgon."}
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <Button variant="outline" onClick={() => navigate("/tala")}>
                Till Tala
              </Button>
              <Button onClick={startRound} className="gap-2">
                <Zap className="w-4 h-4" /> En runda till
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}