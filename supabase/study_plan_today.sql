-- Store today's chosen lesson set on the study plan so it's consistent across
-- devices (instead of per-device localStorage). Shape: { "date": "YYYY-MM-DD",
-- "lesson_ids": [...] }. Run once in the Supabase SQL editor. Safe to re-run.
alter table study_plans add column if not exists today_plan jsonb;
