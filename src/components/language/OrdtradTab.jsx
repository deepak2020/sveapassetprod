import { useMemo } from "react";
import { Volume2, Sparkles } from "lucide-react";
import { playAudio } from "@/lib/speech";

// Heuristically bucket a Swedish word into a semantic/grammatical group.
// Keeps it simple: nouns (en/ett), verbs (att …), phrases, other.
function classify(swedish) {
  const s = (swedish || "").trim().toLowerCase();
  if (!s) return "other";
  if (/^(en|ett)\s+/.test(s)) return "noun";
  if (/^att\s+/.test(s)) return "verb";
  // verbs in present often end in -r and are a single word
  if (/^\S+r$/.test(s) && !s.includes(" ")) return "verb";
  if (s.split(/\s+/).length >= 3) return "phrase";
  return "other";
}

const GROUPS = [
  { key: "noun",   label: "Substantiv", labelEn: "Nouns",   emoji: "📦", color: "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800" },
  { key: "verb",   label: "Verb",       labelEn: "Verbs",   emoji: "⚡", color: "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800" },
  { key: "phrase", label: "Fraser",     labelEn: "Phrases", emoji: "💬", color: "bg-violet-50 border-violet-200 dark:bg-violet-950/30 dark:border-violet-800" },
  { key: "other",  label: "Övrigt",     labelEn: "Other",   emoji: "✨", color: "bg-slate-50 border-slate-200 dark:bg-slate-950/30 dark:border-slate-800" },
];

export default function OrdtradTab({ lessons }) {
  const grouped = useMemo(() => {
    const seen = new Set();
    const byGroup = { noun: [], verb: [], phrase: [], other: [] };
    for (const lesson of lessons || []) {
      for (const wp of lesson.word_pairs || []) {
        if (!wp?.swedish || !wp?.english) continue;
        const key = wp.swedish.toLowerCase().trim();
        if (seen.has(key)) continue;
        seen.add(key);
        const bucket = classify(wp.swedish);
        byGroup[bucket].push({
          swedish: wp.swedish,
          english: wp.english,
          example_sv: wp.example_sv,
          lessonTitle: lesson.title_sv || lesson.title,
        });
      }
    }
    return byGroup;
  }, [lessons]);

  const totalWords = Object.values(grouped).reduce((s, arr) => s + arr.length, 0);

  if (totalWords === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">Inga ord ännu — börja en lektion för att fylla din ordtråd.</p>
        <p className="text-xs italic mt-1">No words yet — start a lesson to fill your word thread.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{totalWords}</span> unika ord i den här ordtråden
        <span className="italic"> · unique words in this thread</span>
      </div>

      {GROUPS.map((g) => {
        const items = grouped[g.key];
        if (!items.length) return null;
        return (
          <section key={g.key} className={`rounded-2xl border ${g.color} p-4`}>
            <header className="flex items-baseline justify-between mb-3">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <span className="text-base">{g.emoji}</span>
                {g.label} <span className="text-xs text-muted-foreground italic font-normal">· {g.labelEn}</span>
              </h3>
              <span className="text-xs text-muted-foreground">{items.length}</span>
            </header>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {items.map((w, i) => (
                <li key={`${w.swedish}-${i}`} className="rounded-lg bg-card border border-border/40 p-3 flex items-start gap-2">
                  <button
                    onClick={() => playAudio(w.swedish, "sv-SE", 0.95)}
                    className="shrink-0 mt-0.5 p-1.5 rounded-md hover:bg-muted text-primary"
                    aria-label={`Lyssna på ${w.swedish}`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-foreground truncate">{w.swedish}</p>
                    <p className="text-xs text-muted-foreground truncate">{w.english}</p>
                    {w.example_sv && (
                      <p className="text-[11px] italic text-muted-foreground mt-1 line-clamp-2">{w.example_sv}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}