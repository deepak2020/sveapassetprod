import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import QuizRunner from "@/components/shared/QuizRunner";
import { LEVEL_INFO } from "@/lib/nationalTest";
import { PART_META } from "@/lib/provdag";

// Turns a weak area (a part that scored low, or a concrete "att förbättra"
// point from the AI feedback) into a small auto-graded practice set.
export default function WeakAreaPractice({ course, part, focus }) {
  const [started, setStarted] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    enabled: started,
    queryKey: ["np-weak-area", course, part, focus],
    staleTime: Infinity,
    queryFn: () =>
      base44.integrations.Core.InvokeLLM({
        prompt: `Du är en SFI-lärare. Eleven läser SFI kurs ${course} (CEFR ${LEVEL_INFO[course].cefr}) och ska göra det nationella provet. Eleven behöver extra träning inom: ${focus}
Skapa ett kort övningspaket: en rubrik, en kort förklaring på enkel svenska (max 60 ord) om vad eleven ska tänka på, och 6 flervalsfrågor på svenska med 4 alternativ var där exakt ett är rätt. Frågorna ska träna exakt det svaga området. Ge engelsk översättning av varje fråga.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            explanation: { type: "string" },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  question_sv: { type: "string" },
                  question_en: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correct_index: { type: "number" },
                },
              },
            },
          },
        },
      }),
  });

  if (!started) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border/40 px-4 py-3">
        <div className="min-w-0">
          <p className="font-medium text-sm">{PART_META[part].sv}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{focus}</p>
        </div>
        <Button size="sm" variant="outline" className="gap-1 shrink-0" onClick={() => setStarted(true)}>
          <Sparkles className="w-4 h-4" /> Öva mer
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-6">
        <Loader2 className="w-4 h-4 animate-spin" /> Skapar övningar för {PART_META[part].sv.toLowerCase()}…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border/40 px-4 py-3">
        <p className="text-sm text-muted-foreground">Kunde inte skapa övningarna just nu.</p>
        <Button size="sm" variant="outline" onClick={() => refetch()}>Försök igen</Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-2">
        <h4 className="font-bold">{data.title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.explanation}</p>
      </div>
      <QuizRunner
        questions={data.questions}
        quizType="language"
        sourceId={`np-weak-${part}-${course}`}
        sourceTitle={`Extra övning: ${data.title}`}
      />
    </div>
  );
}