import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { topic, level, currentTopicTitle } = await req.json();

    if (!topic || !level) {
      return Response.json({ error: 'Missing topic or level' }, { status: 400 });
    }

    const prompt = `Generate exactly 50 Swedish grammar questions for the topic "${currentTopicTitle}" at SFI level ${level}.

Topic context: ${topic}

Create a varied mix of question types:
- 20 fill-in-the-blank questions (show the sentence with ___ for the blank)
- 20 multiple-choice questions (exactly 4 options each)
- 10 translation/comprehension questions (exactly 4 options each)

CRITICAL QUALITY RULES:
1. Every question MUST have exactly 4 options — never 2 or 3.
2. All 3 distractors MUST be real Swedish words or phrases. Never invent fake words (e.g. "bilor", "husor").
3. The blank (___) must REPLACE the word being tested, not sit next to it. Example: "___ är röd" (answer: "Bilen"), NOT "___ bil är röd".
4. Do NOT create "Find the mistake/error" questions — they are ambiguous when multiple options contain mistakes.
5. Do NOT create True/False questions — always use 4 distinct options.
6. Only ONE option should be correct. The other three must be plausible but clearly wrong.
7. Options must not be duplicates (case-insensitive).
8. Do not use em-dashes (—) as placeholders in options.

Return a JSON array with this structure for each question:
{
  "question": "the question text",
  "type": "fill-blank" | "choice" | "translation",
  "answer": "correct answer",
  "options": ["option1", "option2", "option3", "option4"],
  "correct_index": 0,
  "explanation": "brief explanation of the answer"
}

Make questions progressively more difficult, with the first questions being easier and later ones more challenging.
Ensure all questions are appropriate for level ${level} students.
Return only valid JSON, no other text.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                type: { type: "string" },
                answer: { type: "string" },
                options: { type: "array", items: { type: "string" } },
                correct_index: { type: "number" },
                explanation: { type: "string" }
              }
            }
          }
        }
      }
    });

    const questions = response.questions || [];

    return Response.json({
      success: true,
      topicTitle: currentTopicTitle,
      level,
      questionCount: questions.length,
      questions: questions.slice(0, 50) // Ensure exactly 50
    });
  } catch (error) {
    console.error('Error generating grammar questions:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});