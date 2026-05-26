// Two-level AI feedback cache:
//   L1 — in-memory Map (instant, lives for current session)
//   L2 — backend QuizResult records (cross-user, cross-device, permanent)
//
// Keys:
//   Translate tab:  "translate-{lessonId}-{promptIndex}"        (exercise-level, same for all users)
//   Writing tab:    "writing-{lessonId}-{promptIndex}-{answer}" (answer-level, same answer = same feedback)

const L1 = new Map();

export async function getCachedFeedback(base44, key) {
  if (L1.has(key)) return L1.get(key);
  try {
    const results = await base44.entities.QuizResult.filter(
      { quiz_type: "ai_explanation_cache", source_id: key },
      null,
      1
    );
    if (results?.length && results[0].answer_text) {
      const data = JSON.parse(results[0].answer_text);
      L1.set(key, data);
      return data;
    }
  } catch {}
  return null;
}

export async function setCachedFeedback(base44, key, data) {
  L1.set(key, data);
  try {
    await base44.entities.QuizResult.create({
      quiz_type: "ai_explanation_cache",
      source_id: key,
      answer_text: JSON.stringify(data),
      score: 1,
      total: 1,
      percentage: 100,
    });
  } catch {}
}

// Build a stable cache key for a writing answer (truncated to avoid huge keys)
export function writingCacheKey(lessonId, promptIndex, normalizedAnswer) {
  return `writing-${lessonId}-${promptIndex}-${normalizedAnswer.slice(0, 120)}`;
}

export function translateCacheKey(lessonId, promptIndex) {
  return `translate-${lessonId}-${promptIndex}`;
}
