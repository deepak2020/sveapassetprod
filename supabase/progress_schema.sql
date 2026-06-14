-- ============================================================================
-- Single source of truth for learner progress (Supabase).
--
-- Keyed by the base44 user id (TEXT), matching the existing grammar_progress
-- pattern: permissive RLS + GRANT to anon. Progress is non-sensitive learning
-- data; for true per-user isolation, switch to Supabase Auth + auth.uid().
--
-- Run in the Supabase SQL editor. Safe to re-run.
-- ============================================================================

-- ── 1. Overall stats / the study plan ──────────────────────────────────────
create table if not exists user_stats (
  user_id        text primary key,
  sfi_level      text,                       -- current course: A | B | C | D
  daily_goal     int  not null default 1,    -- e.g. lessons per day
  xp_total       int  not null default 0,
  streak_days    int  not null default 0,
  last_active    date,
  updated_at     timestamptz not null default now()
);

-- ── 2. Lesson progress: what's finished + where you left off ────────────────
create table if not exists lesson_progress (
  user_id        text not null,
  lesson_id      text not null,
  sfi_course     text,
  status         text not null default 'in_progress', -- in_progress | completed
  completed_tabs jsonb not null default '[]'::jsonb,   -- e.g. ["vocabulary","quiz"]
  scores         jsonb not null default '{}'::jsonb,   -- { "quiz": {score,total,pct} }
  last_tab       text,                                  -- resume: which tab
  last_index     int  not null default 0,               -- resume: item index
  completed_at   timestamptz,
  updated_at     timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create index if not exists lesson_progress_user_idx on lesson_progress (user_id);

-- ── 3. Quiz/test results: history → weak areas & mastery ────────────────────
create table if not exists quiz_results (
  id             bigint generated always as identity primary key,
  user_id        text not null,
  quiz_type      text not null,              -- language | listening | civic | lesson_tab
  source_id      text,
  source_title   text,
  skill          text,                       -- vocabulary | grammar | reading | ...
  sfi_course     text,
  score          int  not null default 0,
  total          int  not null default 0,
  percentage     int  not null default 0,
  created_at     timestamptz not null default now()
);
create index if not exists quiz_results_user_skill_idx on quiz_results (user_id, skill);
create index if not exists quiz_results_user_created_idx on quiz_results (user_id, created_at desc);

-- ── 4. Spaced-repetition review items (the practice engine) ─────────────────
-- One row per (user, learnable item). Scheduling uses an SM-2-style algorithm:
-- a correct answer pushes due_date further out; a wrong answer resets it.
create table if not exists review_items (
  user_id        text not null,
  item_key       text not null,              -- stable id, e.g. "vocab:lesson123:hej"
  item_type      text not null default 'vocab', -- vocab | phrase | question
  lesson_id      text,
  sfi_course     text,
  prompt         text,                       -- shown side (e.g. Swedish word)
  answer         text,                       -- expected answer (e.g. English)
  ease           real not null default 2.5,  -- SM-2 ease factor
  interval_days  int  not null default 0,
  reps           int  not null default 0,
  lapses         int  not null default 0,
  due_date       date not null default current_date,
  last_result    text,                       -- again | hard | good | easy
  last_reviewed  timestamptz,
  updated_at     timestamptz not null default now(),
  primary key (user_id, item_key)
);
-- "What do I practice today?" → due items, oldest first.
create index if not exists review_items_due_idx on review_items (user_id, due_date);

-- ── RLS (permissive, matches grammar_progress) ──────────────────────────────
-- NOTE: USING (true) does NOT isolate users at the DB level; rows are scoped
-- by the user_id sent in the query. Swap to auth.uid() with Supabase Auth for
-- real isolation.
do $$
declare t text;
begin
  foreach t in array array['user_stats','lesson_progress','quiz_results','review_items']
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "rw %1$s" on %1$s;', t);
    execute format('create policy "rw %1$s" on %1$s for all using (true) with check (true);', t);
    execute format('grant select, insert, update, delete on %I to anon;', t);
  end loop;
end $$;
grant usage, select on sequence quiz_results_id_seq to anon;
