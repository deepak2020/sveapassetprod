import { Link } from "react-router-dom";
import { ArrowRight, Mic, PenSquare } from "lucide-react";
import { SFI3C_TOPICS } from "@/data/sfi3cTopics";

export default function Practice3CCard() {
  return (
    <Link
      to="/3c"
      className="group block rounded-2xl border border-border/50 bg-gradient-to-r from-primary/5 via-card to-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <PenSquare className="w-5 h-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm">Skriv & tala · SFI 3C</p>
          <p className="text-xs text-muted-foreground">
            {SFI3C_TOPICS.length} ämnen med ord, verb och fraser — bedömning direkt
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5" />
      </div>
      <div className="flex items-center gap-3 mt-2 pl-12 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <PenSquare className="w-3 h-3" /> Skrivuppgifter
        </span>
        <span className="inline-flex items-center gap-1">
          <Mic className="w-3 h-3" /> Taluppdrag
        </span>
      </div>
    </Link>
  );
}