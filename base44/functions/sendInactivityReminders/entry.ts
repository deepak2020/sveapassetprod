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

// Build a tiered email based on the user's streak so the nudge feels personal.
function buildEmail({ firstName, streak, unsubUrl }) {
  let subject, headline, body, cta;

  if (streak >= 30) {
    // LONG STREAK: high-stakes, emotional
    subject = `🔥 ${firstName}, your ${streak}-day streak deserves saving!`;
    headline = `${streak} days. Don't let it end today. 🔥`;
    body = `<p style="font-size:16px;color:#334155">You've built something rare — a <strong>${streak}-day streak</strong> on Sveapasset. That's real commitment, ${firstName}.</p>
            <p style="font-size:15px;color:#475569">Two minutes of vocabulary today is all it takes to keep it alive. You've come too far to stop now. 💪</p>`;
    cta = 'Save my streak →';
  } else if (streak >= 7) {
    // MID STREAK: momentum-focused
    subject = `🔥 Keep your ${streak}-day streak alive, ${firstName}!`;
    headline = `${streak} days strong — keep it going!`;
    body = `<p style="font-size:16px;color:#334155">Your <strong>${streak}-day streak</strong> on Sveapasset is looking great, ${firstName}.</p>
            <p style="font-size:15px;color:#475569">A quick flashcard round today keeps the momentum going. You've got this!</p>`;
    cta = 'Continue my streak →';
  } else if (streak >= 1) {
    // EARLY STREAK: encouragement
    subject = `🔥 Don't break your ${streak}-day streak!`;
    headline = `Hej ${firstName}! Day ${streak + 1} awaits 👋`;
    body = `<p style="font-size:16px;color:#334155">You're on a <strong>${streak}-day streak</strong>. One quick session today keeps it alive!</p>
            <p style="font-size:15px;color:#475569">Just 2 minutes of vocabulary is enough. Small steps, big progress.</p>`;
    cta = 'Practise now →';
  } else {
    // NO STREAK: gentle re-engagement
    subject = `Hej ${firstName} — 2 minutes of svenska today?`;
    headline = `Welcome back, ${firstName}! 👋`;
    body = `<p style="font-size:16px;color:#334155">It's been a little while since your last session on Sveapasset.</p>
            <p style="font-size:15px;color:#475569">Just a couple of minutes today builds real momentum. Try a flashcard round or today's daily challenge!</p>`;
    cta = 'Start a quick session →';
  }

  const html = `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;margin:0">
    <div style="max-width:540px;margin:0 auto;background:white;border-radius:16px;padding:32px;border:1px solid #e2e8f0">
      <h1 style="font-size:22px;color:#0f172a;margin:0 0 16px">${headline}</h1>
      ${body}
      <div style="text-align:center;margin:28px 0">
        <a href="${APP_URL}/gym" style="display:inline-block;background:#1e3a8a;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600">${cta}</a>
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

// Triggered daily by a scheduled automation; can also be invoked manually by an admin.
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
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const toDateStr = (d) => d.toISOString().split('T')[0];

  const users = await base44.asServiceRole.entities.User.list('-created_date', 500);
  let sent = 0, skipped = 0, failed = 0;
  const errors = [];

  for (const u of users) {
    if (!u.email) { skipped++; continue; }
    if (u.email_reminders_disabled) { skipped++; continue; }

    const lastActive = u.last_active_date;
    if (!lastActive) { skipped++; continue; }
    if (lastActive >= toDateStr(twentyFourHoursAgo)) { skipped++; continue; }
    if (lastActive < toDateStr(fourteenDaysAgo)) { skipped++; continue; }

    const firstName = (u.full_name || '').split(' ')[0] || 'där';
    const streak = u.streak_days || 0;

    const token = await hmacSign(apiKey, u.id);
    const unsubUrl = `${APP_URL}/functions/unsubscribeEmails?uid=${u.id}&t=${token}`;
    const { subject, html } = buildEmail({ firstName, streak, unsubUrl });

    try {
      const res = await fetch(`${BREVO_API}/smtp/email`, {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: [{ email: u.email, name: u.full_name || firstName }],
          sender: { email: 'noreply@sveapasset.se', name: 'Sveapasset' },
          subject,
          htmlContent: html,
          tags: ['inactivity_reminder'],
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