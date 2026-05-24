/**
 * Normalize a user-typed or speech-recognized answer before comparison.
 * Strips punctuation, collapses whitespace, lowercases.
 */
export function normalizeAnswer(s) {
  return (s || "").trim().toLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ");
}
