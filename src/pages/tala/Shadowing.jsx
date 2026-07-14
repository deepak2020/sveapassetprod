import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Headphones, Volume2, Loader2, Check, RotateCw, Trophy } from "lucide-react";
import PageSEO from "@/components/shared/PageSEO";
import LoginGate from "@/components/shared/LoginGate";
import { useAuth } from "@/lib/AuthContext";
import { useSpeech } from "@/hooks/useSpeech";
import { prefetchTts } from "@/lib/tts";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { similarityPercent } from "@/lib/similarity";
import { shuffle } from "@/lib/shuffle";
import MicButton from "@/components/tala/MicButton";

const LEVELS = ["A1", "A2", "B1", "B2"];
const ROUND_SIZE = 6;

export default function Shadowing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { speak, speaking } = useSpeech();
  const queryClient = useQueryClient();

  const [level, setLevel] = useState("A2");
  const [phase, setPhase] = useState("intro"); // intro | listen | repeat | feedback | done
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(0);
  const [lastResult, setLastResult] = useState(null); // { match, transcript, target }
  const [scores, setScores] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [showText, setShowText] = useState(true);

  const { data: pool = [], isLoading } = useQuery({
    queryKey: ["shadowing-chunks", level],
    queryFn: () => base44.entities.ShadowingChunk.filter({ level }),
    enabled: isAuthenticated,
  });

  const current = queue[index];

  const { listening, interim, supported, toggle, stop } = useSpeechRecognition({
    onFinal: (transcript) => handleTranscript(transcript),
  });

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await base44.functions.invoke("generateShadowingBatch", { level, count: 10 });
      if (res?.data?.sentences?.length) {
        queryClient.invalidateQueries({ queryKey: ["shadowing-chunks", level] });
      }
    } finally {
      setGenerating(false);
    }
  };

  const startRound = () => {
    if (!pool.length) return;
    const picked = shuffle(pool).slice(0, ROUND_SIZE);
    // Warm up Azure TTS for the whole round so first playback uses the cached URL.
    picked.forEach((s) => prefetchTts(s.text_sv));
    setQueue(picked);
    setIndex(0);
    setScores([]);
    setPhase("listen");
  };

  // Auto-play the sentence when entering "listen" phase.
  // Prefetch the *next* sentence at the same time so its Azure URL is cached
  // before we advance — keeps playback in the Azure path, not the browser fallback.
  useEffect(() => {
    if (phase === "listen" && current) {
      const t = setTimeout(() => speak(current.text_sv, "sv-SE"), 300);
      const nextItem = queue[index + 1];
      if (nextItem) prefetchTts(nextItem.text_sv);
      return () => clearTimeout(t);
    }
  }, [phase, current, index, queue, speak]);

  const goRepeat = () => {
    setShowText(false);
    setPhase("repeat");
  };

  const handleTranscript = (transcript) => {
    if (!current || phase !== "repeat") return;
    if (listening) stop();
    const match = similarityPercent(transcript, current.text_sv);
    setLastResult({ match, transcript, target: current.text_sv });
    setScores((s) => [...s, match]);

    if (isAuthenticated) {
      base44.entities.SpeakingDrillResult.create({
        station: "shadowing",
        prompt: current.text_sv,
        expected: current.text_sv,
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
    setShowText(true);
    if (index + 1 >= queue.length) {
      setPhase("done");
      return;
    }
    setIndex((i) => i + 1);
    setPhase("listen");
  };

  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <PageSEO title="Shadowing · Tala · Sveapasset" description="Härma Svea för uttal och rytm." />
        <LoginGate title="Shadowing" description="Log in to practice shadowing Swedish audio." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <PageSEO title="Shadowing · Tala · Sveapasset" description="Härma Svea för uttal och rytm." />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/tala")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold flex items-center gap-2">
            <Headphones className="w-5 h-5 text-blue-500" /> Shadowing
          </h1>
          <p className="text-xs text-muted-foreground">
            Lyssna → härma direkt · <span className="italic">Listen → repeat instantly</span>
          </p>
        </div>
      </div>

      {phase === "intro" && (
        <Card className="border-2 border-blue-300 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20">
          <CardContent className="p-6 space-y-5">
            <div className="text-center space-y-2">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 items-center justify-center">
                <Headphones className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold">Härma Svea</h2>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Du hör en mening två gånger, sedan säger du den själv. Vi mäter hur nära du kom.
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Nivå
              </p>
              <div className="grid grid-cols-4 gap-2">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`py-2.5 rounded-lg border-2 text-sm font-bold transition-all ${
                      level === l
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-blue-200 dark:border-blue-800/60 bg-white/60 dark:bg-black/20 hover:border-blue-400"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {isLoading ? "Laddar…" : `${pool.length} meningar tillgängliga`}
              </p>
            </div>

            {!supported && (
              <p className="text-xs text-red-600 dark:text-red-400 text-center">
                Din webbläsare stödjer inte röstinspelning. Prova Chrome eller Edge.
              </p>
            )}

            <div className="flex gap-2">
              {pool.length < ROUND_SIZE ? (
                <Button
                  onClick={generate}
                  disabled={generating}
                  size="lg"
                  className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Skapar meningar…
                    </>
                  ) : (
                    <>
                      <Headphones className="w-4 h-4" /> Skapa {level}-meningar
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={startRound}
                    disabled={!supported}
                    size="lg"
                    className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0"
                  >
                    <Headphones className="w-4 h-4" /> Starta ({ROUND_SIZE} meningar)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={generate}
                    disabled={generating}
                    size="lg"
                    title="Skapa fler meningar"
                  >
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCw className="w-4 h-4" />}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {(phase === "listen" || phase === "repeat") && current && (
        <Card className="border-2 border-blue-300 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold">Mening {index + 1} / {queue.length}</span>
              <span>Nivå {level}</span>
            </div>

            {phase === "listen" && (
              <>
                <div className="text-center py-6 space-y-4">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    Steg 1 · Lyssna
                  </p>
                  {showText ? (
                    <p className="font-display text-2xl sm:text-3xl font-semibold leading-snug">
                      {current.text_sv}
                    </p>
                  ) : (
                    <p className="font-display text-2xl italic text-muted-foreground">
                      🔊 …
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground italic">{current.text_en}</p>
                  {current.chunk_hint && (
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      🧠 Chunk: <strong>{current.chunk_hint}</strong>
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-center gap-3">
                  <Button
                    onClick={() => speak(current.text_sv, "sv-SE")}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Volume2 className={`w-4 h-4 ${speaking ? "text-primary animate-pulse" : ""}`} />
                    Spela upp igen
                  </Button>
                  <Button
                    onClick={goRepeat}
                    disabled={!supported}
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0"
                  >
                    Jag är redo — härma!
                  </Button>
                </div>
              </>
            )}

            {phase === "repeat" && (
              <>
                <div className="text-center py-6 space-y-3">
                  <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
                    Steg 2 · Härma
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tryck på mikrofonen och säg meningen så exakt du kan.
                  </p>
                  {interim && (
                    <p className="text-base italic text-foreground min-h-[1.5rem]">
                      🎙️ {interim}
                    </p>
                  )}
                </div>
                <div className="flex justify-center">
                  <MicButton listening={listening} onToggle={toggle} />
                </div>
                <div className="text-center">
                  <button
                    onClick={() => {
                      setShowText(true);
                      speak(current.text_sv, "sv-SE");
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Behöver du höra igen?
                  </button>
                </div>
                {showText && (
                  <p className="text-center font-display text-lg opacity-70">
                    {current.text_sv}
                  </p>
                )}
              </>
            )}
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
          <CardContent className="p-6 space-y-4 text-center">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Match
            </p>
            <p className="font-display text-5xl font-bold">
              {lastResult.match}%
            </p>
            <p className="text-sm">
              {lastResult.match >= 80
                ? "Utmärkt rytm! 🎯"
                : lastResult.match >= 50
                ? "Bra försök — lyssna igen och prova."
                : "Nästan där — härma rytmen närmare."}
            </p>
            <div className="space-y-1 pt-2">
              <p className="text-xs text-muted-foreground">Målet:</p>
              <p className="font-display text-lg">{lastResult.target}</p>
              <p className="text-xs text-muted-foreground pt-2">Du sa:</p>
              <p className="text-sm italic">"{lastResult.transcript || "(inget hörbart)"}"</p>
            </div>
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
        <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/10 to-blue-50 dark:from-primary/15 dark:to-blue-950/30">
          <CardContent className="p-6 text-center space-y-4">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 items-center justify-center mx-auto">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold">Pass klart!</h2>
            <p className="font-display text-4xl font-bold">{avgScore}%</p>
            <p className="text-sm text-muted-foreground">
              Genomsnittlig match över {queue.length} meningar
            </p>
            <div className="flex justify-center gap-2 pt-2">
              <Button variant="outline" onClick={() => navigate("/tala")}>
                Till Tala
              </Button>
              <Button onClick={startRound} className="gap-2">
                <Headphones className="w-4 h-4" /> En runda till
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}