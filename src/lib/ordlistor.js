import { ALL_WORDS } from "@/data/sprakvagenC";
import { shuffle } from "@/lib/shuffle";

export const SESSION_SIZE = 10;

// Which side of the pair the learner must produce
export function directionSides(direction) {
  return direction === "en-sv"
    ? { prompt: "en", answer: "sv" }
    : { prompt: "sv", answer: "en" };
}

function makeQuestion(word, pool, promptKey, answerKey) {
  // Distractors come from the same topic so the choice is meaningful
  const wrong = shuffle(pool.filter((w) => w[answerKey] !== word[answerKey]))
    .slice(0, 3)
    .map((w) => w[answerKey]);

  const options = shuffle([word[answerKey], ...wrong]);
  return {
    promptText: word[promptKey],
    correctText: word[answerKey],
    options,
    correct: options.indexOf(word[answerKey]),
    sv: word.sv,
    en: word.en,
    chapterTitle: word.chapterTitle,
  };
}

// The words of one topic, in the order of the original word list
export function topicWords(chapter, level) {
  return ALL_WORDS.filter((w) => w.chapter === chapter && w.level === level);
}

// A session that follows the list order, starting where the learner stopped
export function buildSequence(pool, direction, startIndex = 0, size = SESSION_SIZE) {
  const { prompt, answer } = directionSides(direction);
  return pool
    .slice(startIndex, startIndex + size)
    .map((w) => makeQuestion(w, pool, prompt, answer));
}

// Random session from a pool (used by "shuffle everything")
export function buildSession(pool, direction, size = SESSION_SIZE) {
  const { prompt, answer } = directionSides(direction);
  return shuffle(pool)
    .slice(0, Math.min(size, pool.length))
    .map((w) => makeQuestion(w, pool, prompt, answer));
}

// Typing session: English is shown, the learner types the Swedish word.
// `shuffled` draws a random set from the pool instead of following its order.
export function buildTypingQuestions(pool, startIndex = 0, size = SESSION_SIZE, shuffled = false) {
  const source = shuffled ? shuffle(pool) : pool.slice(startIndex, startIndex + size);
  return source.slice(0, Math.min(size, pool.length)).map((w) => ({
    sv: w.sv,
    en: w.en,
    chapterTitle: w.chapterTitle,
  }));
}