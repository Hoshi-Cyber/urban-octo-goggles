// src/lib/blog/related.ts

/**
 * RelatedArticles selection logic (Fix Plan 205.1.6 + 213)
 *
 * Responsibilities:
 * - Honour manual overrides from frontmatter: entry.data.relatedPosts.
 * - Otherwise, compute a deterministic list of related articles based on:
 *   - Same category preference
 *   - Tag overlap
 *   - Recency (date) as a tiebreaker
 *   - Stable fallback ordering (slug) to avoid jitter between builds
 *
 * Output shape is UI-agnostic but matches what BlogPostLayout expects:
 *   type RelatedArticle = {
 *     title: string;
 *     href: string;
 *     category: string;
 *     readingTimeMinutes?: number;
 *     excerpt?: string;
 *     dateISO?: string;
 *   };
 */

import { getCollection, type CollectionEntry } from "astro:content";

type BlogPostEntry = CollectionEntry<"blog">;

/**
 * Public output shape for BlogPostLayout and other consumers.
 * Kept here (lib) to avoid coupling data logic back to the UI component.
 */
export type RelatedArticle = {
  title: string;
  href: string;
  category: string;
  readingTimeMinutes?: number;
  excerpt?: string;
  dateISO?: string;
};

type ManualRelatedPost = {
  title: string;
  href: string;
  category?: string;
  readingTimeMinutes?: number;
  excerpt?: string;
  dateISO?: string;
};

/**
 * Derive the base slug (last segment) from a blog entry.
 * e.g. "cv-tips/ats-proof-cv-kenya" -> "ats-proof-cv-kenya"
 */
function getBaseSlug(entry: BlogPostEntry): string {
  const parts = entry.slug.split("/");
  return parts[parts.length - 1]!;
}

/**
 * Derive category slug from entry:
 * - Prefer explicit entry.data.category when present.
 * - Fallback to first segment of the path, e.g. "cv-tips/foo" -> "cv-tips".
 */
function getCategorySlug(entry: BlogPostEntry): string {
  const dataCategory = (entry.data as any).category as string | undefined;
  if (dataCategory && dataCategory.trim().length > 0) {
    return dataCategory;
  }

  const parts = entry.slug.split("/");
  return parts.length > 1 ? parts[0]! : "";
}

/**
 * Compute simple tag overlap score between two posts.
 */
function tagOverlapScore(a: BlogPostEntry, b: BlogPostEntry): number {
  const tagsA = new Set((a.data as any).tags ?? []);
  const tagsB = new Set((b.data as any).tags ?? []);
  let score = 0;

  for (const tag of tagsA) {
    if (tagsB.has(tag)) score++;
  }

  return score;
}

/**
 * Normalise manual relatedPosts overrides from frontmatter.
 *
 * relatedPosts?: { title: string; href: string; category: string;
 *                  readingTimeMinutes?: number; excerpt?: string; dateISO?: string }[]
 */
function getManualOverrides(entry: BlogPostEntry): RelatedArticle[] | null {
  const raw = (entry.data as any).relatedPosts as ManualRelatedPost[] | undefined;
  if (!Array.isArray(raw) || raw.length === 0) {
    return null;
  }

  const selfHref = `/blog/${getCategorySlug(entry)}/${getBaseSlug(entry)}/`;

  const normalised = raw
    .filter(
      (item) =>
        item &&
        typeof item.href === "string" &&
        item.href.trim().length > 0
    )
    // avoid self-linking by mistake
    .filter((item) => item.href !== selfHref)
    .map<RelatedArticle>((item) => ({
      title: item.title,
      href: item.href,
      category: item.category ?? getCategorySlug(entry),
      readingTimeMinutes:
        typeof item.readingTimeMinutes === "number"
          ? item.readingTimeMinutes
          : undefined,
      excerpt: item.excerpt,
      dateISO: item.dateISO,
    }));

  return normalised.length > 0 ? normalised : null;
}

interface GetRelatedArticlesOptions {
  /** Maximum number of related articles to return. Default: 6. */
  limit?: number;
}

/**
 * Main helper: compute related articles for a given blog entry.
 *
 * 1. If entry.data.relatedPosts is present → return those (normalised).
 * 2. Otherwise:
 *    - Filter out the current entry.
 *    - Prefer same-category posts.
 *    - Score by tag overlap + same-category bonus.
 *    - Sort by score desc, then date desc, then slug asc (stable).
 *    - Map to RelatedArticle objects.
 *
 * This keeps all "what is related?" logic in /lib and lets the route layer
 * simply call getRelatedArticles(...) and feed the result into BlogPostLayout.
 */
export async function getRelatedArticles(
  entry: BlogPostEntry,
  options: GetRelatedArticlesOptions = {}
): Promise<RelatedArticle[]> {
  const manual = getManualOverrides(entry);
  if (manual) {
    return manual.slice(0, options.limit ?? 6);
  }

  const limit = options.limit ?? 6;
  const allPosts = await getCollection("blog");

  const selfSlug = entry.slug;
  const currentCategory = getCategorySlug(entry);

  const candidates = allPosts.filter((post) => post.slug !== selfSlug);

  type Scored = {
    post: BlogPostEntry;
    score: number;
    date: Date;
  };

  const scored: Scored[] = candidates.map((post) => {
    const category = getCategorySlug(post);
    const sameCategory = category === currentCategory;

    const overlap = tagOverlapScore(entry, post);
    const date = new Date((post.data as any).date);

    // Heuristic scoring:
    // - Same category = +3
    // - Each overlapping tag = +2
    // Behaviour is deterministic and stable.
    const score = (sameCategory ? 3 : 0) + overlap * 2;

    return { post, score, date };
  });

  // Filter out completely unrelated posts unless we have no tags at all.
  const hasTags =
    Array.isArray((entry.data as any).tags) &&
    ((entry.data as any).tags as any[]).length > 0;

  const filtered =
    hasTags ? scored.filter((item) => item.score > 0) : scored;

  // If everything got filtered out (e.g. no overlaps), fall back to same-category by recency.
  const pool =
    filtered.length > 0
      ? filtered
      : scored.filter(
          (item) => getCategorySlug(item.post) === currentCategory
        );

  // If still empty (edge case), fall back to "latest posts minus self".
  const finalPool = pool.length > 0 ? pool : scored;

  finalPool.sort((a, b) => {
    // 1) Higher score first
    if (b.score !== a.score) return b.score - a.score;

    // 2) Newer posts first
    const timeDiff = b.date.getTime() - a.date.getTime();
    if (timeDiff !== 0) return timeDiff;

    // 3) Stable tie-breaker by slug
    return a.post.slug.localeCompare(b.post.slug);
  });

  const selected = finalPool.slice(0, limit);

  return selected.map<RelatedArticle>(({ post, date }) => {
    const category = getCategorySlug(post);
    const base = getBaseSlug(post);

    const readingTime =
      typeof (post.data as any).readingTime === "number"
        ? (post.data as any).readingTime
        : undefined;

    // Prefer category-aware URL when we have one; otherwise fall back to /blog/<slug>/.
    const href =
      category && category.trim().length > 0
        ? `/blog/${category}/${base}/`
        : `/blog/${base}/`;

    return {
      title: post.data.title,
      href,
      category: category || "",
      readingTimeMinutes: readingTime,
      excerpt: (post.data as any).description,
      dateISO: date.toISOString(),
    };
  });
}
