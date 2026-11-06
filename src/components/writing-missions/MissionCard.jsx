import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import ProgressRing from "@/components/writing-missions/ProgressRing";
import { estimateMinutes, missionType, progressPercent, nextStage } from "@/lib/writingMissions";

// One mission in the list: progress ring, estimated time and a resume button.
export default function MissionCard({ mission, progress }) {
  const meta = missionType(mission.type);
  const percent = progressPercent(progress);
  const stage = progress?.completed_stages?.length ? nextStage(progress) : 1;
  const started = (progress?.completed_stages || []).length > 0;

  return (
    <Link
      to={`/writing-missions/${mission.id}?stage=${stage}`}
      className="group block rounded-2xl border border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        <ProgressRing value={percent} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm leading-tight">{mission.title}</p>
          <p className="text-[11px] italic text-muted-foreground truncate">{mission.topic}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" /> {estimateMinutes(mission)} min
            </span>
            <span>
              {mission.min_words}–{mission.max_words} ord
            </span>
            <span className={`rounded-full border px-1.5 py-0.5 font-medium ${meta.tone}`}>{meta.label}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-[11px] text-muted-foreground">
          {started ? `Steg ${stage} av 7 · fortsätt där du var` : "Ny · sju korta steg"}
        </p>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
          {started ? "Fortsätt" : "Börja"}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}