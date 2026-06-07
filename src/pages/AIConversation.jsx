import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Lock, Sparkles, Send, Volume2, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
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
];

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
      <h1 className="text-xl font-bold mb-2">AI Conversation Practice</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Practice real Swedish conversations with an AI tutor — this feature is currently available
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
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-10">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Conversation · <span className="italic font-normal text-muted-foreground">AI-samtal</span></h1>
            <p className="text-sm text-muted-foreground">Pick a scenario and start chatting in Swedish</p>
          </div>
        </div>
      </div>
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
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }), 50);
  };

  const sendMessage = async () => {
    const text = input.trim();
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

Reply to the user's last message, staying in character as described. If their Swedish was awkward or incorrect, suggest a more natural phrasing — otherwise leave correction fields empty.

Return JSON only.`,
        add_context_from_history: false,
        response_json_schema: REPLY_SCHEMA,
      });
      setMessages(h => [...h, {
        role: "assistant",
        text: result?.reply || "...",
        correction: result?.correction || "",
        correctionNote: result?.correction_note || "",
      }]);
    } catch {
      setMessages(h => [...h, { role: "assistant", text: "Hmm, something went wrong — try again?", error: true }]);
    } finally {
      setSending(false);
      scrollToBottom();
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
        <Button variant="ghost" size="sm" onClick={onExit} className="gap-1.5 flex-shrink-0">
          <RotateCcw className="w-3.5 h-3.5" /> Change scenario
        </Button>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto space-y-3 pr-1">
        {messages.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-10">
            Say hello to get the conversation started 👋
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
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Tutor is replying…
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Skriv på svenska…"
          className="flex-1 rounded-xl border border-border/60 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Button onClick={sendMessage} disabled={sending || !input.trim()} size="icon" className="flex-shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function AIConversation() {
  const { user, isAuthenticated } = useAuth();
  const [scenario, setScenario] = useState(null);

  const hasAccess = isAuthenticated && user?.ai_chat_access;

  if (!hasAccess) return <LockedView />;

  return scenario
    ? <ChatView scenario={scenario} onExit={() => setScenario(null)} />
    : <ScenarioPicker onSelect={setScenario} />;
}
