// Shared speech utility — picks the best available voice for a language.
// Works around Chrome's two known Web Speech API bugs:
//   1. getVoices() returns [] on first synchronous call (voices load async)
//   2. speechSynthesis silently freezes after ~15s of page inactivity

const QUALITY_TIERS = ["premium", "enhanced", "natural", "online", "google", "compact"];

function scoreVoice(voice) {
  const name = voice.name.toLowerCase();
  const idx = QUALITY_TIERS.findIndex((t) => name.includes(t));
  return idx === -1 ? QUALITY_TIERS.length - 2 : idx;
}

// Never cache null — always re-query until voices are available
function getBestVoiceForLang(lang = "sv-SE") {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  if (voices.length === 0) return null;
  const candidates = voices.filter((v) => v.lang === lang || v.lang.startsWith(lang.split("-")[0]));
  if (candidates.length === 0) return null;
  return candidates.slice().sort((a, b) => scoreVoice(a) - scoreVoice(b))[0];
}

// Chrome freeze fix: every 10s while speaking, pause+resume to un-stick the engine
if (typeof window !== "undefined" && window.speechSynthesis) {
  setInterval(() => {
    const ss = window.speechSynthesis;
    if (ss?.speaking) {
      ss.pause();
      ss.resume();
    }
  }, 10000);
}

export function getBestVoice(lang = "sv-SE") {
  return getBestVoiceForLang(lang);
}

export function playAudio(text, lang = "sv-SE", speed = 1) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  const voice = getBestVoiceForLang(lang);
  if (voice) utterance.voice = voice;

  utterance.rate = speed === 1 ? 0.92 : speed;
  utterance.pitch = 0.97;

  window.speechSynthesis.speak(utterance);
}
