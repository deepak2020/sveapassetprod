import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { awardXP, XP_REWARDS } from "@/lib/xp";
import { useSpeech } from "@/hooks/useSpeech";
import SpeakButton from "@/components/shared/SpeakButton";
import AddToVocabButton from "@/components/shared/AddToVocabButton";
import { useExerciseProgress } from "@/hooks/useExerciseProgress";

export default function FlashcardDeck({ wordPairs, onComplete, lessonId, lessonTitle, storageKey, userId, tab, initialProgress }) {
  const { load, save, clear } = useExerciseProgress(storageKey, userId, lessonId, tab);
  const remoteApplied = useRef(false);
  const [cardPool, setCardPool] = useState(wordPairs || []);
  const [index, setIndex] = useState(() => initialProgress?.current ?? load()?.index ?? 0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [learning, setLearning] = useState([]);
  const [finished, setFinished] = useState(false);
  const touchStartX = useRef(null);
  const { speak } = useSpeech();

  useEffect(() => {
    if (remoteApplied.current || finished || initialProgress == null) return;
    remoteApplied.current = true;
    const localIdx = load()?.current ?? load()?.index ?? 0;
    const remoteIdx = initialProgress.current ?? 0;
    if (remoteIdx > localIdx) setIndex(remoteIdx);
  }, [initialProgress]);

  // Auto-play Swedish pronunciation when a new card appears or when flipping back to Swedish side
  useEffect(() => {
    const w = cardPool[index];
    if (!w || finished) return;
    if (!flipped && w.swedish) {
      const t = setTimeout(() => speak(w.swedish, "sv-SE"), 250);
      return () => clearTimeout(t);
    }
  }, [index, flipped, finished]);

  if (!wordPairs || wordPairs.length === 0) {
    return <p className="text-muted-foreground text-sm">No vocabulary available for this lesson.</p>;
  }

  const card = cardPool[index];
  const total = cardPool.length;

  const handleKnow = async () => {
    setKnown(k => [...k, card]);
    awardXP(base44, XP_REWARDS.flashcard_good);
    advance(true);
  };

  const handleLearning = async () => {
    setLearning(l => [...l, card]);
    awardXP(base44, XP_REWARDS.flashcard_hard);
    advance(false);
  };

  const advance = (knewThisCard) => {
    setFlipped(false);
    if (index + 1 >= total) {
      clear();
      setFinished(true);
      const finalKnown = known.length + (knewThisCard ? 1 : 0);
      onComplete?.(finalKnown, total);
    } else {
      const next = index + 1;
      save({ index: next, current: next });
      setIndex(next);
    }
  };

  const restart = (retryLearning = false) => {
    clear();
    setCardPool(retryLearning ? learning : (wordPairs || []));
    setIndex(0); setFlipped(false); setKnown([]); setLearning([]); setFinished(false);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !flipped) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      // Swipe right = Got it, swipe left = Still learning (Tinder convention)
      if (diff < 0) handleKnow();
      else handleLearning();
    }
    touchStartX.current = null;
  };

  if (finished) {
    const pct = Math.round((known.length / total) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-10 h-10 text-amber-500" />
        </div>
        <h3 className="font-display text-2xl font-bold mb-1">Round complete!</h3>
        <div aria-live="polite">
          <p className="text-4xl font-bold text-primary my-3">{pct}%</p>
          <p className="text-muted-foreground mb-4">{known.length} known · {learning.length} still learning</p>
        </div>
        <div className="flex flex-col gap-2 max-w-xs mx-auto">
          {learning.length > 0 && (
            <Button onClick={() => restart(true)} className="gap-2">
              <RotateCcw className="w-4 h-4" /> Retry {learning.length} still learning
            </Button>
          )}
          <Button onClick={() => restart(false)} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" /> {learning.length > 0 ? "Review all cards" : "Review again"}
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{index + 1} / {total}</span>
        <div className="flex gap-3">
          <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="w-3.5 h-3.5" />{known.length}</span>
          <span className="flex items-center gap-1 text-orange-500"><XCircle className="w-3.5 h-3.5" />{learning.length}</span>
        </div>
      </div>
      <div
        className="w-full h-1.5 bg-muted rounded-full"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((index / total) * 100)}
        aria-label="Flashcard progress"
      >
        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(index / total) * 100}%` }} />
      </div>

      {/* Flashcard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          aria-label={flipped ? "Card showing English — click to flip back" : "Card showing Swedish — click to reveal translation"}
          onClick={() => setFlipped(f => !f)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFlipped(f => !f); } }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative min-h-[240px] rounded-2xl border-2 border-border/50 bg-card shadow-sm flex flex-col items-center justify-center p-8 text-center select-none hover:border-primary/30 transition-colors">
            <span className="absolute top-3 left-3 text-xs text-muted-foreground uppercase tracking-wide font-medium">
              {flipped ? "English" : "Swedish"}
            </span>

            <SpeakButton
              text={flipped ? card.english : card.swedish}
              lang={flipped ? "en-US" : "sv-SE"}
              className="absolute top-3 right-3"
              ariaLabel={flipped ? "Play English pronunciation" : "Play Swedish pronunciation"}
            />

            <p className="text-3xl font-bold text-foreground mb-3">
              {flipped ? card.english : card.swedish}
            </p>

            {flipped && card.example_sv && (
              <div className="mt-4 pt-4 border-t border-border/40 w-full">
                <p className="text-sm italic text-foreground">"{card.example_sv}"</p>
                <p className="text-xs text-muted-foreground mt-1">"{card.example_en}"</p>
              </div>
            )}

            {!flipped && (
              <p className="text-xs text-muted-foreground mt-4">Tap to reveal translation</p>
            )}
            {flipped && (
              <p className="text-xs text-muted-foreground mt-4 md:hidden">
                ← Still learning &nbsp;·&nbsp; Got it! →
              </p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Actions */}
      {flipped ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleLearning}
              aria-label="Mark as still learning"
              className="flex items-center justify-center gap-2 p-5 min-h-[44px] rounded-xl border-2 border-orange-200 bg-orange-50 text-orange-700 font-semibold hover:bg-orange-100 transition-colors"
            >
              <XCircle className="w-5 h-5" /> Still learning
            </button>
            <button
              onClick={handleKnow}
              aria-label="Mark as known"
              className="flex items-center justify-center gap-2 p-5 min-h-[44px] rounded-xl border-2 border-green-200 bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5" /> Got it!
            </button>
          </div>
          <AddToVocabButton
            swedish={card.swedish}
            english={card.english}
            lessonId={lessonId}
            lessonTitle={lessonTitle}
            exampleSentence={card.example_sv}
          />
        </div>
      ) : (
        <p className="text-center text-sm text-muted-foreground">Tap the card to reveal the answer, then rate yourself</p>
      )}
    </div>
  );
}