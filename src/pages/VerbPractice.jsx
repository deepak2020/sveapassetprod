import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Layers, ListChecks, Loader2, PenSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { usePageView } from "@/hooks/usePageView";
import { useVerbProgress } from "@/hooks/useVerbProgress";
import { FORM_OVERVIEW, VERB_GROUPS, groupProgress, verbsInGroup, weakVerbs } from "@/lib/verbs";
import VerbGroupTabs from "@/components/verbs/VerbGroupTabs";
import VerbTable from "@/components/verbs/VerbTable";
import VerbFlashcards from "@/components/verbs/VerbFlashcards";
import VerbQuiz from "@/components/verbs/VerbQuiz";
import VerbFormsQuiz from "@/components/verbs/VerbFormsQuiz";
import WeakVerbCard from "@/components/verbs/WeakVerbCard";
import SveaVerbTest from "@/components/verbs/SveaVerbTest";

const MODES = [
  { id: "flashcards", label: "Flashcards", en: "Flip the cards", Icon: Layers },
  { id: "quiz", label: "Quiz", en: "Type the form", Icon: ListChecks },
  { id: "forms", label: "Alla former", en: "Write all three forms", Icon: PenSquare },
  { id: "test", label: "Svea-test", en: "15 questions", Icon: Sparkles },
];

export default function VerbPractice() {
  usePageView("verb_practice");
  const { isAuthenticated, navigateToLogin } = useAuth();
  const { progress, record } = useVerbProgress();
  const [group, setGroup] = useState("all");
  const [mode, setMode] = useState(null);

  const { data: verbs = [], isLoading } = useQuery({
    queryKey: ["verbs"],
    queryFn: () => base44.entities.Verb.list("infinitive", 500),
  });

  const selectedGroup = VERB_GROUPS.find((g) => g.id === group) || VERB_GROUPS[0];
  const groupVerbs = useMemo(() => verbsInGroup(verbs, group), [verbs, group]);
  const { mastered, total } = groupProgress(groupVerbs, progress);
  const pct = total ? Math.round((mastered / total) * 100) : 0;
  const groupLabel = `${selectedGroup.label}${selectedGroup.hint ? ` (${selectedGroup.hint})` : ""}`;
  const weakItems = useMemo(() => weakVerbs(verbs, progress), [verbs, progress]);

  const modeView = {
    flashcards: <VerbFlashcards key={`fc-${group}`} verbs={groupVerbs} groupLabel={groupLabel} onRecord={record} onExit={() => setMode(null)} />,
    quiz: <VerbQuiz key={`qz-${group}`} verbs={groupVerbs} groupLabel={groupLabel} onRecord={record} onExit={() => setMode(null)} isAuthenticated={isAuthenticated} />,
    forms: <VerbFormsQuiz key={`fm-${group}`} verbs={groupVerbs} groupLabel={groupLabel} onRecord={record} onExit={() => setMode(null)} isAuthenticated={isAuthenticated} />,
    test: <SveaVerbTest key={`st-${group}`} verbs={groupVerbs} groupLabel={groupLabel} onRecord={record} onExit={() => setMode(null)} isAuthenticated={isAuthenticated} />,
    weak: <VerbFormsQuiz key="weak" verbs={weakItems.map((w) => w.verb)} groupLabel="Verb du behöver träna mer" onRecord={record} onExit={() => setMode(null)} isAuthenticated={isAuthenticated} />,
  }[mode];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-10">
      {/* Header — the four forms every learner needs */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <span className="text-xl">🦉</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Verb att kunna – SFI C</h1>
            <p className="text-sm text-muted-foreground">
              Verbens fyra former <span className="italic">· the four verb forms</span>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
          {FORM_OVERVIEW.map((form) => (
            <div key={form.key} className="rounded-xl border border-border/50 bg-card p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{form.sv}</p>
              <p className="text-[11px] italic text-muted-foreground">{form.en}</p>
              <p className="font-semibold mt-1">{form.example}</p>
            </div>
          ))}
        </div>
      </div>

      {mode ? modeView : (
        <div className="space-y-5">
          {/* Group tabs */}
          <VerbGroupTabs active={group} onSelect={setGroup} />

          {/* Progress for the selected group */}
          <div className="rounded-2xl border border-border/50 bg-card p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-sm font-semibold">
                {groupLabel} <span className="font-normal italic text-muted-foreground">· {selectedGroup.en}</span>
              </p>
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap">{mastered}/{total} kunna</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Verbs this learner keeps getting wrong */}
          <WeakVerbCard items={weakItems} onPractice={() => setMode("weak")} />

          {/* The four practice modes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MODES.map(({ id, label, en, Icon }) => (
              <button
                key={id}
                onClick={() => setMode(id)}
                className="rounded-2xl border-2 border-border/50 bg-card p-3 text-center hover:border-primary/40 hover:shadow-sm transition-all"
              >
                <Icon className="w-5 h-5 text-primary mx-auto mb-1.5" />
                <p className="text-sm font-semibold leading-tight">{label}</p>
                <p className="text-[10px] italic text-muted-foreground leading-tight mt-0.5">{en}</p>
              </button>
            ))}
          </div>

          {/* Guests keep their progress in this browser only */}
          {!isAuthenticated && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-semibold">Dina framsteg sparas i den här webbläsaren</p>
                <p className="text-xs text-muted-foreground">
                  Your progress is saved in this browser. Create a free account to keep it on all your devices.
                </p>
              </div>
              <Button size="sm" className="shrink-0" onClick={navigateToLogin}>Skapa gratis konto</Button>
            </div>
          )}

          {/* Reference table */}
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Laddar verb…
            </div>
          ) : (
            <VerbTable verbs={groupVerbs} />
          )}
        </div>
      )}
    </div>
  );
}