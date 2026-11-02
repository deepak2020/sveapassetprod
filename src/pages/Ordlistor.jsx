import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Repeat, Languages, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ORDLISTOR, TOTAL_WORDS } from "@/data/sprakvagenC";
import { buildSession, filterPool } from "@/lib/ordlistor";
import WordDrill from "@/components/ordlistor/WordDrill";

const DIRECTIONS = [
  { id: "sv-en", label: "Svenska → Engelska", sub: "Swedish to English" },
  { id: "en-sv", label: "Engelska → Svenska", sub: "English to Swedish" },
];

export default function Ordlistor() {
  const [direction, setDirection] = useState("sv-en");
  const [chapter, setChapter] = useState("all");
  const [level, setLevel] = useState("all");
  const [questions, setQuestions] = useState(null);

  const pool = useMemo(() => filterPool({ chapter, level }), [chapter, level]);

  const start = (dir = direction) => {
    if (pool.length < 4) return;
    setQuestions(buildSession(pool, dir));
  };

  if (questions) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10">
        <WordDrill
          questions={questions}
          direction={direction}
          onExit={() => setQuestions(null)}
          onRestart={() => start()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-6">
      <Link to="/gym" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Träningssalen
      </Link>

      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ListOrdered className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Ordlistor · <span className="italic font-normal text-muted-foreground">Språkvägen C</span></h1>
            <p className="text-sm text-muted-foreground">{TOTAL_WORDS} ord i 20 ordlistor · 10 kapitel</p>
          </div>
        </div>
      </div>

      {/* Direction */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5" /> Riktning
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {DIRECTIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDirection(d.id)}
              className={`rounded-xl border-2 px-4 py-3 text-left transition-all ${
                direction === d.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <p className="font-semibold text-sm">{d.label}</p>
              <p className="text-xs italic text-muted-foreground">{d.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chapter */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Kapitel</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setChapter("all")}
            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
              chapter === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"
            }`}
          >
            Alla
          </button>
          {ORDLISTOR.map((ch) => (
            <button
              key={ch.chapter}
              onClick={() => setChapter(ch.chapter)}
              className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                chapter === ch.chapter ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"
              }`}
            >
              {ch.chapter}. {ch.title}
            </button>
          ))}
        </div>
      </div>

      {/* Level */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nivå</p>
        <div className="flex gap-2">
          {[
            { id: "all", label: "Alla" },
            { id: 1, label: "Nivå 1" },
            { id: 2, label: "Nivå 2" },
          ].map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                level === l.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        {pool.length} ord i ditt urval · 12 frågor per omgång
      </div>

      <Button onClick={() => start()} size="lg" className="w-full gap-2" disabled={pool.length < 4}>
        <Play className="w-5 h-5" /> Börja öva
      </Button>

      <Button onClick={() => start(direction === "sv-en" ? "en-sv" : "sv-en")} variant="outline" className="w-full gap-2" disabled={pool.length < 4}>
        <Repeat className="w-4 h-4" /> Öva andra riktningen
      </Button>
    </div>
  );
}