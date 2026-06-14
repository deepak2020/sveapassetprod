import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Wand2, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Admin tool: reformat EXISTING lesson/civic content in place into the
// Swedish-first + "## In English" layout. Safe — only the content field is
// rewritten, so vocabulary, quizzes and user progress are untouched.
export default function ReformatContentButton() {
  const [type, setType] = useState("lesson"); // "lesson" | "civic"
  const [course, setCourse] = useState(""); // "" = all courses (lessons only)
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, success: 0, failed: 0, skipped: 0 });
  const [result, setResult] = useState(null);

  const handleRun = async () => {
    const scope = type === "civic" ? "civic topics" : course ? `Kurs ${course} lessons` : "ALL lessons (A–D)";
    if (!confirm(`Reformat existing content for ${scope} into Swedish-first + English-below.\n\nThis only reorders the text — vocabulary, quizzes and user progress are NOT affected. It can take a while; keep this tab open. Continue?`)) return;

    setRunning(true);
    setResult(null);
    setProgress({ done: 0, total: 0, success: 0, failed: 0, skipped: 0 });

    const errors = [];
    let success = 0, failed = 0, skipped = 0;

    try {
      const listBody = { list_only: true, type };
      if (type === "lesson" && course) listBody.course = course;
      const listRes = await base44.functions.invoke("reformatContent", listBody);
      const targets = listRes.data?.ids || [];
      const total = targets.length;
      setProgress({ done: 0, total, success: 0, failed: 0, skipped: 0 });

      for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        try {
          const res = await base44.functions.invoke("reformatContent", { id: t.id, type });
          if (res.data?.success && !res.data?.skipped) success++;
          else if (res.data?.skipped) skipped++;
          else {
            failed++;
            errors.push({ id: t.id, title: t.title, error: res.data?.error || res.data?.skipped });
          }
        } catch (e) {
          failed++;
          errors.push({ id: t.id, title: t.title, error: e.message });
        }
        setProgress({ done: i + 1, total, success, failed, skipped });
      }

      setResult({ success, failed, skipped, total, errors });
    } catch (e) {
      setResult({ error: e.message });
    }
    setRunning(false);
  };

  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  const selectCls = "h-9 rounded-lg border border-border bg-background px-2 text-sm";

  return (
    <div className="border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 mb-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-semibold text-amber-900 dark:text-amber-200">Admin — Reformat content (Swedish first)</p>
          <p className="text-sm text-amber-700 dark:text-amber-300 max-w-xl">
            Reorders existing lesson/civic content into Swedish first, then an “In English” section. Only the text is reordered — vocabulary, quizzes and user progress are not affected.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select value={type} onChange={(e) => setType(e.target.value)} disabled={running} className={selectCls}>
            <option value="lesson">Lessons</option>
            <option value="civic">Civic topics</option>
          </select>
          {type === "lesson" && (
            <select value={course} onChange={(e) => setCourse(e.target.value)} disabled={running} className={selectCls}>
              <option value="">All courses</option>
              <option value="A">Kurs A</option>
              <option value="B">Kurs B</option>
              <option value="C">Kurs C</option>
              <option value="D">Kurs D</option>
            </select>
          )}
          <Button onClick={handleRun} disabled={running} className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
            <Wand2 className={`w-4 h-4 ${running ? "animate-pulse" : ""}`} />
            {running ? `Reformatting ${progress.done}/${progress.total || "…"}…` : "Reformat"}
          </Button>
        </div>
      </div>

      {running && progress.total > 0 && (
        <div className="mt-3 space-y-1">
          <Progress value={pct} className="h-2" />
          <p className="text-xs text-amber-700 dark:text-amber-300">
            {progress.done} / {progress.total} processed · ✅ {progress.success} · ⏭️ {progress.skipped} skipped · ❌ {progress.failed}
          </p>
        </div>
      )}

      {result && (
        <div className="mt-3 flex items-start gap-2 text-sm">
          {result.error ? (
            <><AlertCircle className="w-4 h-4 text-red-500 mt-0.5" /><span className="text-red-700">Error: {result.error}</span></>
          ) : (
            <><CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
              <span className="text-green-700 dark:text-green-400">
                Done! {result.success}/{result.total} reformatted
                {result.skipped > 0 && ` · ${result.skipped} skipped (kept original)`}
                {result.failed > 0 && ` · ${result.failed} failed`}.
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
