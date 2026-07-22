import { useRef, useState, useCallback } from "react";

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

// Chrome (esp. on Android / flaky mics) sometimes re-emits the same words as
// separate final results, yielding transcripts like "det det det kostar kostar
// kostar" when the user said the phrase once. Collapse any run of the same
// word repeated back-to-back down to a single occurrence. Case-insensitive,
// punctuation-tolerant; keeps the first-seen casing.
function collapseRepeats(text) {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  const out = [];
  const norm = (w) => w.toLowerCase().replace(/[.,!?;:]/g, "");
  for (const w of words) {
    if (out.length && norm(out[out.length - 1]) === norm(w)) continue;
    out.push(w);
  }
  return out.join(" ");
}

/**
 * Swedish speech recognition hook.
 *
 * Design notes:
 * - Chrome auto-ends recognition on ~2s of silence. In continuous mode we
 *   restart it under the hood so a single user "session" can span many
 *   recognizer sessions; in single-utterance mode (default) we let it end and
 *   submit automatically on the first pause.
 * - We keep ONE growing transcript across restarts in `finalTranscriptRef`.
 *   Each Chrome session starts its own `event.results` list from scratch, so
 *   the transcript from session N is appended to what session N-1 produced.
 * - When the user taps stop we do NOT immediately drop the recognizer — we set
 *   a flag and let the current session flush its pending final result. This is
 *   the only reliable way to keep short utterances (e.g. "här") on mobile.
 * - Every captured chunk is run through collapseRepeats() so Chrome's re-emitted
 *   duplicate words don't leak into the transcript.
 */
export function useSpeechRecognition({ onFinal, lang = "sv-SE", continuous = false } = {}) {
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
    if (onFinal) onFinal(collapseRepeats(finalTranscriptRef.current).trim());
  }, [onFinal]);

  const start = useCallback(() => {
    if (!supported || listening) return;
    setError(null);
    setInterim("");
    setFinalSoFar("");
    finalTranscriptRef.current = "";
    stoppedByUserRef.current = false;

    // Cut any TTS off so the mic doesn't pick it up.
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
        else interimText += t + " ";
      }
      sessionFinal = collapseRepeats(finalText);
      sessionInterim = collapseRepeats(interimText);
      setInterim(sessionInterim);

      // If the user has asked to stop and we now have a final result,
      // end cleanly right away instead of waiting for the silence timeout.
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
      const captured = collapseRepeats(sessionFinal || sessionInterim || "").trim();
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
          finalTranscriptRef.current = collapseRepeats(
            [prev, addition].filter(Boolean).join(" ")
          ).trim();
          setFinalSoFar(finalTranscriptRef.current);
        }
      }
      sessionFinal = "";
      sessionInterim = "";

      // In continuous mode, auto-restart on Chrome's silence timeout unless the
      // user tapped stop. In single-utterance mode, end and submit.
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
