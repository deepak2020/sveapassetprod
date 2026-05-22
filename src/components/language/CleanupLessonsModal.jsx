import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, AlertTriangle, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function CleanupLessonsModal({ open, onClose, onComplete, course, keepCount = 90 }) {
  const [step, setStep] = useState("idle"); // idle | scanning | confirm | deleting | complete | error
  const [confirmed, setConfirmed] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [toDelete, setToDelete] = useState([]);
  const [deleted, setDeleted] = useState(0);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    setStep("scanning");
    setError(null);
    try {
      const all = await base44.entities.Lesson.filter({ sfi_course: course }, "-created_date", 500);
      setLessons(all);
      const old = all.slice(keepCount);
      setToDelete(old);
      setStep("confirm");
    } catch (e) {
      setError(e.message);
      setStep("error");
    }
  };

  const handleDelete = async () => {
    if (!confirmed) return;
    setStep("deleting");
    setDeleted(0);
    let count = 0;
    for (const lesson of toDelete) {
      try {
        await base44.entities.Lesson.delete(lesson.id);
        count++;
        setDeleted(count);
      } catch (e) {
        console.error(`Failed to delete lesson ${lesson.id}:`, e.message);
      }
    }
    setStep("complete");
    onComplete?.();
  };

  const handleClose = () => {
    setStep("idle");
    setConfirmed(false);
    setLessons([]);
    setToDelete([]);
    setDeleted(0);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-destructive" />
            Clean up Kurs {course} Lessons
          </DialogTitle>
          <DialogDescription>
            Remove old duplicate lessons, keeping only the {keepCount} most recently imported.
          </DialogDescription>
        </DialogHeader>

        {step === "idle" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will scan all Kurs {course} lessons, keep the <strong>{keepCount} newest</strong>, and delete the rest.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
              <Button onClick={handleScan} className="flex-1">Scan Lessons</Button>
            </div>
          </div>
        )}

        {step === "scanning" && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Scanning Kurs {course} lessons...
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-sm space-y-1">
              <p><strong>Total lessons found:</strong> {lessons.length}</p>
              <p><strong>Keep (newest {keepCount}):</strong> {Math.min(keepCount, lessons.length)}</p>
              <p className="text-destructive font-semibold"><strong>Will delete:</strong> {toDelete.length} old lessons</p>
            </div>

            {toDelete.length === 0 ? (
              <p className="text-sm text-green-600 dark:text-green-400">
                Nothing to delete — Kurs {course} already has {lessons.length} lessons or fewer.
              </p>
            ) : (
              <>
                <div className="flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-950/30 p-3 border border-red-200 dark:border-red-800/40">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 dark:text-red-300">
                    This permanently deletes {toDelete.length} lessons. This cannot be undone.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="confirm" checked={confirmed} onCheckedChange={setConfirmed} />
                  <label htmlFor="confirm" className="text-sm cursor-pointer">
                    I understand and want to delete {toDelete.length} old lessons
                  </label>
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
              {toDelete.length > 0 && (
                <Button variant="destructive" onClick={handleDelete} disabled={!confirmed} className="flex-1">
                  Delete {toDelete.length} Lessons
                </Button>
              )}
            </div>
          </div>
        )}

        {step === "deleting" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Deleting old lessons... {deleted}/{toDelete.length}
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-destructive h-full transition-all"
                style={{ width: `${Math.round((deleted / toDelete.length) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-400 text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>Done! Deleted {deleted} old lessons. Kurs {course} now has {lessons.length - deleted} lessons.</span>
            </div>
            <Button onClick={handleClose} className="w-full">Close</Button>
          </div>
        )}

        {step === "error" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-950/30 p-3 border border-red-200 dark:border-red-800/40">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 dark:text-red-300">
                <p className="font-semibold mb-1">Error</p>
                <p>{error}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">Close</Button>
              <Button onClick={() => setStep("idle")} className="flex-1">Try Again</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
