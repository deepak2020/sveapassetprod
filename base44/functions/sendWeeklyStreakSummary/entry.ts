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

// Sent every Sunday evening — celebrates the week's progress and looks ahead.
// Only goes to users who were active at some point in the last 14 days, so
// we don't spam dormant accounts.
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
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const toDateStr = (d) => d.toISOString().split('T')[0];

  const users = await base44.asServiceRole.entities.User.list('-created_date', 500);
  let sent = 0, skipped = 0, failed = 0;
  const errors = [];

  for (const u of users) {
    if (!u.email) { skipped++; continue; }
    if (u.email_reminders_disabled) { skipped++; continue; }
    if (!u.last_active_date) { skipped++; continue; }
    if (u.last_active_date < toDateStr(fourteenDaysAgo)) { skipped++; continue; }

    const firstName = (u.full_name || '').split(' ')[0] || 'där';
    const streak = u.streak_days || 0;
    const xp = u.xp_total || 0;

    // Fetch this user's quiz results from the past 7 days — RLS-safe via service role.
    const sevenDaysAgoIso = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    let weeklyResults = [];
    try {
      const all = await base44.asServiceRole.entities.QuizResult.filter(
        { created_by: u.email }, '-created_date', 100
      );
      weeklyResults = all.filter(r => r.created_date >= sevenDaysAgoIso);
    } catch { /* ignore */ }

    const quizzesThisWeek = weeklyResults.length;
    const avgScore = quizzesThisWeek > 0
      ? Math.round(weeklyResults.reduce((s, r) => s + (r.percentage || 0), 0) / quizzesThisWeek)
      : 0;

    // Skip users who had zero practice this week AND no streak — they'll get the
    // daily inactivity nudge instead, no need to double-email.
    if (quizzesThisWeek === 0 && streak === 0) { skipped++; continue; }

    const token = await hmacSign(apiKey, u.id);
    const unsubUrl = `${APP_URL}/functions/unsubscribeEmails?uid=${u.id}&t=${token}`;

    const streakBadge = streak > 0
      ? `<div style="display:inline-block;background:#fff7ed;color:#c2410c;padding:8px 14px;border-radius:999px;font-weight:600;font-size:14px;margin:4px">🔥 ${streak}-day streak</div>`
      : '';

    const html = `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;margin:0">
      <div style="max-width:540px;margin:0 auto;background:white;border-radius:16px;padding:32px;border:1px solid #e2e8f0">
        <p style="font-size:13px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.5px">Your weekly recap</p>
        <h1 style="font-size:24px;color:#0f172a;margin:0 0 20px">Veckans sammanfattning 📊</h1>

        <p style="font-size:16px;color:#334155;margin:0 0 20px">Hej ${firstName}! Here's how your Swedish journey looked this week:</p>

        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:0 0 20px">
          <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:16px">
            ${streakBadge}
            <div style="display:inline-block;background:#eff6ff;color:#1e3a8a;padding:8px 14px;border-radius:999px;font-weight:600;font-size:14px;margin:4px">⚡ ${xp.toLocaleString()} XP total</div>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:15px">
            <tr><td style="padding:8px 0;color:#64748b">Quizzes this week</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#0f172a">${quizzesThisWeek}</td></tr>
            ${quizzesThisWeek > 0 ? `<tr><td style="padding:8px 0;color:#64748b;border-top:1px solid #e2e8f0">Average score</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#0f172a;border-top:1px solid #e2e8f0">${avgScore}%</td></tr>` : ''}
          </table>
        </div>

        <p style="font-size:15px;color:#475569">${
          quizzesThisWeek >= 5 ? `Incredible week, ${firstName}! ${quizzesThisWeek} sessions — that's how fluency is built. 💪` :
          quizzesThisWeek >= 2 ? `Solid week, ${firstName}! Let's aim for one more session next week. 🎯` :
          quizzesThisWeek === 1 ? `Nice start, ${firstName}! Try 2-3 short sessions next week for compounding gains. 🌱` :
          `Let's get back on track this coming week, ${firstName}. Even 2 minutes a day builds the habit. 💙`
        }</p>

        <div style="text-align:center;margin:28px 0">
          <a href="${APP_URL}/dashboard" style="display:inline-block;background:#1e3a8a;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600">Open dashboard →</a>
        </div>

        <p style="font-size:13px;color:#94a3b8;text-align:center;margin:0">Ha en bra vecka! · Team Sveapasset 💙💛</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
        <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0">
          Don't want these emails? <a href="${unsubUrl}" style="color:#94a3b8;text-decoration:underline">Unsubscribe</a>
        </p>
      </div>
    </body></html>`;

    try {
      const res = await fetch(`${BREVO_API}/smtp/email`, {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: [{ email: u.email, name: u.full_name || firstName }],
          sender: { email: 'noreply@sveapasset.se', name: 'Sveapasset' },
          subject: streak > 0
            ? `📊 Your week on Sveapasset — ${streak}-day streak strong!`
            : `📊 Your week on Sveapasset — ${quizzesThisWeek} ${quizzesThisWeek === 1 ? 'session' : 'sessions'}`,
          htmlContent: html,
          tags: ['weekly_summary'],
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