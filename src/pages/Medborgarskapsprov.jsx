import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ArrowRight, CalendarDays, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PageSEO from "@/components/shared/PageSEO";
import CivicQuestionPreview from "@/components/civic/CivicQuestionPreview";

export default function Medborgarskapsprov() {
  const { data: topics = [], isLoading } = useQuery({
    queryKey: ["civic-topics-landing"],
    queryFn: () => base44.entities.CivicTopic.list("order", 200),
  });

  const chapters = [...new Set(topics.map((t) => t.chapter).filter(Boolean))];
  const questions = topics.flatMap((t) => t.quiz_questions || []).filter((q) => q.options?.length).slice(0, 5);

  const cta = (
    <Button asChild size="lg" className="gap-2">
      <Link to="/civic">Börja öva gratis · Start practicing free <ArrowRight className="w-4 h-4" /></Link>
    </Button>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 pb-24 space-y-10">
      <PageSEO
        title="Swedish Citizenship Test 2027 (Medborgarskapsprov) - Free Practice"
        description="Prepare for Sweden's 2027 citizenship test (medborgarskapsprov). Learn the civic topics and practice real quiz questions free on Sveapasset."
        canonical="https://sveapasset.se/medborgarskapsprov"
      />

      <header className="space-y-4">
        <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-secondary-foreground"><Landmark className="w-3.5 h-3.5" /> Medborgarskapsprov 2027</span>
        <h1 className="font-display text-4xl font-bold">Swedish Citizenship Test 2027</h1>
        <p className="text-lg text-muted-foreground">From 2027, most applicants for Swedish citizenship must pass a civics test (samhällskunskapsprov) and show Swedish language skills. Sveapasset helps you prepare for both, for free.</p>
        {cta}
      </header>

      <section className="rounded-2xl border border-border/50 bg-card p-6 space-y-3">
        <h2 className="text-xl font-bold flex items-center gap-2"><CalendarDays className="w-5 h-5 text-primary" /> What is the requirement?</h2>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-muted-foreground">
          <li>A knowledge test about Swedish society: democracy, rights and duties, history and culture.</li>
          <li>A Swedish language requirement, roughly at SFI course D level.</li>
          <li>The tests are planned to apply to citizenship applications from 2027. Check Migrationsverket for the latest details.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">Topics the test covers</h2>
        {isLoading ? <Skeleton className="h-16 rounded-xl" /> : (
          <div className="flex flex-wrap gap-2">
            {chapters.map((c) => <span key={c} className="px-3 py-1.5 rounded-lg bg-muted text-sm font-medium">{c}</span>)}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Try sample questions</h2>
        {isLoading ? <Skeleton className="h-40 rounded-2xl" /> : questions.map((q, i) => <CivicQuestionPreview key={i} q={q} />)}
      </section>

      <div className="text-center rounded-2xl bg-primary/5 border border-primary/20 p-8 space-y-3">
        <h2 className="text-2xl font-bold">Ready to pass?</h2>
        <p className="text-muted-foreground">100+ civic guides and quizzes based on Sverige i Fokus.</p>
        {cta}
      </div>
    </div>
  );
}