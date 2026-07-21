import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Headphones, Zap, Puzzle, Check, ArrowRight, Trophy, Sparkles } from "lucide-react";
import PageSEO from "@/components/shared/PageSEO";
import LoginGate from "@/components/shared/LoginGate";
import { useAuth } from "@/lib/AuthContext";
import { getTopicMeta } from "@/lib/topicMeta";

// Guides the user through the 4-station daily circuit.
// Each station opens in its own page — we just orchestrate order & completion.
const CIRCUIT = [
  {
    id: "shadowing",
    path: "/tala/shadowing",
    icon: Headphones,
    color: "from-blue-500 to-indigo-500",
    title: "Shadowing",
    duration: "5 min",
    description: "Härma svenska meningar för uttal och rytm.",
  },
  {
    id: "sprint",
    path: "/tala/sprint",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    title: "Word Sprint",
    duration: "2 min",
    description: "Säg ord snabbt under mild tidspress.",
  },
  {
    id: "chunks",
    path: "/tala/chunks",
    icon: Puzzle,
    color: "from-emerald-500 to-teal-500",
    title: "Chunks",
    duration: "3 min",
    description: "Bygg meningar och säg dem högt.",
  },
];

const STORAGE_KEY = "tala:daily-workout";

function todayKey() {
  return new Date().toISOString().split("T")[0];
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayKey(), completed: [] };
    const parsed = JSON.parse(raw);
    if (parsed.date !== todayKey()) return { date: todayKey(), completed: [] };
    return parsed;
  } catch {
    return { date: todayKey(), completed: [] };
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}

export default function DailyWorkout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(loadProgress());

  // Optional Språk topic scoping — passed via ?topic=Mat from Tala hub.
  const urlParams = new URLSearchParams(window.location.search);
  const topic = urlParams.get("topic");
  const topicMeta = topic ? getTopicMeta(topic) : null;

  const doneCount = progress.completed.length;
  const total = CIRCUIT.length;
  const allDone = doneCount >= total;
  const currentStep = CIRCUIT.find((s) => !progress.completed.includes(s.id));

  const markDone = (id) => {
    const next = { date: todayKey(), completed: [...new Set([...progress.completed, id])] };
    setProgress(next);
    saveProgress(next);
  };

  const goToStation = (station) => {
    // Mark as attempted when they leave — a soft completion. Full "come back and mark done"
    // is unnecessary complexity for step 1; we optimistically credit the attempt.
    markDone(station.id);
    navigate(station.path);
  };

  const reset = () => {
    const cleared = { date: todayKey(), completed: [] };
    setProgress(cleared);
    saveProgress(cleared);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <PageSEO title="Dagens tal-pass · Tala · Sveapasset" description="15-minuters talträning i fyra stationer." />
        <LoginGate title="Dagens tal-pass" description="Log in to start the daily speaking workout." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <PageSEO title="Dagens tal-pass · Tala · Sveapasset" description="15-minuters talträning i fyra stationer." />

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/tala")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Dagens tal-pass
          </h1>
          <p className="text-xs text-muted-foreground">
            15 min · fyra stationer · <span className="italic">4-station daily circuit</span>
          </p>
        </div>
      </div>

      {topic && (
        <Card className="border-2 border-emerald-300/60 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="text-3xl">{topicMeta?.emoji || "💬"}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Ämne från Språk · Topic from Språk
              </p>
              <p className="font-display text-lg font-bold leading-tight">
                {topic} <span className="text-sm text-muted-foreground italic font-normal">· {topicMeta?.en || topic}</span>
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/tala/daily")}>
              Ta bort
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Progress hero */}
      <Card className="border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-blue-50 to-indigo-50 dark:from-primary/15 dark:via-blue-950/30 dark:to-indigo-950/20">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-semibold text-primary">Framsteg idag</p>
              <p className="font-display text-2xl font-bold">
                {doneCount} / {total} stationer
              </p>
            </div>
            {allDone && (
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          <div className="h-2 bg-white/60 dark:bg-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all"
              style={{ width: `${(doneCount / total) * 100}%` }}
            />
          </div>
          {allDone ? (
            <div className="text-center pt-1 space-y-2">
              <p className="text-sm font-semibold">Fantastiskt! Dagens pass är klart 🎉</p>
              <Button variant="outline" size="sm" onClick={reset}>
                Kör igen
              </Button>
            </div>
          ) : (
            currentStep && (
              <Button
                onClick={() => goToStation(currentStep)}
                size="lg"
                className="w-full gap-2 mt-1"
              >
                Fortsätt till {currentStep.title}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )
          )}
        </CardContent>
      </Card>

      {/* Station list */}
      <div className="space-y-2">
        {CIRCUIT.map((s, i) => {
          const done = progress.completed.includes(s.id);
          const isNext = !done && currentStep?.id === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => goToStation(s)}
              className={`w-full text-left rounded-xl border-2 p-4 flex items-center gap-3 transition-all ${
                done
                  ? "border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20"
                  : isNext
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/60 bg-card hover:border-border"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">{i + 1}.</span>
                  <p className="font-semibold text-sm">{s.title}</p>
                  <span className="text-[10px] text-muted-foreground">· {s.duration}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{s.description}</p>
              </div>
              {done ? (
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
              ) : (
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center italic">
        Tryck på en station för att starta — vi markerar den som klar när du öppnar den.
      </p>
    </div>
  );
}