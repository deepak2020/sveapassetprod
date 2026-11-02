import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shuffle, Languages, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ORDLISTOR, TOTAL_WORDS, ALL_WORDS } from "@/data/sprakvagenC";
import { buildSequence, buildSession, topicWords } from "@/lib/ordlistor";
import { useOrdlisteProgress } from "@/hooks/useOrdlisteProgress";
import WordDrill from "@/components/ordlistor/WordDrill";
import OrdlistTopicCard from "@/components/ordlistor/OrdlistTopicCard";

const DIRECTIONS = [
  { id: "sv-en", label: "Svenska → Engelska", sub: "Swedish to English" },
  { id: "en-sv", label: "Engelska → Svenska", sub: "English to Swedish" },
];

export default function Ordlistor() {
  const [direction, setDirection] = useState("sv-en");
  const [session, setSession] = useState(null);
  const { progress, markDone, resetTopic } = useOrdlisteProgress();

  const startTopic = (chapter, level) => {
    const pool = topicWords(chapter, level);
    const key = `${chapter}-${level}`;
    const done = progress[key] || 0;
    const startIndex = done >= pool.length ? 0 : done;
    setSession({
      questions: buildSequence(pool, direction, startIndex),
      key,
      startIndex,
      kind: { type: "topic", chapter, level },
    });
  };

  const startRandom = () =>
    setSession({ questions: buildSession(ALL_WORDS, direction), key: null, startIndex: 0, kind: { type: "random" } });

  if (session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10">
        <WordDrill
          questions={session.questions}
          direction={direction}
          onExit={() => setSession(null)}
          onFinish={() => {
            if (session.key) markDone(session.key, session.startIndex + session.questions.length);
          }}
          onRestart={() => {
            if (session.kind.type === "topic") startTopic(session.kind.chapter, session.kind.level);
            else startRandom();
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-6">
      <Link to="/gym" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Träningssalen
      </Link>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <ListOrdered className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Ordlistor · <span className="italic font-normal text-muted-foreground">Språkvägen C</span></h1>
          <p className="text-sm text-muted-foreground">{TOTAL_WORDS} ord · 20 ordlistor · öva i ordning</p>
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

      {/* Topics in curriculum order */}
      <div className="space-y-5">
        {ORDLISTOR.map((ch) => (
          <div key={ch.chapter} className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-bold">
                <span className="text-muted-foreground mr-1.5">{ch.chapter}.</span>
                {ch.title}
              </h2>
              <span className="text-xs italic text-muted-foreground">{ch.titleEn}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ch.lists.map((l) => {
                const key = `${ch.chapter}-${l.level}`;
                return (
                  <OrdlistTopicCard
                    key={key}
                    level={l.level}
                    total={l.words.length}
                    done={Math.min(progress[key] || 0, l.words.length)}
                    onStart={() => startTopic(ch.chapter, l.level)}
                    onReset={() => resetTopic(key)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={startRandom} variant="outline" className="w-full gap-2">
        <Shuffle className="w-4 h-4" /> Slumpa från alla {TOTAL_WORDS} ord
      </Button>
    </div>
  );
}