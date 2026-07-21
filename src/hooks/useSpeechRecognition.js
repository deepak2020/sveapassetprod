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
  const [finalSoFar, setFinalSoFar] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");
  const stoppedByUserRef = useRef(false);

  const supported = !!SpeechRecognitionAPI;

  const start = useCallback(() => {
    if (!supported || listening) return;
    setError(null);
    setInterim("");
    setFinalSoFar("");
    finalTranscriptRef.current = "";
    stoppedByUserRef.current = false;

    // Cut any TTS off so mic doesn't pick it up.
    window.speechSynthesis?.cancel();

    const rec = new SpeechRecognitionAPI();
    rec.lang = lang;
    rec.interimResults = true;
    rec.continuous = continuous;
    rec.maxAlternatives = 1;

    // Rebuild the transcript within THIS recognition session on every event
    // (finals from earlier sessions are preserved in sessionFinalsRef).
    // Appending deltas caused duplicated phrases because Chrome sometimes
    // re-emits earlier results as final, producing "vädret vädret vädret var…".
    let sessionFinal = "";
    let sessionInterim = "";
    rec.onresult = (event) => {
      let finalText = "";
      let interimText = "";
      for (let i = 0; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += t + " ";
        else interimText += t;
      }
      sessionFinal = finalText.trim();
      sessionInterim = interimText.trim();
      setInterim(interimText);
    };

    rec.onerror = (e) => {
      // Real errors (mic denied, network, etc.) must stop the loop so the UI
      // doesn't stay stuck in "listening" forever. Only benign events (no-speech,
      // aborted from an auto-restart) are ignored.
      if (e.error && e.error !== "no-speech" && e.error !== "aborted") {
        setError(e.error);
        stoppedByUserRef.current = true;
      }
    };

    rec.onend = () => {
      // Fold this session's final (or its interim fallback) into the persistent
      // ref. Chrome sometimes re-emits earlier results across auto-restart
      // cycles, so we dedupe: only append the tail that isn't already there.
      const captured = (sessionFinal || sessionInterim || "").trim();
      if (captured) {
        const prev = finalTranscriptRef.current.trim();
        let addition = captured;
        if (prev) {
          if (captured === prev || prev.endsWith(captured)) {
            addition = "";
          } else if (captured.startsWith(prev)) {
            addition = captured.slice(prev.length).trim();
          }
        }
        if (addition) {
          finalTranscriptRef.current = [prev, addition].filter(Boolean).join(" ").trim();
          setFinalSoFar(finalTranscriptRef.current);
        }
        sessionFinal = "";
        sessionInterim = "";
      }
      // Chrome auto-ends on pause. Restart unless the user tapped stop.
      if (!stoppedByUserRef.current && continuous) {
        try { rec.start(); return; } catch { /* fall through */ }
      }
      setListening(false);
      setInterim("");
      setFinalSoFar("");
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
    // Give the recognizer a beat to flush a pending final result for very
    // short utterances (e.g. "här") where onend can otherwise fire before
    // onresult, causing the captured word to be silently dropped.
    setTimeout(() => {
      try { rec.stop(); } catch { /* ignore */ }
    }, 350);
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  return { listening, interim, finalSoFar, error, supported, start, stop, toggle };
}