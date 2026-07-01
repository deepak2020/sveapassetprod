import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";

// Unified mistake tracking across all exercise types.
// Persists to the MistakeLog entity so mistakes sync across devices.
// Silently no-ops for unauthenticated users.

export function useMistakeLog() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: mistakes = [], refetch } = useQuery({
    queryKey: ["mistake-log"],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      return base44.entities.MistakeLog.filter({ resolved: false }, "-updated_date", 200);
    },
    enabled: isAuthenticated,
    initialData: [],
  });

  const logMistake = async (mistake) => {
    if (!isAuthenticated) return;
    if (!mistake?.question || !mistake?.correct_answer) return;
    const today = new Date().toISOString().split("T")[0];
    // Check if the same mistake already exists — increment attempts if so
    const existing = await base44.entities.MistakeLog.filter({
      source: mistake.source,
      question: mistake.question,
      resolved: false,
    }, "-created_date", 1);
    if (existing?.[0]) {
      await base44.entities.MistakeLog.update(existing[0].id, {
        attempts: (existing[0].attempts || 1) + 1,
        user_answer: mistake.user_answer || existing[0].user_answer,
        last_seen_date: today,
      });
    } else {
      await base44.entities.MistakeLog.create({
        ...mistake,
        attempts: 1,
        resolved: false,
        last_seen_date: today,
      });
    }
    queryClient.invalidateQueries({ queryKey: ["mistake-log"] });
  };

  const resolveMistake = async (id) => {
    if (!isAuthenticated) return;
    await base44.entities.MistakeLog.update(id, { resolved: true });
    queryClient.invalidateQueries({ queryKey: ["mistake-log"] });
  };

  const clearAll = async () => {
    if (!isAuthenticated) return;
    await Promise.all(mistakes.map(m => base44.entities.MistakeLog.update(m.id, { resolved: true })));
    queryClient.invalidateQueries({ queryKey: ["mistake-log"] });
  };

  return { mistakes, logMistake, resolveMistake, clearAll, refetch };
}