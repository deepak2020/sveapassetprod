import { useState, useCallback } from "react";

const KEY = "svenska:writing_revision";

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(items) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
}

export function useWritingRevision() {
  const [items, setItems] = useState(() => load());

  const addToRevision = useCallback(({ lessonId, promptIndex, promptText, exampleAnswer, userAnswer, grammarIssues }) => {
    setItems(prev => {
      const existingIdx = prev.findIndex(i => i.lessonId === lessonId && i.promptIndex === promptIndex);
      let next;
      if (existingIdx >= 0) {
        next = [...prev];
        next[existingIdx] = {
          ...next[existingIdx],
          userAnswer,
          grammarIssues,
          attempts: (next[existingIdx].attempts || 1) + 1,
          updatedAt: Date.now(),
        };
      } else {
        next = [...prev, {
          id: `${lessonId}-${promptIndex}`,
          lessonId,
          promptIndex,
          promptText,
          exampleAnswer,
          userAnswer,
          grammarIssues,
          attempts: 1,
          addedAt: Date.now(),
          updatedAt: Date.now(),
        }];
      }
      persist(next);
      return next;
    });
  }, []);

  const removeFromRevision = useCallback((lessonId, promptIndex) => {
    setItems(prev => {
      const next = prev.filter(i => !(i.lessonId === lessonId && i.promptIndex === promptIndex));
      persist(next);
      return next;
    });
  }, []);

  const getForLesson = useCallback((lessonId) => {
    return items.filter(i => i.lessonId === lessonId);
  }, [items]);

  return { items, addToRevision, removeFromRevision, getForLesson };
}
