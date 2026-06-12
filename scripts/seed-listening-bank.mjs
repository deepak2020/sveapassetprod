// Seed the listening_bank table from JSON files in supabase/seed/listening/.
//
// Usage:
//   export SUPABASE_SERVICE_KEY=...          (service role key — never commit)
//   node scripts/seed-listening-bank.mjs [--dry-run]
//
// Each JSON file holds an array of rows: { id, course, type, intro,
// transcript, questions, sort_order }. Rows are upserted on id; existing
// audio_url values are left untouched.

import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://zpuaksuhvgwvnvopjaov.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const DRY_RUN = process.argv.includes("--dry-run");

const seedDir = join(dirname(fileURLToPath(import.meta.url)), "..", "supabase", "seed", "listening");

function fail(msg) {
  console.error(`Error: ${msg}`);
  process.exit(1);
}

function validate(row, file) {
  const ctx = `${file} → ${row.id || "<no id>"}`;
  for (const k of ["id", "course", "type", "intro", "transcript", "questions"])
    if (row[k] == null) fail(`${ctx}: missing "${k}"`);
  if (!Array.isArray(row.transcript) || row.transcript.length === 0)
    fail(`${ctx}: transcript must be a non-empty array`);
  for (const line of row.transcript)
    if (!line.speaker || !line.text) fail(`${ctx}: transcript line needs speaker and text`);
  const speakers = new Set(row.transcript.map((l) => l.speaker));
  if (speakers.size > 4) fail(`${ctx}: more than 4 speakers (only 4 TTS voices available)`);
  if (!Array.isArray(row.questions) || row.questions.length === 0)
    fail(`${ctx}: questions must be a non-empty array`);
  for (const q of row.questions) {
    if (!q.q) fail(`${ctx}: question missing "q"`);
    if (q.type === "open") {
      if (!Array.isArray(q.accept) || q.accept.length === 0)
        fail(`${ctx}: open question needs a non-empty "accept" array`);
    } else {
      if (!Array.isArray(q.options) || q.options.length < 2)
        fail(`${ctx}: question needs an options array`);
      if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex >= q.options.length)
        fail(`${ctx}: correctIndex out of range`);
    }
  }
}

async function upsert(rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/listening_bank?on_conflict=id`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) fail(`Supabase upsert failed (${res.status}): ${await res.text()}`);
}

const files = readdirSync(seedDir).filter((f) => f.endsWith(".json")).sort();
if (files.length === 0) fail(`no JSON files in ${seedDir}`);

const all = [];
const seen = new Set();
for (const file of files) {
  const rows = JSON.parse(readFileSync(join(seedDir, file), "utf8"));
  for (const row of rows) {
    validate(row, file);
    if (seen.has(row.id)) fail(`duplicate id ${row.id}`);
    seen.add(row.id);
    all.push({
      id: row.id,
      course: row.course,
      type: row.type,
      intro: row.intro,
      transcript: row.transcript,
      questions: row.questions,
      sort_order: row.sort_order ?? 0,
    });
  }
  console.log(`${file}: ${rows.length} row(s) ok`);
}
console.log(`Total: ${all.length} row(s)`);

if (DRY_RUN) {
  console.log("Dry run — nothing written.");
  process.exit(0);
}

if (!SERVICE_KEY) fail("SUPABASE_SERVICE_KEY is not set");
for (let i = 0; i < all.length; i += 50) await upsert(all.slice(i, i + 50));
console.log("Upsert complete.");
