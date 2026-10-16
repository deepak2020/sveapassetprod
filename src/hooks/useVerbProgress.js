import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { nextProgress } from "@/lib/verbs";

const STORAGE_KEY = "svenska:verb_progress";

function readLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}

function writeLocal(map) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(map)); } catch { /* private mode */ }
}

// Verb progress for the current learner. Signed-in learners keep it in the
// VerbProgress entity; guests get the same shape in localStorage so the page
// still tracks the session until they create a free account.
export function useVerbProgress() {
  const { user, isAuthenticated, authChecked } = useAuth();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authChecked) return;
    if (!isAuthenticated) {
      setProgress(readLocal());
      setLoading(false);
      return;
    }
    let active = true;
    base44.entities.VerbProgress.list("-created_date", 500)
      .then((rows) => {
        if (!active) return;
        const map = {};
        for (const row of rows) map[row.verb_id] = row;
        setProgress(map);
      })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [authChecked, isAuthenticated, user?.id]);

  const record = useCallback(async (verbId, correct) => {
    const prev = progress[verbId];
    const next = nextProgress(prev, correct);

    if (!isAuthenticated) {
      setProgress((current) => {
        const map = { ...current, [verbId]: next };
        writeLocal(map);
        return map;
      });
      return next;
    }

    const saved = prev?.id
      ? await base44.entities.VerbProgress.update(prev.id, next)
      : await base44.entities.VerbProgress.create({ verb_id: verbId, ...next });
    setProgress((current) => ({ ...current, [verbId]: { ...next, id: saved.id } }));
    return next;
  }, [progress, isAuthenticated]);

  return { progress, record, loading, isAuthenticated };
}