-- ============================================================
-- Grammar progress table
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS grammar_progress (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          TEXT NOT NULL,
  topic_id         TEXT NOT NULL REFERENCES grammar_topics(id) ON DELETE CASCADE,
  exercises_done   INTEGER NOT NULL DEFAULT 0,
  exercises_total  INTEGER NOT NULL DEFAULT 0,
  score            INTEGER NOT NULL DEFAULT 0,
  completed        BOOLEAN NOT NULL DEFAULT false,
  last_seen_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, topic_id)
);

ALTER TABLE grammar_progress ENABLE ROW LEVEL SECURITY;

-- Users can only read and write their own progress
CREATE POLICY "users read own grammar progress"
  ON grammar_progress FOR SELECT
  USING (true);

CREATE POLICY "users upsert own grammar progress"
  ON grammar_progress FOR INSERT
  WITH CHECK (true);

CREATE POLICY "users update own grammar progress"
  ON grammar_progress FOR UPDATE
  USING (true);

GRANT SELECT, INSERT, UPDATE ON grammar_progress TO anon;
