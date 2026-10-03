import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import QuizRunner from "@/components/shared/QuizRunner";
import { LEVEL_INFO } from "@/lib/nationalTest";

export default function ReadingPart({ course, round }) {
  const info = LEVEL_INFO[course];
  const { data, isLoading } = useQuery({
    queryKey: ["np-reading", course, round],
    staleTime: Infinity,
    queryFn: () => base44.integrations.Core.InvokeLLM({
      prompt: `Skapa en läsförståelseuppgift i stil med SFI nationellt prov kurs ${course} (CEFR ${info.cefr}).
Skriv en autentisk svensk text på ${info.words} ord (t.ex. ett meddelande, en annons, en artikel eller ett brev om vardagsliv, arbete eller samhälle i Sverige).
Skapa sedan 6 flervalsfrågor på svenska om texten med 4 alternativ var, exakt ett rätt svar. Frågorna ska testa både detaljer och huvudbudskap. Ge engelsk översättning av varje fråga.`,
      response_json_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          text: { type: "string" },
          questions: { type: "array", items: { type: "object", properties: {
            question_sv: { type: "string" }, question_en: { type: "string" },
            options: { type: "array", items: { type: "string" } }, correct_index: { type: "number" } } } },
        },
      },
    }),
  });

  if (isLoading) return <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center"><Loader2 className="animate-spin w-5 h-5" /> Skapar läsprov…</div>;

  return (
    <div className="space-y-6">
      <article className="rounded-2xl border border-border/50 bg-card p-5 space-y-3 lesson-text">
        <h3 className="text-lg font-bold">{data.title}</h3>
        <p className="whitespace-pre-line leading-relaxed text-sm">{data.text}</p>
      </article>
      <QuizRunner key={round} questions={data.questions} quizType="language" sourceId={`np-reading-${course}`} sourceTitle={`Nationellt prov ${course}: Läsa`} />
    </div>
  );
}