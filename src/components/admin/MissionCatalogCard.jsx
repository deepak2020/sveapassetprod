import { useState } from "react";
import { Copy, Check, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildMissionPrompt } from "@/lib/missionPrompt";

const LEVEL_COLOR = {
  A1: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900",
  A2: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  B1: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  B2: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900",
  C1: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900",
};

export default function MissionCatalogCard({ mission, seeded }) {
  const [copied, setCopied] = useState(null); // 'prompt' | 'meta' | null

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(buildMissionPrompt(mission));
    setCopied("prompt");
    setTimeout(() => setCopied(null), 1500);
  };

  const copyMeta = async () => {
    const meta = {
      title_sv: mission.title_sv,
      title_en: mission.title_en,
      level: mission.level,
      category: mission.category,
      emoji: mission.emoji,
      order: mission.order,
    };
    await navigator.clipboard.writeText(JSON.stringify(meta, null, 2));
    setCopied("meta");
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Card className={seeded ? "border-emerald-300 dark:border-emerald-800" : "border-border"}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="text-2xl shrink-0">{mission.emoji}</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${LEVEL_COLOR[mission.level] || ""}`}>
                {mission.level}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                {mission.category}
              </span>
              <span className="text-[10px] text-muted-foreground">· #{mission.order}</span>
            </div>
            <p className="font-semibold text-sm leading-tight mt-0.5 truncate">{mission.title_sv}</p>
            <p className="text-[11px] text-muted-foreground italic truncate">{mission.title_en}</p>
          </div>
          <div className="shrink-0">
            {seeded ? (
              <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                In DB
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
                <Circle className="w-3.5 h-3.5" />
                Missing
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] text-foreground/80 leading-relaxed line-clamp-2">
          {mission.situation}
        </p>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Goal:</span> {mission.goal_hint}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <Button size="sm" variant="default" onClick={copyPrompt} className="gap-1.5 h-7 text-xs">
            {copied === "prompt" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied === "prompt" ? "Copied" : "Copy Claude prompt"}
          </Button>
          <Button size="sm" variant="outline" onClick={copyMeta} className="gap-1.5 h-7 text-xs">
            {copied === "meta" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied === "meta" ? "Copied" : "Copy metadata"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}