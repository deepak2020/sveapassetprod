import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, Mic, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { playAudio } from "@/lib/speech";
import { cn } from "@/lib/utils";

// Stage 3 — Fraser (Key phrases with audio + shadowing option).
export default function FraserStage({ topic, onNext, onBack }) {
  const phrases = topic.key_phrases || [];
  const [index, setIndex] = useState(0);

  if (phrases.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Inga färdiga fraser för det här uppdraget.
        </p>
        <Button onClick={onNext} className="w-full gap-2">Fortsätt <ArrowRight className="w-4 h-4" /></Button>
      </div>
    );
  }

  const current = phrases[index];
  const isLast = index === phrases.length - 1;

  const advance = () => {
    if (isLast) onNext();
    else setIndex((i) => i + 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Nyckelfras · {index + 1} av {phrases.length}
        </p>
        <div className="flex gap-1">
          {phrases.map((_, i) => (
            <div key={i} className={cn("h-1.5 w-4 rounded-full", i <= index ? "bg-blue-500" : "bg-muted")} />
          ))}
        </div>
      </div>

      <Card className="border-2 border-blue-200 dark:border-blue-900">
        <CardContent className="p-5 space-y-4">
          {current.situation_en && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                När du säger detta
              </p>
              <p className="text-sm text-foreground/80">{current.situation_en}</p>
            </div>
          )}

          <div className="space-y-2 border-t border-border/50 pt-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">🇸🇪 Svenska</p>
            <p className="font-display text-xl sm:text-2xl font-semibold leading-snug">
              "{current.phrase_sv}"
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">🇬🇧 English</p>
            <p className="text-sm text-muted-foreground italic">"{current.phrase_en}"</p>
          </div>

          {current.pronunciation_tip && (
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-md p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-1">
                💡 Uttal
              </p>
              <p className="text-xs text-blue-900 dark:text-blue-200">{current.pronunciation_tip}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => playAudio(current.phrase_sv, "sv-SE", 0.9)}
              className="gap-1.5"
            >
              <Volume2 className="w-4 h-4" />
              Lyssna
            </Button>
            <Button
              variant="outline"
              onClick={() => playAudio(current.phrase_sv, "sv-SE", 0.65)}
              className="gap-1.5"
            >
              <Mic className="w-4 h-4" />
              Långsamt
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button onClick={advance} className="w-full gap-1.5">
        {isLast ? "Klart — till övningen" : "Nästa fras"}
        {isLast ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
      </Button>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka
        </Button>
        <Button variant="ghost" size="sm" onClick={onNext} className="gap-1 text-muted-foreground">
          Hoppa till övning
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}