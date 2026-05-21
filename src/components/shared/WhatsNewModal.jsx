import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CURRENT_VERSION = "1.2";
const STORAGE_KEY = "svenska:whats_new_seen";

const FEATURES = [
  {
    emoji: "📅",
    title: "Dagens utmaningar",
    titleEn: "Daily challenges",
    desc: "4 utmaningar om dagen — morgon, eftermiddag, kväll och natt. Låses upp efter tid.",
    descEn: "4 challenges a day unlocking by time of day.",
  },
  {
    emoji: "⚡",
    title: "XP-notiser",
    titleEn: "XP toasts",
    desc: "Se dina poäng direkt när du svarar rätt.",
    descEn: "Floating +XP popup on every correct answer.",
  },
  {
    emoji: "🔥",
    title: "Svitmilstolpar",
    titleEn: "Streak milestones",
    desc: "Bonuspoäng och belöning vid 7, 30 och 100 dagars svit.",
    descEn: "Bonus XP + reward modal at 7, 30 and 100-day streaks.",
  },
  {
    emoji: "🧠",
    title: "Ordförråds-SRS",
    titleEn: "Vocabulary SRS",
    desc: "Ord du lärt dig sparas automatiskt i en upprepningsdäck i Gym.",
    descEn: "Lesson vocab saved to a spaced-repetition review deck in Gym.",
  },
  {
    emoji: "📉",
    title: "Svaga områden",
    titleEn: "Weak area card",
    desc: "Dashboarden visar dina svagaste färdigheter och rekommenderar lektioner.",
    descEn: "Dashboard shows your weakest skills and recommends lessons.",
  },
  {
    emoji: "➡️",
    title: "Nästa aktivitet",
    titleEn: "Next activity button",
    desc: "Knapp inuti varje lektionsflik för att gå vidare utan att scrolla upp.",
    descEn: "Button inside each lesson tab to move forward without scrolling.",
  },
  {
    emoji: "🔊",
    title: "Förbättrat tal",
    titleEn: "Better TTS voices",
    desc: "Väljer automatiskt den bästa tillgängliga svenska rösten på din enhet.",
    descEn: "Automatically picks the best available Swedish voice on your device.",
  },
  {
    emoji: "✅",
    title: "Lektionsstatus",
    titleEn: "Lesson completion",
    desc: "Konfetti och banner när alla aktiviteter i en lektion är klara.",
    descEn: "Confetti + banner when all activities in a lesson are completed.",
  },
];

export default function WhatsNewModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (seen !== CURRENT_VERSION) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, CURRENT_VERSION); } catch {}
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={dismiss} />

          {/* Sheet */}
          <motion.div
            role="dialog"
            aria-labelledby="whats-new-title"
            className="relative w-full sm:max-w-md bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl border border-border/50 overflow-hidden flex flex-col max-h-[90vh]"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { type: "spring", bounce: 0.25 } }}
            exit={{ y: 40, opacity: 0 }}
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-border/40 shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 id="whats-new-title" className="font-display text-lg font-bold leading-tight">Nyheter · What's new</h2>
                    <p className="text-xs text-muted-foreground">Version {CURRENT_VERSION}</p>
                  </div>
                </div>
                <button
                  onClick={dismiss}
                  aria-label="Close"
                  className="flex items-center justify-center min-w-[44px] min-h-[44px] p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Feature list */}
            <div className="overflow-y-auto px-4 py-3 space-y-1.5 flex-1">
              {FEATURES.map((f) => (
                <div
                  key={f.titleEn}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors"
                >
                  <span className="text-2xl leading-none mt-0.5 shrink-0">{f.emoji}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground leading-tight">
                      {f.title}
                      <span className="font-normal text-muted-foreground"> · {f.titleEn}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
                    <p className="text-xs text-muted-foreground/60 italic">{f.descEn}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/40 shrink-0">
              <Button className="w-full" onClick={dismiss}>
                Kom igång! · Let's go!
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
