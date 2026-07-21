import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { supabase } from "@/api/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { awardXP, XP_REWARDS } from "@/lib/xp";

// Ordered list of missions (linear path) + which have been completed.
// Linear order: CEFR level first (A1 → C1), then the topic's own `order` field.
const LEVEL_ORDER = { A1: 0, A2: 1, B1: 2, B2: 3, C1: 4 };

const ALL_STAGES = ["briefing", "ord", "fraser", "repetera", "live"];

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

// A mission counts as "fully complete" when all 5 stages are done.
function isFullyComplete(record) {
  if (!record) return false;
  if (record.completed_at) return true;
  const stages = record.stages_completed || [];
  return ALL_STAGES.every((s) => stages.includes(s));
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

  const recordsById = new Map(
    (completionsQuery.data || []).map((r) => [r.mission_id, r])
  );
  const completedIds = new Set(
    (completionsQuery.data || [])
      .filter((r) => isFullyComplete(r))
      .map((r) => r.mission_id)
  );

  // All missions are unlocked for everyone. The "current" one is still the first
  // fully-uncompleted mission (used for the "continue" CTA), but nothing is ever locked.
  const firstUncompletedIdx = ordered.findIndex((m) => !completedIds.has(m.id));
  const currentIdx = firstUncompletedIdx === -1 ? ordered.length : firstUncompletedIdx;

  const items = ordered.map((m, idx) => {
    const record = recordsById.get(m.id);
    return {
      mission: m,
      completed: completedIds.has(m.id),
      unlocked: true,
      isCurrent: idx === currentIdx,
      stagesCompleted: record?.stages_completed || [],
      lastStage: record?.last_stage || null,
    };
  });

  return {
    items,
    currentMission: ordered[currentIdx] || null,
    completedCount: completedIds.size,
    totalCount: ordered.length,
    isLoading: missionsQuery.isLoading || (isAuthenticated && completionsQuery.isLoading),
  };
}

// Look up saved progress for a single mission (stages completed + last stage).
export function useMissionRecord(missionId) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ["mission-completion", missionId],
    queryFn: async () => {
      const rows = await base44.entities.MissionCompletion.filter(
        { mission_id: missionId },
        "-completed_at",
        1
      );
      return rows?.[0] || null;
    },
    enabled: !!missionId && isAuthenticated,
  });
}

// Save (or upsert) stage-level progress for a mission. Called each time the
// user finishes a stage or moves between stages. Awards XP the first time all
// 5 stages are done.
export function useSaveMissionProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ missionId, stageCompleted, currentStage }) => {
      if (!missionId) return null;
      const existing = await base44.entities.MissionCompletion.filter(
        { mission_id: missionId },
        "-completed_at",
        1
      );
      const prev = existing?.[0] || null;
      const prevStages = new Set(prev?.stages_completed || []);
      if (stageCompleted) prevStages.add(stageCompleted);
      const stages_completed = ALL_STAGES.filter((s) => prevStages.has(s));

      const wasFullyComplete = isFullyComplete(prev);
      const nowFullyComplete = ALL_STAGES.every((s) => prevStages.has(s));
      const justFinished = !wasFullyComplete && nowFullyComplete;

      const patch = {
        mission_id: missionId,
        stages_completed,
        last_stage: currentStage || prev?.last_stage || stageCompleted || "briefing",
      };
      if (justFinished) patch.completed_at = new Date().toISOString();

      let record;
      if (prev) {
        record = await base44.entities.MissionCompletion.update(prev.id, patch);
      } else {
        record = await base44.entities.MissionCompletion.create(patch);
      }

      if (justFinished) {
        await awardXP(base44, XP_REWARDS.mission_complete, "🎯 Uppdrag klart!");
      }

      return { record, justFinished };
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["mission-completions"] });
      if (vars?.missionId) {
        qc.invalidateQueries({ queryKey: ["mission-completion", vars.missionId] });
      }
    },
  });
}

// Backwards-compatible helper: mark the whole mission complete in one call.
export function useCompleteMission() {
  const save = useSaveMissionProgress();
  return {
    ...save,
    mutate: (missionId) =>
      save.mutate({ missionId, stageCompleted: "live", currentStage: "live" }),
  };
}