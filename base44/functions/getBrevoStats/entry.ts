// Returns aggregated Brevo email stats per campaign tag for the admin board.
// Uses the /smtp/statistics/aggregatedReport endpoint with tag filtering.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BREVO_API = 'https://api.brevo.com/v3';
const TAGS = ['inactivity_reminder', 'churned_reminder', 'weekly_summary'];

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const apiKey = Deno.env.get('BREVO_API_KEY');
  if (!apiKey) return Response.json({ error: 'BREVO_API_KEY not set' }, { status: 500 });

  const me = await base44.auth.me();
  if (me?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

  const url = new URL(req.url);
  const days = parseInt(url.searchParams.get('days') || '30', 10);

  const results = {};
  for (const tag of TAGS) {
    try {
      const res = await fetch(
        `${BREVO_API}/smtp/statistics/aggregatedReport?days=${days}&tag=${encodeURIComponent(tag)}`,
        { headers: { 'api-key': apiKey, 'Accept': 'application/json' } }
      );
      if (res.ok) {
        results[tag] = await res.json();
      } else {
        results[tag] = { error: `${res.status}` };
      }
    } catch (e) {
      results[tag] = { error: e.message };
    }
  }

  return Response.json({ days, stats: results });
});