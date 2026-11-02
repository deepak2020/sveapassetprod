import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Swedish pronunciation audio. Generates MP3 speech with an explicit Swedish
// language setting (the model supports sv) and returns a public URL that the
// frontend caches, so each word is only synthesised once.
export default async function (req) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = typeof body?.text === 'string' ? body.text.trim() : '';
    if (!text) return Response.json({ error: 'text is required' }, { status: 400 });
    if (text.length > 400) return Response.json({ error: 'text must be 400 characters or fewer' }, { status: 400 });

    const base44 = createClientFromRequest(req);
    const { baseURL, token, headers } = base44.asServiceRole.aiGateway.connection();

    const res = await fetch(`${baseURL}/audio/speech`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: 'eleven_flash_v2_5',
        input: text,
        voice: 'honey',
        language: 'sv',
        response_format: 'mp3',
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return Response.json({ error: `Speech generation failed (${res.status}): ${detail}` }, { status: 502 });
    }

    const bytes = await res.arrayBuffer();
    const file = new File([bytes], 'speech.mp3', { type: 'audio/mpeg' });
    const { file_url } = await base44.asServiceRole.integrations.Core.UploadPublicFile({ file });

    return Response.json({ url: file_url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}