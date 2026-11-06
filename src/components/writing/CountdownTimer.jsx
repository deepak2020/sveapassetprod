import { Timer } from "lucide-react";

function format(seconds) {
  const m = Math.floor(Math.max(0, seconds) / 60);
  const s = Math.max(0, seconds) % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

// Countdown used in provläge (test mode).
export default function CountdownTimer({ secondsLeft }) {
  const low = secondsLeft <= 60;

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold tabular-nums ${
        low ? "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300" : "bg-muted text-foreground"
      }`}
    >
      <Timer className="w-4 h-4" />
      {format(secondsLeft)}
    </div>
  );
}