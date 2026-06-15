import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// LLM coaching for learners. Two kinds:
//   { kind: "focus", course, weakSkills, streak }                 -> a short
//       personalised "what to focus on" message.
//   { kind: "explain", question, userAnswer, correctAnswer }      -> a gentle
//       1–2 sentence explanation of why the correct answer is right.
// Returns { text }.
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Auth required' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    let prompt: string;

    if (body.kind === 'explain') {
      prompt = `You are a warm, encouraging Swedish (SFI) tutor. A learner just answered a quiz question incorrectly.

Question: ${body.question}
Their answer: ${body.userAnswer}
Correct answer: ${body.correctAnswer}

In 1–2 short sentences, gently explain WHY the correct answer is right — the rule, pattern or meaning — in simple English, keeping the key Swedish words. Be kind and concrete. No preamble, no "great question", just the explanation.`;
    } else {
      prompt = `You are a warm, encouraging Swedish (SFI) tutor coaching a learner in Kurs ${body.course || 'C'}.
Their weakest skills right now: ${body.weakSkills || 'unknown'}. Current streak: ${body.streak ?? 0} days.

In 2–3 short, warm sentences spoken directly to them ("you"), say what to focus on next and give ONE concrete, doable tip for today. No preamble, no bullet lists, no headings.`;
    }

    let generated: any;
    try {
      generated = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: { text: { type: 'string' } },
          required: ['text'],
        },
      });
    } catch (e) {
      return Response.json({ error: 'LLM call failed: ' + (e as Error).message }, { status: 500 });
    }

    let data = generated;
    if (generated?.response && typeof generated.response === 'string') {
      try {
        const raw = generated.response.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/, '').trim();
        data = JSON.parse(raw);
      } catch { data = { text: generated.response }; }
    }

    const text = (data?.text || '').trim();
    if (!text) return Response.json({ error: 'empty' }, { status: 500 });
    return Response.json({ text });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
});
