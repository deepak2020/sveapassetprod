import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Grades an SFI course C (B1) writing or speaking answer against the task points
// and the topic vocabulary the learner was given.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const skill = body.skill === 'speaking' ? 'speaking' : 'writing';
    const mode = body.mode === 'exam' ? 'exam' : 'guided';
    const topicTitle = String(body.topic_title || '').slice(0, 200);
    const task = String(body.task || '').slice(0, 2000);
    const points = (Array.isArray(body.points) ? body.points : []).map((p) => String(p)).slice(0, 8);
    const vocabulary = (Array.isArray(body.vocabulary) ? body.vocabulary : []).map((v) => String(v)).slice(0, 20);
    const response = String(body.response || '').slice(0, 6000);

    if (!task) return Response.json({ error: 'task is required' }, { status: 400 });
    const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 10) {
      return Response.json(
        { error: 'too_short', message: 'Skriv eller säg lite mer innan du lämnar in.' },
        { status: 422 }
      );
    }

    const skillText =
      skill === 'speaking'
        ? 'Eleven har TALAT och texten är en automatisk transkription av talet. Bedöm inte skiljetecken eller versaler. Bedöm flyt, meningsbyggnad, ordförråd och hur väl eleven utvecklar sina svar. Om ett ord ser ut som ett transkriptionsfel (t.ex. sammansmältning) ska det inte räknas som språkfel.'
        : 'Eleven har SKRIVIT texten. Bedöm textuppbyggnad, sammanhang, variation, grammatik och stavning.';

    const llm = await base44.integrations.Core.InvokeLLM({
      prompt: `Du är en erfaren SFI-lärare som bedömer en uppgift på kurs C (nivå B1, nationellt prov-liknande).

Ämne: ${topicTitle}
Uppgift: ${task}
Punkterna eleven skulle ta upp: ${points.length ? points.join('; ') : '—'}
Ordförråd eleven fick som stöd: ${vocabulary.length ? vocabulary.join(', ') : '—'}
Läget: ${mode === 'exam' ? 'provläge (tidspress, inga hjälpmedel)' : 'guidad övning'}

${skillText}

Elevens svar:
"""
${response}
"""

Uppgifter:
1. Bedöm om eleven svarade på uppgiften och tog upp punkterna ("task_completion", en eller två meningar).
2. Sätt betyg enligt skalan F (ej godkänd), E, D, C, B, A för kurs C. Var rättvis men uppmuntrande.
3. Ge en kort sammanfattning på enkel svenska ("summary").
4. Lista 2–4 saker som är bra ("strengths") och 2–4 konkreta saker att förbättra ("improvements").
5. Ge 3–6 konkreta språkrättelser ("corrections") med elevens formulering ("wrong"), en bättre formulering ("correct") och en kort regel/förklaring på svenska ("rule"). Ta bara med verkliga fel ur texten — hitta inte på.
6. Lista vilka av ordlistans ord eleven faktiskt använde ("vocab_used"), exakt som i listan.

All feedback ska vara på enkel svenska (B1-nivå).`,
      response_json_schema: {
        type: 'object',
        properties: {
          grade: { type: 'string' },
          summary: { type: 'string' },
          task_completion: { type: 'string' },
          strengths: { type: 'array', items: { type: 'string' } },
          improvements: { type: 'array', items: { type: 'string' } },
          corrections: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                wrong: { type: 'string' },
                correct: { type: 'string' },
                rule: { type: 'string' },
              },
              required: ['wrong', 'correct'],
            },
          },
          vocab_used: { type: 'array', items: { type: 'string' } },
        },
        required: ['grade', 'summary', 'task_completion', 'strengths', 'improvements'],
      },
    });

    return Response.json({
      grade: llm.grade || 'E',
      summary: llm.summary || '',
      task_completion: llm.task_completion || '',
      strengths: Array.isArray(llm.strengths) ? llm.strengths : [],
      improvements: Array.isArray(llm.improvements) ? llm.improvements : [],
      corrections: Array.isArray(llm.corrections) ? llm.corrections.slice(0, 8) : [],
      vocab_used: Array.isArray(llm.vocab_used) ? llm.vocab_used : [],
      word_count: wordCount,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}