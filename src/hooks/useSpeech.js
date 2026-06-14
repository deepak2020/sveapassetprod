import { useState, useCallback, useRef } from "react";
import { getBestVoice } from "@/lib/speech";
import { getAzureTtsUrl } from "@/lib/tts";

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
  const audioRef = useRef(null);

  const speak = useCallback(async (text, lang = "sv-SE") => {
    if (!text) return;

    // Stop anything currently playing.
    window.speechSynthesis?.cancel();
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }

    const onStart = () => setSpeaking(true);
    const onEnd = () => setSpeaking(false);

    // Prefer Azure audio (generated on demand and cached) for Swedish; fall
    // back to the browser's speech synthesis if it is unavailable.
    if (lang.startsWith("sv")) {
      setSpeaking(true);
      try {
        const url = await getAzureTtsUrl(text);
        if (url) {
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = onEnd;
          audio.onerror = () => browserSpeak(text, lang, onStart, onEnd);
          await audio.play();
          return;
        }
      } catch {
        // fall through to browser TTS
      }
    }

    browserSpeak(text, lang, onStart, onEnd);
  }, []);

  return { speak, speaking };
}
