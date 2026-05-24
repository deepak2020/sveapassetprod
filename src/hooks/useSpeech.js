import { useState, useCallback } from "react";
import { getBestVoice } from "@/lib/speech";

function doSpeak(text, lang, onStart, onEnd) {
  const ss = window.speechSynthesis;
  ss.cancel();

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
    if (!window.speechSynthesis) return;

    const onStart = () => setSpeaking(true);
    const onEnd = () => setSpeaking(false);

    // Chrome: if voices not loaded yet, wait for voiceschanged then speak
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener(
        "voiceschanged",
        () => doSpeak(text, lang, onStart, onEnd),
        { once: true }
      );
    } else {
      doSpeak(text, lang, onStart, onEnd);
    }
  }, []);

  return { speak, speaking };
}
