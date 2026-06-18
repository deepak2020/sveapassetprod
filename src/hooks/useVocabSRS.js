import { useState, useCallback } from "react";

const KEY = "svenska:vocab_srs_cards";

function readCards() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}

function saveCards(cards) {
  try { localStorage.setItem(KEY, JSON.stringify(cards)); } catch {}
}

// Simplified SM-2: quality 0=wrong, 1=hard, 2=good, 3=easy
function sm2(card, quality) {
  let { interval_days = 1, ease_factor = 2.5, times_seen = 0, times_correct = 0 } = card;
  times_seen += 1;
  if (quality >= 2) {
    times_correct += 1;
    ease_factor = Math.max(1.3, ease_factor + 0.1 - (3 - quality) * (0.08 + (3 - quality) * 0.02));
    interval_days = interval_days <= 1
      ? (quality >= 3 ? 4 : 1)
      : Math.round(interval_days * ease_factor);
    if (quality === 3) interval_days = Math.max(interval_days, 4);
  } else {
    ease_factor = Math.max(1.3, ease_factor - (quality === 0 ? 0.3 : 0.15));
    interval_days = 1;
  }
  const due = new Date();
  due.setDate(due.getDate() + interval_days);
  const due_date = due.toISOString().split("T")[0];
  const status =
    times_seen >= 3 && times_correct / times_seen >= 0.8 && interval_days >= 4
      ? "mastered"
      : times_seen > 0
      ? "review"
      : "new";
  return { ...card, interval_days, ease_factor, times_seen, times_correct, due_date, status };
}

// Standalone — safe to call outside React (e.g. in onComplete callbacks)
export function addVocabSRSCards(wordPairs, lessonId, lessonTitle) {
  const existing = readCards();
  const existingIds = new Set(existing.map((c) => c.id));
  const today = new Date().toISOString().split("T")[0];
  const newCards = (wordPairs || [])
    .filter((wp) => wp.swedish && wp.english)
    .map((wp) => {
      const id = `${lessonId}::${wp.swedish}`;
      if (existingIds.has(id)) return null;
      return {
        id,
        swedish: wp.swedish,
        english: wp.english,
        lessonId,
        lessonTitle,
        due_date: today,
        interval_days: 1,
        ease_factor: 2.5,
        times_seen: 0,
        times_correct: 0,
        status: "new",
      };
    })
    .filter(Boolean);
  if (newCards.length > 0) saveCards([...existing, ...newCards]);
  return newCards.length;
}

// Add words the student got wrong in Skriva (production mode) to the SRS deck.
// `issues` is an array of { wrong, correct, explanation } from Svea feedback.
// `context` is the English prompt sentence (used as the "translation" hint on flip).
export function addMissedWordsFromSkriva(issues, contextEn) {
  if (!Array.isArray(issues) || issues.length === 0) return 0;
  const existing = readCards();
  const existingIds = new Set(existing.map((c) => c.id));
  const today = new Date().toISOString().split("T")[0];
  const newCards = issues
    .map((iss) => {
      const sv = (iss?.correct || "").trim();
      if (!sv) return null;
      const id = `skriva::${sv.toLowerCase()}`;
      if (existingIds.has(id)) return null;
      existingIds.add(id);
      return {
        id,
        swedish: sv,
        english: contextEn || iss?.explanation || "",
        lessonId: null,
        lessonTitle: "Skriva — missed words",
        due_date: today,
        interval_days: 1,
        ease_factor: 2.5,
        times_seen: 0,
        times_correct: 0,
        status: "new",
      };
    })
    .filter(Boolean);
  if (newCards.length > 0) saveCards([...existing, ...newCards]);
  return newCards.length;
}

// Add words from UserVocabulary (saved words) to SRS deck
export function addSavedWordToSRS(word) {
  const id = `saved::${word.id || word.swedish}`;
  const existing = readCards();
  if (existing.some((c) => c.id === id)) return 0;
  const today = new Date().toISOString().split("T")[0];
  saveCards([
    ...existing,
    {
      id,
      swedish: word.swedish,
      english: word.english,
      lessonId: null,
      lessonTitle: word.lesson_title || "My Vocabulary",
      due_date: today,
      interval_days: 1,
      ease_factor: 2.5,
      times_seen: 0,
      times_correct: 0,
      status: "new",
    },
  ]);
  return 1;
}

export function useVocabSRS() {
  const [cards, setCards] = useState(readCards);

  const refresh = useCallback(() => setCards(readCards()), []);

  const updateCard = useCallback((id, quality) => {
    setCards((prev) => {
      const next = prev.map((c) => (c.id === id ? sm2(c, quality) : c));
      saveCards(next);
      return next;
    });
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const dueCards = cards.filter((c) => c.due_date <= today && c.status !== "mastered");
  const masteredCount = cards.filter((c) => c.status === "mastered").length;
  const totalCount = cards.length;

  return { cards, dueCards, masteredCount, totalCount, updateCard, refresh };
}