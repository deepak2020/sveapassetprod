import { useState } from "react";
import { ArrowLeft, Loader2, Mic, Square } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { LEVEL_INFO } from "@/lib/nationalTest";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import WritingFeedback from "./WritingFeedback";

export default function SpeakingSession({ course, task, onBack, onResult }) {
  const [spokenText, setSpokenText] = useState(""); // text committed from finished runs
  const [result, setResult] = useState(null);
  const [grading, setGrading] = useState(false);

  // Shared Swedish recogniser. It rebuilds each session's transcript from the
  // full results list and collapses Chrome's re-emitted repeats, instead of
  // appending every final result — which is what produced transcripts like
  // "jag jag berätta jag berätta nya jag berätta nya min …".
  const { listening, interim, finalSoFar, supported, start, stop } = useSpeechRecognition({
    lang: "sv-SE",
    continuous: true,
    onFinal: (text) => {
      if (text) setSpokenText((prev) => (prev ? `${prev} ${text}` : text).trim());
    },
  });

  // Everything captured so far: finished text plus words finalised in the
  // current run. The live partial is the fallback when nothing is final yet.
  const captured = [spokenText, finalSoFar].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
  const text = captured || interim.trim();
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0;

  const submit = async () => {
    stop();
    setGrading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Du är en SFI-lärare som bedömer muntlig färdighet enligt nationellt prov kurs ${course} (CEFR ${LEVEL_INFO[course].cefr}). Betygsskala: F, E, D, C, B, A.
Uppgift: ${task}
Transkribering av elevens tal (taligenkänning, kan innehålla igenkänningsfel — bedöm inte stavning eller skiljetecken):
${text}
Bedöm innehåll, flyt och mängd, ordförråd, grammatik och hur väl uppgiften besvaras. Ge feedback på enkel svenska.`,
      response_json_schema: { type: "object", properties: {
        grade: { type: "string" }, summary: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        improvements: { type: "array", items: { type: "string" } } } },
    });
    setResult(res);
    setGrading(false);
    if (onResult) onResult(res);
  };

  return (
    <div className="space-y-4">
      <button onClick={() => { stop(); onBack(); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /> Alla uppgifter</button>
      <div className="rounded-2xl border border-border/50 bg-card p-5"><p className="font-medium">{task}</p></div>
      {!supported ? (
        <p className="text-sm text-destructive">Din webbläsare stöder inte taligenkänning. Använd Chrome eller Edge.</p>
      ) : !result && (
        <div className="flex flex-col items-center gap-3 py-4">
          <button onClick={listening ? stop : start} disabled={grading}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-primary-foreground ${listening ? "bg-destructive animate-pulse" : "bg-primary"}`}>
            {listening ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
          <p className="text-sm text-muted-foreground">{listening ? "Prata fritt… tryck för att pausa" : captured ? "Tryck för att fortsätta prata" : "Tryck och börja prata"}</p>
        </div>
      )}
      {text && (
        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 text-sm leading-relaxed min-h-[100px]">
          {captured} <span className="text-muted-foreground">{interim}</span>
        </div>
      )}
      {!result && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{words} ord</span>
          <Button onClick={submit} disabled={grading || words < 15}>{grading && <Loader2 className="animate-spin" />} Skicka in för bedömning</Button>
        </div>
      )}
      {result && <WritingFeedback result={result} />}
    </div>
  );
}