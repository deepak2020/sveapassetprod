import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useMissions } from "@/hooks/useWritingMissions";
import VocabDrill from "@/components/writing-missions/VocabDrill";

// Practice the topic's words both ways before writing the mission.
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-24 md:pb-10 space-y-5">
      <Link
        to={`/writing-missions/${mission.id}`}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {mission.title}
      </Link>

      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold">Öva orden</h1>
        <p className="text-sm text-muted-foreground">
          {mission.words?.length || 0} ord ur uppdraget, båda vägarna.{" "}
          <span className="italic">Learn the topic words first: Swedish → English and English → Swedish.</span>
        </p>
      </div>

      <VocabDrill mission={mission} />
    </div>
  );
}