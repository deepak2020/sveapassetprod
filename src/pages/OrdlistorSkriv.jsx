import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Printer, PenLine } from "lucide-react";
import { ORDLISTOR } from "@/data/sprakvagenC";
import { WORKSHEET_DIRECTIONS, printWorksheet, worksheetItems } from "@/lib/worksheet";
import { Button } from "@/components/ui/button";
import WorksheetSheet from "@/components/ordlistor/WorksheetSheet";
import WorksheetCheck from "@/components/ordlistor/WorksheetCheck";

export default function OrdlistorSkriv() {
  const [listKey, setListKey] = useState("1-1");
  const [direction, setDirection] = useState("en-sv");

  const [chapter, level] = listKey.split("-").map(Number);
  const chapterMeta = ORDLISTOR.find((c) => c.chapter === chapter);
  const list = chapterMeta?.lists.find((l) => l.level === level);
  const items = useMemo(() => worksheetItems(chapter, level, direction), [chapter, level, direction]);
  const dir = WORKSHEET_DIRECTIONS.find((d) => d.id === direction);
  const title = `${chapter}. ${chapterMeta?.title} · Nivå ${level}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-10 space-y-6">
      <Link
        to="/ordlistor"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Ordlistor
      </Link>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <PenLine className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Skriv på papper</h1>
          <p className="text-sm text-muted-foreground">Skriv ut en ordlista, fyll i för hand och få den rättad</p>
        </div>
      </div>

      {/* Direction */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Riktning</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {WORKSHEET_DIRECTIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setDirection(d.id)}
              className={`rounded-xl border-2 px-4 py-3 text-left transition-all ${
                direction === d.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <p className="font-semibold text-sm">{d.label}</p>
              <p className="text-xs italic text-muted-foreground">{d.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Word list */}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ordlista</p>
        <select
          value={listKey}
          onChange={(e) => setListKey(e.target.value)}
          className="w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm"
        >
          {ORDLISTOR.map((ch) => (
            <optgroup key={ch.chapter} label={`${ch.chapter}. ${ch.title}`}>
              {ch.lists.map((l) => (
                <option key={l.level} value={`${ch.chapter}-${l.level}`}>
                  {ch.chapter}. {ch.title} · Nivå {l.level} ({l.words.length} ord)
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <Button
        onClick={() =>
          printWorksheet({ title, directionLabel: dir.label, instruction: dir.sub, items })
        }
        className="w-full gap-2"
      >
        <Printer className="w-4 h-4" /> Skriv ut ({items.length} ord)
      </Button>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Förhandsvisning</p>
        <WorksheetSheet items={items} />
      </div>

      <WorksheetCheck items={items} />

      {!list && <p className="text-sm text-muted-foreground">Ordlistan kunde inte hittas.</p>}
    </div>
  );
}