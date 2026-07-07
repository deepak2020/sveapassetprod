import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// One conversation turn with Svea: evaluate the user's Swedish, correct it if
// needed, and generate the next Svea reply — all in a single LLM call.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      topic_title_sv,
      topic_title_en,
      level = 'A2',
      user_message,
      history = [], // [{ role: 'svea'|'user', text_sv }]
    } = body || {};

    if (!user_message || typeof user_message !== 'string') {
      return Response.json({ error: 'user_message is required' }, { status: 400 });
    }

    // Keep prompt small — only last 6 turns
    const recent = Array.isArray(history) ? history.slice(-6) : [];
    const transcript = recent
      .map((t) => `${t.role === 'svea' ? 'Svea' : 'Student'}: ${t.text_sv}`)
      .join('\n');

    const prompt = `You are Svea, a warm, encouraging Swedish conversation partner talking to an SFI student at CEFR level ${level}.

Topic: ${topic_title_sv}${topic_title_en ? ` (${topic_title_en})` : ''}

Conversation so far:
${transcript || '(no previous turns — this is the student\'s first reply to your opener)'}

Student just said (in Swedish, may be imperfect):
"${user_message}"

Your job — in ONE JSON response:
1. Evaluate the student's Swedish. Only flag REAL grammatical errors (wrong verb form, wrong word order, wrong gender, wrong preposition that changes meaning, missing key word). NEVER rewrite for style. Accept natural alternatives, synonyms, and multiple valid prepositions.
2. If there are errors, correct up to 2 of the MOST important ones. Ignore minor typos.
3. Reply in Swedish with ONE short, natural follow-up (max 2 sentences) that keeps the conversation flowing on this topic. Match the student's CEFR level — do NOT reply in advanced Swedish to a beginner. Ask a question when it feels natural.
4. Give brief English encouragement.

Return JSON with:
- is_swedish: boolean (false if the student wrote in another language)
- on_topic: boolean
- grammar_score: 0-100
- corrected_sv: the student's sentence rewritten correctly (or the original if perfect)
- mistakes: array of { wrong, correct, rule } — max 2 items, empty if perfect
- encouragement_en: string, max 15 words, warm and specific
- svea_reply_sv: your Swedish follow-up (max 2 sentences)
- svea_reply_en: English translation of svea_reply_sv`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          is_swedish: { type: 'boolean' },
          on_topic: { type: 'boolean' },
          grammar_score: { type: 'number' },
          corrected_sv: { type: 'string' },
          mistakes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                wrong: { type: 'string' },
                correct: { type: 'string' },
                rule: { type: 'string' },
              },
            },
          },
          encouragement_en: { type: 'string' },
          svea_reply_sv: { type: 'string' },
          svea_reply_en: { type: 'string' },
        },
        required: ['corrected_sv', 'svea_reply_sv'],
      },
    });

    return Response.json({ result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});