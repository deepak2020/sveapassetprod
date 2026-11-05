import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Grades a handwritten writing-test answer from photos: transcribes what the
// student actually wrote, then assesses it with the same rubric as the typed
// answer, so both paths produce the same feedback shape.
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const course = String(body.course || '').slice(0, 4);
    const cefr = String(body.cefr || '').slice(0, 8);
    const task = String(body.task || '').slice(0, 2000);
    const points = (Array.isArray(body.points) ? body.points : []).map((p) => String(p)).slice(0, 10);
    const fileUris = (Array.isArray(body.file_uris) ? body.file_uris : []).filter(Boolean).slice(0, 3);

    if (!task) return Response.json({ error: 'task is required' }, { status: 400 });
    if (!fileUris.length) return Response.json({ error: 'file_uris are required' }, { status: 400 });

    const signed = await Promise.all(
      fileUris.map((file_uri) =>
        base44.integrations.Core.CreateFileSignedUrl({ file_uri, expires_in: 900 })
      )
    );
    const fileUrls = signed.map((s) => s?.signed_url || s?.data?.signed_url).filter(Boolean);
    if (!fileUrls.length) return Response.json({ error: 'files could not be opened' }, { status: 400 });

    const llm = await base44.integrations.Core.InvokeLLM({
      prompt: `Du rättar ett skrivprov i svenska (SFI nationellt prov kurs ${course}, CEFR ${cefr}) som eleven har skrivit FÖR HAND och fotograferat.

Uppgift: ${task}
Punkter eleven skulle ta upp: ${points.length ? points.join('; ') : '—'}

Bilderna visar elevens handskrivna svar på papper.
Steg 1: skriv av elevens text ordagrant i "text". Behåll å, ä, ö. Rätta inte stavfel, byt inte ut ord och hitta inte på text. Om bilderna inte visar en läsbar handskriven text (suddigt, fel bild, tomt papper), sätt "readable": false och lämna "text" tom.
Steg 2: bedöm den avskrivna texten som en SFI-lärare enligt betygsskalan F (ej godkänd), E, D, C, B, A. Bedöm innehåll, sammanhang, ordförråd och grammatik. Ge kort feedback på enkel svenska.`,
      file_urls: fileUrls,
      response_json_schema: {
        type: 'object',
        properties: {
          readable: { type: 'boolean' },
          text: { type: 'string' },
          grade: { type: 'string' },
          summary: { type: 'string' },
          strengths: { type: 'array', items: { type: 'string' } },
          improvements: { type: 'array', items: { type: 'string' } },
        },
        required: ['readable', 'grade', 'summary'],
      },
    });

    if (llm?.readable === false || !String(llm?.text || '').trim()) {
      return Response.json(
        { error: 'unreadable', message: 'Kunde inte läsa texten på bilden. Ta en tydligare bild och försök igen.' },
        { status: 422 }
      );
    }

    return Response.json({
      text: String(llm.text),
      grade: llm.grade,
      summary: llm.summary,
      strengths: Array.isArray(llm.strengths) ? llm.strengths : [],
      improvements: Array.isArray(llm.improvements) ? llm.improvements : [],
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}