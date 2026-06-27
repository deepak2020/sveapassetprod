import { useAuth } from "@/lib/AuthContext";
import { useVocabSRS } from "./useVocabSRS";

const REVIEW_COUNT = 10;
const MIN_FOR_NUDGE = 3;

export function useDailyReview(offset = 0) {
  const { user } = useAuth();
  const { dueCards, updateCard, refresh } = useVocabSRS();
  const today = new Date().toISOString().split("T")[0];
  const isDone = user?.last_review_date === today;
  const totalDue = dueCards.length;
  // Wrap-around so requesting the next batch keeps working even after the user
  // burns through all due cards in one sitting.
  const safeOffset = totalDue > 0 ? offset % totalDue : 0;
  const reviewItems = totalDue === 0
    ? []
    : [...dueCards, ...dueCards].slice(safeOffset, safeOffset + REVIEW_COUNT);
  const hasMore = totalDue > REVIEW_COUNT;
  const showNudge = !isDone && totalDue >= MIN_FOR_NUDGE;

  return { isDone, reviewItems, totalDue, hasMore, showNudge, today, updateCard, refresh };
}