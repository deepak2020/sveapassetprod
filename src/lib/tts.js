// Swedish text-to-speech via the Base44 GenerateSpeech integration.
//
// Every Swedish word/sentence is generated once and then cached permanently in
// localStorage, so a given phrase is only ever synthesised a single time per
// browser. The audio always comes back as native Swedish (language_code "sv"),
// which is what keeps word pronunciations accurate.
//
// getTtsUrl(text) returns a stored MP3 URL or null (never throws) so callers can
// fall back to the browser's own voice.

import { base44 } from "@/api/base44Client";

const LS_PREFIX = "tts:url:v3:";
const mem = new Map(); // key -> url | Promise<url|null>

function lsGet(key) {
  try { return localStorage.getItem(LS_PREFIX + key); } catch { return null; }
}
function lsSet(key, url) {
  try { localStorage.setItem(LS_PREFIX + key, url); } catch { /* quota/private mode */ }
}

// Synchronous lookup — returns a ready URL from cache, or null. Lets callers
// start playback inside a user gesture (important for iOS autoplay rules).
export function getCachedTtsUrl(text) {
  const key = (text || "").trim();
  if (!key) return null;
  const m = mem.get(key);
  if (typeof m === "string") return m;
  const stored = lsGet(key);
  if (stored) { mem.set(key, stored); return stored; }
  return null;
}

export async function getTtsUrl(text) {
  const key = (text || "").trim();
  if (!key) return null;

  if (mem.has(key)) return mem.get(key);
  const cached = getCachedTtsUrl(key);
  if (cached) return cached;

  const pending = (async () => {
    try {
      const res = await base44.functions.invoke("swedishTts", { text: key });
      const url = res?.data?.url;
      if (!url) throw new Error("no url");
      mem.set(key, url);
      lsSet(key, url);
      return url;
    } catch {
      mem.delete(key); // allow a later retry
      return null;
    }
  })();

  mem.set(key, pending); // dedupe concurrent requests for the same phrase
  return pending;
}

// Fire-and-forget warm-up so the clip is ready before the user taps.
// Only call this on real intent (hover/focus), since each new phrase costs a
// speech generation.
export function prefetchTts(text) {
  if (!text) return;
  if (getCachedTtsUrl(text)) return;
  getTtsUrl(text);
}