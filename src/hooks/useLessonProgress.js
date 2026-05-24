import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const KEY_LAST = "svenska:last_lesson";
const KEY_PROGRESS_PREFIX = "svenska:lesson_progress:";
const KEY_SCORES_PREFIX = "svenska:lesson_scores:";

// One-time session cleanup: remove "writing" and "speaking" from all lesson_progress
// localStorage entries so that spurious QuizResult records created by old buggy code
// no longer auto-mark these tabs as complete. Writing completions will be re-validated
// against actual writing_answer records from the backend. Speaking is validated locally.
const PURGE_KEY = "svenska:suspect_completions_v1";
function purgeLocalSuspectCompletions() {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(PURGE_KEY)) return;
  sessionStorage.setItem(PURGE_KEY, "1");
  try {
    const progressKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(KEY_PROGRESS_PREFIX)) progressKeys.push(k);
    }
    for (const k of progressKeys) {
      try {
        const arr = JSON.parse(localStorage.getItem(k) || "[]");
        if (Array.isArray(arr)) {
          const cleaned = arr.filter(t => t !== "writing" && t !== "speaking");
          if (cleaned.length !== arr.length) localStorage.setItem(k, JSON.stringify(cleaned));
        }
      } catch (_) {}
      // Also remove spurious "speaking" score (can't be validated from backend)
      const lessonId = k.slice(KEY_PROGRESS_PREFIX.length);
      try {
        const scoreKey = KEY_SCORES_PREFIX + lessonId;
        const scores = JSON.parse(localStorage.getItem(scoreKey) || "{}");
        if (scores.speaking !== undefined) {
          delete scores.speaking;
          localStorage.setItem(scoreKey, JSON.stringify(scores));
        }
      } catch (_) {}
    }
  } catch (_) {}
}

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

    // Remove stale spurious writing/speaking keys from all lesson_progress localStorage entries
    purgeLocalSuspectCompletions();

    // Load from localStorage immediately (no latency)
    try {
      const raw = localStorage.getItem(KEY_PROGRESS_PREFIX + lessonId);
      if (raw) setCompleted(JSON.parse(raw));
      const rawScores = localStorage.getItem(KEY_SCORES_PREFIX + lessonId);
      if (rawScores) setScores(JSON.parse(rawScores));
    } catch (_) {}

    // Load from backend and merge — only when logged in, so records are user-scoped.
    // "writing" is only trusted when actual writing_answer records exist (prevents spurious
    // completions from the old auto-firing bug from polluting lesson progress).
    // "speaking" is validated locally only — the backend record cannot be reliably
    // distinguished from spurious completions, so we trust localStorage exclusively.
    if (!isAuthenticated) return;
    Promise.all([
      base44.entities.QuizResult.filter({ quiz_type: "lesson_tab", source_id: lessonId }, null, 200),
      base44.entities.QuizResult.filter({ quiz_type: "writing_answer", source_id: lessonId }, null, 5),
    ])
      .then(([tabResults, writingAnswers]) => {
        const hasRealWritingAnswers = (writingAnswers?.length ?? 0) > 0;
        const backendKeys = [
          ...new Set((tabResults || []).map((r) => r.skill).filter(Boolean)),
        ].filter((k) => {
          if (k === "writing") return hasRealWritingAnswers;
          if (k === "speaking") return false; // trust localStorage only
          return true;
        });
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
    // Skip silently if already marked complete — prevents duplicate backend records.
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
