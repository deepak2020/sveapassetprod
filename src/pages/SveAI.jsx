import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Volume2, Loader2, RotateCcw, Mic, Send, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playAudio } from "@/lib/speech";
import { base44 } from "@/api/base44Client";
import { SVEAI_TOPICS, getTodaysSveAITopic } from "@/data/sveaiTopics";

const ANSWER_SCHEMA = {
  type: "object",
  properties: {
    feedback: { type: "string", description: "One short, encouraging sentence in English commenting on how well the user's Swedish answer fits the question/statement." },
    correction: { type: "string", description: "A corrected, more natural full version of the user's Swedish answer. Empty string if it was already natural and correct." },
    correction_note: { type: "string", description: "One short, encouraging sentence in English explaining the specific change and why. Empty string if no correction." },
    model_answer: { type: "string", description: "A natural example answer in Swedish that a native speaker might give to the prompt, at roughly the same level." },
  },
  required: ["feedback", "correction", "correction_note", "model_answer"],
};

const SESSION_LENGTH = 10;

function TopicPicker({ onSelect }) {
  const todays = getTodaysSveAITopic();
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-10">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Talk to SveAI</h1>
            <p className="text-sm text-muted-foreground">Listen, answer in Swedish, and get instant feedback</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSelect(todays)}
        className="w-full text-left rounded-2xl border-2 border-primary/40 bg-primary/5 p-5 mb-6 hover:shadow-md transition-all flex items-center gap-4"
      >
        <div className="text-4xl">{todays.emoji}</div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wide text-primary">✨ Today's topic</span>
          <h3 className="font-bold text-sm mt-0.5">{todays.title} · <span className="italic font-normal text-muted-foreground">{todays.titleSv}</span></h3>
          <p className="text-xs text-muted-foreground mt-0.5">{todays.prompts.length} statements & questions to practice · {todays.level}</p>
        </div>
      </button>

      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Or pick another topic</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SVEAI_TOPICS.map(t => (
          <motion.button
            key={t.id}
            onClick={() => onSelect(t)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`text-left rounded-2xl border-2 p-5 hover:shadow-md transition-all ${t.color}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${t.iconBg}`}>{t.emoji}</div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{t.level}</span>
            </div>
            <h3 className="font-bold text-sm">{t.title}</h3>
            <p className="text-xs italic text-muted-foreground mb-1">{t.titleSv}</p>
            <p className="text-xs text-muted-foreground">{t.prompts.length} statements</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function PracticeView({ topic, onExit }) {
  const [order] = useState(() => {
    const indices = topic.prompts.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return indices.slice(0, Math.min(SESSION_LENGTH, indices.length));
  });
  const [step, setStep] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const prompt = topic.prompts[order[step]];
  const isLast = step === order.length - 1;

  // Reset per-prompt state and speak the new prompt
  useEffect(() => {
    setShowHint(false);
    setInput("");
    setResult(null);
    const t = setTimeout(() => playAudio(prompt.sv, "sv-SE", 0.9), 350);
    return () => clearTimeout(t);
  }, [step]);

  const checkAnswer = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || checking) return;
    setChecking(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a friendly, encouraging Swedish tutor. The learner heard this Swedish statement or question:
"${prompt.sv}" (English: "${prompt.en}")

They answered, in Swedish:
"${text}"

Evaluate their answer:
- feedback: ONE short, encouraging sentence in English about how well their answer responds to the prompt and how natural the Swedish is.
- correction: a corrected, more natural full version of THEIR answer in Swedish — fix spelling, word order, verb tense, en/ett articles, missing words, or just make it more idiomatic. Leave empty only if it was already fully natural, native-sounding Swedish.
- correction_note: ONE short, encouraging sentence in English explaining the specific change and why.
- model_answer: a natural example answer in Swedish that a native speaker might give to this prompt, at roughly the same level.

Return JSON only.`,
        add_context_from_history: false,
        response_json_schema: ANSWER_SCHEMA,
      });
      setResult({
        feedback: res?.feedback || "",
        correction: res?.correction || "",
        correctionNote: res?.correction_note || "",
        modelAnswer: res?.model_answer || "",
      });
    } catch {
      setResult({ feedback: "Hmm, couldn't check that just now — try again?", correction: "", correctionNote: "", modelAnswer: "", error: true });
    } finally {
      setChecking(false);
    }
  };

  const handleMic = () => {
    if (listening || checking) return;
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition isn't supported in this browser — try Chrome, or type your answer instead.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = "sv-SE";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        if (event.results.length > 0) {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          checkAnswer(transcript);
        }
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
    } catch {
      setListening(false);
    }
  };

  const next = () => {
    if (isLast) { onExit(); return; }
    setStep(s => s + 1);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 md:pb-10">
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-2xl">{topic.emoji}</div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm truncate">{topic.title}</h2>
            <p className="text-xs italic text-muted-foreground truncate">{topic.titleSv}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onExit} className="gap-1.5 flex-shrink-0">
          <RotateCcw className="w-3.5 h-3.5" /> Change topic
        </Button>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-1.5 mb-6">
        {order.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < step ? "bg-primary" : i === step ? "bg-primary/50" : "bg-muted"}`} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-3">Statement {step + 1} of {order.length}</p>

      {/* Prompt card */}
      <div className="rounded-2xl border-2 border-border/50 bg-card p-6 mb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wide text-primary">🔊 Listen & answer</span>
          <button
            onClick={() => setShowHint(v => !v)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
          >
            {showHint ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showHint ? "Hide translation" : "Show translation"}
          </button>
        </div>
        <p className="text-lg font-semibold mb-1">{prompt.sv}</p>
        {showHint && <p className="text-sm text-muted-foreground italic">{prompt.en}</p>}
        <button
          onClick={() => playAudio(prompt.sv, "sv-SE", 0.9)}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <Volume2 className="w-3.5 h-3.5" /> Listen again
        </button>
      </div>

      {/* Answer input */}
      {!result && (
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={listening ? "default" : "outline"}
            size="icon"
            onClick={handleMic}
            disabled={checking}
            className="flex-shrink-0"
            title="Speak your answer in Swedish"
          >
            <Mic className={`w-4 h-4 ${listening ? "animate-pulse" : ""}`} />
          </Button>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && checkAnswer()}
            placeholder={listening ? "Lyssnar…" : "Skriv ditt svar på svenska…"}
            className="flex-1 rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button onClick={() => checkAnswer()} disabled={checking || !input.trim()} size="icon" className="flex-shrink-0">
            {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 mb-4 space-y-3"
          >
            <div className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="font-medium">{result.feedback}</p>
            </div>
            {result.correction && (
              <div className="text-xs pt-2 border-t border-border/40">
                <p className="font-semibold text-amber-600 dark:text-amber-400">💡 More natural: <span className="font-normal italic">"{result.correction}"</span></p>
                {result.correctionNote && <p className="text-muted-foreground mt-0.5">{result.correctionNote}</p>}
              </div>
            )}
            {result.modelAnswer && (
              <div className="text-xs pt-2 border-t border-border/40">
                <p className="font-semibold text-foreground">Example answer:</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="italic text-muted-foreground">"{result.modelAnswer}"</p>
                  <button onClick={() => playAudio(result.modelAnswer, "sv-SE", 0.9)} className="text-primary hover:opacity-70 flex-shrink-0">
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
            <Button onClick={next} className="w-full gap-2 mt-1">
              {isLast ? "Finish session" : "Next statement"} <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {!result && (
        <p className="text-center text-xs text-muted-foreground">Type or tap the mic and speak your answer in Swedish</p>
      )}
    </div>
  );
}

export default function SveAI() {
  const [topic, setTopic] = useState(null);

  return topic
    ? <PracticeView key={topic.id} topic={topic} onExit={() => setTopic(null)} />
    : <TopicPicker onSelect={setTopic} />;
}
