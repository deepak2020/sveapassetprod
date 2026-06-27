// Removes a push subscription when the user opts out.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { endpoint } = await req.json();
    if (!endpoint) return Response.json({ error: 'Missing endpoint' }, { status: 400 });

    const matches = await base44.entities.PushSubscription.filter({ endpoint, user_id: user.id });
    for (const m of matches) {
      await base44.entities.PushSubscription.delete(m.id);
    }
    return Response.json({ ok: true, removed: matches.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});