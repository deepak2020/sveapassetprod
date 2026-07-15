import { Link } from "react-router-dom";
import { Headphones, Zap, Puzzle, MessageCircle, PenSquare, Mic, Sparkles, Clock, ArrowRight, Brain, Repeat, Image as ImageIcon, Link2, Ear } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageSEO from "@/components/shared/PageSEO";
import LoginGate from "@/components/shared/LoginGate";
import { useAuth } from "@/lib/AuthContext";

// Tala is organised by how speaking skill actually develops in a learner:
// single words → memorised phrases → self-built sentences → free conversation.
// Each level maps to one or two existing stations — same pages, same URLs —
// just presented in the order a learner should progress through them.
const LEVELS = [
  {
    id: 1,
    label: "Nivå 1",
    title: "Ord",
    title_en: "Words",
    tagline: "Kom på ordet snabbt",
    tagline_en: "Recall words on demand",
    hint: "Börja här om du fastnar när du letar efter ord.",
    hint_en: "Start here if you freeze searching for words.",
    tint: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20",
    ring: "border-amber-300 dark:border-amber-800",
    accent: "text-amber-700 dark:text-amber-400",
    stations: [
      {
        id: "sprint",
        path: "/tala/sprint",
        icon: Zap,
        title: "Word Sprint",
        subtitle: "Snabb återkallelse",
        subtitle_en: "Fast retrieval",
        duration: "2 min",
        description: "Se ett ord på engelska — säg det på svenska inom sekunder.",
        color: "from-amber-500 to-orange-500",
        ring: "border-amber-300 dark:border-amber-800",
        tint: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20",
      },
    ],
    memoryTips: [
      {
        icon: ImageIcon,
        title: "Se ordet — inte översätt det",
        title_en: "Picture it — don't translate it",
        body: "När du hör mjölk, se en vit tetra i huvudet. Hoppa över engelska helt.",
        body_en: "When you hear mjölk, see a white carton in your head. Skip English entirely.",
      },
      {
        icon: Link2,
        title: "Koppla till något du redan vet",
        title_en: "Link it to something you know",
        body: "fönster låter som 'fönster' i tyska Fenster. Hitta en krok — vilken som helst.",
        body_en: "fönster sounds like German Fenster. Find any hook — silly ones stick best.",
      },
      {
        icon: Ear,
        title: "Säg det högt, tre gånger",
        title_en: "Say it out loud, three times",
        body: "Munnen minns det öronen och ögonen glömmer. Viska om du är på bussen.",
        body_en: "Your mouth remembers what eyes and ears forget. Whisper it if you're on the bus.",
      },
      {
        icon: Repeat,
        title: "Möt ordet igen imorgon",
        title_en: "Meet the word again tomorrow",
        body: "Ett ord ses 5–7 gånger innan det sitter. Sprint gör det åt dig automatiskt.",
        body_en: "A word needs 5–7 encounters to stick. Sprint spaces them out for you automatically.",
      },
    ],
  },
  {
    id: 2,
    label: "Nivå 2",
    title: "Fraser",
    title_en: "Phrases",
    tagline: "Härma hela chunks",
    tagline_en: "Imitate whole chunks",
    hint: "När orden sitter — lär dig hela fraser som en enhet.",
    hint_en: "Once words stick — memorise whole phrases as one unit.",
    tint: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20",
    ring: "border-blue-300 dark:border-blue-800",
    accent: "text-blue-700 dark:text-blue-400",
    stations: [
      {
        id: "shadowing",
        path: "/tala/shadowing",
        icon: Headphones,
        title: "Shadowing",
        subtitle: "Härma Svea",
        subtitle_en: "Repeat after Svea",
        duration: "5 min",
        description: "Lyssna på en mening och härma direkt. Bygger uttal och rytm.",
        color: "from-blue-500 to-indigo-500",
        ring: "border-blue-300 dark:border-blue-800",
        tint: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20",
      },
    ],
  },
  {
    id: 3,
    label: "Nivå 3",
    title: "Meningar",
    title_en: "Sentences",
    tagline: "Bygg dina egna meningar",
    tagline_en: "Build your own sentences",
    hint: "Kombinera chunks till egna meningar — muntligt och skriftligt.",
    hint_en: "Combine chunks into your own sentences — speaking and writing.",
    tint: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20",
    ring: "border-emerald-300 dark:border-emerald-800",
    accent: "text-emerald-700 dark:text-emerald-400",
    stations: [
      {
        id: "chunks",
        path: "/tala/chunks",
        icon: Puzzle,
        title: "Chunks",
        subtitle: "Bygg meningar",
        subtitle_en: "Build sentences",
        duration: "3 min",
        description: "Ordna svenska ord i rätt ordning och säg meningen högt.",
        color: "from-emerald-500 to-teal-500",
        ring: "border-emerald-300 dark:border-emerald-800",
        tint: "from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20",
      },
      {
        id: "skriva",
        path: "/speaking",
        icon: PenSquare,
        title: "Skriva",
        subtitle: "Grammatik-precision",
        subtitle_en: "Grammar precision",
        duration: "öppet",
        description: "Översätt engelska meningar till svenska från minnet.",
        color: "from-rose-500 to-red-500",
        ring: "border-rose-300 dark:border-rose-800",
        tint: "from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/20",
      },
    ],
  },
  {
    id: 4,
    label: "Nivå 4",
    title: "Samtal",
    title_en: "Conversation",
    tagline: "Prata fritt med SveAI",
    tagline_en: "Speak freely with SveAI",
    hint: "Här sätts allt ihop — oförutsägbart, som verkliga samtal.",
    hint_en: "Where it all comes together — unpredictable, like real conversation.",
    tint: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20",
    ring: "border-purple-300 dark:border-purple-800",
    accent: "text-purple-700 dark:text-purple-400",
    stations: [
      {
        id: "prata",
        path: "/prata",
        icon: MessageCircle,
        title: "Prata",
        subtitle: "Chatta med SveAI",
        subtitle_en: "Chat with SveAI",
        duration: "5+ min",
        description: "Ha en riktig konversation. SveAI rättar dig varsamt.",
        color: "from-purple-500 to-pink-500",
        ring: "border-purple-300 dark:border-purple-800",
        tint: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20",
      },
    ],
  },
];

