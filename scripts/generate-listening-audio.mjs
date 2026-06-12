#!/usr/bin/env node
// Generate audio for listening_bank items and store it in Supabase.
//
// Routing: everything is rendered with Azure Speech by default — multi-voice
// SSML (<voice name="...">) handles conversations with several speakers in
// a single API call, which covers all clip types for free (up to 0.5M
// chars/month). Types listed in ELEVEN_TYPES (none by default) fall back to
// ElevenLabs for extra-lifelike delivery if you want to mix engines later.
// Only rows with audio_url = null are processed, so the script is safe to
// re-run; null a row's audio_url to regenerate it.
//
// Usage:
//   export SUPABASE_SERVICE_KEY=...          (service role key — never commit)
//   export AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=swedencentral
//   export ELEVENLABS_API_KEY=...            (only needed if ELEVEN_TYPES is non-empty)
//   node scripts/generate-listening-audio.mjs [--dry-run] [--only=c-tel-001]
//        [--type=phone] [--limit=5]
//
// Requirements: Node 18+ (built-in fetch). ffmpeg is optional — used to add
// natural pauses between dialogue turns when ElevenLabs is used; without it,
// segments are joined directly.

import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://zpuaksuhvgwvnvopjaov.supabase.co";
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const AZURE_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_REGION = process.env.AZURE_SPEECH_REGION || "swedencentral";
const ELEVEN_KEY = process.env.ELEVENLABS_API_KEY;

const BUCKET = "listening-audio";

// Which engine renders which clip type. Azure handles everything by
// default via multi-voice SSML; list a type here to render it with
// ElevenLabs instead.
const ELEVEN_TYPES = new Set([]);

// Azure voice cast — rotated per speaker within a clip. Mix of female/male
// neural voices so multi-person conversations sound distinct.
const AZURE_VOICES = [
  "sv-SE-SofieNeural",
  "sv-SE-MattiasNeural",
  "sv-SE-HilleviNeural",
  // Azure only ships three sv-SE voices; a 4th speaker gets a male
  // multilingual voice that handles Swedish.
  "en-US-AndrewMultilingualNeural",
];

// ElevenLabs voice cast. These are premade multilingual voices; replace with
// voice IDs from your Voice Library (pick native Swedish voices for best
// results — search "Swedish" at elevenlabs.io/voice-library).
const ELEVEN_VOICES = [
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel (F)" },
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam (M)" },
  { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah (F)" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh (M)" },
];
const ELEVEN_MODEL = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";

// ── CLI args ─────────────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const DRY_RUN = !!args["dry-run"];

function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exit(1);
}

// ── Supabase helpers (service key) ──────────────────────────────────
async function sb(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${options.method || "GET"} ${path} → ${res.status}: ${body}`);
  }
  return res;
}

async function fetchPendingItems() {
  let query = `/rest/v1/listening_bank?audio_url=is.null&order=type,sort_order&select=id,course,type,intro,transcript`;
  if (args.only) query = `/rest/v1/listening_bank?id=eq.${args.only}&select=id,course,type,intro,transcript`;
  if (args.type) query += `&type=eq.${args.type}`;
  const res = await sb(query, { headers: { "Content-Type": "application/json" } });
  let items = await res.json();
  if (args.limit) items = items.slice(0, Number(args.limit));
  return items;
}

async function ensureBucket() {
  const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket/${BUCKET}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
  });
  if (res.ok) return;
  await sb(`/storage/v1/bucket`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  });
  console.log(`  created public bucket "${BUCKET}"`);
}

async function uploadAudio(path, buffer) {
  await sb(`/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "audio/mpeg", "x-upsert": "true" },
    body: buffer,
  });
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
}

