import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, X } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/AuthContext";
import LoginGate from "@/components/shared/LoginGate";
import PageSEO from "@/components/shared/PageSEO";
import MissionProgressBar from "@/components/missions/MissionProgressBar";
import BriefingStage from "@/components/missions/BriefingStage";
import OrdStage from "@/components/missions/OrdStage";
import FraserStage from "@/components/missions/FraserStage";
import RepeteraStage from "@/components/missions/RepeteraStage";
import ConversationView from "@/components/speaking-chat/ConversationView";
import { useMissionRecord, useSaveMissionProgress } from "@/hooks/useMissionProgress";

const STAGE_ORDER = ["briefing", "ord", "fraser", "repetera", "live"];

// The 5-stage mission player: Briefing → Ord → Fraser → Repetera → Live med Svea.
export default function MissionPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [stage, setStage] = useState("briefing");
  const [completedStages, setCompletedStages] = useState([]);
  const [restored, setRestored] = useState(false);
  const saveProgress = useSaveMissionProgress();
  const { data: savedRecord, isLoading: isLoadingRecord } = useMissionRecord(id);

  const { data: topic, isLoading, error } = useQuery({
    queryKey: ["speaking-topic", id],
    queryFn: () => supabase.speakingTopics.get(id),
    enabled: !!id && isAuthenticated,
  });

  // Restore saved progress once, on first load, so the user resumes where they left off.
  useEffect(() => {
    if (restored || isLoadingRecord) return;
    if (savedRecord) {
      setCompletedStages(savedRecord.stages_completed || []);
      if (savedRecord.last_stage && STAGE_ORDER.includes(savedRecord.last_stage)) {
        setStage(savedRecord.last_stage);
      }
    }
    setRestored(true);
  }, [savedRecord, isLoadingRecord, restored]);

  // When the user exits the Live stage, record the mission as fully complete.
  const handleExitLive = () => {
    if (id) saveProgress.mutate({ missionId: id, stageCompleted: "live", currentStage: "live" });
    navigate("/tala");
  };

  const markComplete = (s) => {
    setCompletedStages((prev) => (prev.includes(s) ? prev : [...prev, s]));
  };

  const goNext = () => {
    markComplete(stage);
    const idx = STAGE_ORDER.indexOf(stage);
    const next = idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : stage;
    if (next !== stage) setStage(next);
    if (id) saveProgress.mutate({ missionId: id, stageCompleted: stage, currentStage: next });
  };
  const goPrev = () => {
    const idx = STAGE_ORDER.indexOf(stage);
    if (idx > 0) {
      const prev = STAGE_ORDER[idx - 1];
      setStage(prev);
      if (id) saveProgress.mutate({ missionId: id, currentStage: prev });
    }
  };
  const jumpTo = (s) => {
    setStage(s);
    if (id) saveProgress.mutate({ missionId: id, currentStage: s });
  };

  const seoTitle = useMemo(
    () => (topic ? `${topic.title_sv} · Uppdrag · Sveapasset` : "Uppdrag · Sveapasset"),
    [topic]
  );

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <PageSEO title="Uppdrag · Sveapasset" description="Öva ett svenskt tal-uppdrag med Svea." />
        <LoginGate title="Speaking mission" description="Log in to start your speaking mission." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center space-y-4">
        <p className="text-muted-foreground">Uppdraget kunde inte hittas.</p>
        <Button asChild variant="outline"><Link to="/tala"><ArrowLeft className="w-4 h-4 mr-1.5" />Till Tala</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5">
      <PageSEO title={seoTitle} description={topic.description_en || `Öva ${topic.title_sv} med Svea.`} />

      {/* Top bar with exit + progress */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/tala")}
          className="shrink-0"
          aria-label="Avsluta uppdrag"
        >
          <X className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <MissionProgressBar
            currentStage={stage}
            completedStages={completedStages}
            onJump={jumpTo}
          />
        </div>
      </div>

      {/* Stage content */}
      {stage === "briefing" && <BriefingStage topic={topic} onNext={goNext} />}
      {stage === "ord" && <OrdStage topic={topic} onNext={goNext} onBack={goPrev} />}
      {stage === "fraser" && <FraserStage topic={topic} onNext={goNext} onBack={goPrev} />}
      {stage === "repetera" && <RepeteraStage topic={topic} onNext={goNext} onBack={goPrev} />}
      {stage === "live" && (
        <div className="space-y-3">
          <div className="text-center space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              🎤 Live med Svea
            </p>
            <p className="text-xs text-muted-foreground">
              Du är redo. Använd orden och fraserna du just övat.
            </p>
          </div>
          <ConversationView topic={topic} onExit={handleExitLive} />
        </div>
      )}
    </div>
  );
}