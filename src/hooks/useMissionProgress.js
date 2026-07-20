import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { supabase } from "@/api/supabaseClient";
import { useAuth } from "@/lib/AuthContext";

// Ordered list of missions (linear path) + which have been completed.
// Linear order: CEFR level first (A1 → C1), then the topic's own `order` field.
const LEVEL_ORDER = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };

function sortMissions(missions) {
  return [...missions].sort((a, b) => {
    const la = LEVEL_ORDER[a.level] ?? 99;
    const lb = LEVEL_ORDER[b.level] ?? 99;
    if (la !== lb) return la - lb;
    const oa = typeof a.order === "number" ? a.order : 999;
    const ob = typeof b.order === "number" ? b.order : 999;
    if (oa !== ob) return oa - ob;
    return (a.title_sv || "").localeCompare(b.title_sv || "");
  });
}

export function useMissionProgress() {
  const { isAuthenticated } = useAuth();

  const missionsQuery = useQuery({
    queryKey: ["speaking-topics-missions"],
    queryFn: () => supabase.speakingTopics.list(),
  });

  const completionsQuery = useQuery({
    queryKey: ["mission-completions"],
    queryFn: () => base44.entities.MissionCompletion.list("-completed_at", 500),
    enabled: isAuthenticated,
  });

  const allMissions = (missionsQuery.data || []).filter(
    (t) => t.goal && Array.isArray(t.success_criteria) && t.success_criteria.length > 0
  );
  const ordered = sortMissions(allMissions);
  const completedIds = new Set((completionsQuery.data || []).map((c) => c.mission_id));

  // All missions are unlocked for everyone. The "current" one is still the first
  // uncompleted mission (used for the "continue" CTA), but nothing is ever locked.
  const firstUncompletedIdx = ordered.findIndex((m) => !completedIds.has(m.id));
  const currentIdx = firstUncompletedIdx === -1 ? ordered.length : firstUncompletedIdx;

  const items = ordered.map((m, idx) => ({
    mission: m,
    completed: completedIds.has(m.id),
    unlocked: true,
    isCurrent: idx === currentIdx,
  }));

  return {
    items,
    currentMission: ordered[currentIdx] || null,
    completedCount: completedIds.size,
    totalCount: ordered.length,
    isLoading: missionsQuery.isLoading || (isAuthenticated && completionsQuery.isLoading),
  };
}

// Records completion for a mission (idempotent — no duplicate rows).
export function useCompleteMission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (missionId) => {
      const existing = await base44.entities.MissionCompletion.filter({ mission_id: missionId }, "-completed_at", 1);
      if (existing && existing.length > 0) return existing[0];
      return base44.entities.MissionCompletion.create({
        mission_id: missionId,
        completed_at: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mission-completions"] });
    },
  });
}