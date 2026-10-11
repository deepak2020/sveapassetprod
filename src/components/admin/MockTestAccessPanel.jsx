import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

export default function MockTestAccessPanel() {
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(null);

  const { data: requests = [] } = useQuery({
    queryKey: ["mock-test-access"],
    queryFn: async () => {
      const res = await base44.entities.MockTestAccess.list("-created_date", 200);
      return Array.isArray(res) ? res : res?.items || [];
    },
  });

  const pending = requests.filter((r) => r.status === "pending");
  const approved = requests.filter((r) => r.status === "approved");

  if (!pending.length && !approved.length) return null;

  const decide = async (id, status) => {
    setBusy(id);
    await base44.entities.MockTestAccess.update(id, { status });
    await queryClient.invalidateQueries({ queryKey: ["mock-test-access"] });
    setBusy(null);
  };

  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-display text-xl font-bold">Provtestet · Mock test access</h2>
          <p className="text-sm text-muted-foreground">Godkänn elever som vill göra provtestet. {approved.length} har åtkomst.</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
          {pending.length} väntar
        </span>
      </div>

      {pending.length > 0 && (
        <div className="space-y-2">
          {pending.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/40 px-4 py-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{r.user_name || r.user_email}</p>
                <p className="text-xs text-muted-foreground truncate">{r.user_email}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button size="sm" className="gap-1" onClick={() => decide(r.id, "approved")} disabled={busy === r.id}>
                  {busy === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Godkänn
                </Button>
                <Button size="sm" variant="outline" className="gap-1" onClick={() => decide(r.id, "rejected")} disabled={busy === r.id}>
                  <X className="w-4 h-4" /> Neka
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {approved.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Har åtkomst: {approved.map((r) => r.user_name || r.user_email).join(", ")}
        </p>
      )}
    </div>
  );
}