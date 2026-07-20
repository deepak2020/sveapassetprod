-- Speaking missions (Tala) — one row per mission/topic.
-- Run in the Supabase SQL Editor. Safe to re-run.
--
-- This backs the admin "Seed to DB" / "Seed all missing" buttons in the
-- Mission catalog, which insert rows from the browser using the anon key.
-- The metadata columns (title_sv … "order") plus the generated content
-- columns match the object built in src/pages/AdminMissions.jsx.

create table if not exists speaking_topics (
  id uuid primary key default gen_random_uuid(),
  -- metadata
  title_sv text not null,
  title_en text,
  level text,
  category text,
  emoji text,
  "order" int,
  -- generated content
  description_en text,
  opener_sv text,
  opener_en text,
  goal text,
  cultural_notes text,
  success_criteria jsonb,
  curveballs jsonb,
  suggested_vocab jsonb,
  key_vocabulary jsonb,
  key_phrases jsonb,
  rehearsal_drills jsonb,
  created_at timestamptz not null default now()
);

-- Avoid duplicate missions when seeding is re-run.
create unique index if not exists speaking_topics_title_sv_key on speaking_topics (title_sv);

alter table speaking_topics enable row level security;

-- Everyone can read the missions (same as listening_bank).
drop policy if exists "Public read access" on speaking_topics;
create policy "Public read access" on speaking_topics for select using (true);

-- ─────────────────────────────────────────────────────────────────────
-- INSERT policy for the admin seeding buttons.
--
-- ⚠ SECURITY NOTE: the app talks to Supabase with the public anon key and
-- gates the admin UI only on the client. A blanket insert policy therefore
-- lets ANYONE with the anon key insert rows into speaking_topics. That is
-- acceptable for a one-time content load but is NOT a good permanent state.
--
-- Recommended workflow:
--   1. Run this whole file once (creates the table + enables the policy).
--   2. Use the "Seed all missing" button in the admin Mission catalog.
--   3. Then run the DROP POLICY line at the bottom to lock the table back
--      down to read-only. Re-add it later only when you need to seed again.
--
-- (If you prefer to never expose public insert, skip this policy and seed
--  with a service-role key from a script instead — the anon-key button will
--  just fail, which is fine.)
-- ─────────────────────────────────────────────────────────────────────
drop policy if exists "Anon insert (seeding)" on speaking_topics;
create policy "Anon insert (seeding)" on speaking_topics for insert with check (true);

-- After seeding, lock it back down by running:
--   drop policy if exists "Anon insert (seeding)" on speaking_topics;
