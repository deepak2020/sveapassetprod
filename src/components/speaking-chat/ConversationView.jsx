import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import TurnBubble from "./TurnBubble";

// Live text chat with Svea about the selected topic.
// v1 is text-only — mic/STT lands in v2.
export default function ConversationView({ topic, onExit }) {
  const [turns, setTurns] = useState(() => [
    {
      role: "svea",
      text_sv: topic.opener_sv,
      text_en: topic.opener_en,
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  // Autoscroll to newest turn
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns, sending]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setError(null);
    setSending(true);

    const userTurn = { role: "user", text_sv: text, created_at: new Date().toISOString() };
    // Optimistic user bubble
    setTurns((prev) => [...prev, userTurn]);
    setInput("");

    try {
      const history = [...turns, userTurn].map((t) => ({ role: t.role, text_sv: t.text_sv }));
      const response = await base44.functions.invoke("speakingChatTurn", {
        topic_title_sv: topic.title_sv,
        topic_title_en: topic.title_en,
        level: topic.level || "A2",
        user_message: text,
        history: history.slice(0, -1), // don't include current user message in history — it's sent separately
      });
      const result = response.data?.result;
      if (!result) throw new Error("No response from Svea");

      // Enrich the last user turn with feedback + append Svea's reply
      setTurns((prev) => {
        const next = [...prev];
        const lastIdx = next.length - 1;
        next[lastIdx] = {
          ...next[lastIdx],
          corrected_sv: result.corrected_sv,
          mistakes: result.mistakes || [],
          grammar_score: result.grammar_score,
          encouragement_en: result.encouragement_en,
        };
        next.push({
          role: "svea",
          text_sv: result.svea_reply_sv,
          text_en: result.svea_reply_en,
          created_at: new Date().toISOString(),
        });
        return next;
      });
    } catch (e) {
      setError(e.message || "Something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
      {/* Topic header */}
      <div className="flex items-center gap-3 pb-3 border-b border-border/50 mb-3">
        <Button variant="ghost" size="icon" onClick={onExit} aria-label="Exit conversation">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">
            {topic.emoji ? `${topic.emoji} ` : ""}{topic.title_sv}
          </p>
          <p className="text-xs text-muted-foreground italic truncate">
            {topic.title_en} · CEFR {topic.level || "A2"}
          </p>
        </div>
      </div>

      {/* Suggested vocab */}
      {topic.suggested_vocab?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {topic.suggested_vocab.slice(0, 6).map((w, i) => (
            <span key={i} className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground border">
              {w}
            </span>
          ))}
        </div>
      )}

      {/* Conversation feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pb-3">
        {turns.map((t, i) => (
          <TurnBubble key={i} turn={t} />
        ))}
        {sending && (
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
              S
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Svea skriver…
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mb-2">{error}</p>
      )}

      {/* Input */}
      <div className="flex gap-2 pt-2 border-t border-border/50">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          disabled={sending}
          placeholder="Skriv på svenska…"
          aria-label="Write in Swedish"
          className="flex-1 rounded-xl border-2 border-border/50 bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/60 disabled:opacity-60"
        />
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            {["å", "ä", "ö"].map((c) => (
              <button
                key={c}
                onClick={() => setInput((v) => v + c)}
                aria-label={`Insert ${c}`}
                className="w-8 h-8 rounded-lg border text-sm hover:bg-muted transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <Button onClick={send} disabled={!input.trim() || sending} className="gap-1.5">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}