import { useState, useCallback } from "react";

const KEY = "svenska:ordlistor:progress";

// How many words of each topic the learner has already worked through.
// Stored per browser so practice can resume in list order.
export function useOrdlisteProgress() {
  const [progress, setProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch {
      return {};
    }
  });

  const markDone = useCallback((topicKey, doneCount) => {
    setProgress((prev) => {
      const next = { ...prev, [topicKey]: Math.max(prev[topicKey] || 0, doneCount) };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const resetTopic = useCallback((topicKey) => {
    setProgress((prev) => {
      const next = { ...prev, [topicKey]: 0 };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { progress, markDone, resetTopic };
}