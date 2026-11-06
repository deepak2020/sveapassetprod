import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Grades an SFI course C (B1) writing or speaking answer against the task points
// and the topic vocabulary the learner was given. A handwritten answer can be
// sent as photos (file_uris) instead of text — it is transcribed first, then
// graded with the same feedback shape.
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
    const fileUris = (Array.isArray(body.file_uris) ? body.file_uris : []).filter(Boolean).slice(0, 3);
    const isPhoto = fileUris.length > 0;
    const response = isPhoto ? '' : String(body.response || '').slice(0, 6000);

    if (!task) return Response.json({ error: 'task is required' }, { status: 400 });

    const wordCount = response.trim().split(/\s+/).filter(Boolean).length;
    if (!isPhoto && wordCount < 10) {
      return Response.json(
        { error: 'too_short', message: 'Skriv eller säg lite mer innan du lämnar in.' },
        { status: 422 }
      );
    }

    let fileUrls = [];
    if (isPhoto) {
      const signed = await Promise.all(
        fileUris.map((file_uri) => base44.integrations.Core.CreateFileSignedUrl({ file_uri, expires_in: 900 }))
      );
      fileUrls = signed.map((s) => s?.signed_url || s?.data?.signed_url).filter(Boolean);
      if (!fileUrls.length) return Response.json({ error: 'files could not be opened' }, { status: 400 });
    }

    const skillText =
      skill === 'speaking'
        ? 'Eleven har TALAT och texten är en automatisk transkription av talet. Bedöm inte skiljetecken eller versaler. Bedöm flyt, meningsbyggnad, ordförråd och hur väl eleven utvecklar sina svar. Om ett ord ser ut som ett transkriptionsfel (t.ex. sammansmältning) ska det inte räknas som språkfel.'
        : 'Eleven har SKRIVIT texten. Bedöm textuppbyggnad, sammanhang, variation, grammatik och stavning.';

    const source = isPhoto
      ? `Bilderna visar elevens HANDSKRIVNA svar på papper.
Steg 1: skriv av elevens text ordagrant i "text". Behåll å, ä, ö. Rätta inte stavfel, byt inte ut ord och hitta ALDRIG på text som inte syns på bilden. Om bilderna inte tydligt visar läsbar handskriven svensk text (suddigt, fel motiv, tomt eller nästan tomt papper), sätt "readable": false och lämna "text" tom — gissa inte.
Steg 2: bedöm den avskrivna texten enligt punkterna nedan.`
      : `Elevens svar:
"""
${response}
"""`;

    const llm = await base44.integrations.Core.InvokeLLM({
      prompt: `Du är en erfaren SFI-lärare som bedömer en uppgift på kurs C (nivå B1, nationellt prov-liknande).

Ämne: ${topicTitle}
Uppgift: ${task}
Punkterna eleven skulle ta upp: ${points.length ? points.join('; ') : '—'}
Ordförråd eleven fick som stöd: ${vocabulary.length ? vocabulary.join(', ') : '—'}
Läget: ${mode === 'exam' ? 'provläge (tidspress, inga hjälpmedel)' : 'guidad övning'}

${skillText}

${source}

Uppgifter:
1. Bedöm om eleven svarade på uppgiften och tog upp punkterna ("task_completion", en eller två meningar).
2. Sätt betyg enligt skalan F (ej godkänd), E, D, C, B, A för kurs C. Var rättvis men uppmuntrande.
3. Ge en kort sammanfattning på enkel svenska ("summary").
4. Lista 2–4 saker som är bra ("strengths") och 2–4 konkreta saker att förbättra ("improvements").
5. Ge 3–6 konkreta språkrättelser ("corrections") med elevens formulering ("wrong"), en bättre formulering ("correct") och en kort regel/förklaring på svenska ("rule"). Ta bara med verkliga fel ur texten — hitta inte på.
6. Lista vilka av ordlistans ord eleven faktiskt använde ("vocab_used"), exakt som i listan.

All feedback ska vara på enkel svenska (B1-nivå).`,
      ...(isPhoto ? { file_urls: fileUrls } : {}),
      response_json_schema: {
        type: 'object',
        properties: {
          ...(isPhoto ? { readable: { type: 'boolean' }, text: { type: 'string' } } : {}),
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

    const transcript = String(llm.text || '').trim();
    if (isPhoto && (llm.readable === false || !transcript)) {
      return Response.json(
        { error: 'unreadable', message: 'Kunde inte läsa texten på bilden. Ta en tydligare bild och försök igen.' },
        { status: 422 }
      );
    }

    return Response.json({
      grade: llm.grade || 'E',
      summary: llm.summary || '',
      task_completion: llm.task_completion || '',
      strengths: Array.isArray(llm.strengths) ? llm.strengths : [],
      improvements: Array.isArray(llm.improvements) ? llm.improvements : [],
      corrections: Array.isArray(llm.corrections) ? llm.corrections.slice(0, 8) : [],
      vocab_used: Array.isArray(llm.vocab_used) ? llm.vocab_used : [],
      transcript: isPhoto ? transcript : '',
      word_count: isPhoto ? transcript.split(/\s+/).filter(Boolean).length : wordCount,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}