import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Infer prerequisite lessons with the LLM and store them on each lesson.
//
// For a target lesson, the candidate set is every lesson in the SAME or a LOWER
// SFI course (a lesson can only depend on something at or below its level). The
// LLM is given the target plus the candidate list and returns the ids it truly
// depends on. Result is written to the lesson's `prerequisites` field only.
//
// Frontend drives the loop (one id per call):
//   { list_only: true, course?, only_missing?, limit? } -> { ids, total }
//   { lesson_id: "..." }                                 -> infers one lesson
const COURSE_RANK: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const all = await base44.asServiceRole.entities.Lesson.list('order', 1000);

    // ── Mode 1: list targets ──────────────────────────────────────────────
    if (body.list_only === true) {
      let targets = all;
      if (body.course) targets = targets.filter((l: any) => l.sfi_course === body.course);
      if (body.only_missing === true) targets = targets.filter((l: any) => !l.prerequisites || l.prerequisites.length === 0);
      const limit = parseInt(body.limit || '0', 10);
      if (limit > 0) targets = targets.slice(0, limit);
      return Response.json({ ids: targets.map((l: any) => ({ id: l.id, title: l.title })), total: targets.length });
    }

    // ── Mode 2: infer one lesson ──────────────────────────────────────────
    if (!body.lesson_id) return Response.json({ error: 'lesson_id required' }, { status: 400 });

    const lesson = all.find((l: any) => l.id === body.lesson_id);
    if (!lesson) return Response.json({ error: 'Lesson not found' }, { status: 404 });

    const rank = COURSE_RANK[lesson.sfi_course] ?? 9;
    // Candidates: same/lower course, not the lesson itself.
    const candidates = all
      .filter((l: any) => l.id !== lesson.id && (COURSE_RANK[l.sfi_course] ?? 9) <= rank)
      .map((l: any) => ({ id: l.id, title: l.title, course: l.sfi_course, skill: l.skill || l.category, topic: l.topic }));

    if (candidates.length === 0) {
      await base44.asServiceRole.entities.Lesson.update(lesson.id, { prerequisites: [] });
      return Response.json({ success: true, lesson_id: lesson.id, prerequisites: [] });
    }

    const prompt = `You are mapping prerequisites in an SFI Swedish course.

TARGET LESSON:
- id: ${lesson.id}
- title: ${lesson.title}
- course: ${lesson.sfi_course}
- skill: ${lesson.skill || lesson.category}
- topic: ${lesson.topic || ''}
- summary: ${(lesson.content || '').slice(0, 600)}

CANDIDATE earlier lessons (same or lower level):
${candidates.map((c: any) => `- ${c.id} | ${c.title} | Kurs ${c.course} | ${c.skill} | ${c.topic || ''}`).join('\n')}

Return the ids of candidates that the learner SHOULD genuinely complete BEFORE the target lesson — i.e. real conceptual/grammatical/vocabulary prerequisites (e.g. past tense before a lesson that uses it, numbers before telling time). Be strict: only direct dependencies, at most 3, and only from the candidate ids above. If there are no real prerequisites, return an empty list.`;

    let generated: any;
    try {
      generated = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: { prerequisites: { type: 'array', items: { type: 'string' } } },
          required: ['prerequisites'],
        },
      });
    } catch (e) {
      return Response.json({ success: false, lesson_id: lesson.id, error: 'LLM call failed: ' + (e as Error).message }, { status: 500 });
    }

    let data = generated;
    if (generated?.response && typeof generated.response === 'string') {
      try {
        const raw = generated.response.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/, '').trim();
        data = JSON.parse(raw);
      } catch { data = { prerequisites: [] }; }
    }

    // Keep only valid candidate ids (guard against hallucinated/self ids).
    const validIds = new Set(candidates.map((c: any) => c.id));
    const prerequisites = [...new Set((data?.prerequisites || []).filter((id: string) => validIds.has(id)))].slice(0, 3);

    await base44.asServiceRole.entities.Lesson.update(lesson.id, { prerequisites });
    return Response.json({ success: true, lesson_id: lesson.id, prerequisites });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});
