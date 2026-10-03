import { Link } from "react-router-dom";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SPEAKING_TASKS } from "@/lib/nationalTest";

export default function SpeakingPart({ course }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Det muntliga provet görs med en lärare. Öva genom att prata högt om varje uppgift i 2–3 minuter.</p>
      {SPEAKING_TASKS[course].map((t, i) => (
        <div key={t} className="rounded-2xl border border-border/50 bg-card p-5">
          <p className="text-xs font-semibold text-muted-foreground mb-1">Uppgift {i + 1}</p>
          <p className="font-medium">{t}</p>
        </div>
      ))}
      <Button asChild className="gap-2"><Link to="/tala"><Mic /> Öva tal med Svea</Link></Button>
    </div>
  );
}