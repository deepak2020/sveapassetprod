import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const BREVO_API = 'https://api.brevo.com/v3';

Deno.serve(async (req) => {
  const params = await req.json();
  const { email, firstName, lastName, event } = params;
  const apiKey = Deno.env.get('BREVO_API_KEY');

  if (!apiKey) return Response.json({ error: 'BREVO_API_KEY not set' }, { status: 500 });
  if (!email) return Response.json({ error: 'email required' }, { status: 400 });

  // Add/update contact
  await fetch(`${BREVO_API}/contacts`, {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      attributes: {
        FIRSTNAME: firstName || '',
        LASTNAME: lastName || '',
        LAST_ACTIVE: new Date().toISOString().split('T')[0],
      },
      listIds: [2],
      updateEnabled: true,
    }),
  });

  // Send welcome email using Brevo template ID 1
  if (event === 'welcome') {
    await fetch(`${BREVO_API}/smtp/email`, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: [{ email, name: firstName || '' }],
        templateId: 1,
      }),
    });
  }

  return Response.json({ success: true });
});
