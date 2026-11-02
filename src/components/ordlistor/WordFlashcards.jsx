import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Shuffle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import SpeakButton from "@/components/shared/SpeakButton";
import { shuffle } from "@/lib/shuffle";

// Review the words of one topic as flip cards. Swedish side first so the
// learner can hear and say the word before revealing the translation.
export default function WordFlashcards({ words, title, onExit }) {
  const [order, setOrder] = useState(words);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const word = order[idx];
  const go = (delta) => {
    setFlipped(false);
    setIdx((i) => (i + delta + order.length) % order.length);
  };
  const reshuffle = () => {
    setOrder(shuffle(words));
    setIdx(0);
    setFlipped(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <button onClick={onExit} className="flex items-center gap-2 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Avsluta
        </button>
        <span>{idx + 1} / {order.length}</span>
        <button onClick={reshuffle} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
          <Shuffle className="w-3.5 h-3.5" /> Blanda
        </button>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${((idx + 1) / order.length) * 100}%` }} />
      </div>

      <motion.button
        key={`${idx}-${flipped}`}
        initial={{ opacity: 0, rotateY: -12 }}
        animate={{ opacity: 1, rotateY: 0 }}
        onClick={() => setFlipped((f) => !f)}
        className="w-full min-h-[220px] rounded-2xl border-2 border-border bg-card p-6 flex flex-col items-center justify-center gap-3 text-center hover:border-primary/50 transition-colors"
      >
        {!flipped ? (
          <>
            <p className="text-3xl font-bold">{word.sv}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <SpeakButton text={word.sv} ariaLabel={`Listen to ${word.sv}`} />
              <span>Lyssna · <span className="italic">tap card to flip</span></span>
            </div>
          </>
        ) : (
          <>
            <p className="text-2xl font-semibold text-primary">{word.en}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{word.sv}</span>
              <SpeakButton text={word.sv} ariaLabel={`Listen to ${word.sv}`} />
            </div>
          </>
        )}
      </motion.button>

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => go(-1)} className="gap-1">
          <ChevronLeft className="w-4 h-4" /> Förra
        </Button>
        <Button variant="outline" onClick={() => setFlipped((f) => !f)} className="gap-1 flex-1">
          <RotateCw className="w-4 h-4" /> Vänd
        </Button>
        <Button onClick={() => go(1)} className="gap-1">
          Nästa <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {title && <p className="text-center text-xs italic text-muted-foreground">{title}</p>}
    </div>
  );
}