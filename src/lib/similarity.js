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
 */
export function similarityPercent(a, b) {
  const ta = tokens(a);
  const tb = tokens(b);
  if (!ta.length || !tb.length) return 0;
  const common = lcsLength(ta, tb);
  return Math.round((common * 2 * 100) / (ta.length + tb.length));
}