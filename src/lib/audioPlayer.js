// A single shared <audio> element for all spoken playback.
//
// Reusing one element matters on iOS: an HTMLAudioElement that has been
// played once inside a user gesture stays "unlocked", so later programmatic
// plays (e.g. flashcard auto-speak) are allowed. We also unlock it on the
// first user interaction by playing a brief silent clip.

let shared = null;
let unlocked = false;

// 44-byte empty WAV — valid, silent, used only to unlock playback on iOS.
const SILENT =
  "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

function getShared() {
  if (!shared) {
    shared = new Audio();
    shared.preload = "auto";
  }
  return shared;
}

// Unlock the shared element. Must run inside a user gesture to take effect.
export function unlockTts() {
  if (unlocked) return;
  unlocked = true;
  const a = getShared();
  try {
    a.src = SILENT;
    const p = a.play();
    if (p && p.then) p.then(() => { a.pause(); a.currentTime = 0; }).catch(() => {});
  } catch { /* ignore */ }
}

export function playTtsUrl(url, { onEnd } = {}) {
  const a = getShared();
  try { a.pause(); } catch { /* ignore */ }
  a.onended = onEnd || null;
  a.onerror = onEnd || null;
  a.src = url;
  a.currentTime = 0;
  return a.play(); // returns a promise that may reject (e.g. autoplay blocked)
}

export function stopTts() {
  if (shared) { try { shared.pause(); } catch { /* ignore */ } }
}

// Unlock on the very first interaction anywhere in the app.
if (typeof window !== "undefined") {
  const onFirst = () => {
    unlockTts();
    window.removeEventListener("pointerdown", onFirst);
    window.removeEventListener("touchstart", onFirst);
    window.removeEventListener("keydown", onFirst);
  };
  window.addEventListener("pointerdown", onFirst, { once: true });
  window.addEventListener("touchstart", onFirst, { once: true });
  window.addEventListener("keydown", onFirst, { once: true });
}
