import { useRef, useState, useCallback } from "react";

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

/**
 * Simple click-to-start/click-to-stop Swedish speech recognition hook.
 * onFinal is called with the final transcript when recognition ends.
 */
export function useSpeechRecognition({ onFinal, lang = "sv-SE", continuous = true } = {}) {
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const stoppedByUserRef = useRef(false);

  const supported = !!SpeechRecognitionAPI;

  const start = useCallback(() => {
    if (!supported || listening) return;
    setError(null);
    setInterim("");
    finalTranscriptRef.current = "";
    stoppedByUserRef.current = false;

    // Cut any TTS off so mic doesn't pick it up.
    window.speechSynthesis?.cancel();

    const rec = new SpeechRecognitionAPI();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = continuous;
    rec.maxAlternatives = 1;

    rec.onresult = (event) => {
      let interimText = "";
      let newFinal = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) newFinal += t;
        else interimText += t;
      }
      setInterim(interimText);
      if (newFinal) {
        finalTranscriptRef.current =
          (finalTranscriptRef.current ? finalTranscriptRef.current + " " : "") + newFinal.trim();
      }
    };

    rec.onerror = (e) => {
      if (e.error !== "no-speech" && e.error !== "aborted") setError(e.error);
    };

    rec.onend = () => {
      // Chrome auto-ends on pause. Restart unless the user tapped stop.
      if (!stoppedByUserRef.current && continuous) {
        try { rec.start(); return; } catch { /* fall through */ }
      }
      setListening(false);
      setInterim("");
      if (onFinal) onFinal(finalTranscriptRef.current.trim());
    };

    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  }, [supported, listening, lang, continuous, onFinal]);

  const stop = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    stoppedByUserRef.current = true;
    try { rec.stop(); } catch { /* ignore */ }
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  return { listening, interim, error, supported, start, stop, toggle };
}