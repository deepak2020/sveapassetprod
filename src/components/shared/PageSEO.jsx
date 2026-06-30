import { useEffect } from "react";

/**
 * Updates document <title> and meta description/og tags for the current page.
 * Restores the previous values when the component unmounts so SPA navigation
 * doesn't leak a stale title to the next page.
 */
function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  const created = !el;
  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  } else {
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  }
  return { el, created };
}

export default function PageSEO({ title, description, canonical }) {
  useEffect(() => {
    if (!title && !description) return;

    const prevTitle = document.title;
    if (title) document.title = title;

    const created = [];
    const prevContent = {};

    if (description) {
      const sel = 'meta[name="description"]';
      const existing = document.head.querySelector(sel);
      prevContent.description = existing?.getAttribute("content") || null;
      const r = upsertMeta(sel, { name: "description", content: description });
      if (r.created) created.push(r.el);
    }

    if (title) {
      const sel = 'meta[property="og:title"]';
      const existing = document.head.querySelector(sel);
      prevContent.ogTitle = existing?.getAttribute("content") || null;
      const r = upsertMeta(sel, { property: "og:title", content: title });
      if (r.created) created.push(r.el);
    }

    if (description) {
      const sel = 'meta[property="og:description"]';
      const existing = document.head.querySelector(sel);
      prevContent.ogDescription = existing?.getAttribute("content") || null;
      const r = upsertMeta(sel, { property: "og:description", content: description });
      if (r.created) created.push(r.el);
    }

    let canonicalEl = null;
    let canonicalWasCreated = false;
    let prevCanonicalHref = null;
    if (canonical) {
      canonicalEl = document.head.querySelector('link[rel="canonical"]');
      if (canonicalEl) {
        prevCanonicalHref = canonicalEl.getAttribute("href");
        canonicalEl.setAttribute("href", canonical);
      } else {
        canonicalEl = document.createElement("link");
        canonicalEl.setAttribute("rel", "canonical");
        canonicalEl.setAttribute("href", canonical);
        document.head.appendChild(canonicalEl);
        canonicalWasCreated = true;
      }
    }

    return () => {
      document.title = prevTitle;
      // Restore previous meta contents we changed; remove the ones we created.
      if (prevContent.description !== undefined) {
        const el = document.head.querySelector('meta[name="description"]');
        if (el && prevContent.description !== null) el.setAttribute("content", prevContent.description);
      }
      if (prevContent.ogTitle !== undefined) {
        const el = document.head.querySelector('meta[property="og:title"]');
        if (el && prevContent.ogTitle !== null) el.setAttribute("content", prevContent.ogTitle);
      }
      if (prevContent.ogDescription !== undefined) {
        const el = document.head.querySelector('meta[property="og:description"]');
        if (el && prevContent.ogDescription !== null) el.setAttribute("content", prevContent.ogDescription);
      }
      created.forEach((el) => el.parentNode?.removeChild(el));
      if (canonicalEl) {
        if (canonicalWasCreated) canonicalEl.parentNode?.removeChild(canonicalEl);
        else if (prevCanonicalHref) canonicalEl.setAttribute("href", prevCanonicalHref);
      }
    };
  }, [title, description, canonical]);

  return null;
}