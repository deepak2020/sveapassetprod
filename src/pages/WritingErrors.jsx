import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useErrorLog, summarizeErrors } from "@/hooks/useErrorLog";
import { errorMeta } from "@/lib/writingPractice";
import ErrorsDrill from "@/components/writing/ErrorsDrill";
import LoginGate from "@/components/shared/LoginGate";

export default function WritingErrors() {
  const { isAuthenticated } = useAuth();
  const { errors, loading } = useErrorLog(isAuthenticated);
  const [openType, setOpenType] = useState(null);

  const top = summarizeErrors(errors).slice(0, 5);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-5">
      <Link
        to="/writing-practice"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Skrivträning
      </Link>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5 text-rose-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Mina vanligaste fel</h1>
          <p className="text-sm text-muted-foreground">
            Dina fem vanligaste feltyper, med exempel ur dina egna texter.
          </p>
          <p className="text-[11px] italic text-muted-foreground/80">Your most common errors</p>
        </div>
      </div>

      <LoginGate message="Logga in för att se dina fel">
        {loading ? (
          <p className="text-center text-xs text-muted-foreground py-8">Laddar…</p>
        ) : !top.length ? (
          <div className="rounded-xl border border-border/60 bg-card p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Inga fel loggade ännu. Skicka en text till Svea så börjar vi samla dina mönster.
            </p>
            <Link to="/writing-practice" className="text-sm font-semibold text-amber-700 dark:text-amber-300 hover:underline">
              Välj en uppgift
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {top.map((group) => {
              const meta = errorMeta(group.type);
              const examples = group.rows.slice(0, 2);
              return (
                <div key={group.type} className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{meta.label}</p>
                      <p className="text-[11px] italic text-muted-foreground">{meta.en}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-[11px] font-bold px-2.5 py-1">
                      {group.total} gånger
                    </span>
                  </div>

                  <ul className="space-y-1.5">
                    {examples.map((row) => (
                      <li key={row.id} className="text-xs">
                        <span className="line-through text-red-600 dark:text-red-400">{row.wrong_text}</span>
                        <span className="mx-1.5 text-muted-foreground">→</span>
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400">{row.correct_text}</span>
                        {row.rule && <p className="text-[11px] text-muted-foreground mt-0.5">{row.rule}</p>}
                      </li>
                    ))}
                  </ul>

                  {openType === group.type ? (
                    <ErrorsDrill rows={group.rows} onClose={() => setOpenType(null)} />
                  ) : (
                    <button
                      onClick={() => setOpenType(group.type)}
                      className="text-xs font-semibold text-amber-700 dark:text-amber-300 hover:underline"
                    >
                      Öva det här
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </LoginGate>
    </div>
  );
}