import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass, Mic, PenSquare, Timer } from "lucide-react";
import { SFI3C_TOPICS, TOPIC_CATEGORIES } from "@/data/sfi3cTopics";
import { usePracticeAttempts } from "@/hooks/usePracticeAttempts";
import PracticeTopicCard from "@/components/practice/PracticeTopicCard";

const SKILLS = [
  { id: "writing", label: "Skriv", en: "Writing", icon: PenSquare },
  { id: "speaking", label: "Tala", en: "Speaking", icon: Mic },
];

const MODES = [
  { id: "guided", label: "Guidad", en: "Förbered dig först", icon: Compass },
  { id: "exam", label: "Provläge", en: "Tid, inga hjälpmedel", icon: Timer },
];

const GRADE_ORDER = ["A", "B", "C", "D", "E", "F"];

const GRADE_TONE = {
  A: "bg-emerald-500",
  B: "bg-emerald-600",
  C: "bg-emerald-700",
  D: "bg-amber-500",
  E: "bg-amber-600",
  F: "bg-red-500",
};

export default function Practice3C() {
  const [skill, setSkill] = useState("writing");
  const [mode, setMode] = useState("guided");
  const { attempts, loading } = usePracticeAttempts();

  // Best grade per topic for the chosen skill, so learners see their progress.
  const best = useMemo(() => {
    const map = {};
    attempts.forEach((attempt) => {
      if (!GRADE_ORDER.includes(attempt.grade)) return;
      const key = `${attempt.topic_id}:${attempt.skill}`;
      const current = map[key];
      if (!current || GRADE_ORDER.indexOf(attempt.grade) < GRADE_ORDER.indexOf(current)) {
        map[key] = attempt.grade;
      }
    });
    return map;
  }, [attempts]);

  const doneCount = Object.keys(best).filter((key) => key.endsWith(`:${skill}`)).length;
  const recent = attempts.filter((a) => a.skill === skill).slice(0, 4);
  const skillLabel = skill === "speaking" ? "Tala" : "Skriv";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-6">
      <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Översikt
      </Link>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">
          Skriv & tala · <span className="font-display italic font-normal text-muted-foreground">SFI 3C</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          {SFI3C_TOPICS.length} ämnen med ord, verb och fraser — öva på riktiga uppgifter och få bedömning direkt.
        </p>
      </div>

      {/* Skill */}
      <div className="grid grid-cols-2 gap-2">
        {SKILLS.map(({ id, label, en, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSkill(id)}
            className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-left transition-all ${
              skill === id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${skill === id ? "text-primary" : "text-muted-foreground"}`} />
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{label}</span>
              <span className="block text-[11px] italic text-muted-foreground">{en}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Mode */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Läge</p>
        <div className="grid grid-cols-2 gap-2">
          {MODES.map(({ id, label, en, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setMode(id)}
              className={`flex items-center gap-2 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                mode === id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${mode === id ? "text-primary" : "text-muted-foreground"}`} />
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-[11px] italic text-muted-foreground">{en}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-xl border border-border/50 bg-card px-4 py-3 space-y-2">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-semibold">{skillLabel}: din progress</span>
          <span className="text-muted-foreground">
            {doneCount} av {SFI3C_TOPICS.length} ämnen bedömda
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.round((doneCount / SFI3C_TOPICS.length) * 100)}%` }}
          />
        </div>
      </div>

      {/* Topics by category */}
      <div className="space-y-5">
        {TOPIC_CATEGORIES.filter((category) => SFI3C_TOPICS.some((t) => t.category === category)).map((category) => (
          <div key={category} className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{category}</h2>
            <div className="space-y-2">
              {SFI3C_TOPICS.filter((topic) => topic.category === category).map((topic) => (
                <PracticeTopicCard
                  key={topic.id}
                  topic={topic}
                  skill={skill}
                  mode={mode}
                  bestGrade={best[`${topic.id}:${skill}`]}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent attempts — revisit earlier feedback */}
      {recent.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Senaste försök · {skillLabel}</h2>
          <div className="space-y-2">
            {recent.map((attempt) => (
              <div key={attempt.id} className="rounded-xl border border-border/50 bg-card p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full text-[11px] font-bold text-white flex items-center justify-center shrink-0 ${
                      GRADE_TONE[attempt.grade] || "bg-primary"
                    }`}
                  >
                    {attempt.grade}
                  </span>
                  <p className="text-sm font-medium truncate">{attempt.topic_title}</p>
                  <span className="ml-auto text-[11px] text-muted-foreground shrink-0">
                    {attempt.mode === "exam" ? "Provläge" : "Guidad"}
                  </span>
                </div>
                {attempt.summary && <p className="text-xs text-muted-foreground line-clamp-2">{attempt.summary}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <p className="text-center text-xs text-muted-foreground">Laddar dina tidigare försök…</p>}
    </div>
  );
}