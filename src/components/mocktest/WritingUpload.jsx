import { useState } from "react";
import { Camera, CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import WritingFeedback from "./WritingFeedback";

// Photo path for the writing part: write by hand, photograph the page, and get
// it transcribed and graded with the same feedback as a typed answer.
export default function WritingUpload({ course, cefr, task, points, onResult }) {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const addFiles = (e) => {
    const picked = Array.from(e.target.files || []).slice(0, 3 - files.length);
    setFiles((f) => [...f, ...picked].slice(0, 3));
    setError("");
    e.target.value = "";
  };

  const check = async () => {
    setBusy(true);
    setError("");
    try {
      const uploaded = await Promise.all(files.map((file) => base44.integrations.Core.UploadPrivateFile({ file })));
      const res = await base44.functions.invoke("gradeWritingPhoto", {
        course,
        cefr,
        task,
        points,
        file_uris: uploaded.map((u) => u.file_uri),
      });
      setResult(res.data);
      onResult?.(res.data);
    } catch (e) {
      setError(e?.response?.data?.message || "Kunde inte rätta just nu. Försök igen om en stund.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-3">
        <p className="text-sm text-muted-foreground">
          Skriv din text för hand på ett papper och fota det. Ladda upp bilden (högst 3) så skrivs den av och bedöms åt dig.
        </p>

        <label className="block cursor-pointer rounded-xl border-2 border-dashed border-border hover:border-primary/60 px-4 py-6 text-center transition-colors">
          <input type="file" accept="image/*" multiple className="hidden" onChange={addFiles} disabled={busy} />
          <Camera className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-sm font-medium">Ladda upp bild på ditt svar</p>
          <p className="text-xs text-muted-foreground">JPG eller PNG · lagras privat</p>
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
          {busy ? "Läser och bedömer…" : "Rätta mitt foto"}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      {result && (
        <>
          <div className="rounded-2xl border border-border/50 bg-muted/40 p-4 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Så här läste vi din text</p>
            <p className="text-sm whitespace-pre-wrap">{result.text}</p>
          </div>
          <WritingFeedback result={result} />
        </>
      )}
    </div>
  );
}