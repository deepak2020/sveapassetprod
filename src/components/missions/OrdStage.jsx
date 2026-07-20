import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, ArrowRight, ArrowLeft } from "lucide-react";
import { playAudio } from "@/lib/speech";
import { cn } from "@/lib/utils";
import SpeakOrTypeInput from "./SpeakOrTypeInput";

// Stage 2 — Ord. User HEARS each word, then SAYS it back. Advances only after
// they've attempted the word (correctly, or after revealing the answer).
export default function OrdStage({ topic, onNext, onBack }) {
  const words = topic.key_vocabulary || [];
  const [index, setIndex] = useState(0);
  const [attempted, setAttempted] = useState(false);

  if (words.length === 0) {
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
      setAttempted(false);
    }
  };

  const handleSpeak = () => playAudio(current.swedish, "sv-SE", 0.9);

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

      <Card className="border-2">
        <CardContent className="p-5 space-y-4 text-center">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Betyder</p>
            <p className="text-lg font-semibold">{current.english}</p>
          </div>

          <div className="border-t border-border/50 pt-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Säg det på svenska</p>
            <p className="font-display text-2xl sm:text-3xl font-bold mb-1">{current.swedish}</p>
            <Button variant="ghost" size="sm" onClick={handleSpeak} className="gap-1.5">
              <Volume2 className="w-4 h-4" />
              Lyssna först
            </Button>
          </div>

          {current.pronunciation_tip && (
            <p className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-1.5 rounded">
              💡 {current.pronunciation_tip}
            </p>
          )}

          <SpeakOrTypeInput
            key={index}
            expected={current.swedish}
            threshold={65}
            placeholder="Skriv ordet på svenska…"
            onResult={() => setAttempted(true)}
            onSkip={() => setAttempted(true)}
          />

          {current.example_sv && (
            <div className="pt-2 border-t border-border/50 text-left">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Exempel</p>
              <p className="text-sm font-medium">"{current.example_sv}"</p>
              {current.example_en && (
                <p className="text-xs text-muted-foreground italic">"{current.example_en}"</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {attempted && (
        <Button onClick={advance} className="w-full gap-1.5">
          {isLast ? "Klart — till fraser" : "Nästa ord"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}

      <div className="flex justify-between pt-1">
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