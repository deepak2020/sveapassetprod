import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, ArrowRight, ArrowLeft, RotateCcw, Check } from "lucide-react";
import { playAudio } from "@/lib/speech";
import { cn } from "@/lib/utils";

// Stage 2 — Ord (Vocabulary flashcards). User flips each card, marks known/unsure.
export default function OrdStage({ topic, onNext, onBack }) {
  const words = topic.key_vocabulary || [];
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (words.length === 0) {
    // Nothing to learn — skip straight through
    return (
      <div className="space-y-4">
        <p className="text-center text-sm text-muted-foreground">
          Inga ord att öva för det här uppdraget.
        </p>
        <Button onClick={onNext} className="w-full gap-2">Fortsätt <ArrowRight className="w-4 h-4" /></Button>
      </div>
    );
  }

  const current = words[index];
  const isLast = index === words.length - 1;

  const advance = () => {
    if (isLast) {
      onNext();
    } else {
      setIndex((i) => i + 1);
      setFlipped(false);
    }
  };

  const handleSpeak = (e) => {
    e.stopPropagation();
    playAudio(current.swedish, "sv-SE", 0.9);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Nyckelord · {index + 1} av {words.length}
        </p>
        <div className="flex gap-1">
          {words.map((_, i) => (
            <div key={i} className={cn("h-1.5 w-4 rounded-full", i <= index ? "bg-primary" : "bg-muted")} />
          ))}
        </div>
      </div>

      <Card
        className="min-h-[280px] cursor-pointer border-2 hover:border-primary/50 transition-colors"
        onClick={() => setFlipped((f) => !f)}
      >
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[280px]">
          {!flipped ? (
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Svenska</p>
              <p className="font-display text-3xl sm:text-4xl font-bold">{current.swedish}</p>
              <Button variant="ghost" size="sm" onClick={handleSpeak} className="gap-1.5">
                <Volume2 className="w-4 h-4" />
                Uttala
              </Button>
              <p className="text-xs text-muted-foreground pt-4 italic">Tryck för att se översättning</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">English</p>
              <p className="text-2xl font-semibold">{current.english}</p>
              {current.example_sv && (
                <div className="pt-3 space-y-1 border-t border-border/50 mt-3 w-full">
                  <p className="text-sm font-medium">"{current.example_sv}"</p>
                  {current.example_en && (
                    <p className="text-xs text-muted-foreground italic">{current.example_en}</p>
                  )}
                </div>
              )}
              {current.pronunciation_tip && (
                <p className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded mt-2">
                  💡 {current.pronunciation_tip}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => setFlipped(false)} className="gap-1.5">
          <RotateCcw className="w-4 h-4" />
          Öva igen
        </Button>
        <Button onClick={advance} className="gap-1.5">
          <Check className="w-4 h-4" />
          Jag kan
        </Button>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" />
          Briefing
        </Button>
        <Button variant="ghost" size="sm" onClick={onNext} className="gap-1 text-muted-foreground">
          Hoppa till fraser
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}