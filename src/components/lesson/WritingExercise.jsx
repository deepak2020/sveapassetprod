import { useState, useEffect } from "react";
import { Lightbulb, ChevronDown, ChevronUp, CheckCircle2, PencilLine, Loader2, ThumbsUp, AlertCircle, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useWritingAnswers } from "@/hooks/useWritingAnswers";

async function evaluateAnswer(prompt, hint, exampleAnswer, userAnswer) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a Swedish language teacher evaluating an SFI student's written answer.

Question: "${prompt}"
${hint ? `Hint: ${hint}` : ""}
${exampleAnswer ? `Model answer: ${exampleAnswer}` : ""}
Student wrote: "${userAnswer}"

Step 1 — Read the student's text word by word.
Step 2 — In a single pass, collect EVERY error you see across ALL of these categories at the same time:
  a) Spelling mistakes (skip proper nouns and names)
  b) Wrong verb form or tense
  c) Wrong article (en/ett)
  d) Wrong word order
  e) Wrong or unnatural vocabulary choice

Step 3 — Put ALL errors from step 2 into the grammar_issues array in one go. Do not save some for later. Do not group by category. List every single one now.

Step 4 — Decide if the answer addresses the question (relevant).
Step 5 — Write one tip and one overall sentence.

Return JSON:
- relevant: boolean
- relevance_feedback: string (English, one sentence)
- grammar_issues: array of ALL errors found in step 2, each with: wrong (exact text from student), correct (Swedish fix), explanation (English, max 10 words). Must be complete — do not omit any error.
- suggestion: string (English, one practical tip)
- score: "great" | "good" | "needs_work"
- overall: string (English, one encouraging sentence)`,
    response_json_schema: {
      type: "object",
      properties: {
        relevant: { type: "boolean" },
        relevance_feedback: { type: "string" },
        grammar_issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              wrong: { type: "string" },
              correct: { type: "string" },
              explanation: { type: "string" },
            },
          },
        },
        suggestion: { type: "string" },
        score: { type: "string" },
        overall: { type: "string" },
      },
    },
  });
  return result;
}

function AnnotatedText({ text, grammarIssues }) {
  if (!grammarIssues || grammarIssues.length === 0) {
    return <span className="text-sm text-foreground leading-relaxed">{text}</span>;
  }

  // Find and highlight wrong phrases in the text
  let segments = [{ t: text, error: false }];
  grammarIssues.forEach((issue) => {
    if (!issue.wrong) return;
    const next = [];
    segments.forEach((seg) => {
      if (seg.error) { next.push(seg); return; }
      const idx = seg.t.toLowerCase().indexOf(issue.wrong.toLowerCase());
      if (idx === -1) { next.push(seg); return; }
      if (idx > 0) next.push({ t: seg.t.slice(0, idx), error: false });
      next.push({ t: seg.t.slice(idx, idx + issue.wrong.length), error: true, issue });
      if (idx + issue.wrong.length < seg.t.length) {
        next.push({ t: seg.t.slice(idx + issue.wrong.length), error: false });
      }
    });
    segments = next;
  });

  return (
    <span className="text-sm text-foreground leading-relaxed">
      {segments.map((seg, i) =>
        seg.error ? (
          <mark
            key={i}
            title={`${seg.issue.explanation} → ${seg.issue.correct}`}
            className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-b-2 border-red-400 rounded-sm px-0.5 cursor-help"
          >
            {seg.t}
          </mark>
        ) : (
          <span key={i}>{seg.t}</span>
        )
      )}
    </span>
  );
}

const SCORE_STYLES = {
  great: { bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/40", text: "text-green-800 dark:text-green-300", icon: <ThumbsUp className="w-4 h-4 text-green-600 shrink-0" /> },
  good:  { bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40",   text: "text-blue-800 dark:text-blue-300",  icon: <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" /> },
  needs_work: { bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40", text: "text-amber-800 dark:text-amber-200", icon: <MessageSquare className="w-4 h-4 text-amber-500 shrink-0" /> },
};

function WritingFeedback({ feedback }) {
  const style = SCORE_STYLES[feedback.score] || SCORE_STYLES.good;

  return (
    <div className="space-y-2.5">
      {/* Overall verdict */}
      <div className={`flex items-start gap-2 rounded-xl px-3 py-2.5 border ${style.bg}`}>
        {style.icon}
        <p className={`text-xs font-medium leading-relaxed ${style.text}`}>{feedback.overall}</p>
      </div>

      {/* Relevance — only show if off-topic */}
      {!feedback.relevant && (
        <div className="flex items-start gap-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/40 rounded-xl px-3 py-2.5">
          <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-orange-800 dark:text-orange-300 mb-0.5">Off-topic</p>
            <p className="text-xs text-orange-700 dark:text-orange-400">{feedback.relevance_feedback}</p>
          </div>
        </div>
      )}

      {/* Grammar issues */}
      {feedback.grammar_issues?.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {feedback.grammar_issues.length} grammar issue{feedback.grammar_issues.length > 1 ? "s" : ""}
          </p>
          {feedback.grammar_issues.map((issue, i) => (
            <div key={i} className="bg-red-50 dark:bg-red-950/30 border border-red-200/60 dark:border-red-800/40 rounded-xl px-3 py-2.5 space-y-1">
              <p className="text-xs text-red-800 dark:text-red-300">{issue.explanation}</p>
              <p className="text-xs text-muted-foreground">
                <span className="line-through text-red-500 mr-1">{issue.wrong}</span>
                → <span className="font-medium text-green-700 dark:text-green-400">{issue.correct}</span>
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tip */}
      {feedback.suggestion && (
        <div className="flex items-start gap-2 bg-violet-50 dark:bg-violet-950/30 border border-violet-200/60 dark:border-violet-800/40 rounded-xl px-3 py-2.5">
          <Lightbulb className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
          <p className="text-xs text-violet-800 dark:text-violet-300">{feedback.suggestion}</p>
        </div>
      )}
    </div>
  );
}

function PromptCard({ prompt, index, onSubmit, onEdit, isSubmitted, savedAnswer, feedback, checking, checkFailed }) {
  const [answer, setAnswer] = useState(savedAnswer || "");
  const [showExample, setShowExample] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (savedAnswer && !editing) setAnswer(savedAnswer);
  }, [savedAnswer]);

  const handleSubmit = () => {
    onSubmit(index, answer);
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
    onEdit(index);
  };

  const showInput = !isSubmitted || editing;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="border-border/50">
        <CardContent className="p-5 space-y-4">
          {/* Prompt */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-sm font-bold text-violet-700 dark:text-violet-300 shrink-0">
              {isSubmitted && !editing ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : index + 1}
            </div>
            <div>
              <p className="font-medium text-foreground">{prompt.prompt}</p>
              {prompt.hint && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> {prompt.hint}
                </p>
              )}
            </div>
          </div>

          {showInput ? (
            <>
              <Textarea
                placeholder="Skriv ditt svar här... (Write your answer here)"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[80px] resize-none"
                autoFocus={editing}
              />
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setShowExample(!showExample)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  {showExample ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  {showExample ? "Hide example" : "Show example answer"}
                </button>
                <div className="flex gap-2">
                  {editing && (
                    <Button size="sm" variant="ghost" onClick={() => setEditing(false)} className="text-muted-foreground">
                      Cancel
                    </Button>
                  )}
                  <Button size="sm" onClick={handleSubmit} disabled={!answer.trim()} className="gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Done
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {/* Answer with inline error highlights */}
              <div className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-3 border border-violet-200/60 dark:border-violet-800/40">
                <p className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-1.5">Your answer:</p>
                <AnnotatedText text={savedAnswer} grammarIssues={feedback?.grammar_issues} />
              </div>

              {/* AI feedback */}
              {checking && (
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Reviewing your answer…
                </div>
              )}
              {!checking && feedback && (
                <AnimatePresence>
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                    <WritingFeedback feedback={feedback} />
                  </motion.div>
                </AnimatePresence>
              )}
              {checkFailed && (
                <p className="text-xs text-muted-foreground">Could not load feedback right now. Your answer is saved.</p>
              )}

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button onClick={handleEdit} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  <PencilLine className="w-3 h-3" /> Edit answer
                </button>
                {prompt.example_answer && (
                  <button onClick={() => setShowExample(!showExample)} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    {showExample ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {showExample ? "Hide example" : "Compare with example"}
                  </button>
                )}
              </div>
            </div>
          )}

          {showExample && prompt.example_answer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3 border border-green-200/60 dark:border-green-800/40"
            >
              <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">Example answer:</p>
              <p className="text-sm text-green-800 dark:text-green-300">{prompt.example_answer}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function WritingExercise({ prompts, lessonId, onComplete }) {
  const { answers, saveAnswer, removeAnswer } = useWritingAnswers(lessonId);
  const [completionFired, setCompletionFired] = useState(false);
  const [feedbackState, setFeedbackState] = useState({});

  useEffect(() => {
    if (!completionFired && prompts?.length > 0 && Object.keys(answers).length === prompts.length) {
      setCompletionFired(true);
      onComplete?.();
    }
  }, [answers]);

  if (!prompts || prompts.length === 0) {
    return <p className="text-muted-foreground text-sm">No writing exercises available.</p>;
  }

  const runFeedback = async (index, answer) => {
    const p = prompts[index];
    setFeedbackState((prev) => ({ ...prev, [index]: { checking: true, feedback: null, failed: false } }));
    try {
      const feedback = await evaluateAnswer(p.prompt, p.hint, p.example_answer, answer);
      setFeedbackState((prev) => ({ ...prev, [index]: { checking: false, feedback, failed: false } }));
    } catch {
      setFeedbackState((prev) => ({ ...prev, [index]: { checking: false, feedback: null, failed: true } }));
    }
  };

  const handleSubmit = (index, answer) => {
    saveAnswer(index, answer);
    runFeedback(index, answer);
    const newCount = Object.keys(answers).filter((k) => Number(k) !== index).length + 1;
    if (newCount === prompts.length && !completionFired) {
      setCompletionFired(true);
      onComplete?.();
    }
  };

  const handleEdit = (index) => {
    removeAnswer(index);
    setFeedbackState((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const doneCount = Object.keys(answers).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Write your answers in Swedish. Your answer will be reviewed against the question automatically.
        {doneCount > 0 && doneCount < prompts.length && (
          <span className="ml-2 font-medium text-foreground">{doneCount}/{prompts.length} completed</span>
        )}
        {doneCount === prompts.length && (
          <span className="ml-2 font-medium text-green-600">All done ✓</span>
        )}
      </p>
      {prompts.map((prompt, i) => {
        const fs = feedbackState[i] || {};
        return (
          <PromptCard
            key={i}
            prompt={prompt}
            index={i}
            onSubmit={handleSubmit}
            onEdit={handleEdit}
            isSubmitted={i in answers}
            savedAnswer={answers[i]}
            feedback={fs.feedback}
            checking={fs.checking}
            checkFailed={fs.failed}
          />
        );
      })}
    </div>
  );
}
