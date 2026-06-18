// Admin-only: sends a real preview of the inactivity + weekly summary emails
// to the calling admin's inbox, using sample data. One-shot tool — safe to delete after use.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BREVO_API = 'https://api.brevo.com/v3';
const APP_URL = 'https://sveapasset.se';

function buildInactivityEmail({ firstName, streak }) {
  let subject, headline, body, cta;
  if (streak >= 30) {
    subject = `🔥 ${firstName}, your ${streak}-day streak deserves saving!`;
    headline = `${streak} days. Don't let it end today. 🔥`;
    body = `<p style="font-size:16px;color:#334155">You've built something rare — a <strong>${streak}-day streak</strong> on Sveapasset. That's real commitment, ${firstName}.</p>
            <p style="font-size:15px;color:#475569">Two minutes of vocabulary today is all it takes to keep it alive. You've come too far to stop now. 💪</p>`;
    cta = 'Save my streak →';
  } else if (streak >= 7) {
    subject = `🔥 Keep your ${streak}-day streak alive, ${firstName}!`;
    headline = `${streak} days strong — keep it going!`;
    body = `<p style="font-size:16px;color:#334155">Your <strong>${streak}-day streak</strong> on Sveapasset is looking great, ${firstName}.</p>
            <p style="font-size:15px;color:#475569">A quick flashcard round today keeps the momentum going. You've got this!</p>`;
    cta = 'Continue my streak →';
  } else if (streak >= 1) {
    subject = `🔥 Don't break your ${streak}-day streak!`;
    headline = `Hej ${firstName}! Day ${streak + 1} awaits 👋`;
    body = `<p style="font-size:16px;color:#334155">You're on a <strong>${streak}-day streak</strong>. One quick session today keeps it alive!</p>
            <p style="font-size:15px;color:#475569">Just 2 minutes of vocabulary is enough. Small steps, big progress.</p>`;
    cta = 'Practise now →';
  } else {
    subject = `Hej ${firstName} — 2 minutes of svenska today?`;
    headline = `Welcome back, ${firstName}! 👋`;
    body = `<p style="font-size:16px;color:#334155">It's been a little while since your last session on Sveapasset.</p>
            <p style="font-size:15px;color:#475569">Just a couple of minutes today builds real momentum. Try a flashcard round or today's daily challenge!</p>`;
    cta = 'Start a quick session →';
  }

  const html = `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;margin:0">
    <div style="max-width:540px;margin:0 auto;background:white;border-radius:16px;padding:32px;border:1px solid #e2e8f0">
      <div style="background:#fef3c7;color:#92400e;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:600;margin-bottom:16px;text-align:center">⚠️ PREVIEW — Sample data, not a real reminder</div>
      <h1 style="font-size:22px;color:#0f172a;margin:0 0 16px">${headline}</h1>
      ${body}
      <div style="text-align:center;margin:28px 0">
        <a href="${APP_URL}/gym" style="display:inline-block;background:#1e3a8a;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600">${cta}</a>
      </div>
      <p style="font-size:13px;color:#94a3b8;text-align:center;margin:0">Lycka till! · Team Sveapasset 💙💛</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
      <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0">
        Don't want these reminders? <a href="${APP_URL}" style="color:#94a3b8;text-decoration:underline">Unsubscribe</a>
      </p>
    </div>
  </body></html>`;
  return { subject: `[PREVIEW] ${subject}`, html };
}

