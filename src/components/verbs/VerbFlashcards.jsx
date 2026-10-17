import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, RotateCcw, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { shuffle } from "@/lib/shuffle";
import { FORM_SV } from "@/lib/verbs";

const FORMS = ["present", "past", "supine"];

export default function VerbFlashcards({ verbs, groupLabel, onRecord, onExit }) {
  const [deck, setDeck] = useState(() => shuffle(verbs));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [tally, setTally] = useState({ knew: 0, more: 0 });

  const verb = deck[index];
  const done = index >= deck.length;

  const answer = (knew) => {
    onRecord(verb.id, knew);
    setTally((t) => ({ knew: t.knew + (knew ? 1 : 0), more: t.more + (knew ? 0 : 1) }));
    setRevealed(false);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setDeck(shuffle(verbs));
    setIndex(0);
    setRevealed(false);
    setTally({ knew: 0, more: 0 });
  };

  const header = (
    <div className="flex items-center justify-between gap-3 mb-4">
      <Button variant="ghost" size="sm" className="gap-1 -ml-2" onClick={onExit}>
        <ArrowLeft className="w-4 h-4" /> Tillbaka
      </Button>
      <span className="text-sm text-muted-foreground font-medium">
        {done ? "Klart" : `Kort ${index + 1} av ${deck.length}`}
      </span>
    </div>
  );

  if (done) {
    return (
      <div className="max-w-2xl mx-auto">
        {header}
        <div className="rounded-2xl border-2 border-border/50 bg-card p-6 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-bold mb-1">Klart för {groupLabel}!</h2>
          <p className="text-sm text-muted-foreground mb-5">
            {tally.knew} kunde du · {tally.more} att öva mer på
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button className="gap-2" onClick={restart}><RotateCcw className="w-4 h-4" /> Börja om</Button>
            <Button variant="outline" onClick={onExit}>Tillbaka till listan</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {header}

      <AnimatePresence mode="wait">
        <motion.button
          key={verb.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          onClick={() => setRevealed((r) => !r)}
          className="w-full text-left rounded-2xl border-2 border-primary/30 bg-card p-6 min-h-[240px] hover:border-primary/60 transition-colors"
        >
          <p className="text-3xl font-bold mb-1">{verb.infinitive}</p>
          <p className="text-sm text-muted-foreground italic">{verb.english}</p>

          {!revealed ? (
            <p className="mt-8 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Repeat className="w-3.5 h-3.5" /> Tryck för att visa formerna · Tap to reveal
            </p>
          ) : (
            <div className="mt-6 space-y-2">
              {FORMS.map((form) => (
                <div key={form} className="border-b border-border/40 pb-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{FORM_SV[form]}</span>
                    <span className="font-semibold">{verb[form] || "—"}</span>
                  </div>
                  {verb[`${form}_sentence`] && (
                    <p className="text-xs text-muted-foreground mt-0.5">{verb[`${form}_sentence`]}</p>
                  )}
                </div>
              ))}
              {!FORMS.some((form) => verb[`${form}_sentence`]) && verb.example_sentence && (
                <p className="text-sm text-muted-foreground pt-2">{verb.example_sentence}</p>
              )}
            </div>
          )}
        </motion.button>
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button className="h-11 gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => answer(true)}>
          <Check className="w-4 h-4" /> Jag kunde det
        </Button>
        <Button variant="outline" className="h-11 gap-2" onClick={() => answer(false)}>
          <RotateCcw className="w-4 h-4" /> Öva mer
        </Button>
      </div>
    </div>
  );
}