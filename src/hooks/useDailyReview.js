import { useAuth } from "@/lib/AuthContext";
import { useVocabSRS } from "./useVocabSRS";

const REVIEW_COUNT = 10;
const MIN_FOR_NUDGE = 3;

export function useDailyReview() {
  const { user } = useAuth();
  const { dueCards, updateCard, refresh } = useVocabSRS();
  const today = new Date().toISOString().split("T")[0];
  const isDone = user?.last_review_date === today;
  const reviewItems = dueCards.slice(0, REVIEW_COUNT);
  const totalDue = dueCards.length;
  const showNudge = !isDone && totalDue >= MIN_FOR_NUDGE;

  return { isDone, reviewItems, totalDue, showNudge, today, updateCard, refresh };
}