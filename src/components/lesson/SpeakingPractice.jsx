import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Mic, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import SpeakButton from "@/components/shared/SpeakButton";

const fuzzyMatch = (userText, expectedText) => {
  const normalize = (text) => text.toLowerCase().trim().replace(/[.,!?]/g, "");
  const user = normalize(userText);
  const expected = normalize(expectedText);

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

export default function SpeakingPractice({ phrases, onComplete }) {
  const [expanded, setExpanded] = useState(null);
  const [listening, setListening] = useState(null);
  const [feedback, setFeedback] = useState({});

  // Auto-expand card when result arrives so feedback is immediately visible
  useEffect(() => {
    const latest = Object.keys(feedback).map(Number).sort((a, b) => b - a)[0];
    if (latest !== undefined) setExpanded(latest);
  }, [feedback]);

  // Mark section complete once every phrase has been attempted at least once
  useEffect(() => {
    if (!phrases || phrases.length === 0) return;
    if (Object.keys(feedback).length >= phrases.length) {
      onComplete?.();
    }
  }, [feedback, phrases, onComplete]);

  if (!phrases || phrases.length === 0) {
    return <p className="text-muted-foreground text-sm">No speaking phrases available.</p>;
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
          setFeedback((prev) => ({
            ...prev,
            [index]: { transcript, score, isCorrect }
          }));
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

  const attempted = Object.keys(feedback).length;
  const allAttempted = attempted >= phrases.length;

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
      <div className="w-full h-1.5 bg-muted rounded-full mb-3">
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
              onClick={() => setExpanded(isOpen ? null : i)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* SpeakButton stops propagation internally via its own onClick */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <SpeakButton
                        text={phrase.phrase_sv}
                        className="w-9 h-9 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 shrink-0"
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
                              className="h-7 px-2 text-xs gap-1"
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
