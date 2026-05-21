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
Step 2 — In a single pass, fix EVERY error across ALL categories at once:
  a) Spelling mistakes (skip proper nouns and names)
  b) Wrong verb form or tense
  c) Wrong article (en/ett)
  d) Wrong word order
  e) Wrong or unnatural vocabulary choice

Step 3 — Write corrected_text: the student's FULL answer with ALL corrections applied. Keep names, punctuation, and correct words exactly as written. Only fix the errors.

Step 4 — List every change you made in grammar_issues.

Step 5 — Decide if the answer addresses the question, write one tip, one overall sentence.

Return JSON:
- corrected_text: string — the student's full answer with every error fixed
- relevant: boolean
- relevance_feedback: string (English, one sentence)
- grammar_issues: array of every change made, each: wrong (original word/phrase), correct (fixed form), explanation (English, max 10 words)
- suggestion: string (English, one practical tip)
- score: "great" | "good" | "needs_work"
- overall: string (English, one encouraging sentence)`,
    response_json_schema: {
      type: "object",
      properties: {
        corrected_text: { type: "string" },
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

// Split text into tokens: words and the whitespace/punctuation between them
function tokenize(text) {
  return text.split(/(\s+)/);
}

// Word-by-word diff between original and corrected text.
// Returns array of segments: { type: "same"|"changed", orig, corr }
function wordDiff(original, corrected) {
  if (!corrected || original === corrected) return [{ type: "same", orig: original }];

  const origTokens = tokenize(original);
  const corrTokens = tokenize(corrected);

  // Fast path: same token count — compare slot by slot
  if (origTokens.length === corrTokens.length) {
    return origTokens.map((tok, i) => {
      const same = tok.toLowerCase().replace(/[^a-zåäöA-ZÅÄÖ]/g, "") ===
                   corrTokens[i].toLowerCase().replace(/[^a-zåäöA-ZÅÄÖ]/g, "");
      return same
        ? { type: "same", orig: tok }
        : { type: "changed", orig: tok, corr: corrTokens[i] };
    });
  }

  // Fallback: show original word-by-word then corrected version
  return [
    { type: "same", orig: original + " " },
    { type: "corrected_block", corr: corrected },
  ];
}

// Shows corrected text: unchanged words normally, changed words as
// strikethrough-red (wrong) immediately followed by bold-green (correct)
function AnnotatedText({ original, correctedText }) {
  if (!correctedText || original === correctedText) return null;

  const segments = wordDiff(original, correctedText);

  return (
    <span className="text-sm leading-relaxed">
      {segments.map((seg, i) => {
        if (seg.type === "same") {
          return <span key={i} className="text-foreground">{seg.orig}</span>;
        }
        if (seg.type === "changed") {
          return (
            <span key={i}>
              <s className="text-red-500 dark:text-red-400">{seg.orig}</s>
              {" "}
              <span className="font-semibold text-green-700 dark:text-green-400">{seg.corr}</span>
            </span>
          );
        }
        return (
          <span key={i}>
            <s className="text-red-400">{seg.orig}</s>
            {" "}
            <span className="font-semibold text-green-700 dark:text-green-400">{seg.corr}</span>
          </span>
        );
      })}
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

      {/* Off-topic warning */}
      {!feedback.relevant && (
        <div className="flex items-start gap-2 bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-800/40 rounded-xl px-3 py-2.5">
          <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-orange-800 dark:text-orange-300 mb-0.5">Off-topic</p>
            <p className="text-xs text-orange-700 dark:text-orange-400">{feedback.relevance_feedback}</p>
          </div>
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
              {/* Original answer — unchanged */}
              <div className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-3 border border-violet-200/60 dark:border-violet-800/40">
                <p className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-1.5">Your answer:</p>
                <p className="text-sm text-foreground leading-relaxed">{savedAnswer}</p>
              </div>

              {/* Corrected version — separate box below */}
              {!checking && feedback?.corrected_text && feedback.corrected_text !== savedAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-3 border border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-950/30"
                >
                  <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-1.5">Corrected version:</p>
                  <AnnotatedText original={savedAnswer} correctedText={feedback.corrected_text} />
                </motion.div>
              )}

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
