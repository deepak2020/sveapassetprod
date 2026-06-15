import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Link2, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Admin tool: run the inferPrerequisites function over lessons to populate each
// lesson's `prerequisites` (AI-inferred). Safe — only that field is written.
export default function InferPrerequisitesButton() {
  const [course, setCourse] = useState("");
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, withPrereqs: 0, failed: 0 });
  const [result, setResult] = useState(null);

  const handleRun = async () => {
    const scope = course ? `Kurs ${course} lessons` : "ALL lessons (A–D)";
    if (!confirm(`Infer prerequisites for ${scope}. Only the prerequisites field is written — content and progress are untouched. Can take a while; keep this tab open. Continue?`)) return;

    setRunning(true);
    setResult(null);
    setProgress({ done: 0, total: 0, withPrereqs: 0, failed: 0 });

    const errors = [];
    let withPrereqs = 0, failed = 0;
    try {
      const listBody = { list_only: true };
      if (course) listBody.course = course;
      const listRes = await base44.functions.invoke("inferPrerequisites", listBody);
      const targets = listRes.data?.ids || [];
      const total = targets.length;
      setProgress({ done: 0, total, withPrereqs: 0, failed: 0 });

      for (let i = 0; i < targets.length; i++) {
        const t = targets[i];
        try {
          const res = await base44.functions.invoke("inferPrerequisites", { lesson_id: t.id });
          if (res.data?.success) {
            if ((res.data.prerequisites || []).length > 0) withPrereqs++;
          } else {
            failed++;
            errors.push({ id: t.id, title: t.title, error: res.data?.error });
          }
        } catch (e) {
          failed++;
          errors.push({ id: t.id, title: t.title, error: e.message });
        }
        setProgress({ done: i + 1, total, withPrereqs, failed });
      }
      setResult({ total, withPrereqs, failed, errors });
    } catch (e) {
      setResult({ error: e.message });
    }
    setRunning(false);
  };

  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;
  const selectCls = "h-9 rounded-lg border border-border bg-background px-2 text-sm";

  return (
    <div className="border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-semibold text-blue-900 dark:text-blue-200">Admin — Infer lesson prerequisites</p>
          <p className="text-sm text-blue-700 dark:text-blue-300 max-w-xl">
            Uses the LLM to map which earlier lessons each lesson depends on, so the planner can put foundation lessons first. Writes only the prerequisites field.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select value={course} onChange={(e) => setCourse(e.target.value)} disabled={running} className={selectCls}>
            <option value="">All courses</option>
            <option value="A">Kurs A</option>
            <option value="B">Kurs B</option>
            <option value="C">Kurs C</option>
            <option value="D">Kurs D</option>
          </select>
          <Button onClick={handleRun} disabled={running} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            <Link2 className={`w-4 h-4 ${running ? "animate-pulse" : ""}`} />
            {running ? `Inferring ${progress.done}/${progress.total || "…"}…` : "Infer prerequisites"}
          </Button>
        </div>
      </div>

      {running && progress.total > 0 && (
        <div className="mt-3 space-y-1">
          <Progress value={pct} className="h-2" />
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {progress.done} / {progress.total} processed · 🔗 {progress.withPrereqs} with prerequisites · ❌ {progress.failed}
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
                Done! {result.withPrereqs}/{result.total} lessons got prerequisites{result.failed > 0 && ` · ${result.failed} failed`}.
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
