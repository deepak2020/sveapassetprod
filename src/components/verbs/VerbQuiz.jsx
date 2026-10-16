import { useRef, useState } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { awardXP } from "@/lib/xp";
import { buildSession } from "@/lib/verbs";
import VerbQuestionCard from "./VerbQuestionCard";

const QUIZ_SIZE = 10;
const XP_PER_CORRECT = 2;

export default function VerbQuiz({ verbs, groupLabel, onRecord, onExit, isAuthenticated }) {
  const [questions, setQuestions] = useState(() => buildSession(verbs, QUIZ_SIZE));
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const scoreRef = useRef(0);

  const question = questions[index];

  const restart = () => {
    scoreRef.current = 0;
    setQuestions(buildSession(verbs, QUIZ_SIZE));
    setIndex(0);
    setCorrect(0);
    setDone(false);
  };

  const handleResult = (isCorrect) => {
    onRecord(question.verb.id, isCorrect);
    if (isCorrect) {
      scoreRef.current += 1;
      setCorrect(scoreRef.current);
    }
  };

  const handleNext = async () => {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      return;
    }
    setDone(true);
    if (isAuthenticated) await awardXP(base44, scoreRef.current * XP_PER_CORRECT, "Verbquiz klart!");
  };

  const header = (
    <div className="flex items-center justify-between gap-3 mb-4">
      <Button variant="ghost" size="sm" className="gap-1 -ml-2" onClick={onExit}>
        <ArrowLeft className="w-4 h-4" /> Tillbaka
      </Button>
      <span className="text-xs text-muted-foreground">{groupLabel}</span>
    </div>
  );

  if (!questions.length) {
    return (
      <div className="max-w-2xl mx-auto">
        {header}
        <p className="text-center text-sm text-muted-foreground py-8">Det finns inga verb att öva på här än.</p>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((scoreRef.current / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto">
        {header}
        <div className="rounded-2xl border-2 border-border/50 bg-card p-6 text-center">
          <div className="text-4xl mb-3">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
          <h2 className="text-xl font-bold mb-1">
            {scoreRef.current} av {questions.length} rätt
          </h2>
          <p className="text-sm text-muted-foreground mb-1">{pct}%</p>
          {isAuthenticated && scoreRef.current > 0 && (
            <p className="text-xs font-semibold text-primary mb-4">+{scoreRef.current * XP_PER_CORRECT} XP</p>
          )}
          <div className="flex flex-col sm:flex-row gap-2 justify-center mt-4">
            <Button className="gap-2" onClick={restart}><RotateCcw className="w-4 h-4" /> Nytt quiz</Button>
            <Button variant="outline" onClick={onExit}>Tillbaka till listan</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {header}
      <VerbQuestionCard
        question={question}
        index={index}
        total={questions.length}
        onResult={handleResult}
        onNext={handleNext}
        isLast={index + 1 === questions.length}
      />
      <p className="text-xs text-muted-foreground text-center mt-3">Rätt svar ger 2 XP · correct answers earn 2 XP ({correct} rätt)</p>
    </div>
  );
}