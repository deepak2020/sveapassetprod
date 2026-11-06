import { Link } from "react-router-dom";
import { Clock, FileText } from "lucide-react";
import { typeMeta } from "@/lib/writingPractice";

// One writing task in the list.
export default function PromptCard({ prompt }) {
  const meta = typeMeta(prompt.type);

  return (
    <Link
      to={`/writing-practice/${prompt.id}`}
      className="block rounded-xl border border-border/60 bg-card p-4 hover:border-amber-400 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="font-semibold text-sm leading-tight">{prompt.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{prompt.instructions}</p>
        </div>
        <span className={`text-[10px] font-semibold px-2 py-1 rounded-full border shrink-0 ${meta.tone}`}>
          {meta.label}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-2.5 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3" /> {prompt.min_words}–{prompt.max_words} ord
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {prompt.time_limit_minutes} min
        </span>
        {prompt.topic && <span className="truncate">· {prompt.topic}</span>}
      </div>
    </Link>
  );
}