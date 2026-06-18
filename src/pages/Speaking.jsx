import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { PenSquare, Sparkles, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GymSessionV2 from "@/components/gym/GymSessionV2";
import LoginGate from "@/components/shared/LoginGate";
import SveaLogo from "@/components/shared/SveaLogo";
import { shuffle } from "@/lib/shuffle";

const SFI_LEVELS = ["A", "B", "C", "D"];
const SENTENCE_COUNTS = [10, 25, 50];

export default function Speaking() {
  const [level, setLevel] = useState("A");
  const [count, setCount] = useState(10);
  const [session, setSession] = useState(null);

  useEffect(() => {
    base44.analytics.track({ eventName: "page_viewed", properties: { page: "speaking" } });
  }, []);

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

  const start = () => {
    const quiz = shuffle(levelSentences).slice(0, available);
    base44.analytics.track({
      eventName: "gym_session_started",
      properties: { mode: "produce", sfi_level: level, sentence_count: quiz.length, source: "speaking_page" },
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