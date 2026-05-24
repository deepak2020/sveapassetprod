import { useState, useCallback } from "react";
import { getBestVoice } from "@/lib/speech";

const isSafari =
  typeof window !== "undefined" &&
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

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

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text, lang = "sv-SE") => {
    const ss = window.speechSynthesis;
    if (!ss) return;

    const onStart = () => setSpeaking(true);
    const onEnd = () => setSpeaking(false);

    ss.cancel();

    const voices = ss.getVoices();

    if (voices.length > 0) {
      // Voices ready — Safari needs a small delay after cancel()
      if (isSafari) {
        setTimeout(() => doSpeak(text, lang, onStart, onEnd), 50);
      } else {
        doSpeak(text, lang, onStart, onEnd);
      }
    } else {
      // Chrome: voices load async, wait for voiceschanged
      // Safari: voiceschanged may not fire — fall back to a short timeout
      let fired = false;
      const go = () => {
        if (fired) return;
        fired = true;
        doSpeak(text, lang, onStart, onEnd);
      };
      ss.addEventListener("voiceschanged", go, { once: true });
      // Safari fallback: if voiceschanged never fires, try after 300ms
      setTimeout(() => {
        if (!fired) {
          ss.removeEventListener("voiceschanged", go);
          go();
        }
      }, 300);
    }
  }, []);

  return { speak, speaking };
}
