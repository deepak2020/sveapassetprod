import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Reformat EXISTING bilingual content in place, without regenerating it.
//
// Reorders each item's `content` markdown into two clearly separated
// sections — all Swedish first, then a "---" divider and a "## In English"
// section — WITHOUT changing the actual information and WITHOUT touching any
// other field (word_pairs, quizzes, etc.). Because only `content` is written
// and the item id is unchanged, user progress/completion is unaffected.
//
// The frontend drives the loop (one id per call) to avoid 504 timeouts.
// Two modes:
//   { list_only: true, type?, course?, limit? } -> { ids: [...], total }
//   { id: "...", type? }                         -> reformats one item
// type: "lesson" (default) | "civic"
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const type = body.type === 'civic' ? 'civic' : 'lesson';
    const entity = type === 'civic'
      ? base44.asServiceRole.entities.CivicTopic
      : base44.asServiceRole.entities.Lesson;

    // ── Mode 1: list items that have content to reformat ──────────────
    if (body.list_only === true) {
      const limit = parseInt(body.limit || '0', 10);
      const all = await entity.list('order', 1000);
      let targets = all.filter((it) => typeof it.content === 'string' && it.content.trim().length > 0);
      if (type === 'lesson' && body.course) targets = targets.filter((l) => l.sfi_course === body.course);
      if (limit > 0) targets = targets.slice(0, limit);
      return Response.json({
        ids: targets.map((it) => ({ id: it.id, title: it.title || it.name || it.id })),
        total: targets.length,
      });
    }

    // ── Mode 2: reformat one item ─────────────────────────────────────
    if (!body.id) {
      return Response.json({ error: 'id required' }, { status: 400 });
    }

    const found = await entity.filter({ id: body.id });
    const item = found?.[0];
    if (!item) return Response.json({ error: 'Not found' }, { status: 404 });
    const original = (item.content || '').trim();
    if (!original) {
      return Response.json({ success: true, id: body.id, skipped: 'no content' });
    }

    const prompt = `You are reformatting an EXISTING bilingual Swedish/English ${type === 'civic' ? 'civic topic' : 'SFI lesson'}.
Below is its current markdown content. Reorganise it into EXACTLY two sections:
1. First, ALL the Swedish content (keep every Swedish heading, paragraph, example sentence, table and bullet list).
2. Then a line containing only "---", then a heading "## In English", then ALL the English content.

STRICT RULES:
- Do NOT add new information, facts, examples or exercises. Do NOT remove any information. Only REORDER and restructure what is already there.
- English that was interleaved (in *italics*, in (parentheses), or following each Swedish paragraph) must be moved into the "## In English" section as clean prose/lists.
- Keep all markdown formatting: ## / ### headings, **bold**, tables (| ... |), and bullet lists. Keep Swedish institution/term names (e.g. *Skatteverket*) where they appear.
- If the original is written mostly in ENGLISH with only a few Swedish terms, treat that English as the basis: produce a faithful Swedish version for the Swedish section first, then put the English in the "## In English" section. Translate faithfully — do not invent new content.
- Keep the language level and tone identical to the original.
- Output ONLY the reformatted markdown that goes in the content field — no commentary, no code fences.

CURRENT CONTENT:
"""
${original}
"""`;

    let generated;
    try {
      generated = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: { content: { type: 'string' } },
          required: ['content'],
        },
      });
    } catch (llmError) {
      return Response.json({ success: false, id: body.id, error: 'LLM call failed: ' + llmError.message }, { status: 500 });
    }

    // InvokeLLM may return { response: string } instead of parsed JSON.
    let data = generated;
    if (generated?.response && typeof generated.response === 'string') {
      try {
        const raw = generated.response.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/, '').trim();
        data = JSON.parse(raw);
      } catch {
        // Fall back to treating the whole string as the content.
        data = { content: generated.response };
      }
    }

    const next = (data?.content || '').trim();
    // Safety: never wipe content. Require a plausible reformat that still
    // contains the English-section marker, otherwise keep the original.
    if (!next || next.length < Math.floor(original.length * 0.5) || !/##\s*In English/i.test(next)) {
      return Response.json({ success: false, id: body.id, skipped: 'reformat rejected (kept original)' });
    }

    await entity.update(body.id, { content: next });
    return Response.json({ success: true, id: body.id });
  } catch (error) {
    return Response.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
});
