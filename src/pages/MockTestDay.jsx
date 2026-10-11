import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, ExternalLink, ListChecks } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { LEVEL_INFO } from "@/lib/nationalTest";
import { DAY_BLOCKS, PART_META, gradeFromPercent, todayKey } from "@/lib/provdag";
import ReadingPart from "@/components/mocktest/ReadingPart";
import WritingPart from "@/components/mocktest/WritingPart";
import SpeakingPart from "@/components/mocktest/SpeakingPart";
import ProvDaySummary from "@/components/mocktest/ProvDaySummary";

// One part of the national test, opened inside the day plan. Each finished
// part reports its result back so the day gets graded as you go.
function PartRunner({ course, part, onDone }) {
  if (part === "reading") {
    return <ReadingPart course={course} round={0} onComplete={(score, total) => onDone({ part: "reading", score, total, percent: Math.round((score / total) * 100) })} />;
  }
  if (part === "writing") {
    return <WritingPart course={course} round={0} onResult={(res) => onDone({ part: "writing", grade: res.grade, summary: res.summary, strengths: res.strengths, improvements: res.improvements })} />;
  }
  if (part === "speaking") {
    return <SpeakingPart course={course} onResult={(res) => onDone({ part: "speaking", grade: res.grade, summary: res.summary, strengths: res.strengths, improvements: res.improvements })} />;
  }
  return null;
}

export default function MockTestDay() {
  const { course } = useParams();
  const day = todayKey();
  const queryClient = useQueryClient();
  const [activePart, setActivePart] = useState(null);

  const { data: attempts = [] } = useQuery({
    queryKey: ["np-day-attempts", course, day],
    queryFn: async () => {
      const res = await base44.entities.MockTestAttempt.filter({ course, day });
      return Array.isArray(res) ? res : res?.items || [];
    },
  });

  // Listening runs on its own page, so its result is picked up from today's
  // saved quiz result instead of being reported inline.
  const { data: listening } = useQuery({
    queryKey: ["np-day-listening", course, day],
    queryFn: async () => {
      const res = await base44.entities.QuizResult.filter({ sfi_course: course });
      const list = Array.isArray(res) ? res : res?.items || [];
      return list.find((r) => (r.source_id || "").startsWith("listening-") && new Date(r.created_date).toLocaleDateString("sv-SE") === day) || null;
    },
  });

  if (!LEVEL_INFO[course]) return <div className="p-10 text-center">Det finns inget nationellt prov för denna kurs.</div>;

  const results = DAY_BLOCKS.map(({ part }) => {
    if (part === "listening") {
      return listening
        ? { part, score: listening.score, total: listening.total, percent: listening.percentage }
        : { part };
    }
    const rec = attempts.find((a) => a.part === part);
    return rec
      ? { part, score: rec.score, total: rec.total, percent: rec.percent, grade: rec.grade, summary: rec.summary, strengths: rec.strengths, improvements: rec.improvements }
      : { part };
  });

  const doneCount = results.filter((r) => r.percent != null || r.grade).length;

  // A finished part is graded right away — refresh the plan when the user
  // comes back so the block and the summary are never stale.
  const backToPlan = () => {
    setActivePart(null);
    queryClient.invalidateQueries({ queryKey: ["np-day-attempts", course, day] });
    queryClient.invalidateQueries({ queryKey: ["np-day-listening", course, day] });
  };

  const saveAttempt = async (data) => {
    await base44.entities.MockTestAttempt.create({ course, day, ...data });
    await queryClient.invalidateQueries({ queryKey: ["np-day-attempts", course, day] });
  };

  if (activePart) {
    const block = DAY_BLOCKS.find((b) => b.part === activePart);
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 space-y-5">
        <button onClick={backToPlan} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Till tidsplanen
        </button>
        <div>
          <h1 className="text-2xl font-bold">{PART_META[activePart].sv}</h1>
          <p className="text-sm italic text-muted-foreground">{block.label} · ca {block.minutes} min · {PART_META[activePart].en}</p>
        </div>
        <PartRunner course={course} part={activePart} onDone={saveAttempt} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 space-y-6">
      <Link to={`/mock-test/${course}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Provtest Kurs {course}
      </Link>

      <div>
        <h1 className="text-2xl font-bold">Provdag — Kurs {course}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Dela upp provet på fyra block över dagen. Varje del rättas direkt, och det du är svag på blir nya övningar.
        </p>
        <p className="text-xs italic text-muted-foreground">Four blocks in one day · graded as you go · CEFR {LEVEL_INFO[course].cefr}</p>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{doneCount} av {DAY_BLOCKS.length} delar klara</span>
          <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> ca 2 h 15 min totalt</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${(doneCount / DAY_BLOCKS.length) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        {DAY_BLOCKS.map((block) => {
          const r = results.find((x) => x.part === block.part);
          const done = r.percent != null || r.grade;
          const meta = PART_META[block.part];
          return (
            <div key={block.part} className={`rounded-2xl border p-5 ${done ? "border-chart-3/50 bg-chart-3/5" : "border-border/50 bg-card"}`}>
              <div className="flex items-start gap-3">
                <div className="w-16 shrink-0">
                  <p className="font-bold tabular-nums">{block.time}</p>
                  <p className="text-[11px] text-muted-foreground">{block.label}</p>
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-semibold flex items-center gap-2">
                    {meta.sv}
                    {done && <CheckCircle2 className="w-4 h-4 text-chart-3" />}
                  </p>
                  <p className="text-sm text-muted-foreground">{block.tip}</p>
                  <p className="text-xs text-muted-foreground">
                    ca {block.minutes} min · {meta.en}
                    {done && r.percent != null && ` · ${r.percent}%`}
                    {done && r.grade && ` · betyg ${r.grade}`}
                  </p>
                </div>
                <div className="shrink-0">
                  {block.part === "listening" ? (
                    <Button asChild size="sm" variant={done ? "outline" : "default"} className="gap-1">
                      <Link to={`/listening/${course.toLowerCase()}`}>
                        {done ? "Gör om" : "Starta"} <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  ) : (
                    <Button size="sm" variant={done ? "outline" : "default"} onClick={() => setActivePart(block.part)}>
                      {done ? "Gör om" : "Starta"}
                    </Button>
                  )}
                </div>
              </div>
              {block.part === "listening" && !done && (
                <p className="text-xs text-muted-foreground mt-3">Resultatet hämtas automatiskt när du är klar.</p>
              )}
            </div>
          );
        })}
      </div>

      {doneCount < DAY_BLOCKS.length && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <ListChecks className="w-3.5 h-3.5" /> Gör klart alla fyra delar för att få hela dagen rättad.
        </p>
      )}

      <ProvDaySummary course={course} results={results} />

      <Button asChild variant="outline" className="gap-2">
        <Link to="/gym">Öva i Gymmet <ArrowRight className="w-4 h-4" /></Link>
      </Button>
    </div>
  );
}