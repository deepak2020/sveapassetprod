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

-- Allow reads via anon key (access controlled at app level — admin page only)
CREATE POLICY "public can read feedback"
  ON user_feedback FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_feedback_created ON user_feedback (created_at DESC);

-- If the table already exists and you need to fix the SELECT policy, run:
-- DROP POLICY IF EXISTS "service role reads feedback" ON user_feedback;
-- DROP POLICY IF EXISTS "public can read feedback" ON user_feedback;
-- CREATE POLICY "public can read feedback" ON user_feedback FOR SELECT USING (true);
