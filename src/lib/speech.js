// Shared speech utility — picks the best available voice for a language
// and applies learner-friendly rate/pitch defaults.

const QUALITY_TIERS = ["premium", "enhanced", "natural", "online", "google", "compact"];

function scoreVoice(voice) {
  const name = voice.name.toLowerCase();
  const idx = QUALITY_TIERS.findIndex((t) => name.includes(t));
  return idx === -1 ? QUALITY_TIERS.length - 2 : idx;
}

function pickBestVoice(lang = "sv-SE") {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  const candidates = voices.filter((v) => v.lang === lang || v.lang.startsWith(lang.split("-")[0]));
  if (candidates.length === 0) return null;
  return candidates.slice().sort((a, b) => scoreVoice(a) - scoreVoice(b))[0];
}

const voiceCache = {};

function getCachedVoice(lang = "sv-SE") {
  if (!voiceCache[lang]) {
    voiceCache[lang] = pickBestVoice(lang);
  }
  return voiceCache[lang];
}

// Prime the cache once voices load (Chrome loads them async)
if (typeof window !== "undefined" && window.speechSynthesis) {
  const prime = () => { voiceCache["sv-SE"] = pickBestVoice("sv-SE"); };
  if (window.speechSynthesis.getVoices().length > 0) prime();
  else window.speechSynthesis.addEventListener("voiceschanged", prime, { once: true });
}

export function getBestVoice(lang = "sv-SE") {
  return getCachedVoice(lang);
}

export function playAudio(text, lang = "sv-SE", speed = 1) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  const voice = getCachedVoice(lang);
  if (voice) utterance.voice = voice;

  // Apply learner-friendly defaults when using natural speed
  utterance.rate = speed === 1 ? 0.92 : speed;
  utterance.pitch = 0.97;

  window.speechSynthesis.speak(utterance);
}
