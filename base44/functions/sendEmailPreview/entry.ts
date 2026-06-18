// Admin-only: sends a real preview of the inactivity + weekly summary emails
// to the calling admin's inbox, using sample data. One-shot tool — safe to delete after use.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BREVO_API = 'https://api.brevo.com/v3';
const APP_URL = 'https://sveapasset.se';

function buildWelcomeEmail({ firstName }) {
  // Fetches the canonical welcome email HTML from the repo so the preview always
  // matches what new signups actually receive.
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Welcome to Sveapasset</title></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
  <tr><td style="background:#fef3c7;color:#92400e;padding:10px 16px;font-size:12px;font-weight:600;text-align:center">⚠️ PREVIEW — This is the welcome email new signups receive</td></tr>
  <tr><td style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);padding:40px 40px 32px;text-align:center;">
    <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">Sveapasset 🇸🇪</h1>
    <p style="margin:8px 0 0;color:#bfdbfe;font-size:14px;font-weight:500;">Your Swedish Learning Companion</p>
  </td></tr>
  <tr><td style="padding:40px 40px 0;">
    <h2 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#111827;">Hi ${firstName} 👋</h2>
    <p style="margin:0;font-size:16px;line-height:1.7;color:#4b5563;">Welcome to <strong>Sveapasset</strong> — your free app for learning Swedish and preparing for the citizenship test. We're excited to have you on board!</p>
  </td></tr>
  <tr><td style="padding:32px 40px 16px;"><h3 style="margin:0;font-size:16px;font-weight:700;color:#111827;">Here's what's waiting for you:</h3></td></tr>

  <tr><td style="padding:0 40px 16px;"><table cellpadding="0" cellspacing="0" style="width:100%;background:#eff6ff;border-radius:12px;padding:16px;"><tr><td style="width:44px;vertical-align:top;font-size:26px;">📚</td><td style="padding-left:12px;vertical-align:top;"><p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#1e40af;">4 SFI Courses (Kurs A–D)</p><p style="margin:0;font-size:14px;color:#4b5563;line-height:1.5;">Structured lessons from absolute beginner to advanced — follow the same path as official Swedish SFI education.</p></td></tr></table></td></tr>

  <tr><td style="padding:0 40px 16px;"><table cellpadding="0" cellspacing="0" style="width:100%;background:#f0fdf4;border-radius:12px;padding:16px;"><tr><td style="vertical-align:top;"><p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#15803d;">Meet <span style="font-weight:800;color:#7c3aed;">Svea</span> — your tutor</p><p style="margin:0;font-size:14px;color:#4b5563;line-height:1.5;"><span style="font-weight:800;color:#7c3aed;">Svea</span> is your personal Swedish tutor: write in Swedish for instant corrections, get explanations when you're stuck, and a daily plan made just for you.</p></td></tr></table></td></tr>

  <tr><td style="padding:0 40px 16px;"><table cellpadding="0" cellspacing="0" style="width:100%;background:#fdf4ff;border-radius:12px;padding:16px;"><tr><td style="width:44px;vertical-align:top;font-size:26px;">📝</td><td style="padding-left:12px;vertical-align:top;"><p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#7e22ce;">Civic Knowledge (38 Topics)</p><p style="margin:0;font-size:14px;color:#4b5563;line-height:1.5;">Everything you need for the Swedish citizenship test — government, history, rights, society and more.</p></td></tr></table></td></tr>

  <tr><td style="padding:0 40px 16px;"><table cellpadding="0" cellspacing="0" style="width:100%;background:#fff7ed;border-radius:12px;padding:16px;"><tr><td style="width:44px;vertical-align:top;font-size:26px;">🔥</td><td style="padding-left:12px;vertical-align:top;"><p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#c2410c;">Daily Challenges & Streaks</p><p style="margin:0;font-size:14px;color:#4b5563;line-height:1.5;">4 challenges unlocked throughout the day — morning, afternoon, evening and night. Build a streak and earn XP rewards.</p></td></tr></table></td></tr>

  <tr><td style="padding:0 40px 16px;"><table cellpadding="0" cellspacing="0" style="width:100%;background:#f0fdfa;border-radius:12px;padding:16px;"><tr><td style="width:44px;vertical-align:top;font-size:26px;">🏋️</td><td style="padding-left:12px;vertical-align:top;"><p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#0f766e;">Gym & Vocabulary SRS</p><p style="margin:0;font-size:14px;color:#4b5563;line-height:1.5;">Words you learn are automatically saved to a spaced repetition deck. Review them at the right time to remember them forever.</p></td></tr></table></td></tr>

  <tr><td style="padding:0 40px 16px;"><table cellpadding="0" cellspacing="0" style="width:100%;background:#fef2f2;border-radius:12px;padding:16px;"><tr><td style="width:44px;vertical-align:top;font-size:26px;">📖</td><td style="padding-left:12px;vertical-align:top;"><p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#b91c1c;">Grammar Hub</p><p style="margin:0;font-size:14px;color:#4b5563;line-height:1.5;">Master Swedish grammar level by level — verbs, en/ett, word order and more. Every rule comes with interactive exercises and AI-powered feedback on your mistakes.</p></td></tr></table></td></tr>

  <tr><td style="padding:0 40px 16px;"><table cellpadding="0" cellspacing="0" style="width:100%;background:#eef2ff;border-radius:12px;padding:16px;"><tr><td style="width:44px;vertical-align:top;font-size:26px;">🎧</td><td style="padding-left:12px;vertical-align:top;"><p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#4338ca;">Listening Tests</p><p style="margin:0;font-size:14px;color:#4b5563;line-height:1.5;">Train your ear with real Swedish audio at every SFI level. Transcribe what you hear or pick the right answer — perfect prep for the listening section of the SFI exam.</p></td></tr></table></td></tr>

  <tr><td style="padding:0 40px 16px;"><table cellpadding="0" cellspacing="0" style="width:100%;background:#ecfeff;border-radius:12px;padding:16px;"><tr><td style="width:44px;vertical-align:top;font-size:26px;">📅</td><td style="padding-left:12px;vertical-align:top;"><p style="margin:0 0 4px;font-size:15px;font-weight:700;color:#0e7490;">Personalised Study Plan</p><p style="margin:0;font-size:14px;color:#4b5563;line-height:1.5;">Tell us your target SFI level and how many days you have — we'll build a day-by-day lesson schedule that keeps you on track and adapts as you progress.</p></td></tr></table></td></tr>

  <tr><td style="padding:32px 40px;text-align:center;">
    <p style="margin:0 0 24px;font-size:16px;color:#4b5563;line-height:1.7;">Ready to start? Open the app and complete your first lesson today — it only takes 5 minutes. 🚀</p>
    <a href="${APP_URL}" style="display:inline-block;background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);color:#ffffff;font-size:16px;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:50px;letter-spacing:0.3px;">Start Learning Now →</a>
  </td></tr>
  <tr><td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
    <p style="margin:0;font-size:13px;color:#9ca3af;">You're receiving this because you created an account at <a href="${APP_URL}" style="color:#3b82f6;text-decoration:none;">sveapasset.se</a></p>
  </td></tr>
</table></td></tr></table></body></html>`;
  return { subject: `[PREVIEW] Welcome to Sveapasset 🇸🇪 — your Swedish learning starts here`, html };
}

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

  // Optional ?only=welcome to test just the welcome email
  const url = new URL(req.url);
  const only = url.searchParams.get('only');

  const allPreviews = [
    { kind: 'welcome', ...buildWelcomeEmail({ firstName }) },
    { kind: 'inactivity-long', ...buildInactivityEmail({ firstName, streak: 47 }) },
    { kind: 'inactivity-mid', ...buildInactivityEmail({ firstName, streak: 12 }) },
    { kind: 'inactivity-early', ...buildInactivityEmail({ firstName, streak: 3 }) },
    { kind: 'inactivity-none', ...buildInactivityEmail({ firstName, streak: 0 }) },
    { kind: 'weekly', ...buildWeeklyEmail({ firstName, streak: 12, xp: 2340, quizzesThisWeek: 7, avgScore: 84 }) },
  ];
  const previews = only ? allPreviews.filter(p => p.kind === only) : allPreviews;

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