import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { usePageView } from "@/hooks/usePageView";
import { base44 } from "@/api/base44Client";
import { useQueryClient } from "@tanstack/react-query";
import { awardXP, XP_REWARDS } from "@/lib/xp";
import { Headphones, Play, Square, ArrowRight, RotateCcw, Trophy, ChevronLeft, Volume2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { getListeningTest } from "@/data/listeningTestsC";
import { getBestVoice } from "@/lib/speech";
import { normalizeAnswer } from "@/lib/normalizeAnswer";

function isCorrect(q, answer) {
  if (q.type === "open") {
    return q.accept.some((a) => normalizeAnswer(a) === normalizeAnswer(answer));
  }
  return answer === q.correctIndex;
}

const MAX_PLAYS = 2;

// Read a transcript aloud with the browser's speech synthesis, using a
// different voice (or pitch) per speaker so dialogues sound like two people.
// Used as fallback until pre-generated audio files (audioUrl) exist.
function speakTranscript(item, { onEnd } = {}) {
  const ss = window.speechSynthesis;
  if (!ss) { onEnd?.(); return; }
  ss.cancel();

  const svVoices = (ss.getVoices() || []).filter((v) => v.lang === "sv-SE" || v.lang.startsWith("sv"));
  const best = getBestVoice("sv-SE");
  const speakers = [...new Set(item.transcript.map((l) => l.speaker))];

  item.transcript.forEach((line, i) => {
    const u = new SpeechSynthesisUtterance(line.text);
    u.lang = "sv-SE";
    const speakerIdx = speakers.indexOf(line.speaker);
    // Give each speaker a distinct voice when several Swedish voices exist;
    // otherwise vary the pitch so turns are still distinguishable.
    if (svVoices.length > 1) {
      u.voice = svVoices[speakerIdx % svVoices.length];
    } else if (best) {
      u.voice = best;
    }
    u.pitch = speakerIdx % 2 === 0 ? 1 : 0.82;
    u.rate = 0.9;
    if (i === item.transcript.length - 1) u.onend = () => onEnd?.();
    ss.speak(u);
  });
}

function stopSpeech() {
  window.speechSynthesis?.cancel();
}

function AudioPlayer({ item, playsLeft, onPlayStart }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  // Stop any ongoing playback when the item changes or on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      audioRef.current?.pause();
    };
  }, [item.id]);

  const handlePlay = () => {
    if (playing || playsLeft <= 0) return;
    onPlayStart();
    setPlaying(true);
    if (item.audioUrl) {
      const audio = new Audio(item.audioUrl);
      audioRef.current = audio;
      audio.onended = () => setPlaying(false);
      audio.onerror = () => setPlaying(false);
      audio.play();
    } else {
      speakTranscript(item, { onEnd: () => setPlaying(false) });
    }
  };

  const handleStop = () => {
    stopSpeech();
    audioRef.current?.pause();
    setPlaying(false);
  };

  return (
    <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 flex items-center gap-4">
      <Button
        size="icon"
        className="w-12 h-12 rounded-full flex-shrink-0"
        onClick={playing ? handleStop : handlePlay}
        disabled={!playing && playsLeft <= 0}
        title={playing ? "Stoppa" : "Spela upp"}
      >
        {playing ? <Square className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
      </Button>
      <div className="min-w-0">
        <p className="font-semibold text-sm flex items-center gap-1.5">
          <Volume2 className="w-4 h-4 text-primary" />
          {playing ? "Spelar upp…" : playsLeft > 0 ? "Lyssna på klippet" : "Inga uppspelningar kvar"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Du kan lyssna {MAX_PLAYS} gånger · {playsLeft} {playsLeft === 1 ? "uppspelning" : "uppspelningar"} kvar
        </p>
      </div>
    </div>
  );
}

export default function ListeningTest() {
  usePageView("listening_test");
  const { course } = useParams();
  const test = getListeningTest(course);
  const queryClient = useQueryClient();

  const [phase, setPhase] = useState("intro"); // intro | running | results
  const [itemIndex, setItemIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // "itemIdx-qIdx" -> selected option index
  const [playsUsed, setPlaysUsed] = useState({}); // itemId -> count
  const [saved, setSaved] = useState(false);

  // Warm up the voice list (Chrome loads voices asynchronously)
  useEffect(() => {
    window.speechSynthesis?.getVoices();
  }, []);

  if (!test) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <Headphones className="w-12 h-12 text-muted-foreground mx-auto" />
        <h2 className="text-xl font-semibold">Det finns inget hörförståelsetest för den här kursen än.</h2>
        <Button asChild variant="outline"><Link to="/language-test">Tillbaka till Språktest</Link></Button>
      </div>
    );
  }

  const item = test.items[itemIndex];
  const isLastItem = itemIndex === test.items.length - 1;
  const allQuestions = test.items.flatMap((it, ii) => it.questions.map((q, qi) => ({ ...q, key: `${ii}-${qi}` })));
  const score = allQuestions.filter((q) => isCorrect(q, answers[q.key])).length;
  const percentage = Math.round((score / allQuestions.length) * 100);
  const itemAnswered = item?.questions.every((q, qi) => {
    const a = answers[`${itemIndex}-${qi}`];
    return q.type === "open" ? typeof a === "string" && a.trim() !== "" : a !== undefined;
  });

  const selectAnswer = (qIdx, value) => {
    setAnswers((prev) => ({ ...prev, [`${itemIndex}-${qIdx}`]: value }));
  };

  const handleNext = async () => {
    stopSpeech();
    if (!isLastItem) {
      setItemIndex((i) => i + 1);
      return;
    }
    if (!saved) {
      setSaved(true);
      await base44.entities.QuizResult.create({
        quiz_type: "listening",
        source_id: test.id,
        source_title: test.title,
        sfi_course: course.toUpperCase(),
        skill: "listening",
        score,
        total: allQuestions.length,
        percentage,
      });
      await awardXP(base44, score * XP_REWARDS.quiz_correct);
      queryClient.invalidateQueries({ queryKey: ["quizResults"] });
    }
    setPhase("results");
  };

  const resetTest = () => {
    stopSpeech();
    setPhase("intro");
    setItemIndex(0);
    setAnswers({});
    setPlaysUsed({});
    setSaved(false);
  };

  // ── INTRO ────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 pb-24 md:pb-12">
        <Link to="/language-test" className="text-sm text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Språktest
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Headphones className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{test.title}</h1>
            <p className="text-sm text-muted-foreground">Mock listening test · SFI kurs {course.toUpperCase()}</p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-border/50 bg-card p-6 mt-6 space-y-4">
          <h2 className="font-semibold">Så här fungerar det · <span className="italic font-normal text-muted-foreground">How it works</span></h2>
          <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
            <li>Testet har {test.items.length} ljudklipp och {allQuestions.length} frågor.</li>
            <li>Du kan lyssna på varje klipp högst {MAX_PLAYS} gånger — precis som på det nationella provet.</li>
            <li>Läs frågorna innan du lyssnar. Du kan svara medan du lyssnar.</li>
            <li>Du kan inte gå tillbaka till ett tidigare klipp.</li>
          </ul>
          <p className="text-xs text-muted-foreground italic">
            The test has {test.items.length} audio clips and {allQuestions.length} questions. You may listen to each clip at most {MAX_PLAYS} times. Read the questions before you listen — you can answer while listening, but you can't go back to a previous clip.
          </p>
        </div>

        <Button className="w-full mt-6 gap-2" size="lg" onClick={() => setPhase("running")}>
          Starta testet <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  // ── RESULTS ──────────────────────────────────────────────────────
  if (phase === "results") {
    const emoji = percentage >= 80 ? "🎉" : percentage >= 60 ? "👍" : "💪";
    const msg = percentage >= 80 ? "Utmärkt jobbat!" : percentage >= 60 ? "Bra jobbat!" : "Fortsätt öva!";
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="text-center mb-10">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="text-6xl mb-4">{emoji}</div>
            <h2 className="font-display text-3xl font-bold mb-2">{msg}</h2>
            <p className="text-muted-foreground mb-6">{score} / {allQuestions.length} rätt · {percentage}%</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={resetTest} variant="outline" className="gap-2"><RotateCcw className="w-4 h-4" /> Försök igen</Button>
              <Button asChild className="gap-2"><Link to="/language-test"><Trophy className="w-4 h-4" /> Fler test</Link></Button>
            </div>
          </motion.div>
        </div>

        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Genomgång · Review</h3>
        <div className="space-y-6">
          {test.items.map((it, ii) => (
            <div key={it.id} className="rounded-2xl border-2 border-border/50 bg-card p-5">
              <p className="font-semibold text-sm mb-1">{it.typeEmoji} {it.typeLabel}: {it.intro}</p>
              <details className="mb-3">
                <summary className="text-xs text-primary cursor-pointer hover:underline">Visa utskrift · Show transcript</summary>
                <div className="mt-2 space-y-1 text-sm text-muted-foreground border-l-2 border-border pl-3">
                  {it.transcript.map((line, li) => (
                    <p key={li}><span className="font-semibold text-foreground">{line.speaker}:</span> {line.text}</p>
                  ))}
                </div>
              </details>
              <div className="space-y-3">
                {it.questions.map((q, qi) => {
                  const sel = answers[`${ii}-${qi}`];
                  const correct = isCorrect(q, sel);
                  const userAnswer = q.type === "open" ? sel : sel !== undefined ? q.options[sel] : undefined;
                  const correctAnswer = q.type === "open" ? q.accept[0] : q.options[q.correctIndex];
                  return (
                    <div key={qi} className="text-sm">
                      <p className="font-medium flex items-start gap-1.5">
                        {correct
                          ? <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          : <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />}
                        {q.q}
                      </p>
                      <p className="text-xs text-muted-foreground ml-6 mt-0.5">
                        {!correct && userAnswer !== undefined && <>Ditt svar: <span className="text-destructive">{userAnswer}</span> · </>}
                        Rätt svar: <span className="text-emerald-600 dark:text-emerald-400 font-medium">{correctAnswer}</span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── RUNNING ──────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-12">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={resetTest} className="gap-1">
          <ChevronLeft className="w-4 h-4" /> Avsluta
        </Button>
        <span className="text-sm text-muted-foreground font-medium">
          Klipp {itemIndex + 1} av {test.items.length}
        </span>
        <Badge variant="outline">SFI {course.toUpperCase()}</Badge>
      </div>

      <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(itemIndex / test.items.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={itemIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">{item.typeEmoji} {item.typeLabel}</Badge>
            <p className="text-sm text-muted-foreground">{item.intro}</p>
          </div>

          <AudioPlayer
            item={item}
            playsLeft={MAX_PLAYS - (playsUsed[item.id] || 0)}
            onPlayStart={() => setPlaysUsed((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))}
          />

          <div className="space-y-6 mt-6">
            {item.questions.map((q, qi) => (
              <div key={qi}>
                <p className="font-semibold text-sm mb-3">{qi + 1}. {q.q}</p>
                {q.type === "open" ? (
                  <input
                    value={answers[`${itemIndex}-${qi}`] || ""}
                    onChange={(e) => selectAnswer(qi, e.target.value)}
                    placeholder="Skriv ditt svar här…"
                    className="w-full rounded-xl border-2 border-border/50 bg-card px-4 py-3 text-sm focus:outline-none focus:border-primary/60"
                  />
                ) : (
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const isSelected = answers[`${itemIndex}-${qi}`] === oi;
                    return (
                      <button
                        key={oi}
                        onClick={() => selectAnswer(qi, oi)}
                        className={`w-full text-left p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border/50 bg-card hover:border-primary/40 hover:bg-muted/50"
                        }`}
                      >
                        <span className="inline-flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-xs shrink-0">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
                )}
              </div>
            ))}
          </div>

          <Button className="w-full mt-8 gap-2" onClick={handleNext} disabled={!itemAnswered}>
            {isLastItem ? <>Visa resultat <Trophy className="w-4 h-4" /></> : <>Nästa klipp <ArrowRight className="w-4 h-4" /></>}
          </Button>
          {!itemAnswered && (
            <p className="text-center text-xs text-muted-foreground mt-2">Svara på alla frågor för att gå vidare</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
