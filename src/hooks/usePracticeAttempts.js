import { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";

// Loads and saves SFI 3C practice attempts. Signed-out visitors simply get an
// empty history — practice still works, it just is not stored.
export function usePracticeAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const page = await base44.entities.PracticeAttempt.list({ sort: "-created_date", limit: 200 });
      setAttempts(Array.isArray(page) ? page : page.items || []);
    } catch {
      setAttempts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async (data) => {
    try {
      const record = await base44.entities.PracticeAttempt.create(data);
      setAttempts((prev) => [record, ...prev]);
      return record;
    } catch {
      return null;
    }
  }, []);

  return { attempts, loading, save, reload: load };
}