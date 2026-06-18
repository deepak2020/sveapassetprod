import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BREVO_API = 'https://api.brevo.com/v3';

// Sends a friendly nudge to learners who haven't practised in the last 24h.
// Triggered daily by a scheduled automation; can also be invoked manually by an admin.
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const apiKey = Deno.env.get('BREVO_API_KEY');

  if (!apiKey) {
    return Response.json({ error: 'BREVO_API_KEY not set' }, { status: 500 });
  }

  // Allow service-role (scheduled automation) OR an authenticated admin to invoke.
  let isAdmin = false;
  try {
    const user = await base44.auth.me();
    isAdmin = user?.role === 'admin';
  } catch {
    // No auth context = scheduled run (service role). Allow.
    isAdmin = true;
  }
  if (!isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Window: users whose last_active_date is more than 24h ago but not too stale (within 14 days,
  // so we don't keep pestering long-churned users).
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const toDateStr = (d) => d.toISOString().split('T')[0];

  const users = await base44.asServiceRole.entities.User.list('-created_date', 500);

  let sent = 0;
  let skipped = 0;
  let failed = 0;
  const errors = [];

  for (const u of users) {
    if (!u.email) { skipped++; continue; }

    const lastActive = u.last_active_date;
    // Need a last_active_date to know if they're inactive
    if (!lastActive) { skipped++; continue; }

    // Inactive = last active >24h ago AND within last 14 days
    if (lastActive >= toDateStr(twentyFourHoursAgo)) { skipped++; continue; }
    if (lastActive < toDateStr(fourteenDaysAgo)) { skipped++; continue; }

    // Respect unsubscribes — Brevo will refuse to send to unsubscribed contacts anyway,
    // but we also gate on a local flag if you ever add one.
    if (u.email_reminders_disabled) { skipped++; continue; }

    const firstName = (u.full_name || '').split(' ')[0] || 'där';
    const streak = u.streak_days || 0;

    const subject = streak > 0
      ? `🔥 Don't break your ${streak}-day streak!`
      : `Hej ${firstName} — 2 minutes of svenska today?`;

    const streakLine = streak > 0
      ? `<p style="font-size:16px;color:#334155">You're on a <strong>${streak}-day streak</strong> on Sveapasset. One quick session today keeps it alive! 🔥</p>`
      : `<p style="font-size:16px;color:#334155">Just a couple of minutes today builds real momentum. Try a flashcard round or a daily challenge!</p>`;

    const html = `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;margin:0">
      <div style="max-width:540px;margin:0 auto;background:white;border-radius:16px;padding:32px;border:1px solid #e2e8f0">
        <h1 style="font-size:22px;color:#0f172a;margin:0 0 12px">Hej ${firstName}! 👋</h1>
        ${streakLine}
        <p style="font-size:15px;color:#475569">Open your vocabulary and review a few words — it only takes 2 minutes, and your future self will thank you.</p>
        <div style="text-align:center;margin:28px 0">
          <a href="https://sveapasset.se/gym" style="display:inline-block;background:#1e3a8a;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600">Practise now →</a>
        </div>
        <p style="font-size:13px;color:#94a3b8;text-align:center;margin:0">Lycka till! · Team Sveapasset 💙💛</p>
      </div>
    </body></html>`;

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
    sent,
    skipped,
    failed,
    total_users: users.length,
    errors: errors.slice(0, 10),
    run_at: now.toISOString(),
  });
});