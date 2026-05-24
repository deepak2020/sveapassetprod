const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function useExerciseProgress(storageKey) {
  const load = () => {
    if (!storageKey) return null;
    try {
      const raw = localStorage.getItem(`ep:${storageKey}`);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      if (Date.now() - saved.ts > TTL_MS) {
        localStorage.removeItem(`ep:${storageKey}`);
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
      localStorage.setItem(`ep:${storageKey}`, JSON.stringify({ ...progress, ts: Date.now() }));
    } catch {}
  };

  const clear = () => {
    if (!storageKey) return;
    try { localStorage.removeItem(`ep:${storageKey}`); } catch {}
  };

  return { load, save, clear };
}
