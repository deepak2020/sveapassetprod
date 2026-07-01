import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { PenSquare, Sparkles, BookOpen, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GymSessionV2 from "@/components/gym/GymSessionV2";
import LoginGate from "@/components/shared/LoginGate";
import SveaLogo from "@/components/shared/SveaLogo";
import { shuffle } from "@/lib/shuffle";
import { useSkrivaRevision } from "@/hooks/useSkrivaRevision";
import { useMistakeLog } from "@/hooks/useMistakeLog";

const SFI_LEVELS = ["A", "B", "C", "D"];
const SENTENCE_COUNTS = [10, 25, 50];

export default function Speaking() {
  const [level, setLevel] = useState("A");
  const [count, setCount] = useState(10);
  const [session, setSession] = useState(null);
  const { items: revisionItems } = useSkrivaRevision();
  const { logMistake, mistakes: loggedMistakes, resolveMistake } = useMistakeLog();

  useEffect(() => {
    base44.analytics.track({ eventName: "page_viewed", properties: { page: "speaking" } });
  }, []);

  // Backfill legacy localStorage Skriva mistakes into the unified MistakeLog
  // so they surface on the Dashboard's "Repetera dina misstag" card too.
  useEffect(() => {
    if (!revisionItems.length) return;
    const alreadyLogged = new Set(
      loggedMistakes
        .filter(m => m.source === "gym_produce")
        .map(m => m.source_id)
    );
    revisionItems.forEach(item => {
      if (!item.sentence?.id || alreadyLogged.has(item.sentence.id)) return;
      logMistake({
        source: "gym_produce",
        source_id: item.sentence.id,
        question: item.sentence.sentence_en,
        correct_answer: item.correctedText || item.sentence.sentence_sv,
        user_answer: item.userAnswer || "",
        explanation: item.grammarIssues?.[0]?.explanation || "",
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revisionItems.length, loggedMistakes.length]);

  const { data: sentences = [] } = useQuery({
    queryKey: ["cloze-sentences"],
    queryFn: async () => {
      const all = await base44.entities.ClozeSentence.list();
      return all.filter(s => s.source === "tatoeba");
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

  const levelSentences = sentences.filter(s => s.sfi_level === level);
  const available = Math.min(count, levelSentences.length);

  // Merge revision sources: legacy localStorage list + unified MistakeLog (gym_produce/writing).
  // MistakeLog rows only have source_id → look up the full ClozeSentence from the loaded list.
  const mistakeLogRevisions = loggedMistakes
    .filter(m => (m.source === "gym_produce" || m.source === "writing") && m.source_id)
    .map(m => {
      const sentence = sentences.find(s => s.id === m.source_id);
      return sentence ? { sentence, _mistakeId: m.id } : null;
    })
    .filter(Boolean);

  // De-dupe by sentence id — a Skriva mistake may live in both stores
  const revisionMap = new Map();
  [...revisionItems, ...mistakeLogRevisions].forEach(item => {
    if (item.sentence?.id && !revisionMap.has(item.sentence.id)) {
      revisionMap.set(item.sentence.id, item);
    }
  });
  const allRevisions = Array.from(revisionMap.values());

  const start = () => {
    const quiz = shuffle(levelSentences).slice(0, available);
    base44.analytics.track({
      eventName: "gym_session_started",
      properties: { mode: "produce", sfi_level: level, sentence_count: quiz.length, source: "speaking_page" },
    });
    setSession({ sentences: quiz, mode: "produce" });
  };

  const startRevision = () => {
    // Re-quiz only the sentences the user got wrong before (from both stores)
    const quiz = shuffle(allRevisions.map(i => i.sentence)).filter(Boolean);
    if (!quiz.length) return;
    base44.analytics.track({
      eventName: "gym_session_started",
      properties: { mode: "produce", sentence_count: quiz.length, source: "skriva_revision" },
    });
    setSession({ sentences: quiz, mode: "produce" });
  };

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
      {/* Hero */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-2 shadow-md">
          <PenSquare className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-display text-3xl font-bold">Skriva</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Översätt engelska meningar till hela svenska meningen från minnet.{" "}
          <SveaLogo className="text-base" /> rättar varje fel och förklarar grammatiken.
        </p>
      </div>

      {/* Revision: re-quiz only the sentences the user got wrong before */}
      {allRevisions.length > 0 && (
        <LoginGate message="Logga in för att repetera dina misstag">
          <Card className="border-2 border-rose-300 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-950/30 dark:to-amber-950/20">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-rose-500/15 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm leading-tight">Repetera dina misstag</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {allRevisions.length} mening{allRevisions.length === 1 ? "" : "ar"} att öva igen ·{" "}
                  <span className="italic">Revise {allRevisions.length} sentence{allRevisions.length === 1 ? "" : "s"} you got wrong</span>
                </p>
              </div>
              <Button onClick={startRevision} size="sm" className="bg-rose-500 hover:bg-rose-600 text-white border-0 shrink-0">
                Starta
              </Button>
            </CardContent>
          </Card>
        </LoginGate>
      )}

      {sentences.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Inga meningar ännu</h3>
            <p className="text-sm text-muted-foreground">
              Be en admin att lägga till meningar i träningssalen.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/20">
          <CardContent className="p-6 space-y-6">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                SFI-nivå
              </p>
              <div className="grid grid-cols-4 gap-2">
                {SFI_LEVELS.map(l => {
                  const lc = sentences.filter(s => s.sfi_level === l).length;
                  return (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`py-3 rounded-lg border-2 text-center transition-all ${
                        level === l
                          ? "border-amber-500 bg-amber-500 text-white"
                          : "border-amber-200 dark:border-amber-800/60 bg-white/60 dark:bg-black/20 hover:border-amber-400"
                      }`}
                    >
                      <p className="font-bold text-lg">{l}</p>
                      <p className={`text-[10px] mt-0.5 ${level === l ? "text-white/80" : "text-muted-foreground"}`}>
                        {lc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Antal meningar
              </p>
              <div className="grid grid-cols-3 gap-2">
                {SENTENCE_COUNTS.map(n => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={`py-2.5 rounded-lg border-2 text-sm font-semibold transition-all ${
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

            <LoginGate message="Logga in för att börja skriva">
              <Button
                onClick={start}
                size="lg"
                className="w-full gap-2 text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-md"
                disabled={available === 0}
              >
                <Sparkles className="w-5 h-5" /> Starta ({available} meningar)
              </Button>
            </LoginGate>
          </CardContent>
        </Card>
      )}

      {/* How it works */}
      <Card className="border-border/50 bg-muted/30">
        <CardContent className="p-5 space-y-3">
          <h3 className="font-semibold text-sm">Så fungerar Skriva</h3>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2"><span className="font-bold text-foreground">1.</span> Du ser en mening på engelska.</li>
            <li className="flex gap-2"><span className="font-bold text-foreground">2.</span> Du skriver hela meningen på svenska från minnet.</li>
            <li className="flex gap-2"><span className="font-bold text-foreground">3.</span> <SveaLogo className="text-sm" /> rättar varje fel och förklarar grammatikregeln.</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}