async function setAudioUrl(id, url) {
  await sb(`/rest/v1/listening_bank?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ audio_url: url }),
  });
}

// ── Azure Speech ─────────────────────────────────────────────────────
function azureSsml(item) {
  const speakers = [...new Set(item.transcript.map((l) => l.speaker))];
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const lines = item.transcript
    .map((line) => {
      const voice = AZURE_VOICES[speakers.indexOf(line.speaker) % AZURE_VOICES.length];
      return `  <voice name="${voice}"><prosody rate="-5%">${esc(line.text)}</prosody><break time="700ms"/></voice>`;
    })
    .join("\n");
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="sv-SE">\n${lines}\n</speak>`;
}

async function generateAzure(item) {
  const res = await fetch(`https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": AZURE_KEY,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-96kbitrate-mono-mp3",
      "User-Agent": "sveapasset-audio-gen",
    },
    body: azureSsml(item),
  });
  if (!res.ok) throw new Error(`Azure TTS ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

// ── ElevenLabs ───────────────────────────────────────────────────────
async function elevenSegment(text, voiceId) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: { "xi-api-key": ELEVEN_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      model_id: ELEVEN_MODEL,
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

let hasFfmpeg = null;
function ffmpegAvailable() {
  if (hasFfmpeg !== null) return hasFfmpeg;
  try {
    execFileSync("ffmpeg", ["-version"], { stdio: "ignore" });
    hasFfmpeg = true;
  } catch {
    hasFfmpeg = false;
    console.warn("  (ffmpeg not found — dialogue turns joined without extra pause)");
  }
  return hasFfmpeg;
}

// Join MP3 segments. With ffmpeg: re-encode with 600ms silence between
// turns for natural conversational rhythm. Without: raw concatenation
// (players handle back-to-back MP3 streams fine; pause is just shorter).
function joinSegments(buffers) {
  if (buffers.length === 1) return buffers[0];
  if (!ffmpegAvailable()) return Buffer.concat(buffers);

  const dir = mkdtempSync(join(tmpdir(), "listening-"));
  try {
    const inputs = [];
    buffers.forEach((b, i) => {
      const p = join(dir, `seg${i}.mp3`);
      writeFileSync(p, b);
      inputs.push(p);
    });
    const listFile = join(dir, "list.txt");
    const silence = join(dir, "silence.mp3");
    execFileSync("ffmpeg", ["-y", "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono", "-t", "0.6", "-q:a", "9", silence], { stdio: "ignore" });
    const entries = inputs.flatMap((p, i) => (i === 0 ? [`file '${p}'`] : [`file '${silence}'`, `file '${p}'`]));
    writeFileSync(listFile, entries.join("\n"));
    const out = join(dir, "out.mp3");
    execFileSync("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c:a", "libmp3lame", "-b:a", "96k", out], { stdio: "ignore" });
    return readFileSync(out);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

async function generateEleven(item) {
  const speakers = [...new Set(item.transcript.map((l) => l.speaker))];
  const buffers = [];
  for (const line of item.transcript) {
    const voice = ELEVEN_VOICES[speakers.indexOf(line.speaker) % ELEVEN_VOICES.length];
    buffers.push(await elevenSegment(line.text, voice.id));
  }
  return joinSegments(buffers);
}

// ── Main ─────────────────────────────────────────────────────────────
async function main() {
  if (!SERVICE_KEY) fail("SUPABASE_SERVICE_KEY is not set");

  const items = await fetchPendingItems();
  if (items.length === 0) {
    console.log("Nothing to do — all items have audio.");
    return;
  }

  const plan = items.map((it) => ({
    id: it.id,
    type: it.type,
    engine: ELEVEN_TYPES.has(it.type) ? "elevenlabs" : "azure",
    chars: it.transcript.reduce((s, l) => s + l.text.length, 0),
  }));

  console.log(`${items.length} item(s) to generate:`);
  for (const p of plan) console.log(`  ${p.id}  [${p.type}] → ${p.engine}  (${p.chars} chars)`);
  const totals = plan.reduce((acc, p) => ((acc[p.engine] = (acc[p.engine] || 0) + p.chars), acc), {});
  console.log(`Characters: azure=${totals.azure || 0}, elevenlabs=${totals.elevenlabs || 0}`);

  if (DRY_RUN) {
    console.log("Dry run — no audio generated.");
    return;
  }

  const needsAzure = plan.some((p) => p.engine === "azure");
  const needsEleven = plan.some((p) => p.engine === "elevenlabs");
  if (needsAzure && !AZURE_KEY) fail("AZURE_SPEECH_KEY is not set");
  if (needsEleven && !ELEVEN_KEY) fail("ELEVENLABS_API_KEY is not set (needed for ELEVEN_TYPES items)");

  await ensureBucket();

  let done = 0;
  for (const item of items) {
    const engine = ELEVEN_TYPES.has(item.type) ? "elevenlabs" : "azure";
    process.stdout.write(`[${++done}/${items.length}] ${item.id} (${engine})… `);
    try {
      const buffer = engine === "azure" ? await generateAzure(item) : await generateEleven(item);
      const path = `${item.course.toLowerCase()}/${item.id}.mp3`;
      const url = await uploadAudio(path, buffer);
      await setAudioUrl(item.id, url);
      console.log(`ok (${Math.round(buffer.length / 1024)} KB)`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }
  console.log("Done.");
}

main().catch((err) => fail(err.message));
