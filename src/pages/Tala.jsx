import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Headphones, Puzzle, MessageCircle, PenSquare, Mic, ChevronDown } from "lucide-react";
import PageSEO from "@/components/shared/PageSEO";
import LoginGate from "@/components/shared/LoginGate";
import { useAuth } from "@/lib/AuthContext";
import MissionCardsSection from "@/components/missions/MissionCardsSection";
import { cn } from "@/lib/utils";

// Compact list of individual practice stations, shown collapsed by default.
const STATIONS = [
  { id: "sprint",    path: "/tala/sprint",    icon: Zap,           title: "Word Sprint", subtitle: "Snabb återkallelse",  duration: "2 min" },
  { id: "shadowing", path: "/tala/shadowing", icon: Headphones,    title: "Shadowing",   subtitle: "Härma Svea",          duration: "5 min" },
  { id: "chunks",    path: "/tala/chunks",    icon: Puzzle,        title: "Chunks",      subtitle: "Bygg meningar",       duration: "3 min" },
  { id: "skriva",    path: "/speaking",       icon: PenSquare,     title: "Skriva",      subtitle: "Översätt till svenska", duration: "öppet" },
  { id: "prata",     path: "/prata",          icon: MessageCircle, title: "Prata",       subtitle: "Fritt samtal med SveAI", duration: "5+ min" },
];

function StationRow({ station }) {
  const Icon = station.icon;
  return (
    <Link
      to={station.path}
      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/50 transition-colors group"
    >
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0 group-hover:bg-primary/10">
        <Icon className="w-4 h-4 text-foreground/70 group-hover:text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-tight">{station.title}</p>
        <p className="text-[11px] text-muted-foreground truncate">{station.subtitle}</p>
      </div>
      <span className="text-[10px] text-muted-foreground shrink-0">{station.duration}</span>
    </Link>
  );
}

export default function Tala() {
  const { isAuthenticated } = useAuth();
  const [stationsOpen, setStationsOpen] = useState(false);

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <PageSEO
        title="Tala · Speaking Gym · Sveapasset"
        description="Bygg din svenska röst steg för steg — från ord till samtal."
      />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-md">
          <Mic className="w-6 h-6 text-white" />
        </div>
        <h1 className="font-display text-3xl font-bold">Tala</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Öva riktiga samtal — steg för steg.{" "}
          <span className="italic">Practice real conversations, step by step.</span>
        </p>
      </div>

      {/* Uppdrag — the main event */}
      <MissionCardsSection />

      {/* Individual stations — collapsed by default */}
      <div className="border-t border-border pt-4">
        <button
          type="button"
          onClick={() => setStationsOpen((o) => !o)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Enskilda övningar
            </p>
            <p className="text-[11px] text-muted-foreground italic">
              Individual practice tools
            </p>
          </div>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              stationsOpen && "rotate-180"
            )}
          />
        </button>

        {stationsOpen && (
          <div className="grid sm:grid-cols-2 gap-2 mt-3">
            {STATIONS.map((s) => (
              <StationRow key={s.id} station={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}