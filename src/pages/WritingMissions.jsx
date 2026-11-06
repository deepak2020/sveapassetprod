import { Link } from "react-router-dom";
import { ArrowLeft, BookOpenCheck, Flame, PenSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useMissions, useMissionProgress, useMissionSubmissions } from "@/hooks/useWritingMissions";
import { useErrorLog, summarizeErrors } from "@/hooks/useErrorLog";
import { MISSION_TYPES, STAGES, weeklyCounts } from "@/lib/writingMissions";
import { errorMeta } from "@/lib/writingPractice";
import MissionCard from "@/components/writing-missions/MissionCard";

export default function WritingMissions() {
  const { missions, loading } = useMissions();
  const { progressFor, signedIn } = useMissionProgress();
  const { submissions } = useMissionSubmissions();
  const { errors } = useErrorLog(signedIn);

  const week = weeklyCounts(submissions);
  const topError = summarizeErrors(errors)[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-6">
      <Link
        to="/speaking"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Skriva
      </Link>

      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold">Skrivuppdrag</h1>
        <p className="text-sm text-muted-foreground">
          Ord först, sedan meningar, stycke och till slut en hel text.{" "}
          <span className="italic">Words first, then sentences, a paragraph — and finally a full text.</span>
        </p>
      </div>

      {!signedIn && (
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2">
          <p className="text-sm font-medium">Dina texter sparas bara på den här enheten.</p>
          <p className="text-xs text-muted-foreground">
            Skapa ett gratis konto för att spara framsteg, texter och vanliga fel.{" "}
            <span className="italic">Create a free account to keep your progress.</span>
          </p>
          <Button size="sm" onClick={() => base44.auth.redirectToLogin(window.location.pathname)}>
            Skapa gratis konto
          </Button>
        </div>
      )}

      {/* Weekly goal */}
      <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Flame className="w-4 h-4 text-orange-500" /> Veckans mål
          </p>
          <span className="text-xs text-muted-foreground">{week.done} / {week.goal}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          2 korta uppdrag och 1 längre text · <span className="italic">two short missions and one longer text</span>
        </p>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.round((week.done / week.goal) * 100)}%` }}
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          Korta: {week.short} · Längre: {week.long}
        </p>
      </div>

      {/* Error review entry */}
      {topError && (
        <Link
          to="/writing-missions/errors"
          className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900 dark:bg-amber-950/20"
        >
          <span className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-amber-600" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Mina vanligaste fel</span>
            <span className="block text-[11px] text-muted-foreground">
              {errorMeta(topError.type).label} · {topError.total} gånger — öva innan nästa uppdrag
            </span>
          </span>
        </Link>
      )}

      {/* Stages overview */}
      <div className="rounded-2xl border border-border/50 bg-muted/30 p-4 space-y-2">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <BookOpenCheck className="w-4 h-4 text-primary" /> Sju steg · 15–25 min
        </p>
        <div className="flex flex-wrap gap-1.5">
          {STAGES.map((s) => (
            <span key={s.id} className="rounded-full bg-card border border-border/60 px-2 py-0.5 text-[11px]">
              {s.id}. {s.label}
            </span>
          ))}
        </div>
      </div>

      {loading && <p className="text-center text-xs text-muted-foreground">Laddar uppdragen…</p>}

      {!loading && missions.length === 0 && (
        <div className="rounded-2xl border border-border/60 bg-card p-8 text-center space-y-2">
          <PenSquare className="w-8 h-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Inga uppdrag ännu.</p>
        </div>
      )}

      {MISSION_TYPES.map((type) => {
        const group = missions.filter((m) => m.type === type.id);
        if (!group.length) return null;
        return (
          <div key={type.id} className="space-y-2">
            <div className="flex items-baseline gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{type.label}</h2>
              <span className="text-[11px] italic text-muted-foreground/80">{type.en}</span>
            </div>
            <div className="space-y-2">
              {group.map((mission) => (
                <MissionCard key={mission.id} mission={mission} progress={progressFor(mission.id)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}