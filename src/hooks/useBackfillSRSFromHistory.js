import { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { addVocabSRSCards } from "./useVocabSRS";

const FLAG_KEY = "svenska:srs_backfill_done_v1";

// One-time backfill: for users who completed lessons BEFORE the
// "add SRS cards on any tab completion" change shipped, walk their
// QuizResult history (lesson_tab + language quizzes) and seed the
// SRS deck from those lessons' word_pairs. Runs once per browser.
export function useBackfillSRSFromHistory() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    if (typeof window === "undefined") return;
    if (localStorage.getItem(FLAG_KEY)) return;

    (async () => {
      try {
        // Pull every completed lesson_tab result for this user
        const results = await base44.entities.QuizResult.filter(
          { quiz_type: "lesson_tab" },
          null,
          1000
        );
        const lessonIds = [...new Set((results || []).map(r => r.source_id).filter(Boolean))];
        if (lessonIds.length === 0) {
          localStorage.setItem(FLAG_KEY, "1");
          return;
        }

        // Fetch the lessons in a few batched queries (never one request per
        // lesson — that hits the rate limit and the backfill never completes)
        const CHUNK = 50;
        for (let i = 0; i < lessonIds.length; i += CHUNK) {
          const chunk = lessonIds.slice(i, i + CHUNK);
          try {
            const lessons = await base44.entities.Lesson.filter({ id: { $in: chunk } }, null, CHUNK);
            for (const lesson of lessons || []) {
              if (lesson?.word_pairs?.length) {
                addVocabSRSCards(lesson.word_pairs, lesson.id, lesson.title);
              }
            }
          } catch (_) {}
        }
        localStorage.setItem(FLAG_KEY, "1");
      } catch (_) {}
    })();
  }, [isAuthenticated]);
}