import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";

// Counts down the exam-style time for a task and tells the parent once when the
// time is up (the learner can still submit).
export default function PracticeTimer({ minutes, onExpire }) {
  const [left, setLeft] = useState(minutes * 60);
  const fired = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((seconds) => {
        if (seconds <= 1) {
          if (!fired.current) {
            fired.current = true;
            onExpire?.();
          }
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm font-semibold tabular-nums ${
        left <= 60
          ? "border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
          : "border-border bg-card text-muted-foreground"
      }`}
    >
      <Clock className="w-4 h-4" /> {mm}:{ss}
    </span>
  );
}