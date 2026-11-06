import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function WritingResponse({ value, onChange, minWords, onSubmit, grading }) {
  const words = value.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <Textarea
        rows={12}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Skriv ditt svar här…"
        disabled={grading}
      />
      <div className="flex items-center justify-between gap-3">
        <span className={`text-xs ${words >= minWords ? "text-emerald-600" : "text-muted-foreground"}`}>
          {words} / {minWords} ord
        </span>
        <Button onClick={onSubmit} disabled={grading || words < minWords} className="gap-2">
          {grading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {grading ? "Rättar…" : "Lämna in"}
        </Button>
      </div>
    </div>
  );
}