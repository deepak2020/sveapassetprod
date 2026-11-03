export default function WorksheetSheet({ items }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card px-5 py-3">
      <div className="divide-y divide-border/50">
        {items.map((it) => (
          <div key={it.n} className="flex items-baseline gap-3 py-2 text-sm">
            <span className="w-7 shrink-0 text-xs text-muted-foreground">{it.n}.</span>
            <span className="font-medium">{it.prompt}</span>
            <span className="flex-1 border-b border-dashed border-border/70" />
          </div>
        ))}
      </div>
    </div>
  );
}