import { useState, useEffect } from "react";
import { Lightbulb, ChevronDown, ChevronUp, CheckCircle2, PencilLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useWritingAnswers } from "@/hooks/useWritingAnswers";

function PromptCard({ prompt, index, onSubmit, onEdit, isSubmitted, savedAnswer }) {
  const [answer, setAnswer] = useState(savedAnswer || "");
  const [showExample, setShowExample] = useState(false);
  const [editing, setEditing] = useState(false);

  // Sync textarea when savedAnswer loads from backend
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
              <div className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-3 border border-violet-200/60 dark:border-violet-800/40">
                <p className="text-sm font-medium text-violet-700 dark:text-violet-300 mb-1">Your answer:</p>
                <p className="text-sm text-foreground">{savedAnswer}</p>
              </div>
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

  // Fire onComplete if all prompts are already answered (loaded from storage/backend)
  useEffect(() => {
    if (!completionFired && prompts?.length > 0 && Object.keys(answers).length === prompts.length) {
      setCompletionFired(true);
      onComplete?.();
    }
  }, [answers]);

  if (!prompts || prompts.length === 0) {
    return <p className="text-muted-foreground text-sm">No writing exercises available.</p>;
  }

  const handleSubmit = (index, answer) => {
    saveAnswer(index, answer);
    const newCount = Object.keys(answers).filter((k) => k != index).length + 1;
    if (newCount === prompts.length && !completionFired) {
      setCompletionFired(true);
      onComplete?.();
    }
  };

  const handleEdit = (index) => {
    removeAnswer(index);
  };

  const doneCount = Object.keys(answers).length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Write your answers in Swedish. Use the hint if you need help, and check the example when you're done.
        {doneCount > 0 && doneCount < prompts.length && (
          <span className="ml-2 font-medium text-foreground">{doneCount}/{prompts.length} completed</span>
        )}
        {doneCount === prompts.length && (
          <span className="ml-2 font-medium text-green-600">All done ✓</span>
        )}
      </p>
      {prompts.map((prompt, i) => (
        <PromptCard
          key={i}
          prompt={prompt}
          index={i}
          onSubmit={handleSubmit}
          onEdit={handleEdit}
          isSubmitted={i in answers}
          savedAnswer={answers[i]}
        />
      ))}
    </div>
  );
}
