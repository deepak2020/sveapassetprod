import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

// Bump this string with every release to re-show the dialog to all users
const CURRENT_VERSION = "2025-05-v3";
const STORAGE_KEY = "svenska:whats_new_seen";

const FEATURES = [
  {
    emoji: "🎧",
    title: "Lyssna & skriv",
    titleEn: "Listen & Write",
    desc: "Tryck på högtalaren för att höra det rätta svaret — skriv sedan från minnet. Diktat-stil!",
    descEn: "Tap the speaker to hear the correct answer, then write it from memory. Dictation-style learning.",
  },
  {
    emoji: "💡",
    title: "Progressiva ledtrådar",
    titleEn: "Progressive Hints",
    desc: "Avslöja svaret ett ord i taget istället för att se allt på en gång. Håller hjärnan igång.",
    descEn: "Reveal the answer one word at a time instead of seeing it all at once. Keeps your brain working.",
  },
  {
    emoji: "✏️",
    title: "Grammatiklektioner",
    titleEn: "Grammar Mini-Lessons",
    desc: "Varje rättelse förklarar VARFÖR — grammatikregeln bakom felet, t.ex. \"svenska verb slutar på -r i presens\".",
    descEn: "Every correction explains WHY — the grammar rule behind it, e.g. "Swedish verbs end in -r in present tense".",
  },
  {
    emoji: "🔄",
    title: "Revisionsköa",
    titleEn: "Revision Queue",
    desc: "Fel svar sparas automatiskt och visas igen tills du behärskar dem.",
    descEn: "Wrong answers are saved automatically and re-shown until you master them.",
  },
  {
    emoji: "🏛️",
    title: "Samhällskunskap",
    titleEn: "Civic Knowledge",
    desc: "Förbered dig för medborgarskapsprovet med ämnen från Sverige i Fokus.",
    descEn: "Prepare for the Swedish citizenship test with topics from Sverige i Fokus.",
  },
  {
    emoji: "⚡",
    title: "Snabb repetition",
    titleEn: "Quick Revision",
    desc: "Gör ett snabbt vokabulärquiz på avklarade lektioner direkt från instrumentpanelen.",
    descEn: "Do a quick vocabulary quiz on completed lessons directly from your dashboard.",
  },
];

export default function WhatsNewModal() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, authChecked } = useAuth();

  useEffect(() => {
    if (!authChecked) return;
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (seen !== CURRENT_VERSION) setOpen(true);
    } catch {
      setOpen(true);
    }
  }, [authChecked]);

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
                    <h2 id="whats-new-title" className="font-display text-lg font-bold leading-tight">
                      Nyheter · What's new
                    </h2>
                    <p className="text-xs text-muted-foreground">Sveapasset · Version {CURRENT_VERSION}</p>
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
            <div className="px-6 py-4 border-t border-border/40 shrink-0 space-y-2">
              {!isAuthenticated && (
                <Button
                  className="w-full"
                  onClick={() => { dismiss(); base44.auth.redirectToLogin(window.location.href); }}
                >
                  Skapa gratis konto · Create free account
                </Button>
              )}
              <button
                onClick={dismiss}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                {isAuthenticated ? "Kom igång! · Let's go 🚀" : "Fortsätt utan konto · Continue without account"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
