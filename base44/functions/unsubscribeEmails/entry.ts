// Public endpoint hit by the "Unsubscribe" link in reminder emails.
// Verifies an HMAC token to prove the user owns the link, then flips
// `email_reminders_disabled = true` on their User record.

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const enc = new TextEncoder();

async function hmacSign(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const userId = url.searchParams.get('uid');
  const token = url.searchParams.get('t');
  const secret = Deno.env.get('BREVO_API_KEY'); // reuse as HMAC secret — already private

  const htmlPage = (title, body) => new Response(
    `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
     <meta name="viewport" content="width=device-width,initial-scale=1">
     <style>body{font-family:Inter,system-ui,Arial,sans-serif;background:#f8fafc;margin:0;padding:48px 16px;color:#0f172a}
     .card{max-width:480px;margin:0 auto;background:white;border:1px solid #e2e8f0;border-radius:16px;padding:32px;text-align:center}
     h1{font-size:22px;margin:0 0 12px}p{color:#475569;line-height:1.5}
     a{display:inline-block;margin-top:20px;background:#1e3a8a;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:600}</style>
     </head><body><div class="card">${body}</div></body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );

  if (!userId || !token || !secret) {
    return htmlPage('Invalid link',
      `<h1>Invalid link</h1><p>This unsubscribe link is missing required information.</p>
       <a href="https://sveapasset.se">Back to Sveapasset</a>`);
  }

  const expected = await hmacSign(secret, userId);
  if (expected !== token) {
    return htmlPage('Invalid link',
      `<h1>Invalid or expired link</h1><p>We couldn't verify this unsubscribe request.</p>
       <a href="https://sveapasset.se">Back to Sveapasset</a>`);
  }

  const base44 = createClientFromRequest(req);
  try {
    await base44.asServiceRole.entities.User.update(userId, { email_reminders_disabled: true });
  } catch (e) {
    return htmlPage('Something went wrong',
      `<h1>Something went wrong</h1><p>${e.message}</p>
       <a href="https://sveapasset.se">Back to Sveapasset</a>`);
  }

  return htmlPage('Unsubscribed',
    `<h1>You've been unsubscribed ✓</h1>
     <p>You won't receive automated reminder emails from Sveapasset anymore.</p>
     <p style="font-size:13px;color:#94a3b8">You can change this anytime in your dashboard settings.</p>
     <a href="https://sveapasset.se">Back to Sveapasset</a>`);
});