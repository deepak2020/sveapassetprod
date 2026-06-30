import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const BASE = 'https://www.sveapasset.se';

// Static, publicly-crawlable routes (anything behind auth or admin is excluded)
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/language', priority: '0.9', changefreq: 'weekly' },
  { path: '/civic', priority: '0.9', changefreq: 'weekly' },
  { path: '/grammar', priority: '0.8', changefreq: 'weekly' },
  { path: '/citizenship-test', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
  { path: '/contact', priority: '0.4', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
];

function escapeXml(s: string) {
  return String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]!));
}

function urlEntry(loc: string, lastmod?: string, changefreq = 'weekly', priority = '0.7') {
  return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Pull all lessons and civic topics in parallel (service role — sitemap is public).
    const [lessons, topics] = await Promise.all([
      base44.asServiceRole.entities.Lesson.list('-updated_date', 2000),
      base44.asServiceRole.entities.CivicTopic.list('-updated_date', 1000),
    ]);

    const urls: string[] = [];

    for (const r of STATIC_ROUTES) {
      urls.push(urlEntry(`${BASE}${r.path}`, undefined, r.changefreq, r.priority));
    }

    for (const l of lessons) {
      urls.push(urlEntry(`${BASE}/language/${l.id}`, l.updated_date || l.created_date, 'monthly', '0.7'));
    }

    for (const t of topics) {
      urls.push(urlEntry(`${BASE}/civic/${t.id}`, t.updated_date || t.created_date, 'monthly', '0.7'));
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    return new Response(`<!-- sitemap error: ${(error as Error).message} -->`, {
      status: 500,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    });
  }
});