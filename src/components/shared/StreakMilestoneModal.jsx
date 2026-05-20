import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const MILESTONE_CONFIG = {
  7:   { emoji: "🔥", title: "En veckas svit!", subtitle: "7-day streak!", color: "from-orange-400 to-amber-500" },
  30:  { emoji: "🏆", title: "En månads svit!", subtitle: "30-day streak!", color: "from-violet-500 to-purple-600" },
  100: { emoji: "👑", title: "100 dagars svit!", subtitle: "100-day streak!", color: "from-yellow-400 to-amber-500" },
};

export default function StreakMilestoneModal() {
  const [milestone, setMilestone] = useState(null);

  useEffect(() => {
    const handler = (e) => setMilestone(e.detail);
    window.addEventListener("streak-milestone", handler);
    return () => window.removeEventListener("streak-milestone", handler);
  }, []);

  const config = milestone ? MILESTONE_CONFIG[milestone.streak] : null;

  return (
    <AnimatePresence>
      {milestone && config && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMilestone(null)} />
          <motion.div
            className="relative bg-card rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border border-border/50 overflow-hidden"
            initial={{ scale: 0.7, y: 40 }}
            animate={{ scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {/* Background gradient glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-10`} />

            <div className="relative">
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {config.emoji}
              </motion.div>

              <h2 className="font-display text-2xl font-bold text-foreground mb-1">{config.title}</h2>
              <p className="text-muted-foreground text-sm italic mb-4">{config.subtitle}</p>

              <div className="flex items-center justify-center gap-2 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-700/40 rounded-xl px-4 py-2 mb-6 mx-auto w-fit">
                <Zap className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-amber-700 dark:text-amber-400">+{milestone.bonusXP} XP bonus</span>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                <Flame className="w-4 h-4 text-orange-500" />
                <span><span className="font-bold text-foreground">{milestone.streak}</span> dagar i rad · days in a row</span>
              </div>

              <Button className="w-full" onClick={() => setMilestone(null)}>
                Fortsätt lära! · Keep going!
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