function StationCard({ station }) {
  const Icon = station.icon;
  return (
    <Link to={station.path} className="block h-full">
      <Card className={`h-full border-2 ${station.ring} bg-gradient-to-br ${station.tint} hover:shadow-lg transition-all group hover:-translate-y-0.5`}>
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
          <h3 className="font-semibold text-base leading-tight mb-1">{station.title}</h3>
          <p className="text-xs font-medium text-foreground/80 mb-2">
            {station.subtitle} · <span className="italic text-muted-foreground">{station.subtitle_en}</span>
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {station.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

function LevelBlock({ level, isFirst }) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className={`shrink-0 w-9 h-9 rounded-full border-2 ${level.ring} bg-gradient-to-br ${level.tint} flex items-center justify-center`}>
          <span className={`text-sm font-bold ${level.accent}`}>{level.id}</span>
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex flex-wrap items-baseline gap-2">
            <h2 className="font-display text-xl font-bold leading-tight">
              {level.title}
            </h2>
            <span className="text-sm text-muted-foreground italic">{level.title_en}</span>
            {isFirst && (
              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                Börja här
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {level.hint} <span className="italic">{level.hint_en}</span>
          </p>
        </div>
      </div>
      <div className={`grid gap-3 ${level.stations.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {level.stations.map((s) => (
          <StationCard key={s.id} station={s} />
        ))}
      </div>
      {level.memoryTips && <MemoryTips tips={level.memoryTips} level={level} />}
    </div>
  );
}

function MemoryTips({ tips, level }) {
  return (
    <Card className={`border-2 border-dashed ${level.ring} bg-gradient-to-br ${level.tint}`}>
      <CardContent className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Brain className={`w-4 h-4 ${level.accent}`} />
          <h4 className="font-semibold text-sm">
            Så minns du ord · <span className="italic font-normal text-muted-foreground">How to remember words</span>
          </h4>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {tips.map((tip, i) => {
            const TipIcon = tip.icon;
            return (
              <div key={i} className="flex gap-2.5">
                <div className={`shrink-0 w-7 h-7 rounded-lg bg-background/70 border ${level.ring} flex items-center justify-center`}>
                  <TipIcon className={`w-3.5 h-3.5 ${level.accent}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold leading-snug">
                    {tip.title} <span className="italic font-normal text-muted-foreground">· {tip.title_en}</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">
                    {tip.body} <span className="italic">{tip.body_en}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Tala() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PageSEO
          title="Tala · Speaking Gym · Sveapasset"
          description="Bygg din svenska röst steg för steg — från ord till samtal."
        />
        <LoginGate title="Tala — Speaking Gym" description="Log in to start building your Swedish speaking skills." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <PageSEO
        title="Tala · Speaking Gym · Sveapasset"
        description="Bygg din svenska röst steg för steg — från ord till samtal."
      />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 mb-2 shadow-md">
          <Mic className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Tala</h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-sm">
          Bygg din svenska röst — som ett barn. Ord först, sedan fraser, meningar, och till slut samtal.{" "}
          <span className="italic">Build your Swedish like a child does — words, then phrases, sentences, and finally real conversation.</span>
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
              Ett pass som tar dig genom alla fyra nivåer — ord, fraser, meningar, samtal.{" "}
              <span className="italic">One session across all four levels — words, phrases, sentences, conversation.</span>
            </p>
          </div>
          <Button size="lg" asChild className="gap-2 shrink-0">
            <Link to="/tala/daily">
              Starta pass
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Or pick a level */}
      <div className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Eller välj en nivå · <span className="italic normal-case font-normal">or pick a level</span>
        </p>
        {LEVELS.map((lvl, i) => (
          <LevelBlock key={lvl.id} level={lvl} isFirst={i === 0} />
        ))}
      </div>

      {/* Why this order */}
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-5 space-y-2">
          <h3 className="font-semibold text-sm">Varför den här ordningen?</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Barn lär sig prata i lager — först enskilda ord, sedan färdiga fraser de har hört
            hundra gånger, sedan egna meningar, till slut riktiga samtal. Vuxna vinner på
            samma ordning. Om du fastnar i en konversation — backa ett steg. Kan du inte
            bygga en mening? Öva chunks. Fastnar du på ordet? Kör Sprint.
          </p>
          <p className="text-xs text-muted-foreground italic leading-relaxed">
            Children learn to speak in layers — single words, then memorised phrases, then
            self-built sentences, and finally real conversation. Adults benefit from the same
            order. Stuck in conversation? Drop back a level. Can't build a sentence? Do Chunks.
            Blanking on words? Run Sprint.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}