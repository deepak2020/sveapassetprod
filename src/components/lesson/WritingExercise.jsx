import { useState, useEffect } from "react";
import { Lightbulb, ChevronDown, ChevronUp, CheckCircle2, PencilLine, AlertCircle, Loader2, SpellCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { useWritingAnswers } from "@/hooks/useWritingAnswers";

async function checkSwedish(text) {
  const body = new URLSearchParams();
  body.append("text", text);
  body.append("language", "sv");
  body.append("enabledOnly", "false");
  const res = await fetch("https://api.languagetool.org/v2/check", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) throw new Error("LanguageTool error");
  const data = await res.json();
  return data.matches || [];
}

function AnnotatedText({ text, matches }) {
  if (!matches || matches.length === 0) {
    return <span className="text-sm text-foreground">{text}</span>;
  }

  const sorted = [...matches].sort((a, b) => a.offset - b.offset);
  const segments = [];
  let cursor = 0;

  sorted.forEach((m, i) => {
    if (m.offset > cursor) {
      segments.push(<span key={`t${i}`}>{text.slice(cursor, m.offset)}</span>);
    }
    const suggestion = m.replacements?.[0]?.value;
    segments.push(
      <span
        key={`e${i}`}
        title={m.message}
        className="bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-b-2 border-red-400 rounded-sm px-0.5 cursor-help"
      >
        {text.slice(m.offset, m.offset + m.length)}
      </span>
    );
    cursor = m.offset + m.length;
  });

  if (cursor < text.length) {
    segments.push(<span key="tail">{text.slice(cursor)}</span>);
  }

  return <span className="text-sm text-foreground leading-relaxed">{segments}</span>;
}

function GrammarFeedback({ matches }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="flex items-center gap-2 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/40 rounded-xl px-3 py-2">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <p className="text-xs font-medium">No grammar or spelling issues found!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
        {matches.length} issue{matches.length > 1 ? "s" : ""} found
      </p>
      {matches.map((m, i) => {
        const suggestion = m.replacements?.[0]?.value;
        const wrong = m.context?.text?.slice(m.context.offset, m.context.offset + m.context.length) || "";
        return (
          <div key={i} className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-xl px-3 py-2.5 space-y-1">
            <p className="text-xs text-amber-900 dark:text-amber-200">{m.message}</p>
            {suggestion && (
              <p className="text-xs text-muted-foreground">
                <span className="line-through text-red-500 mr-1">{wrong || "..."}</span>
                →{" "}
                <span className="font-medium text-green-700 dark:text-green-400">{suggestion}</span>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function PromptCard({ prompt, index, onSubmit, onEdit, isSubmitted, savedAnswer, ltMatches, ltChecking, ltFailed }) {
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
          {/* Prompt header */}
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

          {/* Input or submitted view */}
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
              {/* Answer with inline highlights */}
              <div className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-3 border border-violet-200/60 dark:border-violet-800/40">
                <p className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-1.5">Your answer:</p>
                <AnnotatedText text={savedAnswer} matches={ltMatches} />
              </div>

              {/* Grammar check result */}
              {ltChecking && (
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Checking your Swedish…
                </div>
              )}
              {!ltChecking && ltMatches && (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <GrammarFeedback matches={ltMatches} />
                  </motion.div>
                </AnimatePresence>
              )}
              {ltFailed && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <SpellCheck className="w-3.5 h-3.5" /> Grammar check unavailable right now.
                </p>
              )}

              {/* Edit + compare actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleEdit}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <PencilLine className="w-3 h-3" /> Edit answer
                </button>
                {prompt.example_answer && (
                  <button
                    onClick={() => setShowExample(!showExample)}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    {showExample ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {showExample ? "Hide example" : "Compare with example"}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Example answer */}
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
  // ltState: { [index]: { checking, matches, failed } }
  const [ltState, setLtState] = useState({});

  useEffect(() => {
    if (!completionFired && prompts?.length > 0 && Object.keys(answers).length === prompts.length) {
      setCompletionFired(true);
      onComplete?.();
    }
  }, [answers]);

  if (!prompts || prompts.length === 0) {
    return <p className="text-muted-foreground text-sm">No writing exercises available.</p>;
  }

  const runGrammarCheck = async (index, text) => {
    setLtState((prev) => ({ ...prev, [index]: { checking: true, matches: null, failed: false } }));
    try {
      const matches = await checkSwedish(text);
      setLtState((prev) => ({ ...prev, [index]: { checking: false, matches, failed: false } }));
    } catch {
      setLtState((prev) => ({ ...prev, [index]: { checking: false, matches: null, failed: true } }));
    }
  };

  const handleSubmit = (index, answer) => {
    saveAnswer(index, answer);
    runGrammarCheck(index, answer);
    const newCount = Object.keys(answers).filter((k) => Number(k) !== index).length + 1;
    if (newCount === prompts.length && !completionFired) {
      setCompletionFired(true);
      onComplete?.();
    }
  };

  const handleEdit = (index) => {
    removeAnswer(index);
    setLtState((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const doneCount = Object.keys(answers).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Write your answers in Swedish. Grammar is checked automatically when you submit.
        {doneCount > 0 && doneCount < prompts.length && (
          <span className="ml-2 font-medium text-foreground">{doneCount}/{prompts.length} completed</span>
        )}
        {doneCount === prompts.length && (
          <span className="ml-2 font-medium text-green-600">All done ✓</span>
        )}
      </p>
      {prompts.map((prompt, i) => {
        const lt = ltState[i] || {};
        return (
          <PromptCard
            key={i}
            prompt={prompt}
            index={i}
            onSubmit={handleSubmit}
            onEdit={handleEdit}
            isSubmitted={i in answers}
            savedAnswer={answers[i]}
            ltMatches={lt.matches}
            ltChecking={lt.checking}
            ltFailed={lt.failed}
          />
        );
      })}
    </div>
  );
}
