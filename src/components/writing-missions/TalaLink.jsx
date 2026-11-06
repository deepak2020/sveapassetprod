import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Mic } from "lucide-react";
import { supabase } from "@/api/supabaseClient";

// Keywords that connect a writing topic to an existing Tala mission.
const TOPIC_HINTS = {
  "Bostad och område": ["hyresvärd", "granne", "bostad", "lägenhet"],
  "Arbete och utbildning": ["sjukledigt", "SFI-läraren", "jobbintervju", "chefen", "kollega"],
  "Åsikter och argument": ["diskutera", "debattera", "argumentera", "klimat"],
  "Familj och vardag": ["familj", "förskolan", "skolan"],
  "Hälsa och sjukvård": ["läkartid", "symtom", "vårdcentralen"],
  "Samhälle och service": ["konsumentverket", "reklamera", "Arbetsförmedlingen"],
  "Språk och kultur": ["språkkafé"],
  "Natur miljö och väder": ["väder", "klimat"],
};

// "Prata om det här" — links to the matching Tala mission when one exists.
export default function TalaLink({ topic }) {
  const hints = TOPIC_HINTS[topic] || [];
  const { data = [] } = useQuery({
    queryKey: ["speaking-topics-tala-link"],
    queryFn: () => supabase.speakingTopics.list(),
    enabled: hints.length > 0,
  });

  if (!hints.length) return null;

  const match = data.find((t) =>
    hints.some((hint) => String(t.title_sv || "").toLowerCase().includes(hint.toLowerCase()))
  );
  if (!match) return null;

  return (
    <Link
      to={`/tala/mission/${match.id}`}
      className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40"
    >
      <span className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Mic className="w-4 h-4 text-primary" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">Prata om det här</span>
        <span className="block text-[11px] italic text-muted-foreground truncate">{match.title_sv}</span>
      </span>
    </Link>
  );
}