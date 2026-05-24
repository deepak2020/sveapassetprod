import { supabase } from '@/api/supabaseClient';

const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const pendingTimers = new Map();

export function useExerciseProgress(storageKey, userId, lessonId, tab) {
  const lsKey = `ep:${storageKey}`;

  const load = () => {
    if (!storageKey) return null;
    try {
      const raw = localStorage.getItem(lsKey);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      if (Date.now() - saved.ts > TTL_MS) {
        localStorage.removeItem(lsKey);
        return null;
      }
      return saved;
    } catch {
      return null;
    }
  };

  const save = (progress) => {
    if (!storageKey) return;
    try {
      localStorage.setItem(lsKey, JSON.stringify({ ...progress, ts: Date.now() }));
    } catch {}

    if (userId && lessonId && tab) {
      if (pendingTimers.has(storageKey)) clearTimeout(pendingTimers.get(storageKey));
      pendingTimers.set(storageKey, setTimeout(() => {
        pendingTimers.delete(storageKey);
        supabase.exerciseProgress.upsert(userId, lessonId, tab, progress.current ?? 0, progress.score ?? 0);
      }, 1500));
    }
  };

  const clear = () => {
    if (!storageKey) return;
    try { localStorage.removeItem(lsKey); } catch {}
    if (pendingTimers.has(storageKey)) {
      clearTimeout(pendingTimers.get(storageKey));
      pendingTimers.delete(storageKey);
    }
    if (userId && lessonId && tab) {
      supabase.exerciseProgress.clear(userId, lessonId, tab);
    }
  };

  return { load, save, clear };
}
