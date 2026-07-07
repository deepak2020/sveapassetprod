import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useSpeech } from "@/hooks/useSpeech";
import TurnBubble from "./TurnBubble";

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

// Live voice chat with Svea about the selected topic.
// Speak in Swedish → transcribed → Svea replies out loud.
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
  const [interim, setInterim] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);
  const openerSpokenRef = useRef(false);
  const { speak, speaking } = useSpeech();

  const canRecord = !!SpeechRecognitionAPI;

  // Speak Svea's opener once on mount
  useEffect(() => {
    if (autoSpeak && !openerSpokenRef.current && topic.opener_sv) {
      openerSpokenRef.current = true;
      // Small delay so page mounts first
      setTimeout(() => speak(topic.opener_sv, "sv-SE"), 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autoscroll to newest turn
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns, sending, interim]);

  const send = async (rawText) => {
    const text = (rawText ?? input).trim();
    if (!text || sending) return;
    setError(null);
    setSending(true);

    const userTurn = { role: "user", text_sv: text, created_at: new Date().toISOString() };
    setTurns((prev) => [...prev, userTurn]);
    setInput("");
    setInterim("");

    try {
      const history = [...turns, userTurn].map((t) => ({ role: t.role, text_sv: t.text_sv }));
      const response = await base44.functions.invoke("speakingChatTurn", {
        topic_title_sv: topic.title_sv,
        topic_title_en: topic.title_en,
        level: topic.level || "A2",
        user_message: text,
        history: history.slice(0, -1),
      });
      const result = response.data?.result;
      if (!result) throw new Error("No response from Svea");

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

      if (autoSpeak && result.svea_reply_sv) {
        speak(result.svea_reply_sv, "sv-SE");
      }
    } catch (e) {
      setError(e.message || "Something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  };

  const startListening = () => {
    if (!SpeechRecognitionAPI || listening || sending) return;
    setError(null);
    setInterim("");

    // Cut Svea off if she's still speaking so mic doesn't pick her up
    window.speechSynthesis?.cancel();

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "sv-SE";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    let finalTranscript = "";

    recognition.onresult = (event) => {
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += t;
        else interimText += t;
      }
      setInterim(interimText);
      if (finalTranscript) setInput((v) => (v ? v + " " : "") + finalTranscript.trim());
    };

    recognition.onerror = (e) => {
      setListening(false);
      if (e.error !== "no-speech" && e.error !== "aborted") {
        setError(`Mic error: ${e.error}`);
      }
    };

    recognition.onend = () => {
      setListening(false);
      setInterim("");
      // Auto-send if we captured something
      const text = (finalTranscript || "").trim();
      if (text) {
        setTimeout(() => send(text), 100);
      }
    };

    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const toggleAutoSpeak = () => {
    if (autoSpeak) window.speechSynthesis?.cancel();
    setAutoSpeak((v) => !v);
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
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAutoSpeak}
          aria-label={autoSpeak ? "Mute Svea" : "Unmute Svea"}
          title={autoSpeak ? "Svea speaks aloud" : "Svea is muted"}
        >
          {autoSpeak ? (
            <Volume2 className={`w-4 h-4 ${speaking ? "text-primary animate-pulse" : ""}`} />
          ) : (
            <VolumeX className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
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
            <div className="w-10 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 px-1">
              SveAI
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-muted px-3.5 py-2.5 text-sm text-muted-foreground flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Svea tänker…
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mb-2">{error}</p>
      )}

      {/* Live interim transcript while listening */}
      {listening && (
        <div className="mb-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40">
          <p className="text-[11px] font-semibold text-red-700 dark:text-red-400 mb-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Lyssnar… · <span className="italic font-normal">Listening…</span>
          </p>
          <p className="text-sm text-foreground min-h-[1.25rem]">
            {interim || input || <span className="text-muted-foreground italic">Prata på svenska…</span>}
          </p>
        </div>
      )}

      {/* Big mic button + fallback text input */}
      <div className="pt-2 border-t border-border/50 space-y-2">
        {canRecord ? (
          <div className="flex justify-center">
            <button
              onClick={listening ? stopListening : startListening}
              disabled={sending}
              aria-label={listening ? "Stop recording" : "Start recording"}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg disabled:opacity-50 ${
                listening
                  ? "bg-red-500 hover:bg-red-600 scale-110"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {listening ? (
                <MicOff className="w-7 h-7 text-white" />
              ) : (
                <Mic className="w-7 h-7 text-white" />
              )}
            </button>
          </div>
        ) : (
          <p className="text-xs text-center text-muted-foreground">
            Din webbläsare stödjer inte röstinspelning — använd Chrome eller Edge. Skriv nedan så länge.
          </p>
        )}

        {/* Text input as fallback / edit path */}
        <div className="flex gap-2">
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
            disabled={sending || listening}
            placeholder={canRecord ? "…eller skriv" : "Skriv på svenska…"}
            aria-label="Write in Swedish"
            className="flex-1 rounded-xl border-2 border-border/50 bg-background px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary/60 disabled:opacity-60"
          />
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
          <Button onClick={() => send()} disabled={!input.trim() || sending} className="gap-1.5">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}