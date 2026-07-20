import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, CheckCircle2, Sparkles, Lightbulb, ArrowRight } from "lucide-react";

// Stage 1 — Briefing. Shows the mission, goal, success criteria, cultural tip.
export default function BriefingStage({ topic, onNext }) {
  const criteria = topic.success_criteria || [];
  const vocabPreview = (topic.key_vocabulary || []).slice(0, 5).map((v) => v.swedish);

  return (
    <div className="space-y-5">
      <div className="text-center space-y-2">
        <div className="text-5xl">{topic.emoji || "🎯"}</div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold">{topic.title_sv}</h1>
        <p className="text-sm text-muted-foreground italic">{topic.title_en}</p>
      </div>

      {topic.goal && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4 flex gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Target className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-1">Ditt mål · Your goal</p>
              <p className="text-sm leading-relaxed">{topic.goal}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {criteria.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Du klarar det när du har…
            </p>
            <ul className="space-y-1.5">
              {criteria.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-emerald-600 mt-0.5">✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {vocabPreview.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Bra ord du kommer öva
            </p>
            <div className="flex flex-wrap gap-1.5">
              {vocabPreview.map((w, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-md bg-muted font-medium">{w}</span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {topic.cultural_notes && (
        <Card className="border-amber-300/50 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800/50">
          <CardContent className="p-4 flex gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4.5 h-4.5 text-amber-700 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-400 mb-1">Kulturtips</p>
              <p className="text-sm leading-relaxed">{topic.cultural_notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Button size="lg" onClick={onNext} className="w-full gap-2">
        Börja lära ord
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}