function buildWeeklyEmail({ firstName, streak, xp, quizzesThisWeek, avgScore }) {
  const streakBadge = streak > 0
    ? `<div style="display:inline-block;background:#fff7ed;color:#c2410c;padding:8px 14px;border-radius:999px;font-weight:600;font-size:14px;margin:4px">🔥 ${streak}-day streak</div>`
    : '';

  const message =
    quizzesThisWeek >= 5 ? `Incredible week, ${firstName}! ${quizzesThisWeek} sessions — that's how fluency is built. 💪` :
    quizzesThisWeek >= 2 ? `Solid week, ${firstName}! Let's aim for one more session next week. 🎯` :
    quizzesThisWeek === 1 ? `Nice start, ${firstName}! Try 2-3 short sessions next week for compounding gains. 🌱` :
    `Let's get back on track this coming week, ${firstName}. Even 2 minutes a day builds the habit. 💙`;

  const html = `<!DOCTYPE html><html><body style="font-family:Inter,Arial,sans-serif;background:#f8fafc;padding:24px;margin:0">
    <div style="max-width:540px;margin:0 auto;background:white;border-radius:16px;padding:32px;border:1px solid #e2e8f0">
      <div style="background:#fef3c7;color:#92400e;padding:8px 12px;border-radius:8px;font-size:12px;font-weight:600;margin-bottom:16px;text-align:center">⚠️ PREVIEW — Sample data, not a real recap</div>
      <p style="font-size:13px;color:#64748b;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.5px">Your weekly recap</p>
      <h1 style="font-size:24px;color:#0f172a;margin:0 0 20px">Veckans sammanfattning 📊</h1>
      <p style="font-size:16px;color:#334155;margin:0 0 20px">Hej ${firstName}! Here's how your Swedish journey looked this week:</p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:0 0 20px">
        <div style="text-align:center;margin-bottom:16px">
          ${streakBadge}
          <div style="display:inline-block;background:#eff6ff;color:#1e3a8a;padding:8px 14px;border-radius:999px;font-weight:600;font-size:14px;margin:4px">⚡ ${xp.toLocaleString()} XP total</div>
        </div>
        <table style="width:100%;border-collapse:collapse;font-size:15px">
          <tr><td style="padding:8px 0;color:#64748b">Quizzes this week</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#0f172a">${quizzesThisWeek}</td></tr>
          ${quizzesThisWeek > 0 ? `<tr><td style="padding:8px 0;color:#64748b;border-top:1px solid #e2e8f0">Average score</td><td style="padding:8px 0;text-align:right;font-weight:600;color:#0f172a;border-top:1px solid #e2e8f0">${avgScore}%</td></tr>` : ''}
        </table>
      </div>
      <p style="font-size:15px;color:#475569">${message}</p>
      <div style="text-align:center;margin:28px 0">
        <a href="${APP_URL}/dashboard" style="display:inline-block;background:#1e3a8a;color:white;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600">Open dashboard →</a>
      </div>
      <p style="font-size:13px;color:#94a3b8;text-align:center;margin:0">Ha en bra vecka! · Team Sveapasset 💙💛</p>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
      <p style="font-size:11px;color:#94a3b8;text-align:center;margin:0">
        Don't want these emails? <a href="${APP_URL}" style="color:#94a3b8;text-decoration:underline">Unsubscribe</a>
      </p>
    </div>
  </body></html>`;
  return { subject: `[PREVIEW] 📊 Your week on Sveapasset — ${streak}-day streak strong!`, html };
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const apiKey = Deno.env.get('BREVO_API_KEY');
  if (!apiKey) return Response.json({ error: 'BREVO_API_KEY not set' }, { status: 500 });

  const me = await base44.auth.me();
  if (me?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const to = me.email;
  const firstName = (me.full_name || '').split(' ')[0] || 'Deepak';

  // Send 5 previews: 4 inactivity tiers + 1 weekly summary
  const previews = [
    { kind: 'inactivity-long', ...buildInactivityEmail({ firstName, streak: 47 }) },
    { kind: 'inactivity-mid', ...buildInactivityEmail({ firstName, streak: 12 }) },
    { kind: 'inactivity-early', ...buildInactivityEmail({ firstName, streak: 3 }) },
    { kind: 'inactivity-none', ...buildInactivityEmail({ firstName, streak: 0 }) },
    { kind: 'weekly', ...buildWeeklyEmail({ firstName, streak: 12, xp: 2340, quizzesThisWeek: 7, avgScore: 84 }) },
  ];

  const results = [];
  for (const p of previews) {
    const res = await fetch(`${BREVO_API}/smtp/email`, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: [{ email: to, name: me.full_name || firstName }],
        sender: { email: 'noreply@sveapasset.se', name: 'Sveapasset (Preview)' },
        subject: p.subject,
        htmlContent: p.html,
        tags: ['email_preview'],
      }),
    });
    results.push({ kind: p.kind, ok: res.ok, status: res.status });
  }

  return Response.json({ sent_to: to, results });
});