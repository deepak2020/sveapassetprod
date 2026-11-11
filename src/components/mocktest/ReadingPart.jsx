import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import QuizRunner from "@/components/shared/QuizRunner";
import { LEVEL_INFO } from "@/lib/nationalTest";

// Every attempt draws a different kind of text, so the reading block never
// serves the same exam twice.
const READING_TYPES = [
  "ett meddelande eller en chattkonversation",
  "en annons från en bostads- eller jobbsajt",
  "en artikel från en lokaltidning",
  "ett brev från en myndighet eller ett företag",
  "ett informationsblad från kommunen",
  "ett inlägg i ett forum eller på sociala medier",
  "en lapp eller ett anslag på en arbetsplats",
];

const TOPICS = [
  "fritidsgården i området",
  "en second hand-butik",
  "kollektivtrafik och förseningar",
  "en förening som söker medlemmar",
  "ett besök på vårdcentralen",
  "att flytta till en ny stadsdel",
  "ett sommarjobb",
  "matbutikens öppettider och erbjudanden",
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

export default function ReadingPart({ course, round, onComplete }) {
  const info = LEVEL_INFO[course];
  const { data, isLoading } = useQuery({
    queryKey: ["np-reading", course, round],
    staleTime: Infinity,
    queryFn: () => {
      const textType = pick(READING_TYPES);
      const topic = pick(TOPICS);
      return base44.integrations.Core.InvokeLLM({
        prompt: `Skapa en läsförståelseuppgift i stil med SFI nationellt prov kurs ${course} (CEFR ${info.cefr}).
Den här gången är texttypen ${textType} och ämnet ${topic}.
Skriv en autentisk svensk text på ${info.words} ord om vardagsliv, arbete eller samhälle i Sverige.
Skapa sedan 6 flervalsfrågor på svenska om texten med 4 alternativ var, exakt ett rätt svar. Frågorna ska testa både detaljer och huvudbudskap, och minst två frågor ska handla om sådant som inte står rakt ut i texten. Ge engelsk översättning av varje fråga.`,
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
      });
    },
  });

  if (isLoading) return <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center"><Loader2 className="animate-spin w-5 h-5" /> Skapar läsprov…</div>;

  return (
    <div className="space-y-6">
      <article className="rounded-2xl border border-border/50 bg-card p-5 space-y-3 lesson-text">
        <h3 className="text-lg font-bold">{data.title}</h3>
        <p className="whitespace-pre-line leading-relaxed text-sm">{data.text}</p>
      </article>
      <QuizRunner key={round} questions={data.questions} quizType="language" sourceId={`np-reading-${course}`} sourceTitle={`Nationellt prov ${course}: Läsa`} onComplete={onComplete} />
    </div>
  );
}