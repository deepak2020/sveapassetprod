import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

// Renders one listening-test clip as natural Swedish speech: every line is
// synthesised with a distinct neural voice (so dialogues sound like two
// different people) and the parts are joined into a single MP3 that is stored
// in public storage. Used to fill in audio for the hörförståelse bank.
const VOICES = ['honey', 'storm', 'sunny', 'river'];

async function synthesize(base44, text, voice) {
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
      voice,
      language: 'sv',
      response_format: 'mp3',
    }),
    signal: AbortSignal.timeout(60000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Speech generation failed (${res.status}): ${detail}`);
  }
  return new Uint8Array(await res.arrayBuffer());
}

function join(parts) {
  const total = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const key = typeof body?.key === 'string' ? body.key.trim() : '';
    const lines = Array.isArray(body?.lines) ? body.lines : [];
    if (!key || !lines.length) return Response.json({ error: 'key and lines are required' }, { status: 400 });
    if (!/^[a-z0-9-]+$/.test(key)) return Response.json({ error: 'key must be lowercase a-z, 0-9 and hyphens' }, { status: 400 });

    const speakers = [...new Set(lines.map((l) => l.speaker))];
    const parts = [];
    for (const line of lines) {
      const voice = VOICES[speakers.indexOf(line.speaker) % VOICES.length];
      parts.push(await synthesize(base44, String(line.text || ''), voice));
    }

    const file = new File([join(parts)], `${key}.mp3`, { type: 'audio/mpeg' });
    const { file_url } = await base44.asServiceRole.integrations.Core.UploadPublicFile({ file });

    return Response.json({ url: file_url, speakers: speakers.length, bytes: file.size });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}