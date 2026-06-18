import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Play, BookOpen, Upload, Brain, CheckCircle2, XCircle, Mic, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import GymSessionV2 from "@/components/gym/GymSessionV2";
import VocabReviewSession from "@/components/gym/VocabReviewSession";
import LoginGate from "@/components/shared/LoginGate";
import { useVocabSRS } from "@/hooks/useVocabSRS";
import { useDailyReview } from "@/hooks/useDailyReview";
import { shuffle } from "@/lib/shuffle";

const SFI_LEVELS = ["A", "B", "C", "D"];
const SENTENCE_COUNTS = [10, 25, 50];
const SKILLS = [
  { id: "vocabulary", label: "Vocabulaire", icon: "📚", desc: "Practique des mots et phrases" },
  { id: "grammar", label: "Grammaire", icon: "✍️", desc: "Formes et structures" },
  { id: "reading", label: "Lecture", icon: "👁️", desc: "Compréhension de textes" },
];

export default function Gym() {
  const [session, setSession] = useState(null);
  const [vocabSession, setVocabSession] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null); // { ok: bool, msg: string }
  const { dueCards, masteredCount, totalCount, refresh } = useVocabSRS();
  const { showNudge, totalDue } = useDailyReview();
  const sessionRef = useRef(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    base44.analytics.track({ eventName: "page_viewed", properties: { page: "gym" } });
  }, []);

  const { data: sentences = [] } = useQuery({
    queryKey: ["cloze-sentences"],
    queryFn: async () => {
      const all = await base44.entities.ClozeSentence.list();
      return all.filter(s => s.source === 'tatoeba');
    },
  });

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const { data: srsCards = [] } = useQuery({
    queryKey: ["srs-cards", user?.email],
    queryFn: () => base44.entities.UserSRSCard.list(),
    enabled: !!user,
  });

  const today = new Date().toISOString().split("T")[0];
  const dueCount = srsCards.filter(c => c.due_date <= today && c.status !== "mastered").length;
  const srsMasteredCount = srsCards.filter(c => c.mastery_percentage === 100).length;
  const srsMasteryPct = srsCards.length > 0 ? Math.round((srsMasteredCount / srsCards.length) * 100) : 0;

  const handleImportTatoeba = async (sfiLevel) => {
    setImporting(true);
    setImportStatus(null);
    try {
      const res = await base44.functions.invoke('importTatoebaData', { limit: 1000, sfiLevel });
      setImportStatus({ ok: true, msg: `Imported ${res.data.imported} sentences from Tatoeba (SFI ${sfiLevel})` });
      queryClient.invalidateQueries({ queryKey: ["cloze-sentences"] });
    } catch (error) {
      setImportStatus({ ok: false, msg: `Import failed: ${error.message}` });
    } finally {
      setImporting(false);
    }
  };

  if (vocabSession) {
    return (
      <VocabReviewSession
        cards={dueCards}
        onFinish={() => { setVocabSession(false); refresh(); base44.analytics.track({ eventName: "vocab_review_completed", properties: { card_count: dueCards.length } }); }}
      />
    );
  }

  if (session) {
    return (
      <GymSessionV2
        sentences={session.sentences}
        mode={session.mode}
        srsCards={srsCards}
        onFinish={() => setSession(null)}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {showNudge && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-sm">
          <span className="text-lg shrink-0">🔥</span>
          <p className="text-amber-800 dark:text-amber-300 flex-1">
            <span className="font-semibold">{totalDue} words due for review</span> · Complete your daily warm-up on the Dashboard to earn +50 XP bonus.
          </p>
        </div>
      )}
      <div className="flex items-center justify-between mb-8">
        <div className="text-center flex-1">
          <h1 className="font-display text-3xl font-bold mb-2">Träningssalen</h1>
          <p className="text-muted-foreground">Högvolym-meningsträning med SRS-spårning</p>
        </div>
        {user?.role === 'admin' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowImport(!showImport)}
            className="gap-2"
          >
            <Upload className="w-4 h-4" /> Tatoeba
          </Button>
        )}
      </div>

      {/* Tatoeba Import Panel */}
      {user?.role === 'admin' && showImport && (
        <Card className="border-border/50 mb-8 bg-primary/5">
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold">Importera från Tatoeba</h3>
            <div className="grid grid-cols-4 gap-2">
              {SFI_LEVELS.map(level => (
                <Button
                  key={level}
                  onClick={() => handleImportTatoeba(level)}
                  disabled={importing}
                  className="text-sm"
                >
                  {importing ? '⏳' : '↓'} SFI {level}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground italic">Importer ~50 meningar från Tatoeba per SFI-nivå</p>
            {importStatus && (
              <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${importStatus.ok ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : "bg-destructive/10 text-destructive"}`}>
                {importStatus.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                {importStatus.msg}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className={`grid gap-3 ${user ? 'grid-cols-3' : 'grid-cols-1'}`}>
        <Card className="border-border/50">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{sentences.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Totalt meningar i Träningssalen</p>
          </CardContent>
        </Card>
        {user && (
          <>
            <Card
              className={`border-border/50 transition-all ${dueCount > 0 ? "cursor-pointer hover:border-orange-400 hover:shadow-md active:scale-95" : ""}`}
              onClick={() => dueCount > 0 && sessionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
            >
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-orange-500">{dueCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Förfallna för granskning</p>
                {dueCount > 0 && <p className="text-[10px] text-orange-400 mt-0.5 italic">Tryck för att starta · Tap to start</p>}
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-emerald-500">{srsMasteryPct}%</p>
                <p className="text-xs text-muted-foreground mt-1">Mastry ({srsMasteredCount})</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Vocab Review deck (lesson word pairs) */}
      {totalCount > 0 && (
        <Card className={`border-2 transition-all ${dueCards.length > 0 ? "border-violet-300 bg-violet-50/40" : "border-border/50"}`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Ordförrådsgranskning</h3>
                  <p className="text-sm text-muted-foreground">
                    Vocabulary SRS · {totalCount} cards, {masteredCount} mastered
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                {dueCards.length > 0 ? (
                  <Button size="sm" onClick={() => { setVocabSession(true); base44.analytics.track({ eventName: "vocab_review_started", properties: { due_cards: dueCards.length } }); }} className="gap-1.5 bg-violet-600 hover:bg-violet-700">
                    <Play className="w-3.5 h-3.5" /> Review {dueCards.length}
                  </Button>
                ) : (
                  <span className="text-xs text-emerald-600 font-medium">✓ All caught up</span>
                )}
              </div>
            </div>
            {totalCount > 0 && (
              <div className="mt-3">
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full transition-all"
                    style={{ width: `${Math.round((masteredCount / totalCount) * 100)}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((masteredCount / totalCount) * 100)}% mastered
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {sentences.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Inga meningar ännu</h3>
            <p className="text-sm text-muted-foreground">Be en admin att lägga till cloze-meningar i träningssalen.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <ProductionModeCard sentences={sentences} onStartSession={setSession} />
          <GymDashboard sentences={sentences} srsCards={srsCards} onStartSession={setSession} sessionRef={sessionRef} />
        </>
      )}
    </div>
  );
}

function ProductionModeCard({ sentences, onStartSession }) {
  const [level, setLevel] = useState("A");
  const [count, setCount] = useState(10);

  const levelSentences = sentences.filter(s => s.sfi_level === level);
  const available = Math.min(count, levelSentences.length);

  const start = () => {
    const quiz = shuffle(levelSentences).slice(0, available);
    base44.analytics.track({
      eventName: "gym_session_started",
      properties: { mode: "produce", sfi_level: level, sentence_count: quiz.length, source: "production_hero" },
    });
    onStartSession({ sentences: quiz, mode: "produce" });
  };

  return (
    <Card className="border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/20 overflow-hidden">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-sm">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-bold text-lg">Production Mode</h3>
              <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">Nytt</span>
            </div>
            <p className="text-sm text-muted-foreground leading-snug mt-0.5">
              Engelska → hela svenska meningen från minnet. <span className="italic">Svea</span> ger feedback på varje fel.
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">SFI-nivå</p>
          <div className="grid grid-cols-4 gap-2">
            {SFI_LEVELS.map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`py-2 rounded-lg border-2 text-sm font-bold transition-all ${
                  level === l
                    ? "border-amber-500 bg-amber-500 text-white"
                    : "border-amber-200 dark:border-amber-800/60 bg-white/60 dark:bg-black/20 hover:border-amber-400"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Antal meningar</p>
          <div className="grid grid-cols-3 gap-2">
            {SENTENCE_COUNTS.map(n => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                  count === n
                    ? "border-amber-500 bg-amber-500 text-white"
                    : "border-amber-200 dark:border-amber-800/60 bg-white/60 dark:bg-black/20 hover:border-amber-400"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <LoginGate message="Logga in för att starta Production Mode">
          <Button
            onClick={start}
            size="lg"
            className="w-full gap-2 text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-md"
            disabled={available === 0}
          >
            <Sparkles className="w-5 h-5" /> Starta Production ({available} meningar)
          </Button>
        </LoginGate>
      </CardContent>
    </Card>
  );
}

function GymDashboard({ sentences, srsCards, onStartSession, sessionRef }) {
  const [selectedLevel, setSelectedLevel] = useState("A");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedMode, setSelectedMode] = useState("listen");
  const [count, setCount] = useState(10);

  // Step 1: Filter by level
  let levelSentences = sentences.filter(s => s.sfi_level === selectedLevel);
  
  // Step 2: Filter by skill/frequency range
  if (selectedSkill === "vocabulary") {
    levelSentences = levelSentences.filter(s => (s.word_frequency_rank || 500) < 300);
  } else if (selectedSkill === "grammar") {
    levelSentences = levelSentences.filter(s => (s.word_frequency_rank || 500) >= 300 && (s.word_frequency_rank || 500) < 700);
  } else if (selectedSkill === "reading") {
    levelSentences = levelSentences.filter(s => (s.word_frequency_rank || 500) >= 700);
  }
  
  // Step 3: Build quiz queue mixing new + due sentences, ordered by frequency rank
  const today = new Date().toISOString().split("T")[0];
  const dueCards = srsCards.filter(c => c.due_date <= today && c.status !== "mastered");
  const dueSentenceIds = new Set(dueCards.map(c => c.cloze_sentence_id));
  
  const newSentences = levelSentences.filter(s => !dueCards.some(c => c.cloze_sentence_id === s.id))
    .sort((a, b) => (a.word_frequency_rank || 500) - (b.word_frequency_rank || 500));
  
  const dueSentences = levelSentences.filter(s => dueSentenceIds.has(s.id))
    .sort((a, b) => (a.word_frequency_rank || 500) - (b.word_frequency_rank || 500));

  // Mix new and due: alternate for balanced difficulty progression
  const sessionSentences = [];
  const maxIdx = Math.max(newSentences.length, dueSentences.length);
  for (let i = 0; i < maxIdx; i++) {
    if (i < dueSentences.length) sessionSentences.push(dueSentences[i]);
    if (i < newSentences.length) sessionSentences.push(newSentences[i]);
  }
  
  // Group by topic for display
  const topicGroups = {};
  levelSentences.forEach(s => {
    const topic = s.topic || "Allmänt";
    if (!topicGroups[topic]) topicGroups[topic] = [];
    topicGroups[topic].push(s);
  });

  const topics = Object.entries(topicGroups)
    .map(([name, items]) => ({
      name,
      count: items.length,
      avgFrequency: items.reduce((avg, s) => avg + (s.word_frequency_rank || 500), 0) / items.length,
    }))
    .sort((a, b) => a.avgFrequency - b.avgFrequency);

  const startSession = () => {
    const shuffled = shuffle(sessionSentences);
    const quiz = shuffled.slice(0, Math.min(count, shuffled.length));
    base44.analytics.track({
      eventName: "gym_session_started",
      properties: { mode: selectedMode, sfi_level: selectedLevel, sentence_count: quiz.length },
    });
    onStartSession({ sentences: quiz, mode: selectedMode });
  };

  return (
    <div className="space-y-6">
      {/* SFI Level Selection */}
      <div ref={sessionRef}>
        <h2 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">SFI-nivå</h2>
        <div className="grid grid-cols-4 gap-3">
          {SFI_LEVELS.map(level => {
            const levelCount = sentences.filter(s => s.sfi_level === level).length;
            return (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  selectedLevel === level ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
                }`}
              >
                <p className="font-bold text-xl">{level}</p>
                <p className="text-xs text-muted-foreground mt-1">{levelCount} meningar</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exercise Mode Selection */}
      <div>
        <h2 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Övningstyp</h2>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedMode("listen")}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              selectedMode === "listen" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
            }`}
          >
            <p className="text-lg">👂</p>
            <p className="text-xs font-medium mt-1">Lyssna</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Läs engelska, lyssna på svenska</p>
          </button>
          <button
            onClick={() => setSelectedMode("read")}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              selectedMode === "read" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
            }`}
          >
            <p className="text-lg">📖</p>
            <p className="text-xs font-medium mt-1">Läsa</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Läs både texterna</p>
          </button>
          <button
            onClick={() => setSelectedMode("type")}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              selectedMode === "type" ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
            }`}
          >
            <p className="text-lg">⌨️</p>
            <p className="text-xs font-medium mt-1">Skriva</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Alltid skriva svar</p>
          </button>
        </div>
      </div>

      {/* Skill Selection */}
      <div>
        <h2 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Kompetens</h2>
        <div className="grid grid-cols-4 gap-3">
          <button
            onClick={() => setSelectedSkill(null)}
            className={`p-4 rounded-xl border-2 text-center transition-all ${
              selectedSkill === null ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
            }`}
          >
            <p className="text-lg">🎯</p>
            <p className="text-xs font-medium mt-1">Alla</p>
          </button>
          {SKILLS.map(skill => (
            <button
              key={skill.id}
              onClick={() => setSelectedSkill(skill.id)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                selectedSkill === skill.id ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/30"
              }`}
            >
              <p className="text-lg">{skill.icon}</p>
              <p className="text-xs font-medium mt-1">{skill.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Topics */}
      {topics.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Ämnen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topics.map(topic => (
              <Card key={topic.name} className="border-border/50 hover:shadow-sm transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{topic.name}</p>
                    </div>
                    <Badge variant="outline" className="text-xs ml-2 shrink-0">
                      {topic.count}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {topic.avgFrequency < 200 ? "Vanliga ord" : topic.avgFrequency < 500 ? "Medel svårighet" : "Avancerad"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Session Length */}
      <div>
        <h2 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Sessionslängd</h2>
        <div className="grid grid-cols-3 gap-3">
          {SENTENCE_COUNTS.map(n => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                count === n ? "border-primary bg-primary text-primary-foreground" : "border-border/50 hover:border-primary/30"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <LoginGate message="Logga in för att starta träningssalen">
        <Button
          onClick={startSession}
          size="lg"
          className="w-full gap-2 text-base"
          disabled={levelSentences.length === 0}
        >
          <Play className="w-5 h-5" /> Starta session ({Math.min(count, levelSentences.length)} meningar)
        </Button>
      </LoginGate>
    </div>
  );
}