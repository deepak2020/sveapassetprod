import { useState } from "react";
import { ChevronDown, Eye, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpeakButton from "@/components/shared/SpeakButton";
import WarmUp from "@/components/writing-missions/WarmUp";
import { missionType } from "@/lib/writingMissions";

// Stage 1 — the task itself, the points, the word range and the model text.
export default function BriefingStage({ mission, warmUp = [], onNext }) {
  const [showModel, setShowModel] = useState(false);
  const meta = missionType(mission.type);

  return (
    <div className="space-y-4">
      <WarmUp pairs={warmUp} />

      <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
        <div className="space-y-1">
          <span className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold ${meta.tone}`}>
            {meta.label} · <span className="italic font-normal">{meta.en}</span>
          </span>
          <h1 className="font-display text-2xl font-bold leading-tight">{mission.title}</h1>
          <p className="text-[11px] italic text-muted-foreground">{mission.topic}</p>
        </div>

        <p className="text-sm leading-relaxed">{mission.task_sv}</p>

        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Ta med det här · <span className="italic normal-case">Include these points</span>
          </p>
          <ul className="space-y-1.5">
            {(mission.points_to_include || []).map((point) => (
              <li key={point} className="flex gap-2 text-sm leading-snug">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="rounded-xl bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          {mission.min_words}–{mission.max_words} ord · {mission.time_limit_minutes} min i provläge
        </p>

        <button
          type="button"
          onClick={() => setShowModel((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-border/60 px-3 py-2.5 text-sm font-medium"
        >
          <span className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-muted-foreground" /> {showModel ? "Dölj exempeltext" : "Visa exempeltext"}
          </span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showModel ? "rotate-180" : ""}`} />
        </button>

        {showModel && (
          <div className="rounded-xl bg-muted/40 p-3 space-y-2">
            <div className="flex items-start gap-2">
              <p className="flex-1 text-sm leading-relaxed">{mission.model_text}</p>
              <SpeakButton text={mission.model_text} ariaLabel="Läs upp exempeltexten" />
            </div>
            <p className="text-[11px] italic text-muted-foreground">
              Model text · read it, do not copy it word for word
            </p>
          </div>
        )}
      </div>

      <p className="rounded-xl bg-primary/5 px-4 py-3 text-xs text-foreground/80">
        Du ska lära dig orden först och sedan skriva själv.{" "}
        <span className="italic text-muted-foreground">Learn the words first, then write on your own.</span>
      </p>

      <Button onClick={onNext} className="w-full gap-2">
        <PenSquare className="w-4 h-4" /> Nästa: Ord
      </Button>
    </div>
  );
}