import { useState, useCallback, useEffect } from "react";

// Lightweight localStorage-backed revision list for Skriva (production) mistakes.
// Stores the sentence (so we can re-quiz it) + grammar issues for context.

const KEY = "svenska:skriva_revision_v1";
const MAX_AGE_DAYS = 30;

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const items = JSON.parse(raw);
    // Auto-prune anything older than 30 days
    const cutoff = Date.now() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
    return items.filter(i => (i.updatedAt || i.addedAt || 0) >= cutoff);
  } catch {
    return [];
  }
}

function persist(items) {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* quota */ }
}

// Singleton notifier so multiple components stay in sync within a tab
const listeners = new Set();
function notify() { listeners.forEach(fn => fn()); }

export function useSkrivaRevision() {
  const [items, setItems] = useState(load);

  useEffect(() => {
    const fn = () => setItems(load());
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  }, []);

  const addMistake = useCallback(({ sentence, userAnswer, grammarIssues, correctedText }) => {
    if (!sentence?.id) return;
    const current = load();
    const idx = current.findIndex(i => i.sentenceId === sentence.id);
    const entry = {
      sentenceId: sentence.id,
      sentence, // full ClozeSentence record — needed to re-run the session
      userAnswer,
      grammarIssues: grammarIssues || [],
      correctedText: correctedText || "",
      attempts: idx >= 0 ? (current[idx].attempts || 1) + 1 : 1,
      addedAt: idx >= 0 ? current[idx].addedAt : Date.now(),
      updatedAt: Date.now(),
    };
    const next = idx >= 0
      ? current.map((i, k) => (k === idx ? entry : i))
      : [...current, entry];
    persist(next);
    setItems(next);
    notify();
  }, []);

  const removeMistake = useCallback((sentenceId) => {
    const next = load().filter(i => i.sentenceId !== sentenceId);
    persist(next);
    setItems(next);
    notify();
  }, []);

  const clearAll = useCallback(() => {
    persist([]);
    setItems([]);
    notify();
  }, []);

  return { items, addMistake, removeMistake, clearAll };
}