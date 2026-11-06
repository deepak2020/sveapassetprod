import { Link } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";

// Entry point at the top of the Skriva page.
export default function WritingMissionsCard() {
  return (
    <Link
      to="/writing-missions"
      className="block rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-5 transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0 shadow-sm">
          <Layers className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold leading-tight">Skrivuppdrag</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Lär dig orden först, bygg meningar och skriv en hel text — sju steg med bedömning.
          </p>
          <p className="text-[11px] italic text-muted-foreground/80 mt-0.5">
            Writing missions: words, sentences, paragraph, full text
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-1" />
      </div>
    </Link>
  );
}