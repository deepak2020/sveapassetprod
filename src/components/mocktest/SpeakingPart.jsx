import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { SPEAKING_TASKS } from "@/lib/nationalTest";
import SpeakingSession from "./SpeakingSession";

export default function SpeakingPart({ course }) {
  const [task, setTask] = useState(null);
  if (task) return <SpeakingSession course={course} task={task} onBack={() => setTask(null)} />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Välj en uppgift och prata så länge du vill (gärna 2–3 minuter). Skicka sedan in för bedömning.</p>
      {SPEAKING_TASKS[course].map((t, i) => (
        <button key={t} onClick={() => setTask(t)} className="w-full text-left rounded-2xl border border-border/50 bg-card p-5 hover:border-primary transition-colors flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs font-semibold text-muted-foreground mb-1">Uppgift {i + 1}</p>
            <p className="font-medium">{t}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      ))}
    </div>
  );
}