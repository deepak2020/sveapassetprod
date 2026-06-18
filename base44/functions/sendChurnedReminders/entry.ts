// Re-engagement email for churned users (15+ days inactive, but joined within
// last 90 days so we don't pester ancient signups). Stronger "we miss you" tone
// than the daily inactivity nudge.

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

function buildEmail({ firstName, xp, unsubUrl, neverActive }) {
  const subject = neverActive
    ? `${firstName}, your Swedish journey is waiting 🇸🇪`
    : `Vi saknar dig, ${firstName} 💙 Come back to Sveapasset`;

  const headline = neverActive
    ? `Welcome back, ${firstName} — let's actually start! 👋`
    : `We miss you, ${firstName} 💙`;

  const body = neverActive
    ? `<p style="font-size:16px;color:#334155">You signed up for Sveapasset but haven't started learning yet. No pressure — but Swedish fluency is closer than you think.</p>
       <p style="font-size:15px;color:#475569">Try just <strong>one</strong> lesson today. 2 minutes. That's all it takes to build the habit.</p>`
    : `<p style="font-size:16px;color:#334155">It's been a while since you practised on Sveapasset${xp > 0 ? `, and your <strong>${xp.toLocaleString()} XP</strong> is waiting for you` : ''}.</p>
       <p style="font-size:15px;color:#475569">No guilt, no pressure — just a friendly nudge. Come back for a 2-minute session and pick up where you left off. Your brain remembers more than you think. 🧠</p>`;

  const html = `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;margin:0">
    <div style="max-width:540px;margin:0 auto;background:white;border-radius:16px;padding:32px;border:1px solid #e2e8f0">
      <h1 style="font-size:24px;color:#0f172a;margin:0 0 16px">${headline}</h1>
      ${body}
      <div style="background:#eff6ff;border-radius:12px;padding:16px;margin:20px 0">
        <p style="font-size:14px;color:#1e3a8a;margin:0;font-weight:600">💡 What's new since you left:</p>
        <ul style="font-size:14px;color:#475569;margin:8px 0 0;padding-left:20px;line-height:1.7">
          <li>Smarter AI tutor (Svea) for personalised practice</li>
          <li>New grammar exercises with instant feedback</li>
          <li>Daily challenges to keep things fun</li>
        </ul>
      </div>
      <div style="text-align:center;margin:28px 0">
        <a href="${APP_URL}/gym" style="display:inline-block;background:#1e3a8a;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600">Come back — 2 minutes →</a>
      </div>
      <p style="font-size:13px;color:#94a3b8;text-align:center;margin:0">Vi ses snart! · Team Sveapasset 💙💛</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
      <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0">
        Don't want these emails? <a href="${unsubUrl}" style="color:#94a3b8;text-decoration:underline">Unsubscribe</a>
      </p>
    </div>
  </body></html>`;

  return { subject, html };
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const apiKey = Deno.env.get('BREVO_API_KEY');
  if (!apiKey) return Response.json({ error: 'BREVO_API_KEY not set' }, { status: 500 });

  let isAdmin = false;
  try {
    const me = await base44.auth.me();
    isAdmin = me?.role === 'admin';
  } catch {
    isAdmin = true;
  }
  if (!isAdmin) return Response.json({ error: 'Forbidden' }, { status: 403 });

  const now = new Date();
  const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const toDateStr = (d) => d.toISOString().split('T')[0];

  const users = await base44.asServiceRole.entities.User.list('-created_date', 1000);
  let sent = 0, skipped = 0, failed = 0;
  const errors = [];

  for (const u of users) {
    if (!u.email) { skipped++; continue; }
    if (u.email_reminders_disabled) { skipped++; continue; }

    // Only target users who joined within the last 90 days — anything older
    // is a cold lead we shouldn't be pinging.
    if (!u.created_date || u.created_date < ninetyDaysAgo.toISOString()) { skipped++; continue; }

    const neverActive = !u.last_active_date;
    const churned = neverActive || u.last_active_date < toDateStr(fifteenDaysAgo);
    if (!churned) { skipped++; continue; }

    const firstName = (u.full_name || '').split(' ')[0] || 'där';
    const xp = u.xp_total || 0;

    const token = await hmacSign(apiKey, u.id);
    const unsubUrl = `${APP_URL}/functions/unsubscribeEmails?uid=${u.id}&t=${token}`;
    const { subject, html } = buildEmail({ firstName, xp, unsubUrl, neverActive });

    try {
      const res = await fetch(`${BREVO_API}/smtp/email`, {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: [{ email: u.email, name: u.full_name || firstName }],
          sender: { email: 'noreply@sveapasset.se', name: 'Sveapasset' },
          subject,
          htmlContent: html,
          tags: ['churned_reminder'],
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