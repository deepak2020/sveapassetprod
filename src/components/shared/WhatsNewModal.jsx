import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CURRENT_VERSION = "1.3";
const STORAGE_KEY = "svenska:whats_new_seen";

const FEATURES = [
  {
    emoji: "✍️",
    title: "AI-skrivfeedback",
    titleEn: "AI writing feedback",
    desc: "Skriv ett svar och få direkt feedback — AI markerar fel med genomstrykning och visar rätt ord i grönt.",
    descEn: "Write an answer and get instant AI feedback with strikethrough errors and green corrections inline.",
  },
  {
    emoji: "💾",
    title: "Sparade skrivövningar",
    titleEn: "Writing answers saved",
    desc: "Dina skrivövningssvar sparas automatiskt — de finns kvar nästa gång du öppnar lektionen.",
    descEn: "Your writing exercise answers are saved automatically and restored when you return.",
  },
  {
    emoji: "📱",
    title: "Bättre mobilnavigering",
    titleEn: "Better mobile navigation",
    desc: "Navigationsknapparna för föregående/nästa lektion syns nu korrekt på mobil.",
    descEn: "Previous/next lesson buttons are now properly visible on mobile screens.",
  },
  {
    emoji: "👋",
    title: "Välkommen tillbaka-banner",
    titleEn: "Welcome back banner",
    desc: "Återvändande besökare uppmanas att skapa ett konto för att spara sina framsteg.",
    descEn: "Returning visitors are gently nudged to create an account to track their progress.",
  },
  {
    emoji: "🎤",
    title: "Talbockmarkering",
    titleEn: "Speaking completion",
    desc: "Talövningar markeras nu korrekt som klara med en bockmarkering.",
    descEn: "Speaking exercises now correctly show a checkmark when completed.",
  },
  {
    emoji: "🔍",
    title: "SEO-förbättringar",
    titleEn: "SEO improvements",
    desc: "Appen är nu sökbar — robots.txt, sitemap och kanoniska URL:er tillagda.",
    descEn: "The app is now crawlable with robots.txt, sitemap.xml, and canonical URLs.",
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
