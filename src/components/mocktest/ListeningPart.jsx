import { useEffect, useState } from "react";
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

  // Draw one clip per type once per attempt and keep that list fixed for the
  // whole session. Re-drawing it on a re-render used to swap the clips
  // mid-session, so the questions on screen no longer matched the clip being
  // played (or the answers already given).
  const [items, setItems] = useState(null);
  useEffect(() => {
    if (categories && items === null) setItems(buildMockTest(categories));
  }, [categories, items]);

  const loading = (
    <div className="flex items-center gap-2 text-muted-foreground py-10 justify-center">
      <Loader2 className="animate-spin w-5 h-5" /> Laddar hörförståelse…
    </div>
  );
  const empty = <p className="text-sm text-muted-foreground py-6 text-center">Det finns inget hörförståelsetest för den här kursen än.</p>;

  if (isLoading) return loading;
  if (!categories) return empty;
  if (items === null) return loading;
  if (items.length === 0) return empty;

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