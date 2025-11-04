// File: src/pages/sitemap.xml.ts
import { getCollection } from "astro:content";
import { site } from "../config/site"; // export const site = { siteUrl: "https://cvwriting.co.ke" }
import { slug } from "@/utils/slug";

/** Safe string normalizer */
const safe = (v: unknown) => (v == null ? "" : String(v));

/** Join base + path with a single slash boundary */
const joinUrl = (base: string, path: string) => {
  const b = String(base || "").replace(/\/+$/, "");
  const p = String(path || "").replace(/^\/+/, "");
  return `${b}/${p}`;
};

/** ISO-8601 or undefined if invalid */
const iso = (d?: string | Date | null) => {
  if (!d) return undefined;
  const dt = typeof d === "string" ? new Date(d) : d;
  return isNaN(dt.getTime()) ? undefined : dt.toISOString();
};

type UrlItem = {
  loc: string;
  lastmod?: string;
  changefreq?: "daily" | "weekly" | "monthly";
  priority?: number;
};

const PER_PAGE = 12; // keep in sync with /blog index + /blog/page/[page].astro

export async function GET() {
  // Fetch all non-draft blog posts
  const entries = await getCollection("blog", ({ data }) => !data.draft);

  // Sort newest -> oldest (same as listing code)
  const sorted = [...entries].sort((a, b) => {
    const da = new Date((a.data as any).date as string).getTime();
    const db = new Date((b.data as any).date as string).getTime();
    return db - da;
  });

  // Post URLs: /blog/<category>/<slug>/
  const postItems: UrlItem[] = sorted.map((p) => {
    const postSlug = p.slug.split("/").pop()!;
    const categorySlug = slug(safe((p.data as any).category || "uncategorized"));
    const last =
      (p.data as any).updated ??
      (p.data as any).updatedAt ??
      (p.data as any).date;

    return {
      loc: joinUrl(site.siteUrl, `/blog/${categorySlug}/${postSlug}/`),
      lastmod: iso(last),
      changefreq: "weekly",
      priority: 0.6,
    };
  });

  // Category index URLs: /blog/category/<category>/
  const latestByCategory = new Map<string, Date>();
  for (const p of sorted) {
    const catSlug = slug(safe((p.data as any).category || "uncategorized"));
    const when = new Date(
      ((p.data as any).updated ??
        (p.data as any).updatedAt ??
        (p.data as any).date) as string
    );
    const prev = latestByCategory.get(catSlug);
    if (!prev || when > prev) latestByCategory.set(catSlug, when);
  }
  const categoryItems: UrlItem[] = Array.from(latestByCategory.entries()).map(
    ([cat, when]) => ({
      loc: joinUrl(site.siteUrl, `/blog/category/${cat}/`),
      lastmod: iso(when),
      changefreq: "weekly",
      priority: 0.5,
    })
  );

  // Tag index URLs: /blog/tag/<tag>/
  const latestByTag = new Map<string, Date>();
  for (const p of sorted) {
    const tags: unknown = (p.data as any).tags ?? [];
    const list = Array.isArray(tags) ? tags : [];
    const when = new Date(
      ((p.data as any).updated ??
        (p.data as any).updatedAt ??
        (p.data as any).date) as string
    );
    for (const t of list) {
      const tagSlug = slug(safe(t));
      if (!tagSlug) continue;
      const prev = latestByTag.get(tagSlug);
      if (!prev || when > prev) latestByTag.set(tagSlug, when);
    }
  }
  const tagItems: UrlItem[] = Array.from(latestByTag.entries()).map(
    ([tag, when]) => ({
      loc: joinUrl(site.siteUrl, `/blog/tag/${tag}/`),
      lastmod: iso(when),
      changefreq: "weekly",
      priority: 0.4,
    })
  );

  // Top-level essentials
  const baseItems: UrlItem[] = [
    { loc: joinUrl(site.siteUrl, "/"), changefreq: "weekly", priority: 0.8 },
    { loc: joinUrl(site.siteUrl, "/blog/"), changefreq: "weekly", priority: 0.7 },
  ];

  // Static service pages moved to .astro
  const serviceUrls = [
    "/services/cv-writing/",
    "/services/cover-letter/",
    "/services/linkedin-optimization/",
  ].map<UrlItem>((p) => ({
    loc: joinUrl(site.siteUrl, p),
    changefreq: "weekly",
    priority: 0.7,
  }));

  // ---- NEW: Global blog pagination URLs (/blog/page/2..N) ----
  // Listing logic uses "featured = newest; rest = others" and paginates the rest.
  const totalItems = Math.max(0, sorted.length - 1);
  const totalPages = Math.max(1, Math.ceil(totalItems / PER_PAGE));

  const paginationItems: UrlItem[] =
    totalPages > 1
      ? Array.from({ length: totalPages - 1 }, (_, i) => {
          const n = i + 2; // start at page 2
          // Compute lastmod as the newest post inside this page slice (of the "rest")
          const start = (n - 1) * PER_PAGE; // page 2 => slice starts at PER_PAGE
          const end = start + PER_PAGE;
          const rest = sorted.slice(1); // drop featured
          const slice = rest.slice(start, end);
          const newestInSlice = slice[0];
          const lastmod =
            newestInSlice
              ? iso(
                  (newestInSlice.data as any).updated ??
                  (newestInSlice.data as any).updatedAt ??
                  (newestInSlice.data as any).date
                )
              : undefined;

          return {
            loc: joinUrl(site.siteUrl, `/blog/page/${n}/`),
            lastmod,
            changefreq: "weekly",
            priority: 0.6,
          };
        })
      : [];

  // Combine and sort by lastmod desc
  const items = [
    ...baseItems,
    ...serviceUrls,
    ...paginationItems, // include paginated listing URLs
    ...categoryItems,
    ...tagItems,
    ...postItems,
  ].sort((a, b) => {
    if (!a.lastmod && !b.lastmod) return 0;
    if (!a.lastmod) return 1;
    if (!b.lastmod) return -1;
    return new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime();
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items
  .map((u) => {
    const lines = [
      `<loc>${u.loc}</loc>`,
      u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "",
      u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : "",
      typeof u.priority === "number" ? `<priority>${u.priority.toFixed(1)}</priority>` : "",
    ]
      .filter(Boolean)
      .join("");
    return `  <url>${lines}</url>`;
  })
  .join("\n")}
</urlset>`.trim();

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
}
