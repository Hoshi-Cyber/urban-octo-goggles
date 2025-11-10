// File: src/pages/blog/data/[category].json.ts
import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";
import { prettyCategoryTitle } from "../../../lib/blog/categories";
import { categorySlug, postSlugFromEntry, postUrlFromEntry } from "../../../lib/slug";

type Category = "cv-tips" | "linkedin" | "career-growth" | "kenya-market";

const CATEGORIES = ["cv-tips", "linkedin", "career-growth", "kenya-market"] as const;

function isCategory(v: string): v is Category {
  return (CATEGORIES as readonly string[]).includes(v);
}

type Item = {
  title: string;
  category: string;
  date: Date | string | null;
  tags: string[];
  slug: string;
  url: string;
  excerpt: string;
  cover: unknown | null;
};

const ts = (d: Item["date"]): number => (d ? new Date(d as Date | string).getTime() : 0);

export const GET: APIRoute = async ({ params }) => {
  const raw = (params.category ?? "").toString();
  if (!isCategory(raw)) {
    return new Response(
      JSON.stringify({ category: raw, categoryPretty: raw, count: 0, items: [] }),
      { headers: { "content-type": "application/json; charset=utf-8" }, status: 200 }
    );
  }
  const cat: Category = raw;

  const posts: CollectionEntry<"blog">[] = await getCollection(
    "blog",
    (entry: CollectionEntry<"blog">) =>
      !entry.data.draft && categorySlug(entry.data.category) === cat
  );

  const items: Item[] = posts
    .map((p: CollectionEntry<"blog">) => {
      const d = p.data;
      const primaryDate: Date | string | null =
        // prefer updated → pubDate → date when present
        (d as { updated?: Date | string }).updated ??
        (d as { pubDate?: Date | string }).pubDate ??
        d.date ??
        null;

      return {
        title: d.title,
        category: categorySlug(d.category),
        date: primaryDate,
        tags: d.tags ?? [],
        slug: postSlugFromEntry(p.slug),
        url: postUrlFromEntry(p),
        excerpt: d.excerpt ?? "",
        cover: (d as { cover?: unknown }).cover ?? null,
      };
    })
    .sort((a, b) => ts(b.date) - ts(a.date));

  const body = {
    category: cat,
    categoryPretty: prettyCategoryTitle(cat),
    count: items.length,
    items,
  };

  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
};
