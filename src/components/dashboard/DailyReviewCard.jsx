import { useState } from "react";
import { Zap, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useDailyReview } from "@/hooks/useDailyReview";
import DailyReviewSession from "@/components/shared/DailyReviewSession";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { awardXP, XP_REWARDS } from "@/lib/xp";
import { useQueryClient } from "@tanstack/react-query";

export default function DailyReviewCard() {
  const [sessionOpen, setSessionOpen] = useState(false);
  const [batchOffset, setBatchOffset] = useState(0);
  const { isDone, reviewItems, totalDue, hasMore, showNudge, today, updateCard, refresh, allCards } = useDailyReview(batchOffset);
  const { checkUserAuth } = useAuth();
  const queryClient = useQueryClient();

  if (totalDue === 0) return null;

  const handleComplete = async () => {
    // Guard against double-awarding (e.g. stale UI, concurrent tabs) by checking
    // server state right before marking done — isDone above can be stale.
    const freshUser = await base44.auth.me();
    if (freshUser?.last_review_date !== today) {
      await base44.auth.updateMe({ last_review_date: today });
      await awardXP(base44, XP_REWARDS.daily_review_bonus, "🔥 Daily warm-up bonus");
    }
    await checkUserAuth();
    queryClient.invalidateQueries({ queryKey: ["me"] });
    setSessionOpen(false);
  };

  if (sessionOpen) {
    return (
      <DailyReviewSession
        items={reviewItems}
        pool={allCards}
        onAnswer={updateCard}
        onComplete={handleComplete}
        onExit={() => { setSessionOpen(false); refresh?.(); }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0 text-xl">
                🔥
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">
                  Daily Warm-up
                  <span className="ml-2 text-xs font-normal text-muted-foreground italic">· Daglig uppvärmning</span>
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Review {Math.min(totalDue, 10)} words you've learned
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2.5 py-1 rounded-lg">
                <Zap className="w-3.5 h-3.5" /> +{XP_REWARDS.daily_review_bonus} XP
              </div>
              <Button
                size="sm"
                onClick={() => setSessionOpen(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white border-0"
              >
                Start
              </Button>
            </div>
          </div>



          {/* Mini progress hint */}
          <div className="mt-3 flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {totalDue} word{totalDue !== 1 ? "s" : ""} due today · ~{Math.ceil(Math.min(totalDue, 10) * 0.4)} min
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}