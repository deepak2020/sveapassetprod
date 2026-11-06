import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronDown, PenLine, Trash2, TrendingUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useWritingSubmissions } from "@/hooks/useWritingSubmissions";
import { GRADE_TONE, PROMPT_TYPES } from "@/lib/writingPractice";
import PromptCard from "@/components/writing/PromptCard";
import WritingProgress from "@/components/writing/WritingProgress";
import WritingFeedbackView from "@/components/writing/WritingFeedbackView";

export default function WritingPractice() {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState("all");
  const [openId, setOpenId] = useState(null);
  const { submissions, loading, remove } = useWritingSubmissions(isAuthenticated);

  const { data: prompts = [] } = useQuery({
    queryKey: ["writing-prompts"],
    queryFn: async () => {
      const page = await base44.entities.WritingPrompt.filter({}, { sort: "order", limit: 100 });
      return page.items || [];
    },
  });

  const visible = filter === "all" ? prompts : prompts.filter((p) => p.type === filter);

  const handleDelete = async (id) => {
    if (!window.confirm("Ta bort texten? Det går inte att ångra.")) return;
    await remove(id);
    if (openId === id) setOpenId(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-5">
      <Link to="/speaking" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Skriva
      </Link>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
          <PenLine className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold">
            Skrivträning · <span className="font-display italic font-normal text-muted-foreground">SFI C</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            {prompts.length} uppgifter: mejl och åsiktstexter. Skicka till Svea och få rättning direkt.
          </p>
          <p className="text-[11px] italic text-muted-foreground/80">Writing practice with AI feedback</p>
        </div>
      </div>

      <Link
        to="/writing-practice/errors"
        className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 hover:border-amber-400 transition-colors"
      >
        <TrendingUp className="w-4 h-4 text-rose-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Mina vanligaste fel</p>
          <p className="text-[11px] text-muted-foreground">Se mönstren i dina texter och öva på dem</p>
        </div>
        <span className="text-[11px] text-muted-foreground shrink-0">Visa</span>
      </Link>

      {isAuthenticated && submissions.length > 0 && <WritingProgress submissions={submissions} />}

      {/* Type filter */}
      <div className="flex gap-2 overflow-x-auto no-select pb-1">
        <button
          onClick={() => setFilter("all")}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
            filter === "all" ? "border-amber-500 bg-amber-500 text-white" : "border-border text-muted-foreground hover:border-amber-400"
          }`}
        >
          Alla
        </button>
        {PROMPT_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === t.id ? "border-amber-500 bg-amber-500 text-white" : "border-border text-muted-foreground hover:border-amber-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visible.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
        {!visible.length && (
          <p className="text-sm text-muted-foreground text-center py-6">Inga uppgifter i den här kategorin.</p>
        )}
      </div>

      {isAuthenticated && submissions.length > 0 && (
        <div className="space-y-2 pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Mina texter · <span className="italic normal-case">My texts</span>
          </h2>
          {submissions.slice(0, 10).map((s) => (
            <div key={s.id} className="rounded-xl border border-border/60 bg-card p-3">
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-full text-[11px] font-bold text-white flex items-center justify-center shrink-0 ${
                    GRADE_TONE[s.estimated_grade] || "bg-primary"
                  }`}
                >
                  {s.estimated_grade || "–"}
                </span>
                <p className="text-sm font-medium truncate flex-1">{s.prompt_title}</p>
                <span className="text-[11px] text-muted-foreground shrink-0">
                  {new Date(s.created_date).toLocaleDateString("sv-SE")}
                </span>
                <button
                  onClick={() => handleDelete(s.id)}
                  aria-label="Ta bort texten"
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1.5">
                <p className="text-[11px] text-muted-foreground">
                  {s.word_count} ord · {s.errors_per_100 ?? 0} fel/100 ord
                  {s.rewrite_of && " · omskriven"}
                </p>
                <button
                  onClick={() => setOpenId(openId === s.id ? null : s.id)}
                  className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300"
                >
                  Feedback
                  <ChevronDown className={`w-3 h-3 transition-transform ${openId === s.id ? "rotate-180" : ""}`} />
                </button>
              </div>
              {openId === s.id && s.feedback_json && (
                <div className="mt-3">
                  <WritingFeedbackView feedback={s.feedback_json} originalText={s.text} xpEarned={0} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {loading && <p className="text-center text-xs text-muted-foreground">Laddar dina texter…</p>}
    </div>
  );
}