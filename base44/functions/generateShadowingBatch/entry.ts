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

    const prompt = `Generate ${count} short Swedish sentences for a SHADOWING exercise at CEFR level ${level}.

Rules:
- Each sentence is natural SPOKEN Swedish that a learner will actually hear in daily life.
- Length: 5–12 words. Not too long — shadowing needs full sentences the ear can hold.
- Use common lexical chunks (e.g. "skulle vilja ha", "det var kul att", "vad tycker du om").
- Vary the topics${topic ? ` — focus on: ${topic}` : ' — mix café, work, weather, weekends, small talk, feelings, plans'}.
- No idioms that a ${level} learner would not recognize.
- Difficulty must genuinely fit ${level}. A1 = present tense, simple; A2 = past tense allowed; B1+ = subordinate clauses ok.

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