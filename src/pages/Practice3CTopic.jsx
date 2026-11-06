import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronDown, Loader2, Mic, PenSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { getTopic } from "@/data/sfi3cTopics";
import { usePracticeAttempts } from "@/hooks/usePracticeAttempts";
import TaskBrief from "@/components/practice/TaskBrief";
import VocabPanel from "@/components/practice/VocabPanel";
import PracticeTimer from "@/components/practice/PracticeTimer";
import WritingResponse from "@/components/practice/WritingResponse";
import SpeakingResponse from "@/components/practice/SpeakingResponse";
import PracticeFeedback from "@/components/practice/PracticeFeedback";

export default function Practice3CTopic() {
  const { topicId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const topic = getTopic(topicId);

  const skill = params.get("skill") === "speaking" ? "speaking" : "writing";
  const mode = params.get("mode") === "exam" ? "exam" : "guided";

  const [step, setStep] = useState(mode === "exam" ? "task" : "prep");
  const [response, setResponse] = useState("");
  const [result, setResult] = useState(null);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState("");
  const [expired, setExpired] = useState(false);
  const [showVocab, setShowVocab] = useState(false);
  const [startedAt, setStartedAt] = useState(Date.now());
  const { save } = usePracticeAttempts();

  if (!topic) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-muted-foreground">Uppgiften finns inte.</p>
        <Button asChild>
          <Link to="/3c">Till alla ämnen</Link>
        </Button>
      </div>
    );
  }

  const task = topic[skill];
  const skillLabel = skill === "speaking" ? "Tala" : "Skriv";

  const startTask = () => {
    setStartedAt(Date.now());
    setStep("task");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async () => {
    if (!response.trim() || grading) return;
    setGrading(true);
    setError("");
    try {
      const res = await base44.functions.invoke("gradePractice", {
        skill,
        mode,
        topic_title: topic.title,
        task: task.task,
        points: task.points,
        vocabulary: topic.vocab.map((word) => word.sv),
        response,
      });
      const data = res.data || {};
      setResult(data);
      await save({
        skill,
        mode,
        topic_id: topic.id,
        topic_title: topic.title,
        prompt: task.task,
        response,
        seconds: Math.round((Date.now() - startedAt) / 1000),
        grade: data.grade,
        summary: data.summary,
        task_completion: data.task_completion,
        strengths: data.strengths,
        improvements: data.improvements,
        corrections: data.corrections,
        vocab_used: data.vocab_used,
      });
      setStep("feedback");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e?.response?.data?.message || "Kunde inte rätta just nu. Försök igen om en stund.");
    } finally {
      setGrading(false);
    }
  };

  const retry = () => {
    setResponse("");
    setResult(null);
    setError("");
    setExpired(false);
    setStartedAt(Date.now());
    setStep(mode === "exam" ? "task" : "prep");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-5">
      <Link to="/3c" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Alla ämnen
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {topic.category} · {skillLabel}
          </p>
          <h1 className="text-xl sm:text-2xl font-bold leading-tight">{topic.title}</h1>
          <p className="text-xs italic text-muted-foreground">
            {topic.titleEn} · {mode === "exam" ? "Provläge" : "Guidad övning"}
          </p>
        </div>
        {mode === "exam" && step === "task" && <PracticeTimer minutes={task.minutes} onExpire={() => setExpired(true)} />}
      </div>

      {step === "prep" && (
        <>
          <TaskBrief task={task.task} points={task.points} />
          <VocabPanel vocab={topic.vocab} verbs={topic.verbs} phrases={topic.phrases} />
          <div className="rounded-xl bg-muted/50 px-4 py-3 text-xs text-muted-foreground">
            Guidad övning: ta god tid. Du får bedömning direkt när du lämnar in.
          </div>
          <Button onClick={startTask} className="w-full gap-2">
            {skill === "speaking" ? <Mic className="w-4 h-4" /> : <PenSquare className="w-4 h-4" />}
            Jag är redo — börja {skill === "speaking" ? "prata" : "skriva"}
          </Button>
        </>
      )}

      {step === "task" && (
        <>
          <TaskBrief task={task.task} points={task.points} />

          {mode === "exam" ? (
            <button
              onClick={() => setShowVocab((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" /> Ord & verb (valfritt)
              </span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showVocab ? "rotate-180" : ""}`} />
            </button>
          ) : (
            <button
              onClick={() => setShowVocab((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-2.5 text-sm font-medium"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-muted-foreground" /> {showVocab ? "Dölj ordlistan" : "Visa ordlistan igen"}
              </span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showVocab ? "rotate-180" : ""}`} />
            </button>
          )}

          {showVocab && <VocabPanel vocab={topic.vocab} verbs={topic.verbs} phrases={topic.phrases} />}

          {expired && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
              Tiden är slut — lämna in ditt svar nu.
            </div>
          )}

          {skill === "speaking" ? (
            <SpeakingResponse
              transcript={response}
              onChange={setResponse}
              minWords={task.minWords}
              onSubmit={submit}
              grading={grading}
            />
          ) : (
            <WritingResponse
              value={response}
              onChange={setResponse}
              minWords={task.minWords}
              onSubmit={submit}
              grading={grading}
            />
          )}

          {grading && (
            <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Svea läser ditt svar…
            </p>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </>
      )}

      {step === "feedback" && result && (
        <PracticeFeedback result={result} onRetry={retry} onBack={() => navigate("/3c")} skillLabel={skillLabel} />
      )}

      {step === "feedback" && !result && (
        <div className="text-center space-y-3">
          <Sparkles className="w-6 h-6 mx-auto text-muted-foreground" />
          <Button onClick={retry}>Försök igen</Button>
        </div>
      )}
    </div>
  );
}