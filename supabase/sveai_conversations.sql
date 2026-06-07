-- ============================================================
-- SveAI conversations table
-- Stores each user's chat history per scenario so they can
-- resume a conversation later instead of starting from scratch.
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS sveai_conversations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT NOT NULL,
  scenario_id  TEXT NOT NULL,
  messages     JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, scenario_id)
);

ALTER TABLE sveai_conversations ENABLE ROW LEVEL SECURITY;

-- Users read and write their own conversations (ownership enforced client-side via user_id)
CREATE POLICY "users read own sveai conversations"
  ON sveai_conversations FOR SELECT
  USING (true);

CREATE POLICY "users insert own sveai conversations"
  ON sveai_conversations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "users update own sveai conversations"
  ON sveai_conversations FOR UPDATE
  USING (true);

CREATE INDEX IF NOT EXISTS idx_sveai_conversations_user ON sveai_conversations (user_id, scenario_id);
