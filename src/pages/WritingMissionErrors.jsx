import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useErrorLog, summarizeErrors } from "@/hooks/useErrorLog";
import { errorMeta } from "@/lib/writingPractice";
import ErrorDrill from "@/components/writing-missions/ErrorDrill";

export default function WritingMissionErrors() {
  const { isAuthenticated } = useAuth();
  const { errors, loading } = useErrorLog(isAuthenticated);
  const [openType, setOpenType] = useState(null);

  const groups = summarizeErrors(errors).slice(0, 5);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-5">
      <Link
        to="/writing-missions"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Skrivuppdrag
      </Link>

      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold">Mina vanligaste fel</h1>
        <p className="text-sm text-muted-foreground">
          Dina egna meningar, rättade.{" "}
          <span className="italic">Your five most frequent error types, with real examples from your writing.</span>
        </p>
      </div>

      {!isAuthenticated && (
        <div className="rounded-2xl border border-border/60 bg-card p-6 text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Logga in för att se dina fel och öva på dem.
          </p>
          <Button onClick={() => base44.auth.redirectToLogin(window.location.pathname)} className="gap-2">
            <LogIn className="w-4 h-4" /> Logga in
          </Button>
        </div>
      )}

      {isAuthenticated && loading && (
        <p className="text-center text-xs text-muted-foreground">Laddar…</p>
      )}

      {isAuthenticated && !loading && groups.length === 0 && (
        <div className="rounded-2xl border border-border/60 bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Inga fel loggade än. Lämna in en text i ett uppdrag så samlar vi dina fel här.
          </p>
        </div>
      )}

      {groups.map((group) => {
        const meta = errorMeta(group.type);
        const open = openType === group.type;
        return (
          <div key={group.type} className="rounded-2xl border border-border/60 bg-card p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{meta.label}</p>
                <p className="text-[11px] italic text-muted-foreground">{meta.en}</p>
              </div>
              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium">
                {group.total} gånger
              </span>
            </div>

            <div className="space-y-1.5">
              {group.rows.slice(0, 2).map((row) => (
                <div key={row.id} className="rounded-xl bg-muted/40 p-2.5 space-y-0.5">
                  <p className="text-sm">
                    <span className="text-red-600 line-through">{row.wrong_text}</span>
                    <span className="mx-1.5 text-muted-foreground">→</span>
                    <span className="font-medium text-emerald-700 dark:text-emerald-400">{row.correct_text}</span>
                  </p>
                  {row.rule && <p className="text-[11px] text-muted-foreground">{row.rule}</p>}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setOpenType(open ? null : group.type)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
            >
              {open ? "Dölj övningen" : "Öva det här"}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && <ErrorDrill rows={group.rows} />}
          </div>
        );
      })}
    </div>
  );
}