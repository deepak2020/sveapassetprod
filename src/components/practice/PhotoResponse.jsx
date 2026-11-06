import { Camera, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Photo path for a writing task: write by hand, upload the page (up to 3 images)
// and let the answer be transcribed and analysed.
export default function PhotoResponse({ files, onFilesChange, onSubmit, busy }) {
  const addFiles = (e) => {
    const picked = Array.from(e.target.files || []).slice(0, 3 - files.length);
    if (picked.length) onFilesChange([...files, ...picked].slice(0, 3));
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border/50 bg-card p-4 space-y-3">
        <p className="text-sm text-muted-foreground">
          Skriv din text för hand på ett papper och ladda upp en bild (högst 3). Vi skriver av texten och bedömer den åt dig.
        </p>

        <label className="block cursor-pointer rounded-xl border-2 border-dashed border-border px-4 py-6 text-center transition-colors hover:border-primary/60">
          <input type="file" accept="image/*" multiple className="hidden" onChange={addFiles} disabled={busy} />
          <Camera className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="text-sm font-medium">Ladda upp bild på ditt svar</p>
          <p className="text-xs text-muted-foreground">JPG eller PNG · lagras privat</p>
        </label>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                <span className="truncate">{file.name}</span>
                <button
                  onClick={() => onFilesChange(files.filter((_, idx) => idx !== i))}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Ta bort bild"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button onClick={onSubmit} disabled={!files.length || busy} className="w-full gap-2">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
          {busy ? "Läser och bedömer…" : "Analysera min bild"}
        </Button>
      </div>
    </div>
  );
}