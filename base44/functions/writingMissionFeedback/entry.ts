import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Svea's feedback for the Skrivuppdrag (writing missions) flow.
//   mode "short": one sentence or paragraph written during stages 4-5
//   mode "full":  the finished text in stage 7, graded as an SFI course C teacher
const SHORT_SCHEMA = {
  type: 'object',
  properties: {
    ok: { type: 'boolean' },
    comment: { type: 'string' },
    correction: { type: 'string' },
  },
  required: ['ok', 'comment', 'correction'],
};

const FULL_SCHEMA = {
  type: 'object',
  properties: {
    estimated_grade: { type: 'string' },
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
          type: { type: 'string' },
          rule: { type: 'string' },
        },
        required: ['wrong', 'correct', 'type'],
      },
    },
    corrected_text: { type: 'string' },
    words_used: { type: 'array', items: { type: 'string' } },
    strengths: { type: 'array', items: { type: 'string' } },
    practice_next: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'estimated_grade',
    'grade_reason',
    'points_covered',
    'errors',
    'corrected_text',
    'words_used',
    'strengths',
    'practice_next',
  ],
};

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const mode = body.mode === 'short' ? 'short' : 'full';
    const text = String(body.text || '').slice(0, 6000).trim();
    if (!text) return Response.json({ error: 'text is required' }, { status: 400 });

    const mission = body.mission || {};
    const title = String(mission.title || '').slice(0, 200);
    const task = String(mission.task_sv || '').slice(0, 1000);
    const points = (Array.isArray(mission.points_to_include) ? mission.points_to_include : [])
      .map((p) => String(p))
      .slice(0, 10);
    const words = (Array.isArray(mission.words) ? mission.words : [])
      .map((w) => String(typeof w === 'string' ? w : w?.sv || ''))
      .filter(Boolean)
      .slice(0, 30);
    const step = String(body.step || '').slice(0, 400);
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    if (mode === 'short') {
      if (wordCount < 3) {
        return Response.json({ error: 'too_short' }, { status: 422 });
      }

      const short = await base44.integrations.Core.InvokeLLM({
        prompt: `Du är Svea, en vänlig och uppmuntrande SFI-lärare på kurs C (nivå B1).

Uppdraget eleven tränar på: ${title}
Uppgift: ${task}
${step ? `Det eleven just gjorde: ${step}` : ''}
Ord eleven har lärt sig: ${words.length ? words.join(', ') : '—'}

Elevens text:
"""
${text}
"""

Ge mycket kort feedback. Regler:
- Markera bara verkliga språkfel. Hitta aldrig på fel och rätta inte stil om texten redan är korrekt.
- comment: EN kort mening på enkel engelska, uppmuntrande.
- correction: elevens text rättad, så nära elevens egna formuleringar som möjligt, på svenska.
- ok: true om det inte finns några verkliga fel.
- Kom ihåg: verbet står på andra plats i huvudsatsen, "också" används i positiva satser och "heller" i negativa, och efter "efterom"/"att" kommer subjektet före verbet.`,
        response_json_schema: SHORT_SCHEMA,
      });

      if (!short || typeof short !== 'object') {
        return Response.json({ error: 'feedback_failed' }, { status: 502 });
      }

      return Response.json({
        ok: short.ok !== false,
        comment: String(short.comment || '').slice(0, 400),
        correction: String(short.correction || '').slice(0, 2000),
      });
    }

    if (wordCount < 10) {
      return Response.json(
        { error: 'too_short', message: 'Skriv lite mer innan du lämnar in.' },
        { status: 422 }
      );
    }

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Du är en erfaren SFI-lärare som bedömer en skrivuppgift på kurs C (nivå B1, nationellt prov-liknande).

Uppdrag: ${title}
Uppgift: ${task}
Punkterna eleven skulle ta upp: ${points.length ? points.join('; ') : '—'}
Ord eleven fick lära sig: ${words.length ? words.join(', ') : '—'}
Läget: ${body.stage_mode === 'test' ? 'provläge (tidspress, inga hjälpmedel)' : 'övning'}

Elevens text (${wordCount} ord):
"""
${text}
"""

Bedöm texten som helhet: uppgiftsuppfyllelse (alla punkter), struktur, ordförråd och grammatik.

Regler:
- Markera bara verkliga fel ur texten. Hitta aldrig på fel.
- Rätta på SFI C-nivå och håll corrected_text så nära elevens egna formuleringar som möjligt.
- Kom ihåg: "måste inte" betyder "do not have to"; "också" används i positiva satser och "heller" i negativa; verbet står på andra plats i huvudsatsen.
- estimated_grade: F (ej godkänd), E, D, C, B eller A. Var rättvis men uppmuntrande.
- grade_reason: EN mening på enkel engelska som förklarar betyget.
- points_covered: en rad per punkt ovan, med punktens text och covered true/false.
- errors: wrong (elevens formulering), correct (bättre formulering), type (verb_second | en_ett | definite_form | preposition | spelling | verb_form | word_choice | connector | other), rule (kort förklaring på enkel engelska).
- words_used: vilka av orden ovan eleven faktiskt använde, exakt som i listan.
- strengths: 2-3 saker som är bra, på enkel svenska.
- practice_next: 3 korta mönster eleven bör träna på, på svenska med kort engelsk gloss.`,
      response_json_schema: FULL_SCHEMA,
    });

    if (!result || typeof result !== 'object' || !result.estimated_grade) {
      return Response.json({ error: 'feedback_failed' }, { status: 502 });
    }

    return Response.json({
      estimated_grade: result.estimated_grade,
      grade_reason: result.grade_reason || '',
      points_covered: Array.isArray(result.points_covered) ? result.points_covered : [],
      errors: Array.isArray(result.errors) ? result.errors.slice(0, 15) : [],
      corrected_text: result.corrected_text || '',
      words_used: Array.isArray(result.words_used) ? result.words_used : [],
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      practice_next: Array.isArray(result.practice_next) ? result.practice_next : [],
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}