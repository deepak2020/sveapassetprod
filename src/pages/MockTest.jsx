import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ClipboardCheck, RotateCcw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import QuizRunner from "@/components/shared/QuizRunner";
import { SFI_COURSES } from "@/lib/course-constants";
import { shuffle } from "lodash";

const TEST_SIZE = 20;

export default function MockTest() {
  const { course } = useParams();
  const courseData = SFI_COURSES.find((c) => c.id === course);
  const [round, setRound] = useState(0);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["mock-test", course, round],
    enabled: !!courseData,
    queryFn: async () => {
      const lessons = await base44.entities.Lesson.filter({ sfi_course: course }, "order", 500);
      const pool = lessons.flatMap((l) => l.quiz_questions || [])
        .filter((q) => q.options?.length >= 2 && q.correct_index >= 0 && q.correct_index < q.options.length);
      return shuffle(pool).slice(0, TEST_SIZE);
    },
  });

  if (!courseData) return <div className="p-10 text-center">Kursen hittades inte.</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 space-y-6">
      <Link to="/mock-test" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Alla provtest
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><ClipboardCheck className="w-6 h-6 text-primary" /> Provtest {courseData.name}</h1>
          <p className="text-sm italic text-muted-foreground">Mock test · {TEST_SIZE} random questions from the whole course</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setRound((r) => r + 1)} className="gap-1"><RotateCcw /> Nytt test</Button>
      </div>
      {isLoading ? <Skeleton className="h-72 rounded-2xl" /> : questions?.length ? (
        <QuizRunner key={round} questions={questions} quizType="language" sourceId={`mock-${course}`} sourceTitle={`Provtest Kurs ${course}`} />
      ) : <p className="text-muted-foreground">Inga frågor ännu för denna kurs.</p>}
    </div>
  );
}