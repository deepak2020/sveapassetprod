// Saves (or replaces) the user's push subscription for this device.
// Frontend calls this after the browser issues a PushSubscription object.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { endpoint, p256dh, auth, user_agent } = body || {};
    if (!endpoint || !p256dh || !auth) {
      return Response.json({ error: 'Missing subscription fields' }, { status: 400 });
    }

    // De-dupe by endpoint — re-subscribing on the same browser shouldn't create rows.
    const existing = await base44.entities.PushSubscription.filter({ endpoint });
    if (existing && existing.length > 0) {
      await base44.entities.PushSubscription.update(existing[0].id, {
        user_id: user.id,
        p256dh,
        auth,
        user_agent: user_agent || '',
        failed_count: 0,
      });
      return Response.json({ ok: true, action: 'updated' });
    }

    await base44.entities.PushSubscription.create({
      user_id: user.id,
      endpoint,
      p256dh,
      auth,
      user_agent: user_agent || '',
      failed_count: 0,
    });
    return Response.json({ ok: true, action: 'created' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});