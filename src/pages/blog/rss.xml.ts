// File: src/pages/blog/rss.xml.ts
import type { APIRoute } from "astro";
import type { CollectionEntry } from "astro:content";
import { getCollection } from "astro:content";

const ts = (e: CollectionEntry<"blog">): number => {
  const d = (e.data as any).updated ?? (e.data as any).pubDate ?? e.data.date ?? 0;
  return new Date(d).getTime();
};

export const GET: APIRoute = async () => {
  const posts: CollectionEntry<"blog">[] = await getCollection(
    "blog",
    (entry: CollectionEntry<"blog">) => !entry.data.draft
  );

  const items = posts
    .sort((a, b) => ts(b) - ts(a))
    .map((post: CollectionEntry<"blog">) => {
      const url = `/blog/${post.slug.replace(/^blog\//, "")}/`;
      const pubDate = new Date(
        (post.data as any).updated ?? (post.data as any).pubDate ?? post.data.date ?? Date.now()
      ).toUTCString();

      return `
      <item>
        <title><![CDATA[${post.data.title}]]></title>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${pubDate}</pubDate>
        <description><![CDATA[${post.data.excerpt ?? ""}]]></description>
      </item>`;
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>CVwriting.co.ke — Blog</title>
  <link>/blog/</link>
  <description>Latest articles</description>
  ${items.join("\n")}
</channel>
</rss>`;

  return new Response(xml, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
};
