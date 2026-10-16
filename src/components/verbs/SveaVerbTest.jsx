import { useRef, useState } from "react";
import { ArrowLeft, RotateCcw, Target } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import SveaLogo from "@/components/shared/SveaLogo";
import { awardXP } from "@/lib/xp";
import { FORM_SV, buildSession, rebuildSession } from "@/lib/verbs";
import VerbQuestionCard from "./VerbQuestionCard";

const TEST_SIZE = 15;
const XP_PER_CORRECT = 2;
const XP_FOR_FINISHING = 10;

export default function SveaVerbTest({ verbs, groupLabel, onRecord, onExit, isAuthenticated }) {
  const [questions, setQuestions] = useState(() => buildSession(verbs, TEST_SIZE));
  const [index, setIndex] = useState(0);
  const [missed, setMissed] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const scoreRef = useRef(0);

  const question = questions[index];

  const start = (list) => {
    scoreRef.current = 0;
    setQuestions(list);
    setIndex(0);
    setMissed([]);
    setCorrect(0);
    setDone(false);
  };

  const handleResult = (isCorrect) => {
    onRecord(question.verb.id, isCorrect);
    if (isCorrect) {
      scoreRef.current += 1;
      setCorrect(scoreRef.current);
    } else {
      setMissed((list) => [...list, question]);
    }
  };

  const handleNext = async () => {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      return;
    }
    setDone(true);
    if (isAuthenticated) {
      await awardXP(base44, scoreRef.current * XP_PER_CORRECT + XP_FOR_FINISHING, "Svea-test klart!");
    }
  };

  const header = (
    <div className="flex items-center justify-between gap-3 mb-4">
      <Button variant="ghost" size="sm" className="gap-1 -ml-2" onClick={onExit}>
        <ArrowLeft className="w-4 h-4" /> Tillbaka
      </Button>
      <span className="text-xs text-muted-foreground">Svea-test · {groupLabel}</span>
    </div>
  );

  if (!questions.length) {
    return (
      <div className="max-w-2xl mx-auto">
        {header}
        <p className="text-center text-sm text-muted-foreground py-8">Det finns inga verb att testa här än.</p>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((scoreRef.current / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {header}

        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 text-center">
          <div className="text-4xl mb-3">🦉</div>
          <h2 className="text-xl font-bold mb-1">
            {scoreRef.current} av {questions.length} rätt
          </h2>
          <p className="text-sm text-muted-foreground">{pct}%</p>
          <p className="text-sm mt-3">
            <SveaLogo className="text-base" /> <span className="italic text-muted-foreground">säger:</span>{" "}
            {pct >= 80 ? "Snyggt jobbat! Du har bra koll på formerna." : pct >= 50 ? "Bra! Repetera de verb du missade." : "Fortsätt öva — det går snabbt framåt."}
          </p>
          {isAuthenticated && (
            <p className="text-xs font-semibold text-primary mt-3">
              +{scoreRef.current * XP_PER_CORRECT + XP_FOR_FINISHING} XP
            </p>
          )}
        </div>

        {missed.length > 0 && (
          <div className="rounded-2xl border-2 border-border/50 bg-card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" /> Verb du missade · Verbs you missed
            </h3>
            <div className="space-y-2">
              {missed.map((q) => (
                <div key={`${q.verb.id}-${q.form}`} className="flex items-baseline justify-between gap-3 border-b border-border/40 pb-1.5 last:border-0">
                  <span className="font-medium">{q.verb.infinitive}</span>
                  <span className="text-sm text-right">
                    <span className="text-muted-foreground mr-2">{FORM_SV[q.form]}</span>
                    <span className="font-semibold text-primary">{q.answer}</span>
                  </span>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4 gap-2" onClick={() => start(rebuildSession(missed))}>
              <RotateCcw className="w-4 h-4" /> Öva de verb jag missade
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button variant="outline" className="gap-2" onClick={() => start(buildSession(verbs, TEST_SIZE))}>
            <RotateCcw className="w-4 h-4" /> Nytt test
          </Button>
          <Button variant="ghost" onClick={onExit}>Tillbaka till listan</Button>
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
      <p className="text-xs text-muted-foreground text-center mt-3">
        15 frågor · 2 XP per rätt svar + 10 XP när du är klar ({correct} rätt)
      </p>
    </div>
  );
}