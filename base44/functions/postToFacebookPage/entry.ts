import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const GRAPH_API = "https://graph.facebook.com/v25.0";

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden — admin only' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const action = body.action || 'list';

    const { accessToken } = await base44.asServiceRole.connectors.getConnection('facebook_pages');

    // List managed Pages with their Page access tokens
    if (action === 'list') {
      const res = await fetch(`${GRAPH_API}/me/accounts?fields=id,name,access_token&limit=100`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const data = await res.json();
      if (data.error) return Response.json({ error: data.error.message }, { status: 500 });
      const pages = (data.data || []).map(p => ({ id: p.id, name: p.name, access_token: p.access_token }));
      return Response.json({ pages });
    }

    // Publish a post to a specific Page
    if (action === 'post') {
      const { pageId, message, link } = body;
      if (!pageId || !message) {
        return Response.json({ error: 'pageId and message are required' }, { status: 400 });
      }

      // Get the Page access token (the user token can't post directly)
      const acctRes = await fetch(`${GRAPH_API}/me/accounts?fields=id,name,access_token`, {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const acctData = await acctRes.json();
      if (acctData.error) return Response.json({ error: acctData.error.message }, { status: 500 });
      const page = (acctData.data || []).find(p => p.id === pageId);
      if (!page) return Response.json({ error: 'Page not found or you lack access' }, { status: 404 });

      const postBody: Record<string, string> = { message };
      if (link) postBody.link = link;

      const postRes = await fetch(`${GRAPH_API}/${pageId}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...postBody, access_token: page.access_token }),
      });
      const postData = await postRes.json();
      if (postData.error) return Response.json({ error: postData.error.message }, { status: 500 });

      return Response.json({ success: true, postId: postData.id, pageId });
    }

    return Response.json({ error: 'Unknown action. Use "list" or "post".' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}