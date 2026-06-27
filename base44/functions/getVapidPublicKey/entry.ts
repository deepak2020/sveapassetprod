// Returns the public VAPID key so the browser can subscribe to push.
// Public by design — only the public key is exposed.

Deno.serve(async (req) => {
  try {
    const publicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    if (!publicKey) {
      return Response.json({ error: 'VAPID_PUBLIC_KEY not set' }, { status: 500 });
    }
    return Response.json({ publicKey });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});