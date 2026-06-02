-- User feedback table
-- Run this in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS user_feedback (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email  text,
  mood        text,
  category    text,
  message     text NOT NULL,
  page_url    text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Anyone can submit feedback (logged in or not)
CREATE POLICY "anyone can insert feedback"
  ON user_feedback FOR INSERT WITH CHECK (true);

-- Only service role (Supabase dashboard / admin) can read
CREATE POLICY "service role reads feedback"
  ON user_feedback FOR SELECT USING (false);

CREATE INDEX IF NOT EXISTS idx_feedback_created ON user_feedback (created_at DESC);
