/**
 * Normalize a user-typed or speech-recognized answer before comparison.
 * Strips punctuation, collapses whitespace, lowercases.
 *
 * Chrome's Swedish speech recognizer often returns spoken digits as numerals
 * (e.g. "noll sju noll" → "070"). Convert each digit to its Swedish word so
 * the transcript can still match a word-level target (and vice-versa).
 */
const DIGIT_TO_SV = {
  0: "noll", 1: "ett", 2: "två", 3: "tre", 4: "fyra",
  5: "fem", 6: "sex", 7: "sju", 8: "åtta", 9: "nio",
};

function digitsToWords(str) {
  return str.replace(/\d+/g, (m) =>
    m.split("").map((d) => DIGIT_TO_SV[d] || d).join(" ")
  );
}

export function normalizeAnswer(s) {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:'"“”‘’]/g, "")
    .replace(/[—–-]/g, " ") // dashes act as separators → turn into spaces
    .replace(/\d+/g, (m) => " " + digitsToWords(m) + " ") // numerals → Swedish words
    .replace(/\s+/g, " ")
    .trim();
}