-- ============================================================
-- Add difficulty column + insert permission for admin
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

ALTER TABLE grammar_exercises
  ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'medium'
    CHECK (difficulty IN ('easy', 'medium', 'hard')),
  ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false;

-- Allow anon to insert exercises (admin generates from browser)
CREATE POLICY "admin insert grammar exercises"
  ON grammar_exercises FOR INSERT
  WITH CHECK (true);

GRANT INSERT ON grammar_exercises TO anon;
