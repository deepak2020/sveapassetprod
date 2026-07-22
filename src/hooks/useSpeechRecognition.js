import { useRef, useState, useCallback } from "react";

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

/**
 * Swedish speech recognition hook.
 *
 * Design notes:
 * - Chrome auto-ends recognition on ~2s of silence. We restart it under the
 *   hood so a single user "session" can span many recognizer sessions.
 * - We keep ONE growing transcript across restarts in `finalTranscriptRef`.
 *   Each Chrome session starts its own `event.results` list from scratch, so
 *   the transcript from session N is appended to what session N-1 produced.
 * - When the user taps stop we do NOT call rec.stop() — we set a flag and let
 *   the current session finish naturally. This is the ONLY reliable way to
 *   get Chrome to flush the pending final result for short utterances on
 *   mobile; calling stop() while a result is mid-flight loses it.
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

  const finish = useCallback(() => {
    setListening(false);
    setInterim("");
    setFinalSoFar("");
    if (onFinal) onFinal(finalTranscriptRef.current.trim());
  }, [onFinal]);

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

    // Text captured during THIS recognizer session only.
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

      // If the user has asked to stop and we now have a final result,
      // end cleanly right away instead of waiting for silence timeout.
      if (stoppedByUserRef.current && sessionFinal) {
        try { rec.stop(); } catch { /* ignore */ }
      }
    };

    rec.onerror = (e) => {
      if (e.error && e.error !== "no-speech" && e.error !== "aborted") {
        setError(e.error);
        stoppedByUserRef.current = true;
      }
    };

    rec.onend = () => {
      // Fold this session's text (final preferred, interim as fallback) into
      // the persistent transcript, deduping against what came before.
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
      }
      sessionFinal = "";
      sessionInterim = "";

      // Auto-restart on Chrome's silence timeout unless the user tapped stop.
      if (!stoppedByUserRef.current && continuous) {
        try { rec.start(); return; } catch { /* fall through */ }
      }
      finish();
    };

    recognitionRef.current = rec;
    setListening(true);
    rec.start();
  }, [supported, listening, lang, continuous, finish]);

  const stop = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    // Mark the intent to stop — the recognizer's own onresult/onend cycle
    // will finish the session cleanly. This preserves short final results
    // (e.g. "här") that a direct rec.stop() would otherwise drop on mobile.
    stoppedByUserRef.current = true;
    try { rec.stop(); } catch { /* ignore */ }
  }, []);

  const toggle = useCallback(() => {
    if (listening) stop();
    else start();
  }, [listening, start, stop]);

  return { listening, interim, finalSoFar, error, supported, start, stop, toggle };
}