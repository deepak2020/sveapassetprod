import { useState, useCallback } from "react";
import { getBestVoice } from "@/lib/speech";

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback((text, lang = "sv-SE") => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const voice = getBestVoice(lang);
    if (voice) utterance.voice = voice;
    utterance.rate = 0.92;
    utterance.pitch = 0.97;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak, speaking };
}
