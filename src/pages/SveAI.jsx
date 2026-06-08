import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Lock, Sparkles, Send, Volume2, Loader2, RotateCcw, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { supabase } from "@/api/supabaseClient";
import { playAudio } from "@/lib/speech";

const SCENARIOS = [
  {
    id: "cafe",
    emoji: "☕",
    title: "Order coffee",
    titleSv: "Beställ kaffe",
    level: "A1",
    role: "You're a customer at a café in Stockholm. The AI plays the barista.",
    system: "You are a friendly Swedish café barista. Stay in character. Keep replies short and simple (A1 level Swedish).",
  },
  {
    id: "directions",
    emoji: "🧭",
    title: "Ask for directions",
    titleSv: "Fråga om vägen",
    level: "A1",
    role: "You stop a stranger on the street to ask how to get to Slussen. The AI plays the stranger.",
    system: "You are a helpful stranger giving simple directions in Stockholm. Use short, clear A1–A2 level Swedish sentences.",
  },
  {
    id: "neighbor",
    emoji: "🏠",
    title: "Chat with a neighbor",
    titleSv: "Prata med en granne",
    level: "A2",
    role: "Your neighbor stops you in the stairwell for some everyday small talk. The AI plays the neighbor.",
    system: "You are a friendly Swedish neighbor making everyday small talk (weather, weekend plans, the building). Use natural A2 level Swedish.",
  },
  {
    id: "doctor",
    emoji: "🏥",
    title: "Book a doctor's appointment",
    titleSv: "Boka läkartid",
    level: "A2",
    role: "You're calling a vårdcentral to book an appointment. The AI plays the receptionist.",
    system: "You are a calm receptionist at a Swedish vårdcentral helping book an appointment. Use clear A2 level Swedish.",
  },
  {
    id: "interview",
    emoji: "💼",
    title: "Job interview small talk",
    titleSv: "Småprat på jobbintervju",
    level: "B1",
    role: "You're making small talk before a job interview. The AI plays the interviewer.",
    system: "You are a friendly Swedish job interviewer making small talk before the interview starts. Use natural B1 level Swedish.",
  },
  {
    id: "buddy",
    emoji: "👋",
    title: "Just chat (free conversation)",
    titleSv: "Bara prata",
    level: "Any",
    role: "No script — chat freely with your AI buddy about anything: your day, hobbies, plans, whatever comes to mind.",
    system: "You are a warm, encouraging Swedish friend having a free-flowing conversation. Match the user's level — start simple, and gently increase complexity if they seem comfortable. Keep replies conversational and not too long.",
  },
];

// Pick a "today's topic" deterministically so it stays the same all day
function getTodaysScenario() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return SCENARIOS[dayIndex % SCENARIOS.length];
}

const REPLY_SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string", description: "The AI character's reply, in Swedish, staying in character" },
    correction: { type: "string", description: "A more natural way to phrase the user's message, in Swedish. Empty string if the message was already natural." },
    correction_note: { type: "string", description: "One short sentence in English explaining the correction. Empty string if no correction." },
  },
  required: ["reply", "correction", "correction_note"],
};

function LockedView() {
  const navigate = useNavigate();
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Lock className="w-7 h-7 text-primary" />
      </div>
      <h1 className="text-xl font-bold mb-2">Talk to SveAI</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Your daily Swedish speaking buddy — practice real conversations out loud with an AI tutor,
        anytime you don't have a friend handy to practice with. This feature is currently available
        to a limited group of users while we test it. Reach out and we'll be happy to enable it for you.
      </p>
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" onClick={() => navigate("/dashboard")}>Back to dashboard</Button>
        <Button onClick={() => navigate("/contact")} className="gap-2">
          <Sparkles className="w-4 h-4" /> Request access
        </Button>
      </div>
    </div>
  );
}

