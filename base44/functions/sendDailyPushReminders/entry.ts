// Daily cron — sends a push notification to every opted-in user who:
//   • has at least one PushSubscription,
//   • hasn't been active in the last ~20 hours,
//   • hasn't already received a push today.
// Uses web-push (npm) with VAPID; subscriptions that 404/410 get pruned.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import webpush from 'npm:web-push@3.6.7';

const APP_URL = 'https://sveapasset.se';

function pickMessage(streak, firstName) {
  if (streak >= 7) {
    return {
      title: `🔥 ${streak}-dagars svit!`,
      body: `${firstName}, håll svit vid liv — 2 min övning räcker.`,
    };
  }
  if (streak >= 1) {
    return {
      title: `🔥 Bryt inte din svit!`,
      body: `Dag ${streak + 1} väntar. En snabb runda räcker, ${firstName}.`,
    };
  }
  return {
    title: `📚 Dags för svenska?`,
    body: `${firstName}, 2 min idag bygger riktig fart. Kör en snabb session!`,
  };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Allow either an admin user OR a scheduled service-role run.
    let allowed = false;
    try {
      const me = await base44.auth.me();
      allowed = me?.role === 'admin';
    } catch {
      allowed = true; // scheduled run has no user context
    }
    if (!allowed) return Response.json({ error: 'Forbidden' }, { status: 403 });

    const publicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const privateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const subject = Deno.env.get('VAPID_SUBJECT') || 'mailto:hello@sveapasset.se';
    if (!publicKey || !privateKey) {
      return Response.json({ error: 'VAPID keys not configured' }, { status: 500 });
    }
    webpush.setVapidDetails(subject, publicKey, privateKey);

    const today = new Date().toISOString().split('T')[0];
    const twentyHoursAgo = new Date(Date.now() - 20 * 60 * 60 * 1000)
      .toISOString().split('T')[0];

    // Pull all subscriptions in batches (paginate to avoid memory blow-up).
    const allSubs = [];
    let page = 0;
    const PAGE = 200;
    while (true) {
      const batch = await base44.asServiceRole.entities.PushSubscription
        .list('-created_date', PAGE, page * PAGE);
      if (!batch || batch.length === 0) break;
      allSubs.push(...batch);
      if (batch.length < PAGE) break;
      page++;
      if (page > 50) break; // safety cap (10k subs)
    }

    let sent = 0, skipped = 0, pruned = 0, failed = 0;
    const errors = [];

    // Group subs by user so we send at most one push per user per day.
    const byUser = new Map();
    for (const s of allSubs) {
      if (!byUser.has(s.user_id)) byUser.set(s.user_id, []);
      byUser.get(s.user_id).push(s);
    }

    for (const [userId, subs] of byUser) {
      let user;
      try {
        user = await base44.asServiceRole.entities.User.get(userId);
      } catch {
        // user deleted — prune their subs
        for (const s of subs) {
          await base44.asServiceRole.entities.PushSubscription.delete(s.id);
          pruned++;
        }
        continue;
      }
      if (!user) { skipped += subs.length; continue; }
      if (user.push_reminders_disabled) { skipped += subs.length; continue; }

      // Skip if active in the last ~20h
      if (user.last_active_date && user.last_active_date >= twentyHoursAgo) {
        skipped += subs.length;
        continue;
      }

      // Skip if any of this user's subs already got a push today
      if (subs.some(s => s.last_sent_date === today)) {
        skipped += subs.length;
        continue;
      }

      const firstName = (user.full_name || '').split(' ')[0] || 'där';
      const { title, body } = pickMessage(user.streak_days || 0, firstName);
      const payload = JSON.stringify({
        title, body,
        url: `${APP_URL}/dashboard`,
        tag: `daily-reminder-${today}`,
      });

      for (const s of subs) {
        const subscription = {
          endpoint: s.endpoint,
          keys: { p256dh: s.p256dh, auth: s.auth },
        };
        try {
          await webpush.sendNotification(subscription, payload);
          await base44.asServiceRole.entities.PushSubscription.update(s.id, {
            last_sent_date: today,
            failed_count: 0,
          });
          sent++;
        } catch (e) {
          // 404/410 = subscription dead → delete it; otherwise increment failure count
          const status = e?.statusCode || 0;
          if (status === 404 || status === 410) {
            await base44.asServiceRole.entities.PushSubscription.delete(s.id);
            pruned++;
          } else {
            const nextFail = (s.failed_count || 0) + 1;
            if (nextFail >= 3) {
              await base44.asServiceRole.entities.PushSubscription.delete(s.id);
              pruned++;
            } else {
              await base44.asServiceRole.entities.PushSubscription.update(s.id, {
                failed_count: nextFail,
              });
            }
            failed++;
            errors.push(`${s.endpoint.slice(-30)}: ${status} ${e.message?.slice(0, 80) || ''}`);
          }
        }
      }
    }

    return Response.json({
      sent, skipped, pruned, failed,
      total_subscriptions: allSubs.length,
      total_users: byUser.size,
      errors: errors.slice(0, 10),
      run_at: new Date().toISOString(),
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});