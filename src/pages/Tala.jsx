import { Link } from "react-router-dom";
import { Headphones, Zap, Puzzle, MessageCircle, PenSquare, Mic, Sparkles, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageSEO from "@/components/shared/PageSEO";
import LoginGate from "@/components/shared/LoginGate";
import { useAuth } from "@/lib/AuthContext";

// Speaking Gym hub — organizes all speaking-focused practice into 5 stations.
// Stations 1–3 are new (built in later steps); 4 & 5 link to existing pages.
const STATIONS = [
  {
    id: "shadowing",
    path: "/tala/shadowing",
    emoji: "🎧",
    icon: Headphones,
    title: "Shadowing",
    subtitle: "Härma Svea",
    subtitle_en: "Repeat after Svea",
    duration: "5 min",
    description: "Lyssna på en mening och härma direkt. Bygger uttal och rytm.",
    description_en: "Hear a sentence, repeat it instantly. Builds pronunciation and rhythm.",
    color: "from-blue-500 to-indigo-500",
    ring: "border-blue-300 dark:border-blue-800",
    tint: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20",
    comingSoon: true,
  },
  {
    id: "sprint",
    path: "/tala/sprint",
    emoji: "⚡",
    icon: Zap,
    title: "Word Sprint",
    subtitle: "Snabb återkallelse",
    subtitle_en: "Fast retrieval",
    duration: "2 min",
    description: "Se ett ord på engelska — säg det på svenska inom 3 sekunder.",
    description_en: "See an English word — say it in Swedish within 3 seconds.",
    color: "from-amber-500 to-orange-500",
    ring: "border-amber-300 dark:border-amber-800",
    tint: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20",
    comingSoon: true,
  },
  {
    id: "chunks",
    path: "/tala/chunks",
    emoji: "🧩",
    icon: Puzzle,
    title: "Chunks",
    subtitle: "Bygg meningar",
    subtitle_en: "Build sentences",
    duration: "3 min",
    description: "Ordna svenska ord i rätt ordning och säg meningen högt.",
    description_en: "Arrange Swedish words in order and say the sentence aloud.",
    color: "from-emerald-500 to-teal-500",
    ring: "border-emerald-300 dark:border-emerald-800",
    tint: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20",
    comingSoon: true,
  },
  {
    id: "prata",
    path: "/prata",
    emoji: "💬",
    icon: MessageCircle,
    title: "Prata",
    subtitle: "Chatta med SveAI",
    subtitle_en: "Chat with SveAI",
    duration: "5+ min",
    description: "Ha en riktig konversation. SveAI rättar dig varsamt.",
    description_en: "Have a real conversation. SveAI corrects you gently.",
    color: "from-purple-500 to-pink-500",
    ring: "border-purple-300 dark:border-purple-800",
    tint: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20",
    comingSoon: false,
  },
  {
    id: "skriva",
    path: "/speaking",
    emoji: "✍️",
    icon: PenSquare,
    title: "Skriva",
    subtitle: "Grammatik-precision",
    subtitle_en: "Grammar precision",
    duration: "öppet",
    description: "Översätt engelska meningar till svenska från minnet.",
    description_en: "Translate English sentences into Swedish from memory.",
    color: "from-rose-500 to-red-500",
    ring: "border-rose-300 dark:border-rose-800",
    tint: "from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/20",
    comingSoon: false,
  },
];

function StationCard({ station }) {
  const Icon = station.icon;
  const inner = (
    <Card
      className={`h-full border-2 ${station.ring} bg-gradient-to-br ${station.tint} hover:shadow-lg transition-all group ${
        station.comingSoon ? "opacity-70" : "hover:-translate-y-0.5"
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${station.color} flex items-center justify-center shadow-sm shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {station.duration}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mb-1">
          <h3 className="font-semibold text-base leading-tight">{station.title}</h3>
          {station.comingSoon && (
            <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              Snart
            </span>
          )}
        </div>
        <p className="text-xs font-medium text-foreground/80 mb-2">
          {station.subtitle} · <span className="italic text-muted-foreground">{station.subtitle_en}</span>
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {station.description}
        </p>
      </CardContent>
    </Card>
  );

  if (station.comingSoon) {
    return <div className="cursor-not-allowed">{inner}</div>;
  }
  return <Link to={station.path}>{inner}</Link>;
}

export default function Tala() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PageSEO
          title="Tala · Speaking Gym · Sveapasset"
          description="Bygg din svenska röst i fem stationer — shadowing, word sprint, chunks, prata, skriva."
        />
        <LoginGate title="Tala — Speaking Gym" description="Log in to start building your Swedish speaking skills." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PageSEO
        title="Tala · Speaking Gym · Sveapasset"
        description="Bygg din svenska röst i fem stationer — shadowing, word sprint, chunks, prata, skriva."
      />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 mb-2 shadow-md">
          <Mic className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Tala</h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm">
          Bygg din svenska röst, en station i taget.{" "}
          <span className="italic">Build your Swedish voice, one station at a time.</span>
        </p>
      </div>

      {/* Daily workout hero */}
      <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-blue-50 to-indigo-50 dark:from-primary/15 dark:via-blue-950/30 dark:to-indigo-950/20">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-sm shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-0.5">
              15 min · dagligt pass
            </p>
            <h2 className="font-display text-xl font-bold leading-tight">Dagens tal-pass</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Fyra stationer i följd — bygger flytande tal på 6 veckor.{" "}
              <span className="italic">Four stations in a row — builds fluency in 6 weeks.</span>
            </p>
          </div>
          <Button size="lg" disabled className="gap-2 shrink-0 opacity-70" title="Kommer snart">
            Starta pass
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Or pick a station */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Eller välj en station · <span className="italic normal-case font-normal">or pick a station</span>
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {STATIONS.map((s) => (
            <StationCard key={s.id} station={s} />
          ))}
        </div>
      </div>

      {/* Why this works */}
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-5 space-y-2">
          <h3 className="font-semibold text-sm">Varför fungerar det här?</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Att kunna ett ord är inte samma sak som att komma på det när du pratar. Varje station
            tränar en annan del av talandet — uttal (Shadowing), snabb återkallelse (Sprint),
            meningsbyggnad (Chunks) och naturlig konversation (Prata). Tillsammans bygger de
            <em> flyt</em>, inte bara ordförråd.
          </p>
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            Knowing a word isn't the same as recalling it when you speak. Each station trains a
            different piece — pronunciation, fast retrieval, sentence-building, and natural
            conversation. Together they build <em>fluency</em>, not just vocabulary.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}