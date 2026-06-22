import { useState, useEffect } from "react";
import {
  Lightbulb, ChevronDown, ChevronUp, CheckCircle2, PencilLine,
  Loader2, ThumbsUp, AlertCircle, MessageSquare, RotateCcw, BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { awardXP, XP_REWARDS } from "@/lib/xp";
import { useWritingAnswers } from "@/hooks/useWritingAnswers";
import { useWritingRevision } from "@/hooks/useWritingRevision";
import { getCachedFeedback, setCachedFeedback, writingCacheKey } from "@/lib/aiCache";
import { normalizeAnswer } from "@/lib/normalizeAnswer";
import SpeakButton from "@/components/shared/SpeakButton";
import { diffWordsInline } from "@/lib/wordDiff";

async function evaluateAnswer(prompt, hint, exampleAnswer, userAnswer) {
  const result = await base44.integrations.Core.InvokeLLM({
    prompt: `You are a Swedish language teacher evaluating an SFI student's written answer.

Question: "${prompt}"
${hint ? `Hint: ${hint}` : ""}
${exampleAnswer ? `Model answer: ${exampleAnswer}` : ""}
Student wrote: "${userAnswer}"

CRITICAL RULE — read this twice:
The model answer is ONE possible answer, not THE answer. If the student's sentence is grammatically correct and natural Swedish that answers the question, it is RIGHT — even if it uses different words, a different verb, or a different structure than the model. DO NOT rewrite valid Swedish to match the model. DO NOT flag stylistic preferences. Examples of sentences you must accept as correct:
- "Jag heter Anna." (valid even if model says "Jag är Anna.")
- "Han kommer från Indien." (valid even if model says "Han är från Indien.")
- "Hon äter frukost." (valid even if model says "Hon är hungrig.")
A sentence is only wrong if it contains a real error: misspelling, wrong verb form, wrong article (en/ett), wrong word order, or vocabulary that is actually incorrect (not just different).

Step 1 — Read the student's text word by word.
Step 2 — Fix ONLY real errors in this list:
  a) Spelling mistakes (skip proper nouns and names)
  b) Wrong verb form or tense
  c) Wrong article (en/ett)
  d) Wrong word order (V2 rule, inversion)
  e) Vocabulary that is genuinely wrong or ungrammatical in context — NOT just different from the model
If the student's sentence has none of these errors, corrected_text MUST equal the student's text exactly and grammar_issues MUST be an empty array.

Step 3 — Write corrected_text: the student's FULL answer with ONLY real corrections applied. Keep names, punctuation, and all correct words exactly as written.

Step 4 — List every real change in grammar_issues. For each, explain the Swedish grammar RULE that was broken — explain WHY it is wrong (e.g. "Swedish present tense verbs end in -r", "ett-words use ett not en as article"). Do NOT add entries for stylistic rewrites.

Step 5 — Decide if the answer addresses the question, write one tip, one overall sentence.

Return JSON:
- corrected_text: string
- relevant: boolean
- relevance_feedback: string (English, one sentence)
- grammar_issues: array, each: wrong (string), correct (string), explanation (English, max 15 words explaining the grammar rule)
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

function normalize(text) {
  return text?.trim().replace(/\s+/g, " ") || "";
}

function AnnotatedText({ original, correctedText }) {
  if (!correctedText || normalize(original) === normalize(correctedText)) return null;
  const segments = diffWordsInline(original || "", correctedText);
  return (
    <span className="text-sm leading-relaxed">
      {segments.map((seg, i) => {
        if (seg.type === "same")
          return <span key={i} className="text-foreground">{seg.text} </span>;
        if (seg.type === "del")
          return <s key={i} className="text-red-500 dark:text-red-400 mr-1">{seg.text}</s>;
        if (seg.type === "ins")
          return (
            <span key={i} className="font-semibold text-green-700 dark:text-green-400 mr-1">
              {seg.text}{" "}
            </span>
          );
        return (
          <span key={i} className="mr-1">
            <s className="text-red-500 dark:text-red-400">{seg.del.join(" ")}</s>{" "}
            <span className="font-semibold text-green-700 dark:text-green-400">{seg.ins.join(" ")}</span>{" "}
          </span>
        );
      })}
    </span>
  );
}

const SCORE_STYLES = {
  great: {
    bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800/40",
    text: "text-green-800 dark:text-green-300",
    icon: <ThumbsUp className="w-4 h-4 text-green-600 shrink-0" />,
  },
  good: {
    bg: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40",
    text: "text-blue-800 dark:text-blue-300",
    icon: <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />,
  },
  needs_work: {
    bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40",
    text: "text-amber-800 dark:text-amber-200",
    icon: <MessageSquare className="w-4 h-4 text-amber-500 shrink-0" />,
  },
};

// Mini grammar lesson card — shows what was wrong, what's correct, and WHY
function GrammarIssueCard({ issue }) {
  return (
    <div className="rounded-xl border border-amber-200 dark:border-amber-800/40 bg-amber-50 dark:bg-amber-950/20 px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
        <span className="text-xs font-mono bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 line-through px-1.5 py-0.5 rounded">
          {issue.wrong}
        </span>
        <span className="text-xs text-muted-foreground">→</span>
        <span className="text-xs font-mono font-semibold bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">
          {issue.correct}
        </span>
      </div>
      <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
        💡 {issue.explanation}
      </p>
    </div>
  );
}

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

      {/* Grammar mini-lessons */}
      {feedback.grammar_issues?.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            Grammar notes ({feedback.grammar_issues.length})
          </p>
          {feedback.grammar_issues.map((issue, i) => (
            <GrammarIssueCard key={i} issue={issue} />
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

// Reveal the example answer word by word so the user is guided, not just shown the answer
function ProgressiveHint({ exampleAnswer }) {
  const [revealed, setRevealed] = useState(0);
  const words = exampleAnswer?.split(" ") ?? [];
  if (!exampleAnswer) return null;
  const allShown = revealed >= words.length;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {!allShown && (
        <button
          onClick={() => setRevealed((r) => Math.min(r + 1, words.length))}
          className="text-xs text-violet-500 hover:text-violet-700 dark:hover:text-violet-300 flex items-center gap-1 transition-colors"
        >
          <Lightbulb className="w-3 h-3" />
          {revealed === 0 ? "Hint" : "More"}
        </button>
      )}
      {revealed > 0 && (
        <>
          <span className="text-xs font-mono text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/30 px-2 py-0.5 rounded-md">
            {words.slice(0, revealed).join(" ")}{!allShown ? " …" : ""}
          </span>
          <button
            onClick={() => setRevealed(0)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            reset
          </button>
        </>
      )}
    </div>
  );
}

function PromptCard({
  prompt, index, onSubmit, onEdit,
  isSubmitted, savedAnswer, feedback, checking, checkFailed,
  isRevision = false,
}) {
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
  const wordCountHint = prompt.example_answer
    ? prompt.example_answer.split(/\s+/).filter(Boolean).length
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <Card className={`border-border/50 ${isRevision ? "border-l-4 border-l-amber-400" : ""}`}>
        <CardContent className="p-5 space-y-4">
          {isRevision && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
              <RotateCcw className="w-3 h-3" /> Revision — you had errors here before
            </div>
          )}

          {/* Prompt */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center text-sm font-bold text-violet-700 dark:text-violet-300 shrink-0">
              {isSubmitted && !editing ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : index + 1}
            </div>
            <div className="flex-1">
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
              {/* Dictation helper — listen to the example, then write it */}
              {prompt.example_answer && (
                <div className="flex items-center gap-3 flex-wrap p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200/60 dark:border-blue-800/30">
                  <SpeakButton text={prompt.example_answer} lang="sv-SE" />
                  <span className="text-xs text-blue-700 dark:text-blue-300 flex-1">
                    Listen to the answer, then write it from memory
                  </span>
                  {wordCountHint && (
                    <span className="text-xs text-muted-foreground bg-white/60 dark:bg-black/20 px-2 py-0.5 rounded-full">
                      ~{wordCountHint} word{wordCountHint !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              )}

              <Textarea
                placeholder="Skriv ditt svar här... (Write your answer here)"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="min-h-[80px] resize-none"
                autoFocus={editing}
              />

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <ProgressiveHint exampleAnswer={prompt.example_answer} />
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
              {/* Your answer */}
              <div className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-3 border border-violet-200/60 dark:border-violet-800/40">
                <p className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-1.5">Your answer:</p>
                <p className="text-sm text-foreground leading-relaxed">{savedAnswer}</p>
              </div>

              {/* Corrected version with listen button */}
              {!checking && feedback?.corrected_text &&
                normalize(feedback.corrected_text) !== normalize(savedAnswer) && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl p-3 border border-green-200 dark:border-green-800/40 bg-green-50 dark:bg-green-950/30"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">Corrected:</p>
                    <SpeakButton text={feedback.corrected_text} lang="sv-SE" />
                  </div>
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

          {/* Example answer panel */}
          {showExample && prompt.example_answer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3 border border-green-200/60 dark:border-green-800/40"
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-green-700 dark:text-green-400">Example answer:</p>
                <SpeakButton text={prompt.example_answer} lang="sv-SE" />
              </div>
              <p className="text-sm text-green-800 dark:text-green-300">{prompt.example_answer}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Standalone revision card for previously wrong answers
function RevisionCard({ item, onMastered }) {
  const [answer, setAnswer] = useState("");
  const [done, setDone] = useState(false);

  if (done) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="border-l-4 border-l-amber-400 border-border/50">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
            <RotateCcw className="w-3 h-3" />
            Revision practice
            {item.attempts > 1 && (
              <span className="text-muted-foreground font-normal">· attempt {item.attempts + 1}</span>
            )}
          </div>

          <p className="font-medium text-foreground">{item.promptText}</p>

          {/* Remind them of previous errors */}
          {item.grammarIssues?.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">Mistakes from last time:</p>
              {item.grammarIssues.slice(0, 3).map((issue, i) => (
                <GrammarIssueCard key={i} issue={issue} />
              ))}
            </div>
          )}

          {/* Dictation helper */}
          {item.exampleAnswer && (
            <div className="flex items-center gap-2 p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200/60 dark:border-blue-800/30">
              <SpeakButton text={item.exampleAnswer} lang="sv-SE" />
              <span className="text-xs text-blue-700 dark:text-blue-300">
                Listen, then write without looking
              </span>
            </div>
          )}

          <Textarea
            placeholder="Try again in Swedish…"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="min-h-[70px] resize-none"
          />

          <div className="flex items-center justify-between flex-wrap gap-2">
            <ProgressiveHint exampleAnswer={item.exampleAnswer} />
            <Button
              size="sm"
              onClick={() => { setDone(true); onMastered(); }}
              disabled={!answer.trim()}
              className="gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Mastered ✓
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function WritingExercise({ prompts, lessonId, onComplete }) {
  const { answers, saveAnswer, removeAnswer } = useWritingAnswers(lessonId);
  const { addToRevision, removeFromRevision, getForLesson } = useWritingRevision();
  const [completionFired, setCompletionFired] = useState(false);
  const [feedbackState, setFeedbackState] = useState({});

  if (!prompts || prompts.length === 0) {
    return <p className="text-muted-foreground text-sm">No writing exercises available.</p>;
  }

  const runFeedback = async (index, answer) => {
    const p = prompts[index];
    setFeedbackState((prev) => ({ ...prev, [index]: { checking: true, feedback: null, failed: false } }));
    try {
      const key = writingCacheKey(lessonId, index, normalizeAnswer(answer));
      const cached = await getCachedFeedback(base44, key);
      const feedback = cached ?? await evaluateAnswer(p.prompt, p.hint, p.example_answer, answer);
      if (!cached) await setCachedFeedback(base44, key, feedback);
      setFeedbackState((prev) => ({ ...prev, [index]: { checking: false, feedback, failed: false } }));

      // Save to revision if there are grammar issues or the answer needs work
      if (feedback.grammar_issues?.length > 0 || feedback.score === "needs_work") {
        addToRevision({
          lessonId,
          promptIndex: index,
          promptText: p.prompt,
          exampleAnswer: p.example_answer,
          userAnswer: answer,
          grammarIssues: feedback.grammar_issues || [],
        });
      } else if (feedback.score === "great") {
        removeFromRevision(lessonId, index);
      }
    } catch {
      setFeedbackState((prev) => ({ ...prev, [index]: { checking: false, feedback: null, failed: true } }));
    }
  };

  const handleSubmit = (index, answer) => {
    saveAnswer(index, answer);
    awardXP(base44, XP_REWARDS.writing_submitted);
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
  const revisionItems = getForLesson(lessonId);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Write your answers in Swedish. Tap 🔊 to hear the answer first — then write it from memory.
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

      {/* Revision section — previously wrong answers resurface here */}
      {revisionItems.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 border-t border-amber-200 dark:border-amber-800/40" />
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 px-2 whitespace-nowrap">
              <RotateCcw className="w-3.5 h-3.5" />
              Practice your mistakes ({revisionItems.length})
            </span>
            <div className="flex-1 border-t border-amber-200 dark:border-amber-800/40" />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            These sentences had errors. Keep practising until they feel natural.
          </p>
          {revisionItems.map((item) => (
            <RevisionCard
              key={item.id}
              item={item}
              onMastered={() => removeFromRevision(item.lessonId, item.promptIndex)}
            />
          ))}
        </div>
      )}
    </div>
  );
}