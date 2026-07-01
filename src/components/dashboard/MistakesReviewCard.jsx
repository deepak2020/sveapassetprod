import { useState } from "react";
import { Link } from "react-router-dom";
import { RotateCcw, ChevronRight, PenSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMistakeLog } from "@/hooks/useMistakeLog";
import MistakesReviewSession from "@/components/shared/MistakesReviewSession";

// Skriva/writing mistakes need the full production UI on the Skriva page,
// not the single-input review — route users there instead.
const PRODUCTION_SOURCES = new Set(["gym_produce", "writing"]);

// Unified mistakes card: shows ALL your wrong answers across lessons, grammar,
// gym, and writing — click to review them in a focused session.
export default function MistakesReviewCard() {
  const { mistakes } = useMistakeLog();
  const [inSession, setInSession] = useState(false);

  if (mistakes.length === 0) return null;

  const count = mistakes.length;
  const bySource = mistakes.reduce((acc, m) => {
    const key = m.source || "other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const skrivaCount = mistakes.filter(m => PRODUCTION_SOURCES.has(m.source)).length;
  const otherCount = count - skrivaCount;
  const onlySkriva = skrivaCount > 0 && otherCount === 0;

  const labelMap = {
    lesson_quiz: "Lessons",
    civic_quiz: "Civic",
    lesson_blank: "Blanks",
    gym_cloze: "Gym",
    gym_produce: "Skriva",
    grammar: "Grammar",
    writing: "Writing",
  };

  if (inSession) {
    return <MistakesReviewSession onExit={() => setInSession(false)} />;
  }

  return (
    <Card className="border-2 border-rose-300 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-950/30 dark:to-amber-950/20">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-500/15 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight">
              Repetera dina misstag
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {count} fråg{count === 1 ? "a" : "or"} att öva igen ·{" "}
              <span className="italic">Review {count} mistake{count === 1 ? "" : "s"}</span>
            </p>
          </div>
        </div>

        {/* Source breakdown */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {Object.entries(bySource).map(([src, n]) => (
            <span key={src} className="text-xs px-2 py-0.5 rounded-full bg-white/70 dark:bg-black/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
              {labelMap[src] || src}: {n}
            </span>
          ))}
        </div>

        {onlySkriva ? (
          <Button
            asChild
            className="w-full mt-4 gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
          >
            <Link to="/speaking">
              <PenSquare className="w-4 h-4" /> Öva på Skriva
            </Link>
          </Button>
        ) : (
          <div className="mt-4 space-y-2">
            <Button
              onClick={() => setInSession(true)}
              className="w-full gap-2 bg-rose-600 hover:bg-rose-700 text-white"
            >
              Start review ({otherCount}) <ChevronRight className="w-4 h-4" />
            </Button>
            {skrivaCount > 0 && (
              <Button
                asChild
                variant="outline"
                className="w-full gap-2 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
              >
                <Link to="/speaking">
                  <PenSquare className="w-4 h-4" /> + {skrivaCount} Skriva-misstag
                </Link>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}