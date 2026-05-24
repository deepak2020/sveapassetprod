// Shared speech utility — picks the best available voice for a language.
// Handles browser-specific Web Speech API bugs:
//   Chrome: getVoices() async load + engine freeze after inactivity
//   Safari: voiceschanged never fires + cancel() breaks immediate speak

const QUALITY_TIERS = ["premium", "enhanced", "natural", "online", "google", "compact"];

function scoreVoice(voice) {
  const name = voice.name.toLowerCase();
  const idx = QUALITY_TIERS.findIndex((t) => name.includes(t));
  return idx === -1 ? QUALITY_TIERS.length - 2 : idx;
}

function getBestVoiceForLang(lang = "sv-SE") {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  if (voices.length === 0) return null;
  const candidates = voices.filter((v) => v.lang === lang || v.lang.startsWith(lang.split("-")[0]));
  if (candidates.length === 0) return null;
  return candidates.slice().sort((a, b) => scoreVoice(a) - scoreVoice(b))[0];
}

const isSafari =
  typeof window !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Chrome freeze fix: pause+resume every 10s while speaking
if (typeof window !== "undefined" && window.speechSynthesis && !isSafari) {
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
  const ss = window.speechSynthesis;
  if (!ss) return;

  const go = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    const voice = getBestVoiceForLang(lang);
    if (voice) utterance.voice = voice;
    utterance.rate = speed === 1 ? 0.92 : speed;
    utterance.pitch = 0.97;
    ss.speak(utterance);
  };

  ss.cancel();
  // Safari silently drops speak() called immediately after cancel()
  if (isSafari) {
    setTimeout(go, 50);
  } else {
    go();
  }
}
