import { useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquarePlus, X, Send, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/api/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";

const MOODS = [
  { emoji: "😍", label: "Love it" },
  { emoji: "😊", label: "Good" },
  { emoji: "😐", label: "Okay" },
  { emoji: "😕", label: "Confused" },
  { emoji: "🐛", label: "Bug" },
];

const CATEGORIES = [
  "Bug report",
  "Feature idea",
  "Content error",
  "General feedback",
];

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [mood, setMood] = useState(null);
  const [category, setCategory] = useState("General feedback");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const reset = () => {
    setMood(null);
    setCategory("General feedback");
    setMessage("");
    setSubmitted(false);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(reset, 300);
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      await supabase.feedback.insert({
        user_email: user?.email || null,
        mood: mood ? `${mood.emoji} ${mood.label}` : null,
        category,
        message: message.trim(),
        page_url: location.pathname,
      });
      setSubmitted(true);
      setTimeout(handleClose, 2000);
    } catch {
      // silently fail — don't disrupt the user
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        className="fixed bottom-20 right-4 md:bottom-6 z-40 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 active:scale-95 transition-transform flex items-center justify-center"
      >
        <MessageSquarePlus className="w-5 h-5" />
      </button>

      {/* Modal backdrop + panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-50"
              onClick={handleClose}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md w-full z-50 bg-card rounded-t-2xl md:rounded-2xl border border-border/50 shadow-2xl max-h-[90vh] overflow-y-auto"
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              {submitted ? (
                <div className="p-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="font-semibold text-lg">Thank you! 🙏</h3>
                  <p className="text-sm text-muted-foreground mt-1">Your feedback helps us improve.</p>
                </div>
              ) : (
                <div className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">Send Feedback</h3>
                      <p className="text-xs text-muted-foreground italic mt-0.5">Skicka feedback · Help us improve</p>
                    </div>
                    <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Mood selector */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">How are you feeling?</p>
                    <div className="flex gap-2">
                      {MOODS.map(m => (
                        <button
                          key={m.emoji}
                          onClick={() => setMood(m)}
                          title={m.label}
                          className={`flex-1 py-2 rounded-xl text-xl transition-all ${
                            mood?.emoji === m.emoji
                              ? "bg-primary/10 ring-2 ring-primary scale-110"
                              : "bg-muted/50 hover:bg-muted hover:scale-105"
                          }`}
                        >
                          {m.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Category</p>
                    <div className="grid grid-cols-2 gap-2">
                      {CATEGORIES.map(c => (
                        <button
                          key={c}
                          onClick={() => setCategory(c)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium text-left transition-all ${
                            category === c
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Your message</p>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Tell us what happened or what you'd like to see…"
                      rows={3}
                      className="w-full border border-border/50 rounded-xl px-3 py-2.5 text-sm bg-transparent focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  {/* Page + user context (shown small) */}
                  <p className="text-[10px] text-muted-foreground/60">
                    Page: {location.pathname} {user?.email ? `· ${user.email}` : "· not logged in"}
                  </p>

                  {/* Submit */}
                  <Button
                    onClick={handleSubmit}
                    disabled={!message.trim() || submitting}
                    className="w-full gap-2"
                  >
                    {submitting
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                      : <><Send className="w-4 h-4" /> Send Feedback</>
                    }
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
