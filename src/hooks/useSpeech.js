import { useState, useCallback } from "react";
import { getBestVoice } from "@/lib/speech";
import { getAzureTtsUrl, getCachedTtsUrl } from "@/lib/tts";
import { playTtsUrl, stopTts } from "@/lib/audioPlayer";

const isSafari =
  typeof window !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// ── Browser speech synthesis (fallback when Azure audio is unavailable) ──
function doSpeak(text, lang, onStart, onEnd) {
  const ss = window.speechSynthesis;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  const voice = getBestVoice(lang);
  if (voice) utterance.voice = voice;
  utterance.rate = 0.92;
  utterance.pitch = 0.97;

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = onEnd;

  ss.speak(utterance);
}

function browserSpeak(text, lang, onStart, onEnd) {
  const ss = window.speechSynthesis;
  if (!ss) { onEnd(); return; }
  ss.cancel();

  const voices = ss.getVoices();
  if (voices.length > 0) {
    if (isSafari) setTimeout(() => doSpeak(text, lang, onStart, onEnd), 50);
    else doSpeak(text, lang, onStart, onEnd);
  } else {
    // Voices load asynchronously in Chrome; Safari may never fire the event.
    let fired = false;
    const go = () => {
      if (fired) return;
      fired = true;
      doSpeak(text, lang, onStart, onEnd);
    };
    ss.addEventListener("voiceschanged", go, { once: true });
    setTimeout(() => {
      if (!fired) { ss.removeEventListener("voiceschanged", go); go(); }
    }, 300);
  }
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text, lang = "sv-SE") => {
    if (!text) return;

    // Stop anything currently playing.
    window.speechSynthesis?.cancel();
    stopTts();

    const onStart = () => setSpeaking(true);
    const onEnd = () => setSpeaking(false);

    const playUrl = (url) => {
      const p = playTtsUrl(url, { onEnd });
      if (p && p.catch) p.catch(() => browserSpeak(text, lang, onStart, onEnd));
    };

    // Prefer Azure audio (generated on demand and cached) for Swedish; fall
    // back to the browser's speech synthesis if it is unavailable.
    if (lang.startsWith("sv")) {
      setSpeaking(true);

      // If the clip is already cached, play it SYNCHRONOUSLY so it stays
      // inside the user gesture (required for iOS autoplay).
      const cached = getCachedTtsUrl(text);
      if (cached) { playUrl(cached); return; }

      // Otherwise fetch it, then play (or fall back).
      getAzureTtsUrl(text)
        .then((url) => { if (url) playUrl(url); else browserSpeak(text, lang, onStart, onEnd); })
        .catch(() => browserSpeak(text, lang, onStart, onEnd));
      return;
    }

    browserSpeak(text, lang, onStart, onEnd);
  }, []);

  return { speak, speaking };
}
