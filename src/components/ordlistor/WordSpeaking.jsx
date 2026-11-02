import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, CheckCircle2, AlertCircle, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { similarityPercent } from "@/lib/similarity";
import SpeakButton from "@/components/shared/SpeakButton";
import MicButton from "@/components/tala/MicButton";

const PASS = 70;

// Pronunciation practice: listen to the word, repeat it into the mic, and get
// an instant match score for that exact word.
export default function WordSpeaking({ words, title, onExit }) {
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [passed, setPassed] = useState(0);

  const word = words[idx];

  const { listening, interim, finalSoFar, error, supported, toggle } = useSpeechRecognition({
    lang: "sv-SE",
    onFinal: (text) => {
      if (!text) return;
      const pct = similarityPercent(text, word.sv);
      setResult({ said: text, pct });
      if (pct >= PASS) setPassed((n) => n + 1);
    },
  });

  const next = () => {
    setResult(null);
    setIdx((i) => (i + 1) % words.length);
  };

  if (!supported) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card p-6 text-center space-y-3">
        <MicOff className="w-8 h-8 mx-auto text-muted-foreground" />
        <p className="font-semibold">Mikrofonen stöds inte i den här webbläsaren</p>
        <p className="text-sm text-muted-foreground">Prova Chrome på dator eller Android. Du kan fortfarande lyssna på orden i flashkorten.</p>
        <Button onClick={onExit} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Tillbaka
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <button onClick={onExit} className="flex items-center gap-2 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Avsluta
        </button>
        <span>{idx + 1} / {words.length}</span>
        <span className="font-semibold text-emerald-600">{passed} godkända</span>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${((idx + 1) / words.length) * 100}%` }} />
      </div>

      <motion.div key={idx} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/50 bg-card p-6 space-y-5 text-center">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Säg ordet</p>

        <div className="flex items-center justify-center gap-3">
          <p className="text-3xl font-bold">{word.sv}</p>
          <SpeakButton text={word.sv} ariaLabel={`Listen to ${word.sv}`} />
        </div>
        <p className="text-sm text-muted-foreground italic">{word.en}</p>

        <div className="flex justify-center">
          <MicButton listening={listening} onToggle={toggle} />
        </div>

        <p className="text-xs text-muted-foreground min-h-[18px]">
          {listening ? (interim || "Lyssnar…") : finalSoFar || "Tryck på mikrofonen och säg ordet"}
        </p>

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Mikrofonfel ({error}) — försök igen
          </p>
        )}

        {result && (
          <div className={`rounded-xl border p-4 text-sm space-y-1 ${
            result.pct >= PASS
              ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-100"
              : "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 text-amber-900 dark:text-amber-100"
          }`}>
            <p className="font-semibold flex items-center justify-center gap-1.5">
              {result.pct >= PASS ? <><CheckCircle2 className="w-4 h-4" /> Bra uttal — {result.pct}%</> : <>Nästan — {result.pct}%</>}
            </p>
            <p className="text-xs">Vi hörde: <span className="italic">{result.said}</span></p>
            <p className="text-xs opacity-80">Mål: {word.sv}</p>
          </div>
        )}

        {result && (
          <Button onClick={next} className="w-full gap-1">
            {idx + 1 >= words.length ? "Börja om" : "Nästa ord"} <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </motion.div>

      {title && <p className="text-center text-xs italic text-muted-foreground">{title}</p>}
    </div>
  );
}