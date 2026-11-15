import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMissions } from "@/hooks/useWritingMissions";
import { printWorksheet } from "@/lib/worksheet";
import { wordLabel } from "@/lib/writingMissions";
import VocabDrill from "@/components/writing-missions/VocabDrill";
import WordTree from "@/components/writing-missions/WordTree";

// The topic's words in context, a two-way drill, and a printable sheet.
export default function WritingMissionWords() {
  const { missionId } = useParams();
  const { missions, loading } = useMissions();
  const mission = missions.find((m) => m.id === missionId);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-muted-foreground">Uppdraget finns inte.</p>
        <Link to="/writing-missions" className="text-sm font-medium text-primary">
          Till alla uppdrag
        </Link>
      </div>
    );
  }

  const printSheet = () => {
    printWorksheet({
      title: `Ord ur uppdraget: ${mission.title}`,
      directionLabel: "Engelska → Svenska",
      instruction: "Skriv det svenska ordet på raden. Ta med en/ett om du vill.",
      items: (mission.words || []).map((word, i) => ({
        n: i + 1,
        prompt: word.en,
        answer: wordLabel(word),
      })),
      footer: "Sveapasset · Skrivuppdrag",
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-10 space-y-5">
      <Link
        to={`/writing-missions/${mission.id}`}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {mission.title}
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold">Orden i uppdraget</h1>
          <p className="text-sm text-muted-foreground">
            {mission.words?.length || 0} ord i sitt sammanhang, båda vägarna.{" "}
            <span className="italic">Words in context, both directions.</span>
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={printSheet} className="gap-2 shrink-0">
          <Printer className="w-3.5 h-3.5" /> Skriv ut
        </Button>
      </div>

      <Tabs defaultValue="tree" className="space-y-3">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tree">Ordtrad</TabsTrigger>
          <TabsTrigger value="drill">Öva ord</TabsTrigger>
        </TabsList>
        <TabsContent value="tree">
          <WordTree mission={mission} />
        </TabsContent>
        <TabsContent value="drill">
          <VocabDrill mission={mission} />
        </TabsContent>
      </Tabs>
    </div>
  );
}