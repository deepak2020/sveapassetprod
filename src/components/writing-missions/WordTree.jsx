import { GitBranch } from "lucide-react";
import SpeakButton from "@/components/shared/SpeakButton";
import { wordLabel } from "@/lib/writingMissions";

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function baseOf(sv) {
  return String(sv || "").replace(/^(en|ett|att)\s+/i, "").trim();
}

// Bolds the mission word wherever it appears in its own example sentence, so
// the meaning is seen in context.
function highlightSentence(sentence, sv) {
  const base = baseOf(sv);
  const text = String(sentence || "");
  if (!text || !base) return text;
  const test = new RegExp(`^${escapeRe(base.slice(0, 5))}`, "i");
  return text.split(/(\s+)/).map((token, i) =>
    test.test(token.replace(/[.,!?;:"]/g, "")) ? (
      <strong key={i} className="font-semibold">{token}</strong>
    ) : (
      <span key={i}>{token}</span>
    )
  );
}

// The topic's words as a small tree: verbs, nouns with their article, and the
// remaining building blocks — each with its meaning and a sentence.
function groupWords(words) {
  const isVerb = (w) => /^att\s/i.test(w.sv || "");
  const isNoun = (w) => /^(en|ett)\s/i.test(w.sv || "");
  const verbs = words.filter(isVerb);
  const nouns = words.filter(isNoun);
  const other = words.filter((w) => !isVerb(w) && !isNoun(w));
  return [
    { label: "Verb", en: "verbs", words: verbs },
    { label: "Substantiv", en: "nouns", words: nouns },
    { label: "Andra ord", en: "other words", words: other },
  ].filter((g) => g.words.length);
}

export default function WordTree({ mission }) {
  const groups = groupWords(mission?.words || []);

  if (!groups.length) {
    return <p className="text-center text-sm text-muted-foreground">Det finns inga ord i det här uppdraget.</p>;
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <GitBranch className="w-4 h-4 text-primary" /> {mission.topic}
        <span className="text-[11px] font-normal italic text-muted-foreground">ordträd · ord i sitt sammanhang</span>
      </p>

      <div className="space-y-4 border-l-2 border-border/70 pl-3 ml-1">
        {groups.map((group) => (
          <div key={group.label} className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {group.label}{" "}
              <span className="font-normal italic normal-case">
                · {group.words.length} {group.en}
              </span>
            </p>
            <div className="space-y-2 border-l-2 border-border/50 pl-3 ml-1">
              {group.words.map((word) => (
                <div key={word.sv} className="rounded-xl bg-muted/40 px-3 py-2 space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <p className="text-sm font-semibold">{wordLabel(word)}</p>
                    <span className="text-xs italic text-muted-foreground">— {word.en}</span>
                    <SpeakButton text={word.sv} ariaLabel="Lyssna på ordet" />
                  </div>
                  {word.example && (
                    <p className="text-xs text-muted-foreground">{highlightSentence(word.example, word.sv)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}