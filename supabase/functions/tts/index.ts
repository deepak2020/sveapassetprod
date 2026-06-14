// Supabase Edge Function: Azure Text-to-Speech with Storage caching.
//
// POST { text: string, voice?: string } -> { url, cached }
//
// The first time a phrase is requested it is synthesised with Azure Speech
// and stored in the public "tts-cache" bucket, keyed by a hash of voice+text.
// Every later request for the same phrase returns the stored URL — so each
// word/sentence is generated once and then served as a static MP3.
//
// Required secrets (supabase secrets set ...):
//   AZURE_SPEECH_KEY, AZURE_SPEECH_REGION (default swedencentral)
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const AZURE_KEY = Deno.env.get("AZURE_SPEECH_KEY") ?? "";
const AZURE_REGION = Deno.env.get("AZURE_SPEECH_REGION") ?? "swedencentral";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const BUCKET = "tts-cache";
const DEFAULT_VOICE = "sv-SE-MattiasNeural";
const ALLOWED_VOICES = new Set([
  "sv-SE-MattiasNeural",
  "sv-SE-SofieNeural",
  "sv-SE-HilleviNeural",
]);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function ssml(text: string, voice: string): string {
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="sv-SE">` +
    `<voice name="${voice}"><prosody rate="-8%">${esc(text)}</prosody></voice></speak>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

  try {
    const { text, voice: rawVoice } = await req.json().catch(() => ({}));
    const clean = typeof text === "string" ? text.trim() : "";
    if (!clean || clean.length > 600) return json({ error: "text required (<=600 chars)" }, 400);

    const voice = ALLOWED_VOICES.has(rawVoice) ? rawVoice : DEFAULT_VOICE;
    const hash = await sha256Hex(`${voice}::${clean}`);
    const path = `${voice}/${hash}.mp3`;
    const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;

    // Already cached → return immediately.
    const head = await fetch(url, { method: "HEAD" });
    if (head.ok) return json({ url, cached: true });

    if (!AZURE_KEY) return json({ error: "AZURE_SPEECH_KEY not configured" }, 500);

    // Synthesise with Azure.
    const azure = await fetch(`https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": AZURE_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-96kbitrate-mono-mp3",
        "User-Agent": "sveapasset-tts",
      },
      body: ssml(clean, voice),
    });
    if (!azure.ok) return json({ error: `Azure ${azure.status}: ${await azure.text()}` }, 502);
    const audio = new Uint8Array(await azure.arrayBuffer());

    // Upload to storage; create the bucket on first use if needed.
    const upload = () => supabase.storage.from(BUCKET).upload(path, audio, { contentType: "audio/mpeg", upsert: true });
    let { error: upErr } = await upload();
    if (upErr) {
      await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => {});
      ({ error: upErr } = await upload());
    }
    if (upErr) return json({ error: `upload: ${upErr.message}` }, 500);

    return json({ url, cached: false });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
