import { Link } from "react-router-dom";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { SFI_COURSES } from "@/lib/course-constants";

export default function MockTestHub() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 pb-24 space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold flex items-center gap-3"><ClipboardCheck className="w-8 h-8 text-primary" /> Provtest SFI</h1>
        <p className="text-muted-foreground mt-2">Testa dig själv inför SFI-provet.</p>
        <p className="text-sm italic text-muted-foreground">Practice all four parts of the national test: reading, listening, writing and speaking. (Kurs A has no national test.)</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {SFI_COURSES.filter((c) => c.id !== "A").map((c) => (
          <Link key={c.id} to={`/mock-test/${c.id}`} className={`rounded-2xl border-2 ${c.border} ${c.bg} p-6 hover:scale-[1.02] transition-transform`}>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${c.badge}`}>Kurs {c.id}</span>
            <h2 className="text-xl font-bold">{c.name}</h2>
            <p className="text-sm text-muted-foreground mb-4">{c.subtitle}</p>
            <span className="text-sm font-semibold text-primary flex items-center gap-1">Starta provtest <ArrowRight className="w-4 h-4" /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}