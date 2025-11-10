// File: src/pages/sitemap.xml.ts
import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

type UrlEntry = {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
};

const dateFrom = (e: CollectionEntry<"blog">): string | undefined => {
  const d =
    (e.data as any).updated ??
    (e.data as any).pubDate ??
    e.data.date ??
    undefined;
  return d ? new Date(d).toISOString() : undefined;
};

export const GET: APIRoute = async () => {
  const posts: CollectionEntry<"blog">[] = await getCollection(
    "blog",
    (entry: CollectionEntry<"blog">) => !entry.data.draft
  );

  const urls: UrlEntry[] = posts.map((p: CollectionEntry<"blog">) => {
    const loc = `/blog/${p.slug.replace(/^blog\//, "")}/`;
    return {
      loc,
      lastmod: dateFrom(p),
      changefreq: "weekly",
      priority: 0.6,
    };
  });

  const xmlItems = urls
    .map(
      (u) => `<url>
  <loc>${u.loc}</loc>${u.lastmod ? `\n  <lastmod>${u.lastmod}</lastmod>` : "" }
  <changefreq>${u.changefreq ?? "weekly"}</changefreq>
  <priority>${(u.priority ?? 0.6).toFixed(1)}</priority>
</url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlItems}
</urlset>`;

  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
};
