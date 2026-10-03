export default function WritingFeedback({ result }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <span className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">{result.grade}</span>
        <p className="text-sm">{result.summary}</p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Bra</p>
        <ul className="list-disc pl-5 text-sm">{result.strengths?.map((s) => <li key={s}>{s}</li>)}</ul>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Att förbättra</p>
        <ul className="list-disc pl-5 text-sm">{result.improvements?.map((s) => <li key={s}>{s}</li>)}</ul>
      </div>
      <p className="text-xs italic text-muted-foreground">AI-bedömning, endast vägledande · AI estimate, for guidance only</p>
    </div>
  );
}