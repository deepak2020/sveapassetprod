import { useAuth } from "@/lib/AuthContext";
import { useVocabSRS } from "./useVocabSRS";

const REVIEW_COUNT = 10;
const MIN_FOR_NUDGE = 3;

export function useDailyReview() {
  const { user } = useAuth();
  const { dueCards, updateCard } = useVocabSRS();
  const today = new Date().toISOString().split("T")[0];
  const storageKey = `review_done_${user?.id || user?.email || "anon"}_${today}`;
  const isDone = !!localStorage.getItem(storageKey);
  const reviewItems = dueCards.slice(0, REVIEW_COUNT);
  const totalDue = dueCards.length;
  const showNudge = !isDone && totalDue >= MIN_FOR_NUDGE;
  const markDone = () => localStorage.setItem(storageKey, "1");

  return { isDone, reviewItems, totalDue, showNudge, markDone, updateCard };
}
