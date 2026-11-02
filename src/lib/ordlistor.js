import { ALL_WORDS } from "@/data/sprakvagenC";
import { shuffle } from "@/lib/shuffle";

const SESSION_SIZE = 12;

// Which side of the pair the learner must produce
export function directionSides(direction) {
  return direction === "en-sv"
    ? { prompt: "en", answer: "sv" }
    : { prompt: "sv", answer: "en" };
}

// Build one multiple-choice session from the selected pool.
export function buildSession(pool, direction, size = SESSION_SIZE) {
  const { prompt, answer } = directionSides(direction);
  const targets = shuffle(pool).slice(0, Math.min(size, pool.length));

  return targets.map((word) => {
    // Distractors come from the same pool so the choice is meaningful
    const wrong = shuffle(
      pool.filter((w) => w[answer] !== word[answer])
    )
      .slice(0, 3)
      .map((w) => w[answer]);

    const options = shuffle([word[answer], ...wrong]);
    return {
      promptText: word[prompt],
      correctText: word[answer],
      options,
      correct: options.indexOf(word[answer]),
      sv: word.sv,
      en: word.en,
      chapterTitle: word.chapterTitle,
    };
  });
}

export function filterPool({ chapter, level }) {
  return ALL_WORDS.filter(
    (w) =>
      (chapter === "all" || w.chapter === chapter) &&
      (level === "all" || w.level === level)
  );
}