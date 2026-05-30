import { useState, useRef } from "react";
import { Mic, MicOff, CheckCircle2, XCircle, RotateCcw, Trophy, Volume2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeAnswer } from "@/lib/normalizeAnswer";
import SpeakButton from "@/components/shared/SpeakButton";
import { useExerciseProgress } from "@/hooks/useExerciseProgress";
import { base44 } from "@/api/base44Client";
import { awardXP, XP_REWARDS } from "@/lib/xp";

const speechSupported = typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

function fuzzyMatch(userText, expected) {
  const u = normalizeAnswer(userText);
  const e = normalizeAnswer(expected);
  if (u === e) return 1;
  const uWords = u.split(" ");
  const eWords = e.split(" ");
  let matched = 0;
  for (const w of uWords) {
    if (eWords.includes(w)) matched++;
  }
  return eWords.length > 0 ? matched / eWords.length : 0;
}

export default function SpeakTranslate({ wordPairs, onComplete, storageKey, userId, lessonId, tab, initialProgress, previousResult }) {
  const { load, save, clear } = useExerciseProgress(storageKey, userId, lessonId, tab);
  const remoteApplied = useRef(false);

  const exercises = (wordPairs || []).filter(wp => wp.example_en && wp.example_sv);

  const [current, setCurrent] = useState(() => previousResult ? 0 : (initialProgress?.current ?? load()?.current ?? 0));
  const [score, setScore] = useState(() => previousResult ? (previousResult.score ?? 0) : (initialProgress?.score ?? load()?.score ?? 0));
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(() => !!previousResult);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [wrongCount, setWrongCount] = useState(0);

  if (!exercises.length) {
    return <p className="text-muted-foreground text-sm">No speaking exercises available for this lesson.</p>;
  }

  const ex = exercises[current];

  const handleRecord = () => {
    if (listening || submitted) return;
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return;
      const recognition = new SR();
      recognition.lang = "sv-SE";
      recognition.interimResults = false;
      recognition.maxAlternatives = 3;
      setListening(true);
      recognition.start();
      recognition.onresult = (event) => {
        const best = Array.from(event.results[0]).map(a => a.transcript).join(" ");
        const score75 = fuzzyMatch(best, ex.example_sv) >= 0.75;
        setTranscript(best);
        setIsCorrect(score75);
        setSubmitted(true);
        setListening(false);
        if (score75) {
          setScore(s => { save({ current, score: s + 1 }); return s + 1; });
          awardXP(base44, XP_REWARDS.speaking_attempted);
        } else {
          setWrongCount(w => w + 1);
          save({ current, score });
          awardXP(base44, XP_REWARDS.speaking_attempted);
        }
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
    } catch {
      setListening(false);
    }
  };

  const handleNext = () => {
    if (current + 1 >= exercises.length) {
      clear();
      setFinished(true);
      onComplete?.(score, exercises.length);
    } else {
      const next = current + 1;
      save({ current: next, score });
      setCurrent(next);
      setSubmitted(false);
      setTranscript("");
      setIsCorrect(null);
    }
  };

  const restart = () => {
    clear();
    setCurrent(0); setScore(0); setSubmitted(false);
    setTranscript(""); setIsCorrect(null); setWrongCount(0); setFinished(false);
  };

  if (finished) {
    const fromPrev = score === 0 && !!previousResult;
    const displayPct = fromPrev ? previousResult.percentage : Math.round((score / exercises.length) * 100);
    const displayScore = fromPrev ? previousResult.score : score;
    const displayTotal = fromPrev ? previousResult.total : exercises.length;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <Card className="border-border/50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-violet-500" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-1">
              {fromPrev ? "Already completed! ✓" : displayPct >= 80 ? "Great speaking! 🎉" : displayPct >= 60 ? "Good effort! 👍" : "Keep practising! 💪"}
            </h3>
            {fromPrev && <p className="text-sm text-muted-foreground italic mb-2">Your last score</p>}
            <p className="text-4xl font-bold text-primary my-2">{displayPct}%</p>
            <p className="text-muted-foreground mb-6">{displayScore} / {displayTotal} correct</p>
            <Button onClick={restart} variant="outline" className="gap-2 w-full">
              <RotateCcw className="w-4 h-4" /> {fromPrev ? "Try again" : "Practise again"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!speechSupported) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300">
          <MicOff className="w-4 h-4 shrink-0" />
          <span>Speech recognition is not supported in this browser. Try Chrome or Edge for the full experience.</span>
        </div>
        <div className="space-y-3">
          {exercises.map((e, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">English</p>
                <p className="font-semibold text-sm">{e.example_en}</p>
                <p className="text-xs text-muted-foreground mt-2">Swedish: <span className="font-medium text-foreground">{e.example_sv}</span></p>
              </div>
              <SpeakButton text={e.example_sv} lang="sv-SE" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Speak in Swedish — {current + 1} / {exercises.length}
          </CardTitle>
          <span className="text-sm text-muted-foreground">Score: {score}</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full mt-2">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${((current + 1) / exercises.length) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            {/* English prompt */}
            <div className="bg-muted/40 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Say this in Swedish:</p>
              <p className="text-xl font-bold text-foreground">{ex.example_en}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Word: <span className="font-medium">{ex.english} → {ex.swedish}</span>
              </p>
            </div>

            {/* Listen to correct Swedish */}
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200/60 dark:border-blue-800/30">
              <SpeakButton text={ex.example_sv} lang="sv-SE" />
              <div>
                <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Listen first</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">Hear the correct Swedish, then tap the mic to repeat it</p>
              </div>
            </div>

            {/* Mic button */}
            {!submitted && (
              <div className="flex flex-col items-center gap-3 py-4">
                <button
                  onClick={handleRecord}
                  disabled={listening}
                  aria-label={listening ? "Listening — recording in progress" : "Tap to speak Swedish"}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    listening
                      ? "bg-red-500 scale-110 shadow-red-300"
                      : "bg-violet-600 hover:bg-violet-700 hover:scale-105"
                  }`}
                >
                  {listening
                    ? <Loader2 className="w-9 h-9 text-white animate-spin" />
                    : <Mic className="w-9 h-9 text-white" />}
                </button>
                <p className="text-sm text-muted-foreground">
                  {listening ? "Listening… speak now 🎤" : "Tap the mic and speak Swedish"}
                </p>
              </div>
            )}

            {/* Feedback */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                aria-live="polite"
                className={`rounded-xl p-4 border-2 ${isCorrect ? "bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700" : "bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-700"}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  {isCorrect
                    ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                    : <XCircle className="w-5 h-5 text-red-500" />}
                  <span className={`font-semibold text-sm ${isCorrect ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                    {isCorrect ? "Great pronunciation! 🎉" : "Not quite — try listening again"}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    You said: <span className="font-medium text-foreground italic">"{transcript}"</span>
                  </p>
                  {!isCorrect && (
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-foreground">
                        Correct: <span className="font-semibold">{ex.example_sv}</span>
                      </p>
                      <SpeakButton text={ex.example_sv} lang="sv-SE" />
                    </div>
                  )}
                </div>

                {!isCorrect && (
                  <button
                    onClick={() => { setSubmitted(false); setTranscript(""); setIsCorrect(null); }}
                    className="mt-3 text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Try again
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {submitted && (
          <div className="flex justify-end pt-1">
            <Button onClick={handleNext} className="bg-violet-600 hover:bg-violet-700">
              {current + 1 >= exercises.length ? "See Results" : "Next →"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
