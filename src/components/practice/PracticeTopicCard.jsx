import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, Mic, PenSquare } from "lucide-react";

const GRADE_TONE = {
  A: "bg-emerald-500",
  B: "bg-emerald-600",
  C: "bg-emerald-700",
  D: "bg-amber-500",
  E: "bg-amber-600",
  F: "bg-red-500",
};

export default function PracticeTopicCard({ topic, skill, mode, bestGrade }) {
  const task = topic[skill];
  const Icon = skill === "speaking" ? Mic : PenSquare;

  return (
    <Link
      to={`/3c/${topic.id}?skill=${skill}&mode=${mode}`}
      className="group flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-all hover:border-primary/60 hover:shadow-sm"
    >
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-snug">{topic.title}</h3>
          {bestGrade && (
            <span
              className={`shrink-0 w-6 h-6 rounded-full text-[11px] font-bold text-white flex items-center justify-center ${
                GRADE_TONE[bestGrade] || "bg-primary"
              }`}
            >
              {bestGrade}
            </span>
          )}
        </div>
        <p className="text-xs italic text-muted-foreground">{topic.titleEn}</p>
        <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> {topic.vocab.length} ord · {topic.verbs.length} verb
          </span>
          <span>·</span>
          <span>{skill === "speaking" ? `${task.minutes} min tal` : `min ${task.minWords} ord`}</span>
        </p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}