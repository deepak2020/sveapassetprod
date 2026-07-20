import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Sparkles } from "lucide-react";
import { supabase } from "@/api/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/AuthContext";
import LoginGate from "@/components/shared/LoginGate";
import PageSEO from "@/components/shared/PageSEO";
import TopicPicker from "@/components/speaking-chat/TopicPicker";
import ConversationView from "@/components/speaking-chat/ConversationView";
import { getTopicMeta } from "@/lib/topicMeta";

// v1 seed topics — used if no SpeakingTopic entities exist yet in the DB.
const SEED_TOPICS = [
  {
    id: "seed-intro",
    title_sv: "Presentera dig själv",
    title_en: "Introduce yourself",
    description_en: "Tell Svea about yourself — name, where you're from, what you do.",
    level: "A1",
    opener_sv: "Hej! Vad kul att träffas. Kan du berätta lite om dig själv?",
    opener_en: "Hi! Nice to meet you. Can you tell me a little about yourself?",
    suggested_vocab: ["Jag heter…", "Jag kommer från…", "Jag bor i…", "Jag jobbar som…"],
    emoji: "👋",
    order: 1,
  },
  {
    id: "seed-cafe",
    title_sv: "Beställa på café",
    title_en: "Order at a café",
    description_en: "Practise ordering coffee, food, and paying at a Swedish café.",
    level: "A2",
    opener_sv: "Hej och välkommen! Vad får det lov att vara?",
    opener_en: "Hi and welcome! What would you like?",
    suggested_vocab: ["en kaffe", "en kanelbulle", "att ta med", "att äta här", "Kan jag få…"],
    emoji: "☕",
    order: 2,
  },
  {
    id: "seed-weather",
    title_sv: "Prata om vädret",
    title_en: "Talk about the weather",
    description_en: "Small talk about weather, seasons, and what you like to do outdoors.",
    level: "A2",
    opener_sv: "Vilket härligt väder idag! Vad tycker du om vädret?",
    opener_en: "What lovely weather today! What do you think of the weather?",
    suggested_vocab: ["soligt", "regnar", "kallt", "varmt", "snö", "hösten", "sommaren"],
    emoji: "☀️",
    order: 3,
  },
  {
    id: "seed-weekend",
    title_sv: "Vad gjorde du i helgen?",
    title_en: "What did you do this weekend?",
    description_en: "Chat about your weekend in past tense.",
    level: "B1",
    opener_sv: "Hej! Hur var din helg? Vad gjorde du?",
    opener_en: "Hi! How was your weekend? What did you do?",
    suggested_vocab: ["jag åkte", "jag träffade", "jag lagade mat", "det var trevligt"],
    emoji: "🎉",
    order: 4,
  },
  {
    id: "seed-doctor",
    title_sv: "Läkarbesök",
    title_en: "Doctor visit",
    description_en: "Explain symptoms and ask questions at the doctor.",
    level: "B1",
    opener_sv: "Hej, kom in och sätt dig. Vad kan jag hjälpa dig med idag?",
    opener_en: "Hi, come in and have a seat. How can I help you today?",
    suggested_vocab: ["Jag har ont i…", "feber", "hosta", "sedan igår", "medicin"],
    emoji: "🩺",
    order: 5,
  },
  {
    id: "seed-jobinterview",
    title_sv: "Jobbintervju",
    title_en: "Job interview",
    description_en: "Practise a Swedish job interview — strengths, experience, why this job.",
    level: "B2",
    opener_sv: "Välkommen! Berätta, varför söker du det här jobbet?",
    opener_en: "Welcome! Tell me, why are you applying for this job?",
    suggested_vocab: ["erfarenhet", "utbildning", "styrka", "utmaning", "samarbete"],
    emoji: "💼",
    order: 6,
  },
];

export default function SpeakingChat() {
  const { isAuthenticated } = useAuth();
  const [activeTopic, setActiveTopic] = useState(null);

  const { data: topicsFromDb = [], isLoading } = useQuery({
    queryKey: ["speaking-topics"],
    queryFn: () => supabase.speakingTopics.list(),
  });

  // Use DB topics if any exist, else fall back to hard-coded seed set.
  const topics = topicsFromDb.length > 0 ? topicsFromDb : SEED_TOPICS;

  // If launched with ?topic=Mat (from Tala's Språk topic strip), build a
  // topic on the fly from Språk metadata and jump straight into Samtal.
  useEffect(() => {
    if (isLoading || activeTopic) return;
    const urlParams = new URLSearchParams(window.location.search);
    const paramTopic = urlParams.get("topic");
    if (!paramTopic) return;

    const match = topics.find(
      (t) => t.title_sv?.toLowerCase() === paramTopic.toLowerCase()
    );
    if (match) {
      setActiveTopic(match);
      return;
    }

    const meta = getTopicMeta(paramTopic);
    setActiveTopic({
      id: `sprak-${paramTopic}`,
      title_sv: paramTopic,
      title_en: meta.en || paramTopic,
      description_en: `Talk with SveAI about ${meta.en || paramTopic}.`,
      level: "A2",
      opener_sv: meta.opener_sv,
      opener_en: "",
      suggested_vocab: [],
      emoji: meta.emoji,
    });
  }, [isLoading, topics, activeTopic]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PageSEO title="Prata med Svea · Sveapasset" description="Practice Swedish conversation with Svea AI." />
        <LoginGate title="Prata med Svea" description="Log in to have real Swedish conversations with Svea." />
      </div>
    );
  }

  if (activeTopic) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <PageSEO title={`${activeTopic.title_sv} · Prata med Svea`} description="Practice Swedish conversation with Svea AI." />
        <ConversationView topic={activeTopic} onExit={() => setActiveTopic(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <PageSEO title="Prata med Svea · Sveapasset" description="Practice Swedish conversation with Svea AI." />

      <div className="mb-6">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Ny · New
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-2">
          <MessageCircle className="w-7 h-7 text-primary" />
          Prata med Svea
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Välj ett ämne och ha en riktig konversation. Svea rättar dig varsamt.{" "}
          <span className="italic">Pick a topic and have a real conversation — Svea gently corrects you.</span>
        </p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <TopicPicker topics={topics} onSelect={setActiveTopic} />
      )}
    </div>
  );
}