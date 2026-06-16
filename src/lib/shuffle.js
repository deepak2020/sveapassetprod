// Uniform Fisher-Yates shuffle.
//
// IMPORTANT: `array.sort(() => Math.random() - 0.5)` does NOT shuffle uniformly
// and, on large arrays, barely moves elements at all — so slicing the first N
// returns nearly the same subset every time (the cause of "it keeps repeating
// the same questions"). Always use this instead.
export function shuffle(arr) {
  const a = [...(arr || [])];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
