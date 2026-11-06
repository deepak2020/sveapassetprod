import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

// The learner's own writing submissions (newest first). Guests have none.
export function useWritingSubmissions(enabled = true) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!enabled) {
      setSubmissions([]);
      setLoading(false);
      return;
    }
    const page = await base44.entities.WritingSubmission.filter({}, { sort: "-created_date", limit: 60 });
    setSubmissions(page.items || []);
    setLoading(false);
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id) => {
    await base44.entities.WritingSubmission.delete(id);
    setSubmissions((list) => list.filter((s) => s.id !== id));
  };

  return { submissions, loading, reload: load, remove };
}