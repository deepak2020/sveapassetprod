import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Translate a listening item's transcript to English (on demand) and cache it
// back into the Supabase listening_bank row so every learner gets it for free.
//
// POST { id, transcript: [{speaker,text}] } -> { transcript: [{speaker,text,text_en}] }
//
// Requires base44 secrets SUPABASE_URL and SUPABASE_SERVICE_KEY for the
// write-back (translation still works/returns without them — just not cached
// server-side).
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_KEY') ?? '';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Auth required' }, { status: 401 });

    const { id, transcript } = await req.json().catch(() => ({}));
    if (!id || !Array.isArray(transcript) || transcript.length === 0) {
      return Response.json({ error: 'id and transcript required' }, { status: 400 });
    }

    // Already translated → return as-is.
    if (transcript.every((l: any) => l.text_en)) return Response.json({ transcript });

    const numbered = transcript.map((l: any, i: number) => `${i + 1}. ${l.text}`).join('\n');
    const prompt = `Translate each numbered Swedish line into natural, simple English. Keep the same order and the same number of lines. Do not add notes.\n\n${numbered}`;

    let generated: any;
    try {
      generated = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: { lines: { type: 'array', items: { type: 'string' } } },
          required: ['lines'],
        },
      });
    } catch (e) {
      return Response.json({ error: 'LLM failed: ' + (e as Error).message }, { status: 500 });
    }

    let data = generated;
    if (generated?.response && typeof generated.response === 'string') {
      try {
        data = JSON.parse(generated.response.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/, '').trim());
      } catch { data = { lines: [] }; }
    }
    const en: string[] = Array.isArray(data?.lines) ? data.lines : [];
    if (en.length === 0) return Response.json({ error: 'empty translation' }, { status: 500 });

    const out = transcript.map((l: any, i: number) => ({ ...l, text_en: l.text_en || en[i] || '' }));

    // Cache back into Supabase (best-effort).
    if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
      await fetch(`${SUPABASE_URL}/rest/v1/listening_bank?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ transcript: out }),
      }).catch(() => {});
    }

    return Response.json({ transcript: out });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});
