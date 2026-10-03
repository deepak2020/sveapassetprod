import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Headphones, PenSquare, Mic, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SFI_COURSES } from "@/lib/course-constants";
import { LEVEL_INFO } from "@/lib/nationalTest";
import ReadingPart from "@/components/mocktest/ReadingPart";
import WritingPart from "@/components/mocktest/WritingPart";
import SpeakingPart from "@/components/mocktest/SpeakingPart";

const PARTS = [
  { id: "reading", sv: "Läsförståelse", en: "Reading", icon: BookOpen },
  { id: "listening", sv: "Hörförståelse", en: "Listening", icon: Headphones },
  { id: "writing", sv: "Skriftlig färdighet", en: "Writing", icon: PenSquare },
  { id: "speaking", sv: "Muntlig färdighet", en: "Speaking", icon: Mic },
];

export default function MockTest() {
  const { course } = useParams();
  const courseData = SFI_COURSES.find((c) => c.id === course);
  const [part, setPart] = useState(null);
  const [round, setRound] = useState(0);

  if (!courseData || !LEVEL_INFO[course]) return <div className="p-10 text-center">Det finns inget nationellt prov för denna kurs.</div>;
  const active = PARTS.find((p) => p.id === part);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 space-y-6">
      {part
        ? <button onClick={() => setPart(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /> Alla delprov</button>
        : <Link to="/mock-test" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /> Alla kurser</Link>}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Nationellt prov Kurs {course}{active ? `: ${active.sv}` : ""}</h1>
          <p className="text-sm italic text-muted-foreground">Mock national test · CEFR {LEVEL_INFO[course].cefr}</p>
        </div>
        {(part === "reading" || part === "writing") && <Button variant="outline" size="sm" onClick={() => setRound((r) => r + 1)} className="gap-1"><RotateCcw /> Nytt</Button>}
      </div>

      {!part && (
        <div className="grid sm:grid-cols-2 gap-3">
          {PARTS.map(({ id, sv, en, icon: Icon }) => {
            const card = <><Icon className="w-5 h-5 text-primary mb-2" /><p className="font-semibold">{sv}</p><p className="text-sm italic text-muted-foreground">{en}</p></>;
            const cls = "rounded-2xl border border-border/50 bg-card p-5 text-left hover:border-primary transition-colors";
            return id === "listening"
              ? <Link key={id} to={`/listening/${course}`} className={cls}>{card}</Link>
              : <button key={id} onClick={() => setPart(id)} className={cls}>{card}</button>;
          })}
        </div>
      )}
      {part === "reading" && <ReadingPart course={course} round={round} />}
      {part === "writing" && <WritingPart key={round} course={course} round={round} />}
      {part === "speaking" && <SpeakingPart course={course} />}
    </div>
  );
}