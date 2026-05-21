import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

const STORAGE_PREFIX = "svenska:writing:";

function localKey(lessonId) {
  return STORAGE_PREFIX + lessonId;
}

function loadLocal(lessonId) {
  try {
    const raw = localStorage.getItem(localKey(lessonId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocal(lessonId, answers) {
  try {
    localStorage.setItem(localKey(lessonId), JSON.stringify(answers));
  } catch {}
}

// Answers are stored in QuizResult as quiz_type="writing_answer",
// source_id=lessonId, skill="writing_N" (N = prompt index), answer_text=text.
// On load we take the most recent record per skill key (handles edits).
export function useWritingAnswers(lessonId) {
  const { isAuthenticated } = useAuth();
  const [answers, setAnswers] = useState(() => loadLocal(lessonId));
  const [loading, setLoading] = useState(false);
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!lessonId || !isAuthenticated || syncedRef.current) return;
    syncedRef.current = true;
    setLoading(true);

    base44.entities.QuizResult.filter(
      { quiz_type: "writing_answer", source_id: lessonId },
      null,
      100
    )
      .then((results) => {
        if (!results?.length) return;

        // Build answer map from backend, most recent record per skill wins
        const backendAnswers = {};
        const sorted = [...results].sort((a, b) =>
          (a.created_date || 0) > (b.created_date || 0) ? 1 : -1
        );
        sorted.forEach((r) => {
          if (r.skill && r.answer_text != null) {
            const idx = parseInt(r.skill.replace("writing_", ""), 10);
            if (!isNaN(idx)) backendAnswers[idx] = r.answer_text;
          }
        });

        if (!Object.keys(backendAnswers).length) return;

        setAnswers((prev) => {
          const merged = { ...backendAnswers, ...prev };
          saveLocal(lessonId, merged);
          return merged;
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lessonId, isAuthenticated]);

  const saveAnswer = (index, answer) => {
    const updated = { ...answers, [index]: answer };
    setAnswers(updated);
    saveLocal(lessonId, updated);

    if (isAuthenticated) {
      base44.entities.QuizResult.create({
        quiz_type: "writing_answer",
        source_id: lessonId,
        skill: `writing_${index}`,
        answer_text: answer,
        score: 1,
        total: 1,
        percentage: 100,
      }).catch(() => {});
    }
  };

  const removeAnswer = (index) => {
    const updated = { ...answers };
    delete updated[index];
    setAnswers(updated);
    saveLocal(lessonId, updated);
  };

  return { answers, loading, saveAnswer, removeAnswer };
}
