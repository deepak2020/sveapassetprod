import { createClientFromRequest } from 'npm:@base44/sdk@0.8.39';

// Seeds 5 pilot mission-scenarios into SpeakingTopic — one per CEFR level.
// Each scenario is a full mission: metadata + goal + success criteria +
// curveballs + key vocab + key phrases + rehearsal drills.
//
// LLM generates all the content; we save it once so all users share it.
// Idempotent: skips a scenario if a SpeakingTopic with the same title_sv
// already exists (so calling this twice doesn't create duplicates).

const PILOT_SCENARIOS = [
  {
    title_sv: 'Beställa fika på café',
    title_en: 'Order fika at a café',
    level: 'A1',
    category: 'survival',
    emoji: '☕',
    order: 101,
    situation:
      "The user walks into a Swedish café. They want to order a coffee and a cinnamon bun, decide whether to eat there or take away, and pay with card. Svea plays the barista.",
    goal_hint: 'Order a coffee + kanelbulle, choose eat-in vs takeaway, pay with card',
  },
  {
    title_sv: 'Boka tid hos tandläkaren',
    title_en: 'Book a dentist appointment',
    level: 'A2',
    category: 'service',
    emoji: '🦷',
    order: 102,
    situation:
      "The user calls a dental clinic because they have toothache and need an urgent appointment for today or tomorrow. Svea plays the receptionist and will ask for their personal number.",
    goal_hint: 'Explain reason, request an urgent time today or tomorrow, confirm the booking',
  },
  {
    title_sv: 'Lämna barn på förskolan',
    title_en: 'Drop off child at preschool',
    level: 'B1',
    category: 'society',
    emoji: '🧒',
    order: 103,
    situation:
      "The user is dropping their child at förskola. They need to say hello to the teacher, mention that the child slept badly and is a bit tired, confirm pickup time, and say goodbye. Svea plays the preschool teacher.",
    goal_hint: 'Greet teacher, share how the child is today, confirm pickup time, say goodbye',
  },
  {
    title_sv: 'Presentera dig i jobbintervju',
    title_en: 'Introduce yourself in a job interview',
    level: 'B1',
    category: 'work',
    emoji: '💼',
    order: 104,
    situation:
      "The user is in a Swedish job interview. Svea plays the interviewer and opens with 'Berätta lite om dig själv'. The user should give a ~60-second self-introduction covering background, current role, and why this job. Svea follows up with one probing question.",
    goal_hint: "Give a short self-intro (background + current role + why this job), handle a follow-up question",
  },
  {
    title_sv: 'Diskutera en nyhet',
    title_en: 'Discuss a news story',
    level: 'B2',
    category: 'nuance',
    emoji: '📰',
    order: 105,
    situation:
      "The user is having coffee with a Swedish friend who brings up a recent news story about climate policy. The user should share their opinion, agree/disagree politely, and back up their view with a reason. Svea plays the friend.",
    goal_hint: 'Share an opinion, agree or disagree politely, give at least one reason',
  },
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') {
      return Response.json({ error: 'Admin only' }, { status: 403 });
    }

    const results: any[] = [];

    for (const scenario of PILOT_SCENARIOS) {
      // Skip if already seeded
      const existing = await base44.asServiceRole.entities.SpeakingTopic.filter({
        title_sv: scenario.title_sv,
      });
      if (existing && existing.length > 0) {
        results.push({ title: scenario.title_sv, status: 'skipped_exists' });
        continue;
      }

      const prompt = `You are designing a SWEDISH SPEAKING MISSION for a language learner at CEFR level ${scenario.level}.

SCENARIO:
${scenario.situation}

GOAL FOR THE LEARNER:
${scenario.goal_hint}

Generate ALL of the following in ONE JSON response. Keep everything strictly at CEFR level ${scenario.level} — vocabulary, grammar, sentence length. Do NOT use words the learner would not know at this level.

1. description_en — one sentence describing the mission (English)
2. opener_sv — Svea's very first line to open the roleplay (Swedish, natural spoken register). Keep short.
3. opener_en — English translation of opener_sv
4. goal — the concrete outcome, ONE sentence in English
5. success_criteria — array of 3 short English strings describing what the user must do to complete the mission (e.g. "Explains why they are calling")
6. curveballs — array of 2–3 short English strings describing unexpected turns Svea can throw (e.g. "Asks for personnummer")
7. cultural_notes — ONE short English sentence with a Swedish cultural/register tip specific to this scenario
8. key_vocabulary — array of 6 core words the learner needs. Each has: swedish, english, example_sv (short natural example using the word), example_en, pronunciation_tip (ONE short English tip, e.g. "Long 'a', stress on first syllable"). Do not include trivial words like "jag" or "och".
9. key_phrases — array of 5 core phrases. Each has: situation_en (when to use it, e.g. "Explaining why you're calling"), phrase_sv (natural spoken Swedish), phrase_en (English translation), pronunciation_tip (ONE short English tip). Phrases should be things the learner will ACTUALLY use in the conversation.
10. rehearsal_drills — array of 3 drills:
    - Drill 1: type "gap_fill". prompt_sv is a sentence with exactly ONE blank marked as "___". prompt_en is the English version. expected_answer_sv is the correct word. options is an array of exactly 4 Swedish words including the correct one. hint_en is a short English hint.
    - Drill 2: type "quick_response". prompt_sv is a short thing Svea says. prompt_en is the English translation. expected_answer_sv is a natural short reply the user could give. expected_answer_en is the English translation. hint_en is a short English hint. options is null.
    - Drill 3: type "quick_response" — a DIFFERENT curveball. Same shape as drill 2.

The drills MUST rehearse specific curveballs or key phrases from THIS scenario. They are the user's warm-up before facing Svea live.

Everything must feel natural to a Swedish native speaker but stay strictly at level ${scenario.level}.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            description_en: { type: 'string' },
            opener_sv: { type: 'string' },
            opener_en: { type: 'string' },
            goal: { type: 'string' },
            success_criteria: { type: 'array', items: { type: 'string' } },
            curveballs: { type: 'array', items: { type: 'string' } },
            cultural_notes: { type: 'string' },
            key_vocabulary: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  swedish: { type: 'string' },
                  english: { type: 'string' },
                  example_sv: { type: 'string' },
                  example_en: { type: 'string' },
                  pronunciation_tip: { type: 'string' },
                },
                required: ['swedish', 'english'],
              },
            },
            key_phrases: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  situation_en: { type: 'string' },
                  phrase_sv: { type: 'string' },
                  phrase_en: { type: 'string' },
                  pronunciation_tip: { type: 'string' },
                },
                required: ['phrase_sv', 'phrase_en'],
              },
            },
            rehearsal_drills: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['gap_fill', 'quick_response'] },
                  prompt_sv: { type: 'string' },
                  prompt_en: { type: 'string' },
                  expected_answer_sv: { type: 'string' },
                  expected_answer_en: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' } },
                  hint_en: { type: 'string' },
                },
                required: ['type', 'prompt_sv', 'expected_answer_sv'],
              },
            },
          },
          required: [
            'opener_sv',
            'goal',
            'success_criteria',
            'key_vocabulary',
            'key_phrases',
            'rehearsal_drills',
          ],
        },
      });

      const created = await base44.asServiceRole.entities.SpeakingTopic.create({
        title_sv: scenario.title_sv,
        title_en: scenario.title_en,
        level: scenario.level,
        category: scenario.category,
        emoji: scenario.emoji,
        order: scenario.order,
        description_en: result.description_en || '',
        opener_sv: result.opener_sv || '',
        opener_en: result.opener_en || '',
        suggested_vocab: (result.key_vocabulary || []).map((v: any) => v.swedish).slice(0, 6),
        goal: result.goal || '',
        success_criteria: result.success_criteria || [],
        curveballs: result.curveballs || [],
        cultural_notes: result.cultural_notes || '',
        key_vocabulary: result.key_vocabulary || [],
        key_phrases: result.key_phrases || [],
        rehearsal_drills: result.rehearsal_drills || [],
      });

      results.push({ title: scenario.title_sv, status: 'created', id: created.id });
    }

    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});