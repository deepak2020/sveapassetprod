import { useRef, useState } from "react";
import { ArrowLeft, Loader2, Mic, Square } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { LEVEL_INFO } from "@/lib/nationalTest";
import WritingFeedback from "./WritingFeedback";

export default function SpeakingSession({ course, task, onBack }) {
  const [recording, setRecording] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [interim, setInterim] = useState("");
  const [result, setResult] = useState(null);
  const [grading, setGrading] = useState(false);
  const recRef = useRef(null);
  const wantRef = useRef(false);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  const start = () => {
    const rec = new SR();
    rec.lang = "sv-SE";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let tmp = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript;
        if (e.results[i].isFinal) setFinalText((f) => `${f} ${t}`.trim());
        else tmp += t;
      }
      setInterim(tmp);
    };
    // Browsers stop after silence — restart so the user can keep talking
    rec.onend = () => { if (wantRef.current) rec.start(); else setRecording(false); };
    recRef.current = rec;
    wantRef.current = true;
    rec.start();
    setRecording(true);
  };

  const stop = () => { wantRef.current = false; recRef.current?.stop(); setInterim(""); };

  const submit = async () => {
    stop();
    setGrading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Du är en SFI-lärare som bedömer muntlig färdighet enligt nationellt prov kurs ${course} (CEFR ${LEVEL_INFO[course].cefr}). Betygsskala: F, E, D, C, B, A.
Uppgift: ${task}
Transkribering av elevens tal (taligenkänning, kan innehålla igenkänningsfel — bedöm inte stavning eller skiljetecken):
${finalText}
Bedöm innehåll, flyt och mängd, ordförråd, grammatik och hur väl uppgiften besvaras. Ge feedback på enkel svenska.`,
      response_json_schema: { type: "object", properties: {
        grade: { type: "string" }, summary: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        improvements: { type: "array", items: { type: "string" } } } },
    });
    setResult(res);
    setGrading(false);
  };

  const words = finalText ? finalText.split(/\s+/).length : 0;

  return (
    <div className="space-y-4">
      <button onClick={() => { stop(); onBack(); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /> Alla uppgifter</button>
      <div className="rounded-2xl border border-border/50 bg-card p-5"><p className="font-medium">{task}</p></div>
      {!SR ? (
        <p className="text-sm text-destructive">Din webbläsare stöder inte taligenkänning. Använd Chrome eller Edge.</p>
      ) : !result && (
        <div className="flex flex-col items-center gap-3 py-4">
          <button onClick={recording ? stop : start} disabled={grading}
            className={`w-20 h-20 rounded-full flex items-center justify-center text-primary-foreground ${recording ? "bg-destructive animate-pulse" : "bg-primary"}`}>
            {recording ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
          <p className="text-sm text-muted-foreground">{recording ? "Prata fritt… tryck för att pausa" : finalText ? "Tryck för att fortsätta prata" : "Tryck och börja prata"}</p>
        </div>
      )}
      {(finalText || interim) && (
        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 text-sm leading-relaxed min-h-[100px]">
          {finalText} <span className="text-muted-foreground">{interim}</span>
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