import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { buildMockTest } from "@/data/listeningBankC";
import { loadListeningCategories } from "@/lib/listening";
import { Session } from "@/pages/ListeningTest";

// Delprov Hörförståelse, shaped like the nationella provet: one listening text
// of every type in exam order, each heard at most twice, with the questions
// after each text — all inside the Provdag, graded as you go.
export default function ListeningPart({ course, onResult, onExit }) {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["listeningBank", course],
    queryFn: () => loadListeningCategories(course),
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
        <Loader2 className="animate-spin w-5 h-5" /> Laddar hörförståelse…
      </div>
    );
  }

  const items = buildMockTest(categories || []);
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground py-6 text-center">Det finns inget hörförståelsetest för den här kursen än.</p>;
  }

  return (
    <Session
      course={course}
      title={`Nationellt prov ${course.toUpperCase()}: Hörförståelse`}
      sourceId={`np-listening-${course.toLowerCase()}`}
      items={items}
      mode="test"
      exitLabel="Till tidsplanen"
      onExit={onExit}
      onComplete={(score, total) => onResult({ part: "listening", score, total, percent: Math.round((score / total) * 100) })}
    />
  );
}