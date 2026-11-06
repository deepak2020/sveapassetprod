import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Svea grades an SFI course C writing task. Returns a fixed JSON shape so the
// writing screen can render grade, points, errors and a corrected text.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const prompt = body.prompt || {};
    const text = String(body.text || '').slice(0, 8000);
    const points = (Array.isArray(prompt.points) ? prompt.points : []).map((p) => String(p)).slice(0, 10);

    if (!text.trim()) return Response.json({ error: 'text is required' }, { status: 400 });

    const llm = await base44.integrations.Core.InvokeLLM({
      prompt: `Du är Svea, lärare i svenska som andraspråk. Du bedömer en skrivuppgift på SFI kurs C (CEFR B1, mot B1+).

UPPGIFT: ${String(prompt.title || '').slice(0, 200)}
TEXTTYP: ${String(prompt.type || 'informal_email')}
INSTRUKTION: ${String(prompt.instructions || '').slice(0, 1000)}
PUNKTER ELEVEN SKA TA UPP: ${points.length ? points.join(' | ') : '—'}
ORDKRAV: ${Number(prompt.min_words) || 0}–${Number(prompt.max_words) || 0} ord
LÄGE: ${body.mode === 'test' ? 'prov (ingen hjälp)' : 'övning'}

ELEVENS TEXT:
"""
${text}
"""

Regler:
- Markera bara verkliga fel som finns i texten. Hitta aldrig på fel och rätta inte stil som är godtagbar på C-nivå.
- Håll rättelserna på SFI C-nivå och behåll elevens egna ord så långt det går.
- Bedöm uppgiftsuppfyllelse (alla punkter), struktur, ordförråd och grammatik.
- Kom ihåg: "måste inte" betyder "do not have to", inte "must not". "Också" används i positiva satser och "heller" i negativa.
- estimated_grade: ett av F, E, D, C, B, A.
- grade_reason: en mening på engelska.
- points_covered: en post per punkt ovan, med punkten ordagrant och covered true/false.
- errors: wrong (elevens formulering), correct (rättad), type (verb_second, en_ett, definite_form, preposition, spelling, verb_form, word_choice, connector eller other), rule (kort förklaring på engelska).
- corrected_text: elevens text med felen rättade, så nära originalets formuleringar som möjligt.
- strengths: 2–3 punkter på enkel svenska.
- practice_next: exakt 3 korta mönster eleven bör öva på.
Svara ENDAST med JSON enligt schemat.`,
      response_json_schema: {
        type: 'object',
        properties: {
          estimated_grade: { type: 'string', enum: ['F', 'E', 'D', 'C', 'B', 'A'] },
          grade_reason: { type: 'string' },
          points_covered: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                point: { type: 'string' },
                covered: { type: 'boolean' },
              },
              required: ['point', 'covered'],
            },
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                wrong: { type: 'string' },
                correct: { type: 'string' },
                type: {
                  type: 'string',
                  enum: [
                    'verb_second',
                    'en_ett',
                    'definite_form',
                    'preposition',
                    'spelling',
                    'verb_form',
                    'word_choice',
                    'connector',
                    'other',
                  ],
                },
                rule: { type: 'string' },
              },
              required: ['wrong', 'correct', 'type', 'rule'],
            },
          },
          corrected_text: { type: 'string' },
          strengths: { type: 'array', items: { type: 'string' } },
          practice_next: { type: 'array', items: { type: 'string' } },
        },
        required: ['estimated_grade', 'grade_reason', 'points_covered', 'errors', 'corrected_text', 'strengths', 'practice_next'],
      },
    });

    return Response.json({
      estimated_grade: llm?.estimated_grade || 'E',
      grade_reason: llm?.grade_reason || '',
      points_covered: Array.isArray(llm?.points_covered) ? llm.points_covered : [],
      errors: Array.isArray(llm?.errors) ? llm.errors : [],
      corrected_text: llm?.corrected_text || '',
      strengths: Array.isArray(llm?.strengths) ? llm.strengths : [],
      practice_next: Array.isArray(llm?.practice_next) ? llm.practice_next : [],
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}