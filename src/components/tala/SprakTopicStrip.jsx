import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ArrowRight, MessageCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { getTopicMeta } from "@/lib/topicMeta";

// Horizontal strip of Språk topics — tap one to jump into Prata (Samtal)
// with SveAI pre-loaded on that topic. All other Tala levels are unchanged.
export default function SprakTopicStrip() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["tala-sprak-topics"],
    queryFn: () => base44.entities.Lesson.list("topic", 500),
    staleTime: 5 * 60 * 1000,
  });

  // Derive unique topic list from lessons, sorted by lesson count desc.
  const topics = useMemo(() => {
    const counts = new Map();
    for (const l of lessons) {
      if (!l.topic) continue;
      counts.set(l.topic, (counts.get(l.topic) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, ...getTopicMeta(name) }));
  }, [lessons]);

  const startConversation = () => {
    if (!selected) return;
    navigate(`/prata?topic=${encodeURIComponent(selected.name)}`);
    setSelected(null);
  };

  if (!isLoading && topics.length === 0) return null;

  return (
    <>
      <Card className="border-2 border-emerald-300/60 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm shrink-0">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg font-bold leading-tight">
                Prata om dina Språk-ämnen
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ta ett ämne du redan lär dig — och prata om det med SveAI.{" "}
                <span className="italic">Pick a topic you're already learning — and talk about it with SveAI.</span>
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex gap-2 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-28 rounded-xl shrink-0" />
              ))}
            </div>
          ) : (
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 snap-x">
              {topics.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setSelected(t)}
                  className="shrink-0 snap-start w-32 rounded-xl border-2 border-border/60 bg-background hover:border-emerald-400 hover:shadow-sm transition-all p-3 text-left group"
                >
                  <div className="text-2xl leading-none mb-1.5">{t.emoji}</div>
                  <p className="text-sm font-semibold leading-tight truncate">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground italic truncate">
                    {t.en || `${t.count} lektioner`}
                  </p>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-sm">
          {selected && (
            <>
              <DialogHeader>
                <div className="text-4xl mb-2">{selected.emoji}</div>
                <DialogTitle className="font-display text-2xl">
                  {selected.name}
                </DialogTitle>
                <DialogDescription className="italic">
                  {selected.en || "Talk about this topic"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-1">
                <p className="text-sm text-foreground/90">
                  Du har lärt dig detta i Språk. Nu — prata om det med SveAI på svenska.
                </p>
                <p className="text-xs text-muted-foreground italic">
                  You've been learning this in Språk. Now — talk about it with SveAI in Swedish.
                </p>

                <div className="rounded-lg bg-muted/50 border border-border/60 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    SveAI kan öppna med
                  </p>
                  <p className="text-sm italic text-foreground/90">
                    "{selected.opener_sv}"
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={startConversation} className="w-full gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Starta samtal
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}