import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowLeft } from "lucide-react";
import { useVocabSRS } from "@/hooks/useVocabSRS";

const QUALITY_BUTTONS = [
  { quality: 0, label: "Missade", sublabel: "Missed", cls: "border-red-300 bg-red-50 text-red-700 hover:bg-red-100" },
  { quality: 1, label: "Svårt",   sublabel: "Hard",   cls: "border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100" },
  { quality: 2, label: "Bra",     sublabel: "Good",   cls: "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100" },
  { quality: 3, label: "Lätt",    sublabel: "Easy",   cls: "border-green-300 bg-green-50 text-green-700 hover:bg-green-100" },
];

export default function VocabReviewSession({ cards, onFinish }) {
  const { updateCard } = useVocabSRS();
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [good, setGood] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!cards || cards.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center space-y-4">
        <p className="text-2xl">🎉</p>
        <h3 className="font-semibold text-lg">Alla kort är klara!</h3>
        <p className="text-muted-foreground text-sm">No vocab cards due right now — come back later.</p>
        <Button onClick={onFinish} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>
    );
  }

  const card = cards[idx];

  const handleQuality = (quality) => {
    updateCard(card.id, quality);
    const newGood = good + (quality >= 2 ? 1 : 0);
    if (idx + 1 >= cards.length) {
      setGood(newGood);
      setFinished(true);
    } else {
      setGood(newGood);
      setIdx((i) => i + 1);
      setFlipped(false);
    }
  };

  if (finished) {
    const pct = Math.round((good / cards.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto px-4 py-8">
        <Card className="border-border/50">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-primary" />
            </div>
            <h3 className="font-display text-2xl font-bold mb-2">
              {pct >= 80 ? "Utmärkt! 🎉" : pct >= 60 ? "Bra jobbat! 👍" : "Fortsätt öva! 💪"}
            </h3>
            <p className="text-4xl font-bold text-primary mb-2">{pct}%</p>
            <p className="text-muted-foreground mb-6">{good} of {cards.length} recalled well</p>
            <Button onClick={onFinish} variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Done
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Button variant="ghost" size="sm" onClick={onFinish} className="gap-1 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <span className="text-sm text-muted-foreground ml-auto">{idx + 1} / {cards.length}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-muted rounded-full">
        <div className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${(idx / cards.length) * 100}%` }} />
      </div>

      {/* Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx + (flipped ? "_b" : "_a")}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
        >
          <Card
            className="border-border/50 cursor-pointer select-none"
            onClick={() => { if (!flipped) setFlipped(true); }}
          >
            <CardContent className="p-10 flex flex-col items-center justify-center min-h-[200px] text-center">
              {!flipped ? (
                <>
                  <p className="text-3xl font-bold mb-4">{card.swedish}</p>
                  <p className="text-sm text-muted-foreground">Tryck för att se svaret · Tap to reveal</p>
                </>
              ) : (
                <>
                  <p className="text-lg text-muted-foreground mb-3">{card.swedish}</p>
                  <p className="text-3xl font-bold text-primary">{card.english}</p>
                  {card.lessonTitle && (
                    <p className="text-xs text-muted-foreground/60 mt-3 italic">{card.lessonTitle}</p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Quality buttons */}
      {flipped && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-4 gap-2">
          {QUALITY_BUTTONS.map(({ quality, label, sublabel, cls }) => (
            <button key={quality} onClick={() => handleQuality(quality)}
              className={`py-3 px-1 rounded-xl border-2 text-sm font-semibold transition-all ${cls}`}>
              <p>{label}</p>
              <p className="text-[10px] font-normal opacity-70">{sublabel}</p>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
