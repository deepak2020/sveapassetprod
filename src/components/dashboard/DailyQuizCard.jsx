import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";
import QuizRunner from "@/components/shared/QuizRunner";
import { skillMastery, weakestSkills } from "@/lib/planner";
import { shuffle } from "@/lib/shuffle";

// Four short quiz check-ins spread through the day keep recall fresh.
const SLOTS = [
  { key: "morning",   label: "Morgon",      emoji: "☀️", from: 0 },
  { key: "midday",    label: "Lunch",       emoji: "🌤️", from: 11 },
  { key: "afternoon", label: "Eftermiddag", emoji: "🌥️", from: 15 },
  { key: "evening",   label: "Kväll",       emoji: "🌙", from: 19 },
];
const QUIZ_SIZE = 5;

const todayKey = () => new Date().toISOString().slice(0, 10);
const doneStorageKey = (slot) => `svenska:daily_quiz:${todayKey()}:${slot}`;
const isSlotDone = (slot) => {
  try { return localStorage.getItem(doneStorageKey(slot)) === "1"; } catch { return false; }
};
const markSlotDone = (slot) => {
  try { localStorage.setItem(doneStorageKey(slot), "1"); } catch { /* ignore */ }
};

// Pick QUIZ_SIZE distinct questions, weighting the learner's weakest skills.
function pickQuestions(lessons, results) {
  const mastery = skillMastery((results || []).filter((r) => r.skill && typeof r.percentage === "number"));
  const weak = new Set(weakestSkills(mastery, 3).map((s) => s.key));
  const pool = [];
  for (const l of lessons) {
    const skill = l.skill || l.category;
    for (const q of l.quiz_questions || []) {
      if (q?.question_sv && Array.isArray(q.options) && typeof q.correct_index === "number") {
        pool.push({ q, weight: weak.has(skill) ? 3 : 1 });
      }
    }
  }
  const expanded = shuffle(pool.flatMap((p) => Array(p.weight).fill(p.q)));
  const picked = [];
  const seen = new Set();
  for (const q of expanded) {
    if (picked.length >= QUIZ_SIZE) break;
    if (seen.has(q.question_sv)) continue;
    seen.add(q.question_sv);
    picked.push(q);
  }
  return picked;
}

export default function DailyQuizCard({ results = [] }) {
  const { user } = useAuth();
  const [activeSlot, setActiveSlot] = useState(null);
  const course = user?.sfi_level;

  const { data: lessons = [] } = useQuery({
    queryKey: ["daily-quiz-lessons", course],
    queryFn: () => base44.entities.Lesson.filter({ sfi_course: course }, "order", 500),
    enabled: !!course,
  });

  const questions = useMemo(
    () => (activeSlot ? pickQuestions(lessons, results) : []),
    [activeSlot, lessons, results]
  );

  if (activeSlot && questions.length > 0) {
    return (
      <QuizRunner
        questions={questions}
        quizType="daily_quiz"
        sourceId={`daily-quiz-${todayKey()}-${activeSlot}`}
        sourceTitle="Dagens quiz"
        onComplete={() => { markSlotDone(activeSlot); setActiveSlot(null); }}
      />
    );
  }

  // Need at least some quizzable content to show the card.
  if (!lessons.some((l) => (l.quiz_questions || []).length)) return null;

  const hour = new Date().getHours();

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-4 h-4 text-primary" />
          <p className="font-semibold text-sm">
            Dagens quiz <span className="text-xs font-normal text-muted-foreground italic">· 4 check-ins</span>
          </p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Korta quiz under dagen håller minnet färskt. · <span className="italic">A short quiz at 4 points in the day keeps recall fresh — weighted to your weak skills.</span>
        </p>
        <div className="grid grid-cols-4 gap-2">
          {SLOTS.map((s) => {
            const done = isSlotDone(s.key);
            const available = !done && hour >= s.from;
            return (
              <button
                key={s.key}
                disabled={!available}
                onClick={() => setActiveSlot(s.key)}
                className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all ${
                  done
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800"
                    : available
                      ? "bg-primary text-primary-foreground border-primary hover:opacity-90"
                      : "bg-muted/40 border-border opacity-60 cursor-not-allowed"
                }`}
              >
                <span className="text-base">{s.emoji}</span>
                <span className="text-[11px] font-semibold">{s.label}</span>
                <span className="text-[10px] font-medium">{done ? "✓ klar" : available ? "Starta" : "🔒"}</span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
