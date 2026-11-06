import { Link } from "react-router-dom";
import { ArrowRight, Clock, PenSquare } from "lucide-react";
import ProgressRing from "@/components/writing-missions/ProgressRing";
import { useMissions, useMissionProgress } from "@/hooks/useWritingMissions";
import { useErrorLog, summarizeErrors } from "@/hooks/useErrorLog";
import { estimateMinutes, missionType, nextStage, progressPercent } from "@/lib/writingMissions";

// Connectors and word choice are the focus of the opinion missions, so a
// student who trips on those gets pointed there first.
const PREFERRED_TYPE = {
  connector: "opinion",
  word_choice: "opinion",
};

export default function DagensSkrivuppdragCard() {
  const { missions } = useMissions();
  const { progressFor } = useMissionProgress();
  const { errors } = useErrorLog(true);

  if (!missions.length) return null;

  const unfinished = missions.filter((m) => !(progressFor(m.id)?.completed_stages || []).includes(7));
  if (!unfinished.length) {
    return (
      <Link
        to="/writing-missions"
        className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40"
      >
        <span className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
          <PenSquare className="w-5 h-5 text-emerald-600" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Dagens skrivuppdrag</span>
          <span className="block text-xs text-muted-foreground">Alla uppdrag klara — välj ett att göra om</span>
        </span>
        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
      </Link>
    );
  }

  const topError = summarizeErrors(errors)[0];
  const preferredType = PREFERRED_TYPE[topError?.type];
  const started = unfinished.find((m) => (progressFor(m.id)?.completed_stages || []).length > 0);

  const mission =
    (preferredType && unfinished.find((m) => m.type === preferredType)) || started || unfinished[0];

  const progress = progressFor(mission.id);
  const stage = nextStage(progress);
  const meta = missionType(mission.type);

  return (
    <Link
      to={`/writing-missions/${mission.id}?stage=${stage}`}
      className="group block rounded-2xl border border-border/60 bg-gradient-to-r from-primary/5 via-card to-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <ProgressRing value={progressPercent(progress)} size={40} />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Dagens skrivuppdrag
          </p>
          <p className="text-sm font-semibold leading-tight truncate">{mission.title}</p>
          <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-[11px] text-muted-foreground">
            <span className={`rounded-full border px-1.5 py-0.5 font-medium ${meta.tone}`}>{meta.label}</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" /> {estimateMinutes(mission)} min
            </span>
            <span>steg {stage} av 7</span>
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}