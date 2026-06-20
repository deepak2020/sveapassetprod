// Admin-only utility to delete grammar exercises by ID list.
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const SUPABASE_URL = 'https://zpuaksuhvgwvnvopjaov.supabase.co';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { ids } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return Response.json({ error: 'ids array required' }, { status: 400 });
    }

    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!serviceKey) {
      return Response.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set' }, { status: 500 });
    }

    const idList = ids.map(id => `"${id}"`).join(',');
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/grammar_exercises?id=in.(${idList})`,
      {
        method: 'DELETE',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: 'return=representation',
        },
      }
    );
    const data = res.ok ? await res.json() : await res.text();
    return Response.json({ ok: res.ok, status: res.status, deleted: data });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});