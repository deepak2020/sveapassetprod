// Small progress ring used on the mission cards.
export default function ProgressRing({ value = 0, size = 44, label }) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} className="stroke-muted" strokeWidth="4" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-emerald-500 transition-all duration-500"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
        {label ?? `${Math.round(value)}%`}
      </span>
    </div>
  );
}