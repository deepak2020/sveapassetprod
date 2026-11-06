export default function TaskBrief({ task, points = [] }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-3">
      <p className="text-[15px] leading-relaxed">{task}</p>
      {points.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Ta upp i svaret</p>
          <ul className="space-y-1.5">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2 text-sm">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}