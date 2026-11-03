import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const clean = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[.,;:!?"'’]/g, ' ')
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

// "en distans" ~ "distans", "to work" ~ "work"
const bare = (s) => s.replace(/^(en|ett|the|a|an|to|att)\s+/, '');

// A listed answer may offer alternatives: "teaching, instruction"
const variants = (answer) =>
  String(answer || '')
    .split(/[,/;]/)
    .map(clean)
    .filter(Boolean)
    .flatMap((v) => [v, bare(v)]);

const isCorrect = (student, answer) => {
  const s = clean(student);
  if (!s) return false;
  const forms = [s, bare(s)];
  return variants(answer).some((a) => forms.includes(a));
};

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json().catch(() => ({}));
    const items = (Array.isArray(body.items) ? body.items : [])
      .filter((i) => i && i.prompt && i.answer)
      .slice(0, 80)
      .map((i, idx) => ({ n: Number(i.n) || idx + 1, prompt: String(i.prompt), answer: String(i.answer) }));
    const fileUris = (Array.isArray(body.file_uris) ? body.file_uris : []).filter(Boolean).slice(0, 3);

    if (!items.length) return Response.json({ error: 'items are required' }, { status: 400 });
    if (!fileUris.length) return Response.json({ error: 'file_uris are required' }, { status: 400 });

    const signed = await Promise.all(
      fileUris.map((file_uri) =>
        base44.integrations.Core.CreateFileSignedUrl({ file_uri, expires_in: 900 })
      )
    );
    const fileUrls = signed
      .map((s) => s?.signed_url || s?.data?.signed_url)
      .filter(Boolean);

    if (!fileUrls.length) return Response.json({ error: 'files could not be opened' }, { status: 400 });

    const rows = items.map((i) => `${i.n}. ${i.prompt}`).join('\n');

    const llm = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a handwriting transcriber for a vocabulary worksheet. You only read what the student wrote by hand. You never solve the exercise.

The printed worksheet has these numbered rows (this printed text is NOT the student's writing):
${rows}

For every number, transcribe only the handwritten answer on that row:
- Keep Swedish characters å, ä, ö exactly as written.
- Do not correct spelling. Do not translate. Do not write the expected answer. Never fill in a word the student did not write.
- If the row is empty, not visible, or not legible, return an empty string for it.
- Return exactly one entry for every number from 1 to ${items.length}, in order.
- Set "readable" to false if the image does not actually show a legible worksheet (blurry, wrong picture, or no handwriting visible at all). Never guess answers in that case.

Return JSON: {"readable":true,"answers":[{"n":1,"text":"..."}]}`,
      file_urls: fileUrls,
      response_json_schema: {
        type: 'object',
        properties: {
          readable: { type: 'boolean' },
          answers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                n: { type: 'number' },
                text: { type: 'string' },
              },
              required: ['n', 'text'],
            },
          },
        },
        required: ['answers'],
      },
    });

    if (llm?.readable === false) {
      return Response.json(
        { error: 'unreadable', message: 'Kunde inte läsa bilden. Ta en tydligare bild rakt ovanifrån och försök igen.' },
        { status: 422 }
      );
    }

    const answers = Array.isArray(llm?.answers) ? llm.answers : [];
    const byNumber = new Map(answers.map((a) => [Number(a.n), String(a.text || '').trim()]));

    const results = items.map((i) => {
      const student = byNumber.get(i.n) || '';
      return {
        n: i.n,
        prompt: i.prompt,
        answer: i.answer,
        student,
        correct: isCorrect(student, i.answer),
      };
    });

    return Response.json({
      score: results.filter((r) => r.correct).length,
      total: results.length,
      results,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}