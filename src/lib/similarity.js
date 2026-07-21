// Lightweight word-level similarity for speech transcripts.
// Uses longest-common-subsequence on tokens so extra/missing/re-ordered words
// still produce a graceful match percentage.

import { normalizeAnswer } from "@/lib/normalizeAnswer";

function tokens(s) {
  return normalizeAnswer(s).split(" ").filter(Boolean);
}

function lcsLength(a, b) {
  const m = a.length;
  const n = b.length;
  if (!m || !n) return 0;
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    let prev = 0;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j];
      if (a[i - 1] === b[j - 1]) dp[j] = prev + 1;
      else dp[j] = Math.max(dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[n];
}

/**
 * 0–100 similarity between two Swedish sentences.
 * 100 = perfect match, 0 = nothing in common.
 *
 * For short answers (≤2 target words) we ALSO compute character-level
 * similarity and take the higher score. Chrome's Swedish recognizer often
 * mangles uncommon words (e.g. "påtår" → "på dör") — those are phonetically
 * close, so char-level matching keeps the user unblocked.
 */
export function similarityPercent(a, b) {
  const ta = tokens(a);
  const tb = tokens(b);
  if (!ta.length || !tb.length) return 0;
  const wordScore = Math.round((lcsLength(ta, tb) * 2 * 100) / (ta.length + tb.length));

  if (tb.length <= 2) {
    const ca = ta.join("").split("");
    const cb = tb.join("").split("");
    const charScore = Math.round((lcsLength(ca, cb) * 2 * 100) / (ca.length + cb.length));
    return Math.max(wordScore, charScore);
  }
  return wordScore;
}