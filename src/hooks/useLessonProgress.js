import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const KEY_LAST = "svenska:last_lesson";
const KEY_PROGRESS_PREFIX = "svenska:lesson_progress:";
const KEY_SCORES_PREFIX = "svenska:lesson_scores:";

// Track the most recently visited lesson (used by the Continue Learning card)
export function setLastLesson(lesson) {
  if (!lesson?.id) return;
  try {
    localStorage.setItem(
      KEY_LAST,
      JSON.stringify({
        id: lesson.id,
        title: lesson.title,
        title_sv: lesson.title_sv,
        sfi_course: lesson.sfi_course,
        topic: lesson.topic,
        skill: lesson.skill || lesson.category,
        at: Date.now(),
      })
    );
  } catch (_) {}
}

export function useLastLesson() {
  const [last, setLast] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY_LAST);
      if (raw) setLast(JSON.parse(raw));
    } catch (_) {}
  }, []);

  return last;
}

// Save and restore the list of completed activity keys + per-skill last scores.
// Persists to both localStorage (fast, offline) and backend via QuizResult
// (quiz_type="lesson_tab") so progress survives across devices and logins.
export function useLessonCompletion(lessonId) {
  const [completed, setCompleted] = useState([]);
  const [scores, setScores] = useState({});
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!lessonId) return;

    // Load from localStorage immediately (no latency)
    try {
      const raw = localStorage.getItem(KEY_PROGRESS_PREFIX + lessonId);
      if (raw) setCompleted(JSON.parse(raw));
      const rawScores = localStorage.getItem(KEY_SCORES_PREFIX + lessonId);
      if (rawScores) setScores(JSON.parse(rawScores));
    } catch (_) {}

    // Load from backend and merge — only when logged in, so records are user-scoped
    if (!isAuthenticated) return;
    base44.entities.QuizResult.filter(
      { quiz_type: "lesson_tab", source_id: lessonId },
      null,
      200
    )
      .then((results) => {
        if (!results?.length) return;
        const backendKeys = [...new Set(results.map((r) => r.skill).filter(Boolean))];
        setCompleted((prev) => {
          const merged = [...new Set([...prev, ...backendKeys])];
          if (merged.length !== prev.length) {
            try {
              localStorage.setItem(KEY_PROGRESS_PREFIX + lessonId, JSON.stringify(merged));
            } catch (_) {}
          }
          return merged;
        });
      })
      .catch(() => {});
  }, [lessonId, isAuthenticated]);

  const markComplete = (key, scoreInfo) => {
    // Skip silently if already marked complete — prevents duplicate backend records
    // when WritingExercise / SpeakingPractice re-fire onComplete on mount.
    if (completed.includes(key)) return;

    // Update local state + localStorage immediately
    setCompleted((prev) => {
      if (prev.includes(key)) return prev;
      const next = [...prev, key];
      try {
        localStorage.setItem(KEY_PROGRESS_PREFIX + lessonId, JSON.stringify(next));
      } catch (_) {}
      return next;
    });

    // Persist to backend only when logged in — records are automatically
    // scoped to the authenticated user by the base44 server via the auth token
    if (isAuthenticated) {
      base44.entities.QuizResult.create({
        quiz_type: "lesson_tab",
        source_id: lessonId,
        skill: key,
        score: scoreInfo?.score ?? 1,
        total: scoreInfo?.total ?? 1,
        percentage:
          scoreInfo?.total > 0
            ? Math.round((scoreInfo.score / scoreInfo.total) * 100)
            : 100,
      }).catch(() => {});
    }

    if (scoreInfo && typeof scoreInfo.score === "number" && typeof scoreInfo.total === "number") {
      setScores((prev) => {
        const percentage =
          scoreInfo.total > 0 ? Math.round((scoreInfo.score / scoreInfo.total) * 100) : 0;
        const next = {
          ...prev,
          [key]: { score: scoreInfo.score, total: scoreInfo.total, percentage, at: Date.now() },
        };
        try {
          localStorage.setItem(KEY_SCORES_PREFIX + lessonId, JSON.stringify(next));
        } catch (_) {}
        return next;
      });
    }
  };

  return { completed, scores, markComplete };
}
