import { useState } from "react";
import { Camera, CheckCircle2, XCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function WorksheetCheck({ items }) {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const addFiles = (e) => {
    const picked = Array.from(e.target.files || []).slice(0, 3 - files.length);
    setFiles((f) => [...f, ...picked].slice(0, 3));
    setResult(null);
    setError("");
    e.target.value = "";
  };

  const check = async () => {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const uploaded = await Promise.all(files.map((file) => base44.integrations.Core.UploadPrivateFile({ file })));
      const res = await base44.functions.invoke("checkWorksheet", {
        items,
        file_uris: uploaded.map((u) => u.file_uri),
      });
      setResult(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Kunde inte rätta just nu. Försök igen om en stund.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
      <div>
        <h2 className="font-bold flex items-center gap-2">
          <Camera className="w-4 h-4 text-primary" /> Rätta dina svar
        </h2>
        <p className="text-sm text-muted-foreground">
          Skriv ut pappret, fyll i svaren för hand och fota det. Ladda upp bilden (högst 3) så rättas den åt dig.
        </p>
      </div>

      <label className="block cursor-pointer rounded-xl border-2 border-dashed border-border hover:border-primary/60 px-4 py-6 text-center transition-colors">
        <input type="file" accept="image/*" multiple className="hidden" onChange={addFiles} />
        <Camera className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
        <p className="text-sm font-medium">Ladda upp bild på ditt ifyllda papper</p>
        <p className="text-xs text-muted-foreground">JPG eller PNG · tas bort efter rättning</p>
      </label>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
              <span className="truncate">{f.name}</span>
              <button
                onClick={() => setFiles((list) => list.filter((_, idx) => idx !== i))}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Ta bort bild"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Button onClick={check} disabled={!files.length || busy} className="w-full gap-2">
        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
        {busy ? "Rättar dina svar…" : "Rätta mina svar"}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="space-y-3 pt-1">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-primary">
              {result.score} / {result.total}
            </p>
            <p className="text-sm text-muted-foreground">rätt</p>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-border/60 rounded-xl border border-border/60">
            {result.results.map((r) => (
              <div key={r.n} className="flex items-start gap-2 px-3 py-2 text-sm">
                {r.correct ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-muted-foreground">
                    <span className="mr-1.5">{r.n}.</span>
                    {r.prompt}
                  </p>
                  {r.correct ? (
                    <p className="font-medium">{r.student}</p>
                  ) : (
                    <p>
                      <span className="text-red-600 line-through">{r.student || "—"}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 ml-2 font-medium">{r.answer}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}