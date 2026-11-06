import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { readLocal, writeLocal } from "@/lib/writingMissions";

// Mission definitions are public — everyone can browse them.
export function useMissions() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const page = await base44.entities.Mission.filter({}, { sort: "order", limit: 100 });
        if (alive) setMissions(page.items || []);
      } catch {
        if (alive) setMissions([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return { missions, loading };
}

// Progress is stored per user; signed-out visitors keep it in localStorage.
export function useMissionProgress() {
  const [records, setRecords] = useState([]);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await base44.auth.me();
        if (!alive) return;
        setSignedIn(true);
        const page = await base44.entities.MissionProgress.filter({}, { limit: 200 });
        if (alive) setRecords(page.items || []);
      } catch {
        if (alive) setRecords(readLocal("progress"));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const save = useCallback(
    async (missionId, patch) => {
      const existing = records.find((r) => r.mission_id === missionId);
      const payload = { ...patch, last_updated: new Date().toISOString() };

      if (!signedIn) {
        const next = existing
          ? records.map((r) => (r.mission_id === missionId ? { ...r, ...payload } : r))
          : [...records, { mission_id: missionId, completed_stages: [], current_stage: 1, ...payload }];
        setRecords(next);
        writeLocal("progress", next);
        return;
      }

      if (existing) {
        const updated = await base44.entities.MissionProgress.update(existing.id, payload);
        setRecords((prev) =>
          prev.map((r) => (r.mission_id === missionId ? { ...r, ...(updated || payload) } : r))
        );
      } else {
        const created = await base44.entities.MissionProgress.create({
          mission_id: missionId,
          completed_stages: [],
          current_stage: 1,
          ...payload,
        });
        setRecords((prev) => [...prev, created]);
      }
    },
    [records, signedIn]
  );

  const progressFor = useCallback(
    (missionId) => records.find((r) => r.mission_id === missionId) || null,
    [records]
  );

  return { records, progressFor, save, signedIn, loading };
}

// Submissions feed the feedback screen, the weekly goal and the error log.
export function useMissionSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await base44.auth.me();
        if (!alive) return;
        setSignedIn(true);
        const page = await base44.entities.WritingSubmission.filter(
          { mission_id: { $exists: true } },
          { sort: "-created_date", limit: 200 }
        );
        if (alive) setSubmissions(page.items || []);
      } catch {
        if (alive) setSubmissions(readLocal("submissions"));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const save = useCallback(
    async (data) => {
      if (!signedIn) {
        const record = { ...data, id: `local-${Date.now()}`, created_date: new Date().toISOString() };
        const next = [record, ...submissions];
        setSubmissions(next);
        writeLocal("submissions", next);
        return record;
      }
      const record = await base44.entities.WritingSubmission.create(data);
      setSubmissions((prev) => [record, ...prev]);
      return record;
    },
    [signedIn, submissions]
  );

  const remove = useCallback(
    async (id) => {
      if (signedIn && !String(id).startsWith("local-")) {
        await base44.entities.WritingSubmission.delete(id);
      }
      setSubmissions((prev) => {
        const next = prev.filter((s) => s.id !== id);
        if (!signedIn) writeLocal("submissions", next);
        return next;
      });
    },
    [signedIn]
  );

  return { submissions, save, remove, signedIn, loading };
}