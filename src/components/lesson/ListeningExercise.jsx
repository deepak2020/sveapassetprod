import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, CheckCircle2, XCircle, Mic, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { playAudio } from "@/lib/speech";
import { useExerciseProgress } from "@/hooks/useExerciseProgress";
import { normalizeAnswer } from "@/lib/normalizeAnswer";

export default function ListeningExercise({ phrases, onComplete, storageKey, userId, lessonId, tab, initialProgress, previousResult }) {
  const { load, save, clear } = useExerciseProgress(storageKey, userId, lessonId, tab);
  const remoteApplied = useRef(false);
  const [phrasePool, setPhrasePool] = useState(phrases);
  const [wrongIndices, setWrongIndices] = useState([]);
  const [current, setCurrent] = useState(() => previousResult ? 0 : (initialProgress?.current ?? load()?.current ?? 0));
  const [typed, setTyped] = useState("");
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [score, setScore] = useState(() => previousResult ? (previousResult.score ?? 0) : (initialProgress?.score ?? load()?.score ?? 0));
  const [finished, setFinished] = useState(() => !!previousResult);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    if (remoteApplied.current || finished || initialProgress == null) return;
    remoteApplied.current = true;
    const localIdx = load()?.current ?? 0;
    const remoteIdx = initialProgress.current ?? 0;
    if (remoteIdx > localIdx) { setCurrent(remoteIdx); setScore(initialProgress.score ?? 0); }
  }, [initialProgress]);

  if (!phrases || phrases.length === 0) {
    return <p className="text-muted-foreground text-sm">No listening exercises available.</p>;
  }

  const phrase = phrasePool[current];
  const isTranscribe = phrase.exercise_type === "transcribe";

  const handleAnswer = (answer) => {
    if (answered) return;
    const expected = normalizeAnswer(phrase.phrase_sv);
    const given = normalizeAnswer(answer);
    const isCorrect = given === expected;
    setAnswered(true);
    setCorrect(isCorrect);
    if (isCorrect) {
      setScore(s => { save({ current, score: s + 1 }); return s + 1; });
    } else {
      save({ current, score });
      setWrongIndices(prev => [...prev, current]);
    }
  };

  const handleListening = () => {
    if (listening || answered) return;
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition not supported in your browser");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = "sv-SE";
      recognition.interimResults = false;
      
      setListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        if (event.results.length > 0) {
          const transcript = event.results[0][0].transcript;
          setTyped(transcript);
          handleAnswer(transcript);
        }
        setListening(false);
      };

      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
    } catch (error) {
      console.error("Speech recognition error:", error);
      setListening(false);
    }
  };

  const handleNext = () => {
    if (current + 1 >= phrasePool.length) {
      clear();
      setFinished(true);
      onComplete?.(score, phrasePool.length);
    } else {
      const next = current + 1;
      save({ current: next, score });
      setCurrent(next);
      setTyped("");
      setSelected(null);
      setAnswered(false);
      setCorrect(false);
    }
  };

  const wrongCount = wrongIndices.length;

  const restart = () => {
    clear();
    const retryPool = wrongCount > 0
      ? wrongIndices.map(i => phrasePool[i])
      : phrases;
    setPhrasePool(retryPool);
    setWrongIndices([]);
    setCurrent(0); setTyped(""); setSelected(null);
    setAnswered(false); setCorrect(false); setScore(0); setFinished(false);
  };

  if (finished) {
    const fromPrev = wrongIndices.length === 0 && score === 0 && !!previousResult;
    const displayPct = fromPrev ? previousResult.percentage : Math.round((score / phrasePool.length) * 100);
    const displayScore = fromPrev ? previousResult.score : score;
    const displayTotal = fromPrev ? previousResult.total : phrasePool.length;
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <Card className="border-border/50 bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-lg text-green-900 mb-2">
              {fromPrev ? "Already completed! ✓" : "Listening complete!"}
            </h3>
            {fromPrev && <p className="text-xs text-green-700 italic mb-1">Your last score</p>}
            <p className="text-3xl font-bold text-green-600 mb-2">{displayPct}%</p>
            <p className="text-sm text-green-700">{displayScore} / {displayTotal} correct</p>
            {!fromPrev && wrongCount > 0 && (
              <Button onClick={restart} className="mt-4 w-full gap-2">
                <RotateCcw className="w-4 h-4" /> Retry {wrongCount} wrong answer{wrongCount !== 1 ? "s" : ""}
              </Button>
            )}
            <Button onClick={restart} variant="outline" className="mt-2 w-full gap-2">
              <RotateCcw className="w-4 h-4" /> {fromPrev ? "Try again" : wrongCount > 0 ? "Start over" : "Try again"}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{current + 1} / {phrasePool.length}</span>
        <span className="font-semibold text-primary" aria-live="polite">Score: {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
          <Card className="border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-900">{phrase.phrase_en}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Listen to the Swedish phrase:</p>
                <button
                  onClick={() => playAudio(phrase.phrase_sv, "sv-SE", 1)}
                  aria-label="Play Swedish phrase audio"
                  className="w-full p-4 rounded-xl border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 font-semibold text-primary"
                >
                  <Volume2 className="w-5 h-5" /> Play audio
                </button>
              </div>

              {isTranscribe ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={typed}
                    onChange={e => setTyped(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !answered) handleAnswer(typed); }}
                    disabled={answered}
                    placeholder="Type what you hear..."
                    aria-label="Type what you hear in Swedish"
                    className="w-full border-2 border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                  <div className="flex gap-2 text-sm text-muted-foreground">
                    {["å", "ä", "ö"].map(c => (
                      <button key={c} onClick={() => setTyped(t => t + c)}
                        aria-label={`Insert ${c}`}
                        className="px-2.5 py-1 min-h-[44px] min-w-[44px] border rounded-lg hover:bg-muted transition-colors font-medium">{c}</button>
                    ))}
                  </div>
                  {!answered && (
                    <div className="flex gap-2">
                      <Button onClick={handleListening} disabled={listening} className="flex-1 gap-2">
                        <Mic className={`w-4 h-4 ${listening ? "animate-pulse" : ""}`} />
                        {listening ? "Listening..." : "Tap to record"}
                      </Button>
                      <Button onClick={() => handleAnswer(typed)} className="flex-1">Check</Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Choose the correct phrase:</p>
                  <div className="space-y-2">
                    {phrase.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelected(idx); handleAnswer(opt); }}
                        disabled={answered}
                        aria-label={
                          answered
                            ? idx === phrase.correct_index
                              ? `${opt} — correct answer`
                              : idx === selected
                              ? `${opt} — incorrect selection`
                              : opt
                            : opt
                        }
                        className={`w-full p-3 rounded-xl border-2 text-left text-sm font-medium transition-all flex items-center justify-between gap-2 ${
                          answered
                            ? idx === phrase.correct_index
                              ? "border-green-400 bg-green-50"
                              : idx === selected
                              ? "border-red-400 bg-red-50 opacity-80"
                              : "border-border/30 opacity-40"
                            : "border-border/50 hover:border-primary/40 hover:bg-muted/50"
                        }`}
                      >
                        <span>{opt}</span>
                        {answered && idx === phrase.correct_index && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                        {answered && idx === selected && idx !== phrase.correct_index && <XCircle className="w-4 h-4 text-red-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {answered && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                  <div aria-live="assertive" className={`p-3 rounded-lg ${correct ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                    <p className={`text-sm font-semibold ${correct ? "text-green-700" : "text-red-700"}`}>
                      {correct ? "✓ Correct!" : `✗ Answer: ${phrase.phrase_sv}`}
                    </p>
                  </div>
                  <Button onClick={handleNext} className="w-full">
                    {current + 1 >= phrases.length ? "See results" : "Next"}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}