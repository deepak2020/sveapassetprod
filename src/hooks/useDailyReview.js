import { useAuth } from "@/lib/AuthContext";
import { useVocabSRS } from "./useVocabSRS";

const REVIEW_COUNT = 10;
const MIN_FOR_NUDGE = 3;

// Lower score = pick first. Rewards weakness + recency.
function weaknessScore(card) {
  const seen = card.times_seen || 0;
  const correct = card.times_correct || 0;
  const accuracy = seen > 0 ? correct / seen : 0.5; // unseen = neutral
  const recentMiss = card.last_answer_correct === false ? -1 : 0;
  // Newer/lower-interval cards bubble up too — they need more reps.
  const intervalPenalty = Math.min(card.interval_days || 1, 30) / 30;
  return accuracy + intervalPenalty + recentMiss;
}

export function useDailyReview(offset = 0) {
  const { user } = useAuth();
  const { dueCards, updateCard, refresh } = useVocabSRS();
  const today = new Date().toISOString().split("T")[0];
  const isDone = user?.last_review_date === today;
  const totalDue = dueCards.length;

  // Smarter ordering: weakest + recent mistakes first, then wrap around.
  const ranked = [...dueCards].sort((a, b) => weaknessScore(a) - weaknessScore(b));
  const safeOffset = totalDue > 0 ? offset % totalDue : 0;
  const reviewItems = totalDue === 0
    ? []
    : [...ranked, ...ranked].slice(safeOffset, safeOffset + REVIEW_COUNT);
  const hasMore = totalDue > REVIEW_COUNT;
  const showNudge = !isDone && totalDue >= MIN_FOR_NUDGE;

  return { isDone, reviewItems, totalDue, hasMore, showNudge, today, updateCard, refresh, allCards: dueCards };
}