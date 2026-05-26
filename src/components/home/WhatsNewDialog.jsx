import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";

// Bump this string with every release to re-show the dialog
const CURRENT_VERSION = "2025-05-v3";
const STORAGE_KEY = "svenska:whats_new_seen";

const FEATURES = [
  {
    emoji: "🎧",
    title: "Listen & Write",
    description: "Tap the speaker in any writing or translate exercise to hear the correct answer — then write it from memory. Dictation-style learning.",
  },
  {
    emoji: "💡",
    title: "Progressive Hints",
    description: "Stuck? Reveal the answer one word at a time instead of seeing it all at once. Keeps your brain working.",
  },
  {
    emoji: "✏️",
    title: "Grammar Mini-Lessons",
    description: "Every correction now explains WHY — the grammar rule behind it, like "Swedish verbs end in -r in present tense".",
  },
  {
    emoji: "🔄",
    title: "Revision Queue",
    description: "Wrong answers are automatically saved and re-shown for practice until you master them. Spaced repetition built in.",
  },
  {
    emoji: "🏛️",
    title: "Civic Knowledge",
    description: "Prepare for the Swedish citizenship test with topics from Sverige i Fokus — democracy, history, society and more.",
  },
  {
    emoji: "⚡",
    title: "Quick Revision",
    description: "Revisit any completed lesson with a 7-question vocab quiz directly from your dashboard.",
  },
];

export default function WhatsNewDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (seen !== CURRENT_VERSION) setOpen(true);
    } catch {}
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, CURRENT_VERSION); } catch {}
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) dismiss(); }}>
      <DialogContent className="max-w-md w-full p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-violet-600 px-6 pt-7 pb-6 text-white relative">
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 rounded-full p-1 hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/70">What's new</span>
          </div>
          <h2 className="text-2xl font-bold leading-tight mb-1">Sveapasset just got smarter 🇸🇪</h2>
          <p className="text-sm text-white/80">New features to help you learn faster and remember longer.</p>
        </div>

        {/* Features list */}
        <div className="px-6 py-5 space-y-4 max-h-[55vh] overflow-y-auto">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex gap-3">
              <div className="text-2xl shrink-0 leading-none mt-0.5">{f.emoji}</div>
              <div>
                <p className="font-semibold text-sm text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2">
          <Button onClick={dismiss} className="w-full rounded-xl font-semibold">
            Let's go! 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
