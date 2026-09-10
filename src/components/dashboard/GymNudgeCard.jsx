import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Dumbbell, X, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const DISMISS_KEY = "svenska:gym_nudge_dismissed";

export default function GymNudgeCard({ results = [] }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    } catch { /* ignore */ }
  }, []);

  // Count unique lessons the user has completed (lesson_tab QuizResults)
  const lessonIds = new Set(
    results
      .filter((r) => r.quiz_type === "lesson_tab" && r.source_id)
      .map((r) => r.source_id)
  );
  const lessonCount = lessonIds.size;

  // Check if user has ever used the Gym (any SRS card means they've started a session)
  const { data: srsCards = [] } = useQuery({
    queryKey: ["srs-cards-nudge"],
    queryFn: () => base44.entities.UserSRSCard.list(),
  });
  const hasUsedGym = srsCards.length > 0;

  const handleDismiss = () => {
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
    setDismissed(true);
    base44.analytics.track({ eventName: "gym_nudge_dismissed" });
  };

  // Show only when: user has completed ≥2 lessons, hasn't used the gym, hasn't dismissed
  if (dismissed || lessonCount < 2 || hasUsedGym) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
      >
        <Card className="border-violet-200 dark:border-violet-800/60 bg-gradient-to-br from-violet-50 to-card dark:from-violet-950/30 relative overflow-hidden">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-muted-foreground/60 hover:text-foreground transition-colors p-1"
            aria-label="Stäng · Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
          <CardContent className="p-5">
            <div className="flex items-start gap-4 pr-6">
              <div className="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center shrink-0">
                <Dumbbell className="w-6 h-6 text-violet-600 dark:text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-0.5">
                  Låt det du lärt dig fastna
                </h3>
                <p className="text-xs text-muted-foreground italic mb-2">
                  Make what you've learned stick
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Du har klarat <span className="font-semibold text-foreground">{lessonCount} lektioner</span> — men ännu inte provat Träningssalen. Spaced repetition hjälper dig minnas ord och fraser permanent istället för att glömma dem.
                </p>
                <Link
                  to="/gym"
                  onClick={() => base44.analytics.track({ eventName: "gym_nudge_clicked", properties: { lessons_completed: lessonCount } })}
                >
                  <Button size="sm" className="mt-3 gap-2 bg-violet-600 hover:bg-violet-700">
                    <Sparkles className="w-3.5 h-3.5" />
                    Prova Träningssalen
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}