function ScenarioPicker({ onSelect }) {
  const todays = getTodaysScenario();
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-10">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Talk to SveAI</h1>
            <p className="text-sm text-muted-foreground">Your daily Swedish speaking buddy — talk it out, out loud</p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onSelect(todays)}
        className="w-full text-left rounded-2xl border-2 border-primary/40 bg-primary/5 p-5 mb-6 hover:shadow-md transition-all flex items-center gap-4"
      >
        <div className="text-4xl">{todays.emoji}</div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wide text-primary">✨ Today's conversation</span>
          <h3 className="font-bold text-sm mt-0.5">{todays.title} · <span className="italic font-normal text-muted-foreground">{todays.titleSv}</span></h3>
          <p className="text-xs text-muted-foreground mt-0.5">{todays.role}</p>
        </div>
      </button>

      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Or pick another scenario</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SCENARIOS.map(s => (
          <motion.button
            key={s.id}
            onClick={() => onSelect(s)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="text-left rounded-2xl border-2 border-border/50 bg-card p-5 hover:shadow-md hover:border-primary/40 transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="text-3xl">{s.emoji}</div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{s.level}</span>
            </div>
            <h3 className="font-bold text-sm">{s.title}</h3>
            <p className="text-xs italic text-muted-foreground mb-2">{s.titleSv}</p>
            <p className="text-xs text-muted-foreground">{s.role}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ChatView({ scenario, onExit }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const listRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
  };

  // Load previous conversation for this scenario, if any
  useEffect(() => {
    let cancelled = false;
    setLoadingHistory(true);
    setMessages([]);
    (async () => {
      if (!user?.id) { setLoadingHistory(false); return; }
      const history = await supabase.sveai.getConversation(user.id, scenario.id);
      if (!cancelled) {
        setMessages(Array.isArray(history) ? history : []);
        setLoadingHistory(false);
        scrollToBottom();
      }
    })();
    return () => { cancelled = true; };
  }, [scenario.id, user?.id]);

  // Persist conversation after each exchange
  const persist = (nextMessages) => {
    if (user?.id) supabase.sveai.saveConversation(user.id, scenario.id, nextMessages);
  };

  const sendMessage = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    if (!text || sending) return;
    setInput("");
    const history = [...messages, { role: "user", text }];
    setMessages(history);
    setSending(true);
    scrollToBottom();
    try {
      const transcript = history.map(m => `${m.role === "user" ? "User" : "Tutor"}: ${m.text}`).join("\n");
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `${scenario.system}

CONVERSATION SO FAR:
${transcript}

Reply to the user's last message, staying in character as described.

Then carefully review the user's LAST message (the Swedish they just wrote/said) for ANYTHING that could be improved — spelling, word order, verb tense, en/ett articles, missing words, or just a more natural/idiomatic way a native speaker would phrase it. Be a helpful, encouraging tutor: even small, minor improvements are worth pointing out, since that's exactly how the user gets better. Only leave the correction fields empty if the message was already a fully natural, native-sounding Swedish sentence with nothing to improve.
- correction: the corrected/more natural full version of the user's message, in Swedish
- correction_note: ONE short, encouraging sentence in English explaining the specific change and why (e.g. "Use 'har varit' instead of 'var' for something that started in the past and continues now.")

Return JSON only.`,
        add_context_from_history: false,
        response_json_schema: REPLY_SCHEMA,
      });
      const replyText = result?.reply || "...";
      const next = [...history, {
        role: "assistant",
        text: replyText,
        correction: result?.correction || "",
        correctionNote: result?.correction_note || "",
      }];
      setMessages(next);
      persist(next);
      if (autoSpeak) playAudio(replyText, "sv-SE", 0.95);
    } catch {
      const next = [...history, { role: "assistant", text: "Hmm, something went wrong — try again?", error: true }];
      setMessages(next);
      persist(next);
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  const handleMic = () => {
    if (listening || sending) return;
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech recognition isn't supported in this browser — try Chrome, or type your reply instead.");
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
          sendMessage(transcript);
        }
      };
      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);
    } catch {
      setListening(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28 md:pb-10 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3 min-w-0">
          <div className="text-2xl">{scenario.emoji}</div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm truncate">{scenario.title}</h2>
            <p className="text-xs italic text-muted-foreground truncate">{scenario.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant={autoSpeak ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setAutoSpeak(v => !v)}
            className="gap-1.5 hidden sm:inline-flex"
            title="Automatically read out the buddy's replies"
          >
            <Volume2 className="w-3.5 h-3.5" /> {autoSpeak ? "Auto-speak on" : "Auto-speak off"}
          </Button>
          <Button variant="ghost" size="sm" onClick={onExit} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Change
          </Button>
        </div>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
        {loadingHistory && (
          <div className="flex justify-center py-10 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        )}
        {!loadingHistory && messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-10">
            Say hello to get the conversation started 👋<br />
            <span className="text-xs">Type, or tap the mic and speak in Swedish</span>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}>
                <p>{m.text}</p>
                {m.role === "assistant" && !m.error && (
                  <button
                    onClick={() => playAudio(m.text, "sv-SE", 0.95)}
                    className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                  >
                    <Volume2 className="w-3 h-3" /> Listen
                  </button>
                )}
                {m.correction && (
                  <div className="mt-2 pt-2 border-t border-border/40 text-xs">
                    <p className="font-semibold text-amber-600 dark:text-amber-400">💡 More natural: <span className="font-normal italic">"{m.correction}"</span></p>
                    {m.correctionNote && <p className="text-muted-foreground mt-0.5">{m.correctionNote}</p>}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {sending && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-2.5 text-sm flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Buddy is replying…
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
        <Button
          variant={listening ? "default" : "outline"}
          size="icon"
          onClick={handleMic}
          disabled={sending}
          className="flex-shrink-0"
          title="Speak your reply in Swedish"
        >
          <Mic className={`w-4 h-4 ${listening ? "animate-pulse" : ""}`} />
        </Button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder={listening ? "Lyssnar…" : "Skriv eller prata på svenska…"}
          className="flex-1 rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Button onClick={() => sendMessage()} disabled={sending || !input.trim()} size="icon" className="flex-shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function SveAI() {
  const { user, isAuthenticated } = useAuth();
  const [scenario, setScenario] = useState(null);

  const hasAccess = isAuthenticated && user?.ai_chat_access;

  if (!hasAccess) return <LockedView />;

  return scenario
    ? <ChatView scenario={scenario} onExit={() => setScenario(null)} />
    : <ScenarioPicker onSelect={setScenario} />;
}
