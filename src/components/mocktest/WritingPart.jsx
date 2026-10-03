import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LEVEL_INFO } from "@/lib/nationalTest";
import WritingFeedback from "./WritingFeedback";

export default function WritingPart({ course, round }) {
  const info = LEVEL_INFO[course];
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [grading, setGrading] = useState(false);

  const { data: task, isLoading } = useQuery({
    queryKey: ["np-writing", course, round],
    staleTime: Infinity,
    queryFn: () => base44.integrations.Core.InvokeLLM({
      prompt: `Skapa en skrivuppgift i stil med SFI nationellt prov kurs ${course} (CEFR ${info.cefr}). Till exempel ett mejl, ett brev eller en berättande/argumenterande text. Ge uppgiften på svenska med 3 punkter eleven ska ta upp.`,
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
      <Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder="Skriv din text här…" disabled={!!result} />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{wordCount} ord</span>
        {!result && <Button onClick={grade} disabled={grading || wordCount < 20}>{grading ? <Loader2 className="animate-spin" /> : null} Lämna in för bedömning</Button>}
      </div>
      {result && <WritingFeedback result={result} />}
    </div>
  );
}