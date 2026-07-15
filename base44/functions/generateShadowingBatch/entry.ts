import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';

// Generates ~10 shadowing sentences for the user's target CEFR level.
// Sentences use natural spoken Swedish (chunks a learner will actually hear).
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { level = 'A2', count = 10, topic } = body || {};

    const levelGuide: Record<string, string> = {
      A1: `A1 = ABSOLUTE BEGINNER. Rules:
- Length: 3–6 words only. Never longer.
- Present tense only. No past, no future, no modals except "kan" and "vill".
- Only the most common 300 words (jag, du, är, har, heter, bor, gillar, vill, kan, en, ett, den, det, hej, tack, god morgon…).
- One clause only. No "och" joining two clauses, no "att", no "som".
- Topics: greetings, name, where you live, family, numbers, food/drink orders, yes/no.
- Examples of RIGHT length/complexity: "Jag heter Anna.", "Var bor du?", "En kaffe, tack.", "Jag gillar kaffe.", "Hur mår du?", "Vi ses imorgon."
- Chunks are 2–3 words max, e.g. "en kaffe tack", "jag heter", "var bor du".`,
      A2: `A2 = ELEMENTARY. Rules:
- Length: 5–8 words.
- Present + simple past ("var", "hade", "gick", "åt"). No perfect, no conditional.
- Everyday vocabulary only. Avoid abstract or work-specific words.
- Simple "och"/"men"/"eller" joins allowed. No subordinate clauses.
- Topics: daily routine, weekend plans, café, shopping, weather, family, feelings.
- Examples: "Jag åt frukost klockan sju.", "Vad gjorde du i helgen?", "Det var kul igår."
- Chunks are 3–4 word everyday phrases: "i helgen", "det var kul", "vad gjorde du".`,
      B1: `B1 = INTERMEDIATE. Rules:
- Length: 6–12 words.
- All common tenses (present, past, perfect, future). Modals ok.
- Subordinate clauses with "att", "som", "när", "om" allowed.
- Topics: work, opinions, plans, describing experiences, small talk.
- Chunks: "jag skulle vilja", "det var kul att", "vad tycker du om".`,
      B2: `B2 = UPPER-INTERMEDIATE. Rules:
- Length: 8–14 words.
- Complex clauses, conditionals ("skulle", "hade kunnat"), passive ok.
- Nuanced vocabulary, hedging, opinions.
- Topics: current events, work challenges, comparing options, negotiating.`,
    };

    const prompt = `Generate ${count} Swedish sentences for a SHADOWING exercise at CEFR level ${level}.

Sentences must be natural SPOKEN Swedish a learner actually hears in daily life. Vary the topics${topic ? ` — focus on: ${topic}` : ''}. No idioms a ${level} learner would not recognize.

${levelGuide[level] || levelGuide.A2}

CRITICAL: Difficulty must GENUINELY fit ${level}. If unsure, err on the EASIER side. An A1 learner cannot shadow a 10-word sentence — keep A1 SHORT.

For each sentence, also identify ONE memorizable chunk (the phrase inside worth learning as a unit).

Return JSON: { sentences: [{ text_sv, text_en, chunk_hint }, ...] }`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          sentences: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                text_sv: { type: 'string' },
                text_en: { type: 'string' },
                chunk_hint: { type: 'string' },
              },
              required: ['text_sv', 'text_en'],
            },
          },
        },
        required: ['sentences'],
      },
    });

    const sentences = (result?.sentences || []).slice(0, count);

    // Persist so subsequent sessions can reuse without re-hitting the LLM.
    const created = await base44.asServiceRole.entities.ShadowingChunk.bulkCreate(
      sentences.map((s: any, i: number) => ({
        text_sv: s.text_sv,
        text_en: s.text_en || '',
        chunk_hint: s.chunk_hint || '',
        level,
        topic: topic || 'mixed',
        order: Date.now() + i,
      }))
    );

    return Response.json({ sentences: created });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});