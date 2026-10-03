import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function CivicQuestionPreview({ q }) {
  const [picked, setPicked] = useState(null);
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-3">
      <p className="font-semibold">{q.question_sv}</p>
      {q.question_en && <p className="text-xs italic text-muted-foreground">{q.question_en}</p>}
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          const done = picked !== null;
          const right = i === q.correct_index;
          return (
            <button key={i} disabled={done} onClick={() => setPicked(i)}
              className={`w-full text-left px-4 py-2.5 rounded-xl border-2 text-sm flex justify-between items-center ${
                done ? right ? "border-green-400 bg-green-50 dark:bg-green-950/30" : picked === i ? "border-red-400 bg-red-50 dark:bg-red-950/30" : "border-border opacity-50"
                : "border-border hover:border-primary"}`}>
              {opt}
              {done && right && <CheckCircle2 className="w-4 h-4 text-green-600" />}
              {done && picked === i && !right && <XCircle className="w-4 h-4 text-red-600" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}