// Builds the exact Claude prompt used to generate content for one mission.
// The output schema must stay in sync with the SpeakingTopic entity so that
// the JSON Claude produces can be pasted straight into the DB.

const SCHEMA_SNIPPET = `{
  "description_en": "one sentence describing the mission (English)",
  "opener_sv": "Svea's first line to open the roleplay (natural spoken Swedish, short)",
  "opener_en": "English translation of opener_sv",
  "goal": "the concrete outcome, ONE sentence in English",
  "success_criteria": ["3 short English strings — what the user must DO to complete the mission"],
  "curveballs": ["2–3 short English strings — unexpected turns Svea can throw"],
  "cultural_notes": "ONE short English sentence with a Swedish cultural/register tip specific to this scenario",
  "suggested_vocab": ["6 Swedish words/short phrases the learner can lean on"],
  "key_vocabulary": [
    {
      "swedish": "…",
      "english": "…",
      "example_sv": "short natural example using the word",
      "example_en": "English translation",
      "pronunciation_tip": "ONE short English tip, e.g. 'Long a, stress on first syllable'"
    }
    // EXACTLY 8 items. No trivial words like 'jag', 'och', 'är'.
  ],
  "key_phrases": [
    {
      "situation_en": "when to use it, e.g. 'Explaining why you are calling'",
      "phrase_sv": "natural spoken Swedish phrase",
      "phrase_en": "English translation",
      "pronunciation_tip": "ONE short English tip"
    }
    // EXACTLY 7 items. Phrases must be things the learner will actually use.
  ],
  "rehearsal_drills": [
    {
      "type": "gap_fill",
      "prompt_sv": "sentence with exactly ONE blank marked as '___'",
      "prompt_en": "English version (with the same blank)",
      "expected_answer_sv": "the correct word",
      "expected_answer_en": "English translation of the correct word",
      "options": ["4 Swedish words, including the correct one"],
      "hint_en": "short English hint"
    },
    {
      "type": "quick_response",
      "prompt_sv": "short thing Svea says",
      "prompt_en": "English translation",
      "expected_answer_sv": "natural short reply the user could give",
      "expected_answer_en": "English translation of the reply",
      "hint_en": "short English hint",
      "options": null
    },
    {
      "type": "quick_response",
      "prompt_sv": "DIFFERENT curveball Svea might throw",
      "prompt_en": "…",
      "expected_answer_sv": "…",
      "expected_answer_en": "…",
      "hint_en": "…",
      "options": null
    },
    {
      "type": "quick_response",
      "prompt_sv": "ANOTHER different curveball or follow-up Svea might throw",
      "prompt_en": "…",
      "expected_answer_sv": "…",
      "expected_answer_en": "…",
      "hint_en": "…",
      "options": null
    }
    // EXACTLY 4 drills, in this order and shape (1 gap_fill + 3 quick_response).
  ]
}`;

export function buildMissionPrompt(mission) {
  const {
    title_sv,
    title_en,
    level,
    category,
    situation,
    goal_hint,
    emoji,
  } = mission;

  return `You are designing a SWEDISH SPEAKING MISSION for a language-learning app called Sveapasset. The user is a non-native Swedish speaker practicing spoken Swedish at CEFR level ${level}.

━━━ MISSION METADATA (fixed — do NOT change) ━━━
title_sv:  ${title_sv}
title_en:  ${title_en}
level:     ${level}
category:  ${category}
emoji:     ${emoji}

━━━ SCENARIO ━━━
${situation}

━━━ LEARNER'S GOAL ━━━
${goal_hint}

━━━ WHAT TO PRODUCE ━━━
Return ONE JSON object that matches EXACTLY this shape and field names:

${SCHEMA_SNIPPET}

━━━ HARD RULES ━━━
1. Everything must be at CEFR level ${level} — vocabulary, grammar, sentence length. Do NOT use words the learner would not know at this level.
2. Swedish must sound natural to a native speaker in Sweden today (not textbook, not archaic).
3. All English text must be plain, direct, learner-facing English.
4. The rehearsal drills MUST rehearse the actual curveballs / key phrases from this scenario — they are the user's warm-up before facing Svea live.
5. Counts are exact: 8 key_vocabulary, 7 key_phrases, 4 rehearsal_drills (in the order gap_fill → quick_response → quick_response → quick_response).
6. Do NOT include the metadata fields (title_sv, title_en, level, category, emoji, order) in your JSON — only the content fields shown in the schema.
7. Output ONLY the JSON object. No prose before or after. No markdown fences.`;
}

// Builds a "top-up" prompt for missions that were already generated with the
// old counts (6 vocab, 5 phrases, 3 drills). Asks Claude for ONLY the extra
// items so we can APPEND them to the existing record — no full regeneration.
export function buildMissionTopUpPrompt(mission) {
  const { title_sv, title_en, level, category, situation, goal_hint, emoji } = mission;

  return `You are ADDING EXTRA content to an existing Swedish speaking mission on Sveapasset. The mission was already generated — do NOT redo it. Only produce the additional items below.

━━━ MISSION METADATA (fixed) ━━━
title_sv:  ${title_sv}
title_en:  ${title_en}
level:     ${level}
category:  ${category}
emoji:     ${emoji}

━━━ SCENARIO ━━━
${situation}

━━━ LEARNER'S GOAL ━━━
${goal_hint}

━━━ WHAT TO PRODUCE ━━━
Return ONE JSON object with EXACTLY these three arrays and nothing else:

{
  "extra_key_vocabulary": [
    {
      "swedish": "…",
      "english": "…",
      "example_sv": "short natural example using the word",
      "example_en": "English translation",
      "pronunciation_tip": "ONE short English tip"
    }
    // EXACTLY 2 items. Must be DIFFERENT words from anything obvious for this scenario — go one step deeper. No trivial words.
  ],
  "extra_key_phrases": [
    {
      "situation_en": "when to use it",
      "phrase_sv": "natural spoken Swedish phrase",
      "phrase_en": "English translation",
      "pronunciation_tip": "ONE short English tip"
    }
    // EXACTLY 2 items. Focus on recovery / clarification / small-talk lines that the first pass usually misses (e.g. "Kan du säga det igen?", "Förlåt, jag förstod inte riktigt").
  ],
  "extra_rehearsal_drill": {
    "type": "quick_response",
    "prompt_sv": "one more curveball Svea might throw in this scenario",
    "prompt_en": "…",
    "expected_answer_sv": "natural short reply",
    "expected_answer_en": "…",
    "hint_en": "short English hint",
    "options": null
  }
}

━━━ HARD RULES ━━━
1. Everything must be at CEFR level ${level}.
2. Swedish must sound natural to a native speaker in Sweden today.
3. Do NOT repeat items that a first-pass generation for this scenario would already contain (skip obvious core vocab like "kaffe" for a café scenario, "biljett" for a ticket scenario, etc.). Go for the SECOND layer of usefulness.
4. Counts are exact: 2 vocab, 2 phrases, 1 drill.
5. Output ONLY the JSON object. No prose before or after. No markdown fences.`;
}