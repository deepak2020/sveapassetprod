import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/api/supabaseClient";

const LS_KEY = "grammar:progress";

function readLocalAll() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function writeLocalAll(map) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(map)); } catch {}
}

export function useGrammarProgress() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || user?.email;

  // { [topicId]: { done, total, score, completed } }
  const [progress, setProgress] = useState(readLocalAll);
  const [synced, setSynced] = useState(false);

  // Load from DB on mount (merge over local — DB wins for completed topics)
  useEffect(() => {
    if (!isAuthenticated || !userId) { setSynced(true); return; }
    supabase.grammar.getProgressForUser(userId).then(({ data }) => {
      if (!data?.length) { setSynced(true); return; }
      setProgress(prev => {
        const merged = { ...prev };
        for (const row of data) {
          merged[row.topic_id] = {
            done: row.exercises_done,
            total: row.exercises_total,
            score: row.score,
            completed: row.completed,
          };
        }
        writeLocalAll(merged);
        return merged;
      });
      setSynced(true);
    }).catch(() => setSynced(true));
  }, [userId, isAuthenticated]);

  const saveProgress = useCallback((topicId, done, total, score, completed) => {
    // Optimistic local update
    setProgress(prev => {
      const next = { ...prev, [topicId]: { done, total, score, completed } };
      writeLocalAll(next);
      return next;
    });
    // Persist to DB if authenticated
    if (isAuthenticated && userId) {
      supabase.grammar.upsertProgress(userId, topicId, done, total, score, completed)
        .catch(() => {}); // silently fail — local state is source of truth
    }
  }, [userId, isAuthenticated]);

  const getTopicProgress = useCallback((topicId) => {
    return progress[topicId] || null;
  }, [progress]);

  return { progress, saveProgress, getTopicProgress, synced };
}
