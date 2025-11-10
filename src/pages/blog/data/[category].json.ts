// File: src/pages/blog/data/[category].json.ts
// Purpose: Serve JSON for a blog category with media fields used by the client list.
// Parity with SSR media resolution: thumbnail → image → cover → ogImage → fallback.
// Ref: Fix Plan 162.  // :contentReference[oaicite:1]{index=1}

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { CATEGORIES, prettyCategoryTitle } from "../../../lib/blog/categories";
import { categorySlug, postUrlFromEntry } from "../../../lib/slug";

export const prerender = true;

/** Pre-build one JSON file per category */
export async function getStaticPaths() {
  return CATEGORIES.map((c: string) => ({
    params: { category: categorySlug(c) },
  }));
}

/** Derive best-available thumbnail with intrinsic size fallbacks (prevents CLS) */
function getThumb(p: any) {
  const t =
    p?.data?.thumbnail ??
    p?.data?.image ??
    p?.data?.cover ??
    p?.data?.ogImage ??
    null;

  const src = typeof t === "string" ? t : t?.src ?? "/assets/logos/logo-wide-1200.png";
  const alt =
    (typeof t === "object" && t?.alt) ? t.alt :
    p?.data?.title ?? "Post thumbnail";
  const width =
    (typeof t === "object" && typeof t?.width === "number") ? t.width : 1200;
  const height =
    (typeof t === "object" && typeof t?.height === "number") ? t.height : 675;

  return { src, alt, width, height };
}

/** GET /blog/data/<category>.json */
export const GET: APIRoute = async ({ params }) => {
  const categoryParam = String(params.category || "");
  const cat = categorySlug(categoryParam);

  // Validate category
  const allowed = new Set(CATEGORIES.map((c: string) => categorySlug(c)));
  if (!allowed.has(cat)) {
    return new Response(
      JSON.stringify({ error: "unknown-category", category: categoryParam }),
      { status: 404, headers: { "content-type": "application/json; charset=utf-8" } },
    );
  }

  // Fetch posts for category
  const all = await getCollection(
    "blog",
    ({ data }) => !data.draft && categorySlug(data.category) === cat,
  );

  // Map to client payload with media fields
  const items = all
    .map((p) => {
      const { src, alt, width, height } = getThumb(p);
      const date = new Date(p.data.date);
      return {
        slug: p.slug,
        title: p.data.title,
        url: postUrlFromEntry(p),
        date: isNaN(date.getTime()) ? null : date.toISOString(),
        tags: Array.isArray(p.data.tags) ? p.data.tags : [],
        estReadMin:
          typeof p.data.readingTimeMinutes === "number"
            ? p.data.readingTimeMinutes
            : typeof p.data.readingTime === "number"
            ? p.data.readingTime
            : null,
        thumbnailSrc: src,
        thumbnailAlt: alt,
        thumbnailW: width,
        thumbnailH: height,
      };
    })
    // newest first, mirrors SSR
    .sort((a, b) => +new Date(b.date || 0) - +new Date(a.date || 0));

  const body = JSON.stringify(
    {
      category: cat,
      categoryPretty: prettyCategoryTitle(cat),
      count: items.length,
      items,
    },
    null,
    0,
  );

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      // Cache aggressively in static hosting; adjust if needed.
      "cache-control": "public, max-age=3600, immutable",
    },
  });
};
