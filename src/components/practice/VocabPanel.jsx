import SpeakButton from "@/components/shared/SpeakButton";

// The support material a learner prepares with: topic words, the verbs to
// master, and sentence starters for the specific task.
export default function VocabPanel({ vocab = [], verbs = [], phrases = [] }) {
  return (
    <div className="space-y-4">
      {vocab.length > 0 && (
        <section className="rounded-2xl border border-border/50 bg-card p-4 space-y-2">
          <h3 className="text-sm font-semibold">Ord</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {vocab.map((word) => (
              <div key={word.sv} className="flex items-center justify-between gap-2 rounded-lg bg-muted/40 px-3 py-2">
                <span className="text-sm font-medium">{word.sv}</span>
                <span className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs italic text-muted-foreground truncate">{word.en}</span>
                  <SpeakButton text={word.sv} ariaLabel={`Lyssna på ${word.sv}`} />
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {verbs.length > 0 && (
        <section className="rounded-2xl border border-border/50 bg-card p-4 space-y-2">
          <h3 className="text-sm font-semibold">Verb att använda</h3>
          <div className="space-y-2">
            {verbs.map((verb) => (
              <div key={verb.inf} className="rounded-lg bg-muted/40 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{verb.inf}</span>
                  <span className="text-xs italic text-muted-foreground">{verb.en}</span>
                  <SpeakButton text={verb.inf} ariaLabel={`Lyssna på ${verb.inf}`} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  pres. <span className="text-foreground">{verb.pres}</span> · pret. <span className="text-foreground">{verb.past}</span> · sup. <span className="text-foreground">{verb.sup}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {phrases.length > 0 && (
        <section className="rounded-2xl border border-border/50 bg-card p-4 space-y-2">
          <h3 className="text-sm font-semibold">Fraser att börja med</h3>
          <ul className="space-y-1.5">
            {phrases.map((phrase) => (
              <li key={phrase} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground">{phrase}</span>
                <SpeakButton text={phrase} ariaLabel="Lyssna på frasen" />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}