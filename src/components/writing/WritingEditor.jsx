import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Compass, Loader2, Send, Timer } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthContext";
import { awardXP } from "@/lib/xp";
import { countWords, errorsPer100, parsePoints } from "@/lib/writingPractice";
import { logWritingErrors } from "@/hooks/useErrorLog";
import PromptBrief from "./PromptBrief";
import TemplatePanel from "./TemplatePanel";
import CountdownTimer from "./CountdownTimer";
import WritingFeedbackView from "./WritingFeedbackView";

const DRAFT_KEY = "svenska:skrivtraning:drafts";

const MODES = [
  { id: "practice", label: "Övning", en: "Practice · hints allowed", icon: Compass },
  { id: "test", label: "Prov", en: "Test · timer, no hints", icon: Timer },
];

export default function WritingEditor({ prompt }) {
  const points = parsePoints(prompt);
  const min = prompt.min_words || 0;
  const max = prompt.max_words || 0;
  const limitSeconds = (prompt.time_limit_minutes || 25) * 60;

  const { isAuthenticated } = useAuth();
  const [text, setText] = useState("");
  const [checked, setChecked] = useState([]);
  const [mode, setMode] = useState("practice");
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [submittedText, setSubmittedText] = useState("");
  const [submissionId, setSubmissionId] = useState(null);
  const [rewriteOf, setRewriteOf] = useState(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [guestSaved, setGuestSaved] = useState(false);
  const busyRef = useRef(false);
  const startedRef = useRef(Date.now());

  const words = countWords(text);
  const canSubmit = words >= Math.ceil(min * 0.5);
  const inRange = words >= min && (max ? words <= max : true);

  useEffect(() => {
    setSecondsLeft(mode === "test" && !feedback ? limitSeconds : null);
  }, [mode, feedback, limitSeconds]);

  // Countdown; auto-submits when it reaches zero.
  useEffect(() => {
    if (secondsLeft === null || feedback) return;
    if (secondsLeft <= 0) {
      submit(true);
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, feedback]);

  async function submit(auto = false) {
    if (busyRef.current || feedback) return;
    if (!text.trim() || !canSubmit) return;

    busyRef.current = true;
    setBusy(true);
    setError("");
    const seconds = Math.round((Date.now() - startedRef.current) / 1000);

    try {
      if (!isAuthenticated) {
        const drafts = JSON.parse(localStorage.getItem(DRAFT_KEY) || "[]");
        drafts.unshift({
          prompt_id: prompt.id,
          prompt_title: prompt.title,
          text,
          word_count: words,
          created_date: new Date().toISOString(),
        });
        localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts.slice(0, 20)));
        setGuestSaved(true);
        return;
      }

      const res = await base44.functions.invoke("writingFeedback", {
        prompt: {
          title: prompt.title,
          type: prompt.type,
          instructions: prompt.instructions,
          points,
          min_words: min,
          max_words: max,
        },
        text,
        seconds,
        mode,
      });
      const fb = res.data;
      const errors = Array.isArray(fb.errors) ? fb.errors : [];
      const per100 = errorsPer100(errors.length, words);

      const previous = await base44.entities.WritingSubmission.filter(
        { prompt_id: prompt.id },
        { sort: "-created_date", limit: 1 }
      );
      const prev = previous.items?.[0];

      const saved = await base44.entities.WritingSubmission.create({
        prompt_id: prompt.id,
        prompt_title: prompt.title,
        prompt_type: prompt.type,
        text,
        word_count: words,
        time_used_seconds: seconds,
        mode,
        estimated_grade: fb.estimated_grade,
        errors_per_100: per100,
        feedback_json: fb,
        ...(rewriteOf ? { rewrite_of: rewriteOf } : {}),
      });

      await logWritingErrors(errors);

      let xp = 10;
      if (rewriteOf) xp += 10;
      if (prev && per100 < (prev.errors_per_100 ?? Infinity)) xp += 5;
      await awardXP(base44, xp, rewriteOf ? "Omskriven text" : "Skrivträning");

      setXpEarned(xp);
      setSubmissionId(saved.id);
      setSubmittedText(text);
      setFeedback(fb);
    } catch (e) {
      setError("Kunde inte rätta just nu. Försök igen om en stund.");
      if (auto) setSecondsLeft(0);
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  const startRewrite = () => {
    setFeedback(null);
    setText(submittedText);
    setRewriteOf(submissionId);
    setXpEarned(0);
    setGuestSaved(false);
    startedRef.current = Date.now();
  };

  if (feedback) {
    return (
      <div className="space-y-4">
        <WritingFeedbackView
          feedback={feedback}
          originalText={submittedText}
          xpEarned={xpEarned}
          onRewrite={startRewrite}
        />
        <Button asChild variant="outline" className="w-full">
          <Link to="/writing-practice">Fler uppgifter · More tasks</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PromptBrief
        prompt={prompt}
        points={points}
        checked={checked}
        onToggle={(point) =>
          setChecked((list) => (list.includes(point) ? list.filter((p) => p !== point) : [...list, point]))
        }
      />

      {/* Mode */}
      <div className="grid grid-cols-2 gap-2">
        {MODES.map(({ id, label, en, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setMode(id)}
            className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition-all ${
              mode === id ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30" : "border-border hover:border-amber-400"
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${mode === id ? "text-amber-600" : "text-muted-foreground"}`} />
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{label}</span>
              <span className="block text-[10px] italic text-muted-foreground truncate">{en}</span>
            </span>
          </button>
        ))}
      </div>

      {mode === "test" && secondsLeft !== null && (
        <div className="flex items-center justify-between gap-2">
          <CountdownTimer secondsLeft={secondsLeft} />
          <span className="text-[11px] text-muted-foreground">Mallar är gömda i provläge</span>
        </div>
      )}

      {mode === "practice" && <TemplatePanel type={prompt.type} onInsert={(tpl) => setText((t) => (t ? `${t}\n\n${tpl}` : tpl))} />}

      <div className="space-y-2">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Skriv din text här…"
          className="min-h-[240px] text-sm leading-relaxed"
          disabled={busy}
        />
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span
            className={`font-semibold tabular-nums ${
              inRange ? "text-emerald-600 dark:text-emerald-400" : words < Math.ceil(min * 0.5) ? "text-red-500" : "text-muted-foreground"
            }`}
          >
            {words} ord
            <span className="ml-1 font-normal text-muted-foreground">/ mål {min}–{max}</span>
          </span>
          <span className="text-[11px] italic text-muted-foreground">Din text skickas till en AI-tjänst för bedömning</span>
        </div>
      </div>

      <Button
        onClick={() => submit(false)}
        disabled={!canSubmit || busy}
        className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
      >
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {busy ? "Svea läser…" : "Skicka till Svea"}
      </Button>

      {!canSubmit && (
        <p className="text-[11px] text-center text-muted-foreground">
          Du kan skicka när du har minst {Math.ceil(min * 0.5)} ord (hälften av målet).
        </p>
      )}

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      {guestSaved && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
          <p className="text-sm font-semibold">Texten är sparad på den här enheten.</p>
          <p className="text-xs text-muted-foreground">
            Skapa ett gratis konto för att få Sveas rättning och spara dina texter på alla enheter.
          </p>
          <Button size="sm" onClick={() => base44.auth.redirectToLogin("/writing-practice")}>
            Skapa gratis konto
          </Button>
        </div>
      )}
    </div>
  );
}