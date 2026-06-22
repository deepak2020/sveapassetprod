// Word-level diff using LCS (longest common subsequence).
// Returns an array of segments: { type: "same" | "del" | "ins", text }
// — "del" = word in original that was removed/changed
// — "ins" = word added in the corrected version
// — "same" = unchanged word
//
// We compare on a normalized form (lowercase, letters-only) so punctuation
// and casing differences don't create false mismatches, but render the
// ORIGINAL surface form so the student sees exactly what they wrote / what
// the correction is.

function normWord(w) {
  return (w || "").toLowerCase().replace(/[^a-zåäöA-ZÅÄÖ0-9]/g, "");
}

// Split into words, dropping pure whitespace tokens (we re-insert spaces on render).
function words(text) {
  return (text || "").trim().split(/\s+/).filter(Boolean);
}

export function diffWords(original, corrected) {
  const a = words(original);
  const b = words(corrected);
  const n = a.length, m = b.length;

  // Build LCS length table on normalized forms.
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    const an = normWord(a[i]);
    for (let j = m - 1; j >= 0; j--) {
      if (an && an === normWord(b[j])) dp[i][j] = dp[i + 1][j + 1] + 1;
      else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  // Walk the table to produce the diff segments in order.
  const segs = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    const an = normWord(a[i]);
    const bn = normWord(b[j]);
    if (an && an === bn) {
      segs.push({ type: "same", text: a[i] });
      i++; j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      segs.push({ type: "del", text: a[i] });
      i++;
    } else {
      segs.push({ type: "ins", text: b[j] });
      j++;
    }
  }
  while (i < n) { segs.push({ type: "del", text: a[i++] }); }
  while (j < m) { segs.push({ type: "ins", text: b[j++] }); }
  return segs;
}

// Pair adjacent del-runs with ins-runs so the UI can render "wrong → right"
// inline instead of one big strikethrough block followed by one big green block.
// Returns segments of type: "same" | "del" | "ins" | "replace" ({ del:[], ins:[] })
export function diffWordsInline(original, corrected) {
  const raw = diffWords(original, corrected);
  const out = [];
  let k = 0;
  while (k < raw.length) {
    const s = raw[k];
    if (s.type === "same") { out.push(s); k++; continue; }
    // collect a run of del/ins (in any order)
    const dels = [], inses = [];
    while (k < raw.length && raw[k].type !== "same") {
      if (raw[k].type === "del") dels.push(raw[k].text);
      else inses.push(raw[k].text);
      k++;
    }
    if (dels.length && inses.length) out.push({ type: "replace", del: dels, ins: inses });
    else if (dels.length) out.push({ type: "del", text: dels.join(" ") });
    else if (inses.length) out.push({ type: "ins", text: inses.join(" ") });
  }
  return out;
}