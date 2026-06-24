import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BREVO_API = 'https://api.brevo.com/v3';
const APP_URL = 'https://sveapasset.se';
const enc = new TextEncoder();

async function hmacSign(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// Evening nudge: "you still have a few hours to keep your streak alive".
function buildEmail({ firstName, streak, unsubUrl }) {
  const subject = streak >= 7
    ? `🔥 ${firstName}, save your ${streak}-day streak before midnight!`
    : `🔥 Don't break your ${streak}-day streak, ${firstName}!`;

  const headline = `${streak} day${streak === 1 ? '' : 's'} strong — keep it alive tonight 🌙`;

  const body = `
    <p style="font-size:16px;color:#334155">Kvällen är här, ${firstName}! Du har en aktiv svit på <strong>${streak} dag${streak === 1 ? '' : 'ar'}</strong> — men du har inte övat idag än.</p>
    <p style="font-size:15px;color:#475569">Just 2 minutes of Swedish keeps your streak going. A quick flashcard round, a daily quiz, or one Skriva sentence — that's all it takes.</p>
  `;

  const html = `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;margin:0">
    <div style="max-width:540px;margin:0 auto;background:white;border-radius:16px;padding:32px;border:1px solid #e2e8f0">
      <h1 style="font-size:22px;color:#0f172a;margin:0 0 16px">${headline}</h1>
      ${body}
      <div style="text-align:center;margin:28px 0">
        <a href="${APP_URL}/gym" style="display:inline-block;background:#1e3a8a;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600">Keep my streak alive →</a>
      </div>
      <p style="font-size:13px;color:#94a3b8;text-align:center;margin:0">Lycka till! · Team Sveapasset 💙💛</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
      <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0">
        Don't want these reminders? <a href="${unsubUrl}" style="color:#94a3b8;text-decoration:underline">Unsubscribe</a>
      </p>
    </div>
  </body></html>`;

  return { subject, html };
}

// Triggered daily by a scheduled automation at 18:00 UTC (= 19:00/20:00 Stockholm).
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const apiKey = Deno.env.get('BREVO_API_KEY');
  if (!apiKey) return Response.json({ error: 'BREVO_API_KEY not set' }, { status: 500 });

  let isAdmin = false;
  try {
    const me = await base44.auth.me();
    isAdmin = me?.role === 'admin';
  } catch {
    isAdmin = true; // service-role / scheduled run
  }
  if (!isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const users = await base44.asServiceRole.entities.User.list('-created_date', 500);
  let sent = 0, skipped = 0, failed = 0;
  const errors = [];

  for (const u of users) {
    if (!u.email) { skipped++; continue; }
    if (u.email_reminders_disabled) { skipped++; continue; }

    const streak = u.streak_days || 0;
    // Only nudge users with an active streak to protect.
    if (streak < 1) { skipped++; continue; }

    // Only if they HAVEN'T already practised today — last_active_date is the day they last got XP.
    if (u.last_active_date === today) { skipped++; continue; }

    const firstName = (u.full_name || '').split(' ')[0] || 'där';
    const token = await hmacSign(apiKey, u.id);
    const unsubUrl = `${APP_URL}/functions/unsubscribeEmails?uid=${u.id}&t=${token}`;
    const { subject, html } = buildEmail({ firstName, streak, unsubUrl });

    try {
      const res = await fetch(`${BREVO_API}/smtp/email`, {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: [{ email: u.email, name: u.full_name || firstName }],
          sender: { email: 'hello@sveapasset.se', name: 'Sveapasset' },
          subject,
          htmlContent: html,
          tags: ['streak_reminder'],
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        failed++;
        errors.push(`${u.email}: ${res.status} ${body.slice(0, 120)}`);
      } else {
        sent++;
      }
    } catch (e) {
      failed++;
      errors.push(`${u.email}: ${e.message}`);
    }
  }

  return Response.json({
    sent, skipped, failed,
    total_users: users.length,
    errors: errors.slice(0, 10),
    run_at: now.toISOString(),
  });
});