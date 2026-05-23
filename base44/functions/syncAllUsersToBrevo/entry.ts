import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BREVO_API = 'https://api.brevo.com/v3';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const apiKey = Deno.env.get('BREVO_API_KEY');

  if (!apiKey) {
    return Response.json({ error: 'BREVO_API_KEY not set' }, { status: 500 });
  }

  const users = await base44.asServiceRole.entities.User.list('-created_date', 500);

  let synced = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const user of users) {
    if (!user.email) continue;
    try {
      await fetch(`${BREVO_API}/contacts`, {
        method: 'POST',
        headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          attributes: {
            FIRSTNAME: user.first_name || '',
            LASTNAME: user.last_name || '',
          },
          listIds: [2],
          updateEnabled: true,
        }),
      });
      synced++;
    } catch (e) {
      failed++;
      errors.push(`${user.email}: ${e.message}`);
    }
  }

  return Response.json({ synced, failed, total: users.length, errors });
});
