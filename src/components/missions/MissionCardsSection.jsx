import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Target, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Groups mission-scenarios (SpeakingTopic with goal + success_criteria set)
// by CEFR level and renders a compact grid of clickable cards.
const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1"];
const LEVEL_LABEL = {
  A1: { name: "Överlevnad", tint: "from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/20", ring: "border-rose-200 dark:border-rose-900", accent: "text-rose-700 dark:text-rose-400" },
  A2: { name: "Vardagsservice", tint: "from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/20", ring: "border-amber-200 dark:border-amber-900", accent: "text-amber-700 dark:text-amber-400" },
  B1: { name: "Familj & samhälle", tint: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20", ring: "border-emerald-200 dark:border-emerald-900", accent: "text-emerald-700 dark:text-emerald-400" },
  B2: { name: "Jobb & nyanser", tint: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20", ring: "border-blue-200 dark:border-blue-900", accent: "text-blue-700 dark:text-blue-400" },
  C1: { name: "Avancerat", tint: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20", ring: "border-purple-200 dark:border-purple-900", accent: "text-purple-700 dark:text-purple-400" },
};

export default function MissionCardsSection() {
  const { data: allTopics = [], isLoading } = useQuery({
    queryKey: ["speaking-topics-missions"],
    queryFn: () => base44.entities.SpeakingTopic.list("order", 200),
  });

  // Only include topics that have a real mission (goal + success criteria).
  const missions = allTopics.filter(
    (t) => t.goal && Array.isArray(t.success_criteria) && t.success_criteria.length > 0
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <div className="grid sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((n) => <Skeleton key={n} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (missions.length === 0) return null;

  // Group by level
  const byLevel = {};
  for (const m of missions) {
    const lvl = m.level || "A2";
    if (!byLevel[lvl]) byLevel[lvl] = [];
    byLevel[lvl].push(m);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Target className="w-4 h-4 text-primary" />
        <h2 className="font-display text-xl font-bold">Uppdrag · <span className="italic font-normal text-muted-foreground text-base">Missions</span></h2>
      </div>
      <p className="text-xs text-muted-foreground -mt-4">
        Riktiga vardagssituationer med ord, fraser och övning innan du pratar med Svea.{" "}
        <span className="italic">Real-life scenarios — learn the words, phrases, and practice before speaking with Svea.</span>
      </p>

      {LEVEL_ORDER.filter((lvl) => byLevel[lvl]?.length).map((lvl) => {
        const meta = LEVEL_LABEL[lvl];
        return (
          <div key={lvl} className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md bg-gradient-to-br ${meta.tint} border ${meta.ring} ${meta.accent}`}>
                {lvl}
              </span>
              <span className="text-xs font-medium text-muted-foreground">{meta.name}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {byLevel[lvl].map((m) => (
                <MissionCard key={m.id} mission={m} meta={meta} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MissionCard({ mission, meta }) {
  return (
    <Link to={`/tala/mission/${mission.id}`} className="block h-full">
      <Card className={`h-full border-2 ${meta.ring} bg-gradient-to-br ${meta.tint} hover:shadow-md transition-all group hover:-translate-y-0.5`}>
        <CardContent className="p-4 flex items-start gap-3">
          <div className="text-3xl shrink-0">{mission.emoji || "🎯"}</div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-sm leading-tight truncate">{mission.title_sv}</p>
            <p className="text-[11px] text-muted-foreground italic truncate">{mission.title_en}</p>
            {mission.goal && (
              <p className="text-[11px] text-foreground/70 mt-1.5 line-clamp-2">{mission.goal}</p>
            )}
          </div>
          <ArrowRight className={`w-4 h-4 shrink-0 mt-1 ${meta.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
        </CardContent>
      </Card>
    </Link>
  );
}