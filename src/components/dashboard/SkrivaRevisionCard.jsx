import { Link } from "react-router-dom";
import { RotateCcw, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSkrivaRevision } from "@/hooks/useSkrivaRevision";

// Dashboard nudge: shows up only when the user has Skriva mistakes to redo.
// Tapping the card sends them to the Skriva page, where the existing
// "Repetera dina misstag" card starts the revision session.
export default function SkrivaRevisionCard() {
  const { items } = useSkrivaRevision();
  if (!items.length) return null;

  const count = items.length;

  return (
    <Link to="/speaking" className="block group">
      <Card className="border-2 border-rose-300 dark:border-rose-800 bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-950/30 dark:to-amber-950/20 hover:shadow-md transition-shadow">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-500/15 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight">
              Repetera dina Skriva-misstag
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {count} mening{count === 1 ? "" : "ar"} att öva igen ·{" "}
              <span className="italic">
                Revise {count} sentence{count === 1 ? "" : "s"} you got wrong
              </span>
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 shrink-0 transition-colors" />
        </CardContent>
      </Card>
    </Link>
  );
}