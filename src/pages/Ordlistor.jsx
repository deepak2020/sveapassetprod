import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shuffle, Languages, ListOrdered, ListChecks, Layers, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ORDLISTOR, TOTAL_WORDS, ALL_WORDS } from "@/data/sprakvagenC";
import { buildSequence, buildSession, topicWords } from "@/lib/ordlistor";
import { useOrdlisteProgress } from "@/hooks/useOrdlisteProgress";
import { shuffle } from "@/lib/shuffle";
import WordDrill from "@/components/ordlistor/WordDrill";
import WordFlashcards from "@/components/ordlistor/WordFlashcards";
import WordSpeaking from "@/components/ordlistor/WordSpeaking";
import OrdlistTopicCard from "@/components/ordlistor/OrdlistTopicCard";

const DIRECTIONS = [
  { id: "sv-en", label: "Svenska → Engelska", sub: "Swedish to English" },
  { id: "en-sv", label: "Engelska → Svenska", sub: "English to Swedish" },
];

const MODES = [
  { id: "quiz", icon: ListChecks, label: "Quiz", sub: "Fler val" },
  { id: "flash", icon: Layers, label: "Flashkort", sub: "Repetera orden" },
  { id: "speak", icon: Mic, label: "Uttal", sub: "Träna uttalet" },
];

export default function Ordlistor() {
  const [mode, setMode] = useState("quiz");
  const [direction, setDirection] = useState("sv-en");
  const [session, setSession] = useState(null);
  const { progress, markDone, resetTopic } = useOrdlisteProgress();

  const startTopic = (chapter, level) => {
    const pool = topicWords(chapter, level);
    const title = `${chapter}. ${ORDLISTOR.find((c) => c.chapter === chapter)?.title} · Nivå ${level}`;

    if (mode === "flash") {
      setSession({ type: "flash", words: pool, title });
      return;
    }
    if (mode === "speak") {
      setSession({ type: "speak", words: pool, title });
      return;
    }

    const key = `${chapter}-${level}`;
    const done = progress[key] || 0;
    const startIndex = done >= pool.length ? 0 : done;
    setSession({
      type: "quiz",
      questions: buildSequence(pool, direction, startIndex),
      key,
      startIndex,
      kind: { type: "topic", chapter, level },
    });
  };

  const startAll = () => {
    if (mode === "flash") return setSession({ type: "flash", words: shuffle(ALL_WORDS), title: "Alla ord" });
    if (mode === "speak") return setSession({ type: "speak", words: shuffle(ALL_WORDS).slice(0, 25), title: "Alla ord" });
    setSession({ type: "quiz", questions: buildSession(ALL_WORDS, direction), key: null, startIndex: 0, kind: { type: "random" } });
  };

  if (session?.type === "flash") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10">
        <WordFlashcards words={session.words} title={session.title} onExit={() => setSession(null)} />
      </div>
    );
  }

  if (session?.type === "speak") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10">
        <WordSpeaking words={session.words} title={session.title} onExit={() => setSession(null)} />
      </div>
    );
  }

  if (session?.type === "quiz") {
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
            else startAll();
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

      {/* Mode */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Läge</p>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map(({ id, icon: Icon, label, sub }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`rounded-xl border-2 px-3 py-3 text-center transition-all ${
                mode === id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <Icon className={`w-4 h-4 mx-auto mb-1 ${mode === id ? "text-primary" : "text-muted-foreground"}`} />
              <p className="font-semibold text-sm">{label}</p>
              <p className="text-[11px] italic text-muted-foreground">{sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Direction (quiz only — flashcards and pronunciation always start in Swedish) */}
      {mode === "quiz" && (
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
      )}

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
                    mode={mode}
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

      <Button onClick={startAll} variant="outline" className="w-full gap-2">
        <Shuffle className="w-4 h-4" />
        {mode === "quiz" ? `Slumpa från alla ${TOTAL_WORDS} ord` : mode === "flash" ? "Blanda alla ord" : "Slumpa 25 ord för uttal"}
      </Button>
    </div>
  );
}