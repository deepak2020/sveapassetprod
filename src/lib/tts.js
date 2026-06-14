// Azure TTS via the Supabase "tts" edge function, with caching.
//
// getAzureTtsUrl(text) returns a stored MP3 URL for the phrase, generating it
// on first request and reusing it afterwards. Results are memoised in-memory
// and in sessionStorage so a given phrase only hits the function once per
// session. Returns null (rather than throwing) on any failure so callers can
// fall back to browser speech synthesis.

import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/api/supabaseClient";

const FN_URL = `${SUPABASE_URL}/functions/v1/tts`;
const SS_PREFIX = "tts:url:";
const mem = new Map(); // key -> url | Promise<url|null>

function ssGet(key) {
  try { return sessionStorage.getItem(SS_PREFIX + key); } catch { return null; }
}
function ssSet(key, url) {
  try { sessionStorage.setItem(SS_PREFIX + key, url); } catch { /* quota/private mode */ }
}

export async function getAzureTtsUrl(text) {
  const key = (text || "").trim();
  if (!key) return null;

  if (mem.has(key)) return mem.get(key);
  const cached = ssGet(key);
  if (cached) { mem.set(key, cached); return cached; }

  const pending = (async () => {
    try {
      const res = await fetch(FN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ text: key }),
      });
      if (!res.ok) throw new Error(`tts ${res.status}`);
      const { url } = await res.json();
      if (!url) throw new Error("no url");
      mem.set(key, url);
      ssSet(key, url);
      return url;
    } catch (e) {
      mem.delete(key); // allow a later retry
      return null;
    }
  })();

  mem.set(key, pending); // dedupe concurrent requests for the same phrase
  return pending;
}
