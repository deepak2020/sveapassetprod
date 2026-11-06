import { useCallback, useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

// The learner's own error log (own records only, enforced by RLS).
export function useErrorLog(enabled = true) {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!enabled) {
      setErrors([]);
      setLoading(false);
      return;
    }
    const page = await base44.entities.ErrorLog.filter({}, { sort: "-last_seen", limit: 200 });
    setErrors(page.items || []);
    setLoading(false);
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  return { errors, loading, reload: load };
}

const norm = (s) => String(s || "").trim().toLowerCase();

// Adds Svea's corrections to the error log, bumping the counter when the same
// wrong/correct pair has been seen before.
export async function logWritingErrors(feedbackErrors) {
  const list = Array.isArray(feedbackErrors) ? feedbackErrors : [];
  if (!list.length) return;

  const page = await base44.entities.ErrorLog.filter({}, { limit: 500 });
  const existing = page.items || [];
  const today = new Date().toISOString().split("T")[0];

  const creates = [];
  const updates = [];
  const handled = new Set();

  list.forEach((e) => {
    if (!e?.wrong || !e?.correct) return;
    const key = `${norm(e.wrong)}|${norm(e.correct)}`;
    if (handled.has(key)) return;
    handled.add(key);

    const match = existing.find(
      (x) => x.error_type === e.type && norm(x.wrong_text) === norm(e.wrong) && norm(x.correct_text) === norm(e.correct)
    );

    if (match) {
      updates.push({ id: match.id, count: (match.count || 1) + 1, last_seen: today, rule: e.rule || match.rule });
    } else {
      creates.push({
        error_type: e.type || "other",
        wrong_text: e.wrong,
        correct_text: e.correct,
        rule: e.rule || "",
        count: 1,
        last_seen: today,
      });
    }
  });

  if (creates.length) await base44.entities.ErrorLog.bulkCreate(creates);
  if (updates.length) await base44.entities.ErrorLog.bulkUpdate(updates);
}

// Top error types by total occurrences, with a couple of real examples each.
export function summarizeErrors(errors) {
  const byType = new Map();

  errors.forEach((e) => {
    const current = byType.get(e.error_type) || { type: e.error_type, total: 0, rows: [] };
    current.total += e.count || 1;
    current.rows.push(e);
    byType.set(e.error_type, current);
  });

  return Array.from(byType.values())
    .map((group) => ({
      ...group,
      rows: group.rows.sort((a, b) => (b.count || 1) - (a.count || 1)),
    }))
    .sort((a, b) => b.total - a.total);
}