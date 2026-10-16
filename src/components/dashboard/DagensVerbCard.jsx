import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const COUNT = 5;

// Same five verbs all day, a different five tomorrow.
function dayStartIndex(length, seed) {
  if (!length) return 0;
  let hash = 0;
  for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) % 100000;
  return hash % length;
}

export default function DagensVerbCard() {
  const { data: verbs = [] } = useQuery({
    queryKey: ["verbs"],
    queryFn: () => base44.entities.Verb.list("infinitive", 500),
  });

  const today = new Date().toISOString().slice(0, 10);
  const five = useMemo(() => {
    if (verbs.length <= COUNT) return verbs;
    const start = dayStartIndex(verbs.length, today);
    return Array.from({ length: COUNT }, (_, i) => verbs[(start + i) % verbs.length]);
  }, [verbs, today]);

  if (!five.length) return null;

  return (
    <Card className="border-border/50">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xl">🦉</span>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm">
                Dagens verb <span className="font-normal italic text-muted-foreground">· Verbs of the day</span>
              </h3>
              <p className="text-xs text-muted-foreground">Fem verb att kunna idag</p>
            </div>
          </div>
          <Link to="/grammar/verbs" className="text-xs font-semibold text-primary inline-flex items-center gap-1 shrink-0">
            Öva <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-2">
          {five.map((verb) => (
            <div key={verb.id} className="border-b border-border/40 pb-2 last:border-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold">{verb.infinitive}</span>
                <span className="text-xs text-muted-foreground truncate">{verb.english}</span>
              </div>
              <p className="text-xs text-muted-foreground tabular-nums mt-0.5">
                {verb.present} · {verb.past} · {verb.supine || "—"}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}