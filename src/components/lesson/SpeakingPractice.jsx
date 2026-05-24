import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Mic, CheckCircle2, XCircle, RotateCcw, MicOff, Trophy } from "lucide-react";
import { normalizeAnswer } from "@/lib/normalizeAnswer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import SpeakButton from "@/components/shared/SpeakButton";
import { useExerciseProgress } from "@/hooks/useExerciseProgress";
import { base44 } from "@/api/base44Client";
import { awardXP, XP_REWARDS } from "@/lib/xp";

const fuzzyMatch = (userText, expectedText) => {
  const user = normalizeAnswer(userText);
  const expected = normalizeAnswer(expectedText);

  if (user === expected) return 1;

  let matches = 0;
  const minLen = Math.min(user.length, expected.length);
  for (let i = 0; i < minLen; i++) {
    if (user[i] === expected[i]) matches++;
  }
  return matches / expected.length;
};

const playSound = (isCorrect) => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    if (isCorrect) {
      oscillator.frequency.value = 800;
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } else {
      oscillator.frequency.value = 400;
      gain.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  } catch (_) {}
};

const speechSupported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

export default function SpeakingPractice({ phrases, onComplete, storageKey, userId, lessonId, tab, initialProgress, previousResult }) {
  const { load, save, clear } = useExerciseProgress(storageKey, userId, lessonId, tab);
  const saved = load();
  const [expanded, setExpanded] = useState(null);
  const [listening, setListening] = useState(null);
  const [feedback, setFeedback] = useState(() => saved?.feedback ?? {});
  const [manualDone, setManualDone] = useState(() => saved?.manualDone ?? {});
  const [finished, setFinished] = useState(() => !!previousResult);
  // Capture sizes of feedback/manualDone that were restored from storage on mount.
  // The completion effect only fires when the user adds something NEW this session.
  const initialFeedbackSize = useRef(Object.keys(saved?.feedback ?? {}).length);
  const initialManualSize = useRef(Object.keys(saved?.manualDone ?? {}).length);

  // Auto-expand card when result arrives so feedback is immediately visible
  useEffect(() => {
    const latest = Object.keys(feedback).map(Number).sort((a, b) => b - a)[0];
    if (latest !== undefined) setExpanded(latest);
  }, [feedback]);

  // Mark section complete once every phrase has been attempted or manually marked done
  useEffect(() => {
    if (!phrases || phrases.length === 0) return;
    const feedbackCount = Object.keys(feedback).length;
    const manualCount = Object.keys(manualDone).length;
    // Skip if nothing new was added beyond what was already in storage at mount
    if (feedbackCount <= initialFeedbackSize.current && manualCount <= initialManualSize.current) return;
    const attemptedCount = speechSupported ? feedbackCount : manualCount;
    if (attemptedCount >= phrases.length) {
      clear();
      setFinished(true);
      onComplete?.();
    }
  }, [feedback, manualDone, phrases]);

  if (!phrases || phrases.length === 0) {
    return <p className="text-muted-foreground text-sm">No speaking phrases available.</p>;
  }

  if (finished && Object.keys(feedback).length === 0 && Object.keys(manualDone).length === 0) {
    // Already completed in a previous session — show summary with option to practice again
    const pct = previousResult?.percentage ?? 100;
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="font-display text-2xl font-bold mb-1">Already completed! ✓</h3>
        <p className="text-sm text-muted-foreground italic mb-2">You practised all {phrases.length} phrases</p>
        <p className="text-4xl font-bold text-primary my-3">{pct}%</p>
        <Button onClick={() => setFinished(false)} variant="outline" className="gap-2 mt-2">
          <RotateCcw className="w-4 h-4" /> Practise again
        </Button>
      </motion.div>
    );
  }

  const handleRecord = (e, index) => {
    e.stopPropagation();
    if (listening === index) return;

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition not supported in your browser");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "sv-SE";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setListening(index);
      recognition.start();

      recognition.onresult = (event) => {
        if (event.results.length > 0) {
          const transcript = event.results[0][0].transcript;
          const score = fuzzyMatch(transcript, phrases[index].phrase_sv);
          const isCorrect = score >= 0.75;
          setFeedback((prev) => {
            const next = { ...prev, [index]: { transcript, score, isCorrect } };
            const correctCount = Object.values(next).filter(f => f.isCorrect).length;
            save({ current: Object.keys(next).length, score: correctCount, feedback: next });
            return next;
          });
          awardXP(base44, XP_REWARDS.speaking_attempted);
          playSound(isCorrect);
        }
        setListening(null);
      };

      recognition.onerror = () => setListening(null);
      recognition.onend = () => setListening(null);
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      setListening(null);
    }
  };

  const attempted = speechSupported ? Object.keys(feedback).length : Object.keys(manualDone).length;
  const allAttempted = attempted >= phrases.length;

  if (!speechSupported) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-800 dark:text-amber-300 mb-4">
          <MicOff className="w-4 h-4 shrink-0" />
          <span>Speech recognition isn't supported in this browser. Read each phrase aloud and mark it done manually.</span>
        </div>
        <div className="space-y-2">
          {phrases.map((p, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${manualDone[i] ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-card border-border"}`}>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{p.phrase_sv}</p>
                {p.phrase_en && <p className="text-xs text-muted-foreground">{p.phrase_en}</p>}
              </div>
              <SpeakButton text={p.phrase_sv} lang="sv-SE" />
              {manualDone[i]
                ? <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                : <button onClick={() => { awardXP(base44, XP_REWARDS.speaking_attempted); setManualDone(prev => { const next = { ...prev, [i]: true }; save({ current: Object.keys(next).length, score: Object.keys(next).length, manualDone: next }); return next; }); }} className="text-xs px-3 py-1.5 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-colors shrink-0">Done</button>
              }
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-muted-foreground">
          Tap the mic to record your pronunciation. {attempted}/{phrases.length} attempted.
        </p>
        {allAttempted && (
          <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Done
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-1.5 bg-muted rounded-full mb-3"
        role="progressbar"
        aria-valuenow={attempted}
        aria-valuemin={0}
        aria-valuemax={phrases.length}
        aria-label="Speaking practice progress"
      >
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${(attempted / phrases.length) * 100}%` }}
        />
      </div>

      {phrases.map((phrase, i) => {
        const fb = feedback[i];
        const isOpen = expanded === i;

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card
              className={`border-border/50 transition-colors cursor-pointer ${
                fb?.isCorrect
                  ? "border-green-300/60 bg-green-50/30"
                  : fb?.isCorrect === false
                  ? "border-orange-300/60"
                  : "hover:border-green-300/60"
              }`}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              aria-label={`${phrase.phrase_sv} — ${phrase.phrase_en}. ${fb ? (fb.isCorrect ? 'Correct' : 'Needs practice') : 'Not yet attempted'}`}
              onClick={() => setExpanded(isOpen ? null : i)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded(isOpen ? null : i); } }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* SpeakButton stops propagation internally via its own onClick */}
                    <div onClick={(e) => e.stopPropagation()} aria-label="Play phrase audio">
                      <SpeakButton
                        text={phrase.phrase_sv}
                        className="w-9 h-9 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 shrink-0"
                        ariaLabel="Play phrase audio"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-base leading-snug">{phrase.phrase_sv}</p>
                      <p className="text-sm text-muted-foreground">{phrase.phrase_en}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {fb?.isCorrect === true && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                    {fb?.isCorrect === false && <XCircle className="w-5 h-5 text-orange-500" />}
                    <Button
                      size="icon"
                      variant={listening === i ? "default" : "outline"}
                      className="w-9 h-9 rounded-xl"
                      aria-label={listening === i ? "Listening — recording in progress" : "Record pronunciation"}
                      onClick={(e) => handleRecord(e, i)}
                      disabled={listening === i}
                    >
                      <Mic className={`w-4 h-4 ${listening === i ? "animate-pulse" : ""}`} />
                    </Button>
                    {isOpen
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    }
                  </div>
                </div>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    aria-live="polite"
                    className="mt-3 pt-3 border-t border-border/50 space-y-3"
                  >
                    {phrase.pronunciation_tip && (
                      <div>
                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Pronunciation tip</p>
                        <p className="text-sm text-foreground">{phrase.pronunciation_tip}</p>
                      </div>
                    )}
                    {fb ? (
                      <div className={`p-3 rounded-lg ${fb.isCorrect ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"}`}>
                        <p className="text-xs font-semibold mb-1 text-foreground">You said:</p>
                        <p className="text-sm text-foreground italic mb-2">"{fb.transcript}"</p>
                        {fb.isCorrect ? (
                          <p className="text-xs font-semibold text-green-700">✓ Great pronunciation!</p>
                        ) : (
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-orange-700">Try again — check the tip above.</p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="min-h-[44px] px-2 text-xs gap-1"
                              onClick={(e) => handleRecord(e, i)}
                              disabled={listening === i}
                            >
                              <RotateCcw className="w-3 h-3" />
                              Try again
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">Tap the mic to record your pronunciation.</p>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
