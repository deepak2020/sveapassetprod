import { useRef } from "react";
import { Loader2, Mic, MicOff, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

// Speak the answer, then edit the transcript before sending it for feedback.
export default function SpeakingResponse({ transcript, onChange, minWords, onSubmit, grading }) {
  const baseRef = useRef("");
  const { listening, interim, supported, error, start, stop } = useSpeechRecognition({
    lang: "sv-SE",
    continuous: true,
    onFinal: (text) => {
      if (!text) return;
      const base = baseRef.current.trim();
      onChange(base && base !== text ? `${base} ${text}` : text);
    },
  });

  const words = transcript.trim().split(/\s+/).filter(Boolean).length;

  const handleMic = () => {
    if (listening) {
      stop();
      return;
    }
    baseRef.current = transcript;
    start();
  };

  return (
    <div className="space-y-3">
      {supported ? (
        <div className="flex flex-col items-center gap-2 py-2">
          <button
            type="button"
            onClick={handleMic}
            aria-label={listening ? "Stoppa inspelningen" : "Börja prata"}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-md transition-all ${
              listening ? "bg-red-500 hover:bg-red-600 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            {listening && <span className="absolute inset-0 rounded-full bg-red-500/40 animate-ping" />}
            {listening ? <MicOff className="w-7 h-7 relative" /> : <Mic className="w-7 h-7" />}
          </button>
          <p className={`text-xs font-medium ${listening ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}`}>
            {listening ? "Spelar in… tryck för att stoppa" : "Tryck och tala svenska"}
          </p>
          {listening && interim && <p className="text-sm italic text-muted-foreground text-center">"{interim}"</p>}
        </div>
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          Mikrofonen stöds inte i den här webbläsaren — skriv ditt svar i stället.
        </p>
      )}

      {error && (
        <p className="text-center text-xs text-amber-600 dark:text-amber-400">
          Mikrofonen fungerade inte. Skriv svaret i stället.
        </p>
      )}

      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Din text <span className="normal-case font-normal italic">(rätta om något blev fel)</span>
        </p>
        <Textarea
          rows={7}
          value={transcript}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ditt tal skrivs här medan du pratar. Du kan också skriva direkt."
          disabled={grading}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className={`text-xs ${words >= minWords ? "text-emerald-600" : "text-muted-foreground"}`}>
          {words} / {minWords} ord
        </span>
        <Button onClick={onSubmit} disabled={grading || words < minWords} className="gap-2">
          {grading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {grading ? "Rättar…" : "Lämna in"}
        </Button>
      </div>
    </div>
  );
}