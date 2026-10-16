import { useMemo, useState } from "react";
import { Search, Volume2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSpeech } from "@/hooks/useSpeech";

const COLUMNS = ["Infinitiv", "Presens", "Preteritum", "Supinum", "English"];

export default function VerbTable({ verbs }) {
  const [search, setSearch] = useState("");
  const { speak, speaking } = useSpeech();

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return verbs;
    return verbs.filter((verb) =>
      `${verb.infinitive} ${verb.present} ${verb.past} ${verb.supine} ${verb.english}`
        .toLowerCase()
        .includes(q)
    );
  }, [verbs, search]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Sök verb · Search verbs…"
          className="pl-9 h-10"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border/50 bg-card">
        <table className="w-full min-w-[540px] text-sm">
          <thead className="bg-muted/60">
            <tr>
              {COLUMNS.map((col) => (
                <th key={col} className="px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                  {col}
                </th>
              ))}
              <th className="px-2 py-2 w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((verb) => (
              <tr key={verb.id} className="border-t border-border/40">
                <td className="px-3 py-2 font-semibold whitespace-nowrap">{verb.infinitive}</td>
                <td className="px-3 py-2 whitespace-nowrap">{verb.present}</td>
                <td className="px-3 py-2 whitespace-nowrap">{verb.past}</td>
                <td className="px-3 py-2 whitespace-nowrap">{verb.supine || "—"}</td>
                <td className="px-3 py-2 text-muted-foreground">{verb.english}</td>
                <td className="px-2 py-2">
                  <button
                    type="button"
                    onClick={() => speak(`${verb.infinitive}. ${verb.example_sentence || ""}`, "sv-SE")}
                    aria-label={`Lyssna: ${verb.infinitive}`}
                    className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                      speaking ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                    title="Lyssna · Listen"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-6">Inga verb matchade sökningen · No verbs matched</p>
      )}
      <p className="text-xs text-muted-foreground text-center">{rows.length} verb</p>
    </div>
  );
}