import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Camera, Keyboard, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LEVEL_INFO } from "@/lib/nationalTest";
import WritingFeedback from "./WritingFeedback";
import WritingUpload from "./WritingUpload";

// A new task type on every attempt, so "Gör om" never repeats the same prompt.
const WRITING_TYPES = [
  "ett personligt mejl till en vän",
  "ett formellt mejl till en myndighet, en hyresvärd eller en arbetsgivare",
  "en kort berättande text om något du varit med om",
  "en argumenterande text där du ger din åsikt",
  "en inbjudan till ett evenemang",
  "ett brev där du klagar på något och föreslår en lösning",
  "en ansökan till en kurs eller ett jobb",
];

const WRITING_TOPICS = [
  "att flytta till en ny lägenhet",
  "ett problem med kollektivtrafiken",
  "en kurs du vill gå",
  "en fest eller ett kalas",
  "arbetstider och schema",
  "en trasig vara du köpt",
  "att börja träna eller motionera",
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export default function WritingPart({ course, round, onResult }) {
  const info = LEVEL_INFO[course];
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [grading, setGrading] = useState(false);
  // Type the answer here, or write it by hand and upload a photo to have it checked.
  const [mode, setMode] = useState("type");

  const { data: task, isLoading } = useQuery({
    queryKey: ["np-writing", course, round],
    staleTime: Infinity,
    queryFn: () => base44.integrations.Core.InvokeLLM({
      prompt: `Skapa en skrivuppgift i stil med SFI nationellt prov kurs ${course} (CEFR ${info.cefr}).
Uppgiftstypen den här gången är ${pick(WRITING_TYPES)} och ämnet är ${pick(WRITING_TOPICS)}.
Ge uppgiften på svenska med 3 punkter eleven ska ta upp, och en tydlig mottagare.`,
      response_json_schema: { type: "object", properties: { task: { type: "string" }, points: { type: "array", items: { type: "string" } } } },
    }),
  });

  const grade = async () => {
    setGrading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Du är en SFI-lärare som bedömer skriftlig färdighet enligt nationellt prov kurs ${course} (CEFR ${info.cefr}). Betygsskala: F (ej godkänd), E, D, C, B, A.
Uppgift: ${task.task}\nPunkter: ${task.points?.join("; ")}\nElevens text:\n${text}
Bedöm innehåll, sammanhang, ordförråd och grammatik. Ge feedback på enkel svenska.`,
      response_json_schema: { type: "object", properties: {
        grade: { type: "string" }, summary: { type: "string" },
        strengths: { type: "array", items: { type: "string" } },
        improvements: { type: "array", items: { type: "string" } } } },
    });
    setResult(res);
    setGrading(false);
    if (onResult) onResult(res);
  };

  if (isLoading) return <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center"><Loader2 className="animate-spin w-5 h-5" /> Skapar skrivuppgift…</div>;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-2">
        <p className="font-semibold">{task.task}</p>
        <ul className="list-disc pl-5 text-sm text-muted-foreground">{task.points?.map((p) => <li key={p}>{p}</li>)}</ul>
        <p className="text-xs text-muted-foreground">Skriv {info.writeWords} ord.</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { id: "type", label: "Skriv här", icon: Keyboard },
          { id: "photo", label: "Fota ditt svar", icon: Camera },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-medium transition-colors ${
              mode === id ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {mode === "photo" ? (
        <WritingUpload
          course={course}
          cefr={info.cefr}
          task={task.task}
          points={task.points}
          onResult={(res) => {
            setResult(res);
            if (onResult) onResult(res);
          }}
        />
      ) : (
        <>
          <Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Skriv din text här…" disabled={!!result} />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{wordCount} ord</span>
            {!result && <Button onClick={grade} disabled={grading || wordCount < 20}>{grading ? <Loader2 className="animate-spin" /> : null} Lämna in för bedömning</Button>}
          </div>
          {result && <WritingFeedback result={result} />}
        </>
      )}
    </div>
  );
}