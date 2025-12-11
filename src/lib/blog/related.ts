// src/lib/blog/related.ts

/**
 * RelatedArticles selection logic (Fix Plan 205.1.6 + 213 + 006)
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
import { categoryBasePath } from "@/lib/blog/categories";

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
  title?: string;
  href?: string;
  category?: string;
  readingTimeMinutes?: number;
  excerpt?: string;
  dateISO?: string;
};

/**
 * Derive the base slug (last segment) from a blog entry.
 * e.g. "cv-strategy/ats-proof-cv-kenya" -> "ats-proof-cv-kenya"
 */
function getBaseSlug(entry: BlogPostEntry): string {
  const parts = entry.slug.split("/");
  return parts[parts.length - 1] ?? entry.slug;
}

/**
 * Derive category slug from entry:
 * - Prefer explicit entry.data.category when present.
 * - Fallback to first segment of the path, e.g. "cv-strategy/foo" -> "cv-strategy".
 */
function getCategorySlug(entry: BlogPostEntry): string {
  const dataCategory = (entry.data as any).category as string | undefined;

  if (typeof dataCategory === "string" && dataCategory.trim().length > 0) {
    return dataCategory.trim();
  }

  const parts = entry.slug.split("/");
  return parts.length > 1 ? parts[0] ?? "" : "";
}

/**
 * Compute simple tag overlap score between two posts.
 */
function tagOverlapScore(a: BlogPostEntry, b: BlogPostEntry): number {
  const tagsA = Array.isArray((a.data as any).tags)
    ? ((a.data as any).tags as string[])
    : [];
  const tagsB = Array.isArray((b.data as any).tags)
    ? ((b.data as any).tags as string[])
    : [];

  if (!tagsA.length || !tagsB.length) {
    return 0;
  }

  const setA = new Set(tagsA);
  let score = 0;

  for (const tag of tagsB) {
    if (setA.has(tag)) {
      score += 1;
    }
  }

  return score;
}

/**
 * Defensive date extraction:
 * - Returns a valid Date instance for sorting.
 * - Falls back to Unix epoch if date is missing/invalid to keep ordering stable.
 */
function getSafeDate(entry: BlogPostEntry): Date {
  const raw = (entry.data as any).date as unknown;

  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return raw;
  }

  if (typeof raw === "string" || typeof raw === "number") {
    const d = new Date(raw);
    if (!Number.isNaN(d.getTime())) {
      return d;
    }
  }

  // Fallback: very old date to push unknowns to the end.
  return new Date(0);
}

/**
 * Normalise manual relatedPosts overrides from frontmatter.
 *
 * relatedPosts?: {
 *   title?: string;
 *   href?: string;
 *   category?: string;
 *   readingTimeMinutes?: number;
 *   excerpt?: string;
 *   dateISO?: string;
 * }[]
 */
function getManualOverrides(entry: BlogPostEntry): RelatedArticle[] | null {
  const raw = (entry.data as any).relatedPosts as
    | ManualRelatedPost[]
    | undefined;

  if (!Array.isArray(raw) || raw.length === 0) {
    return null;
  }

  const category = getCategorySlug(entry);
  const baseSlug = getBaseSlug(entry);

  const selfHref =
    category && category.trim().length > 0
      ? `${categoryBasePath}/${category}/${baseSlug}/`
      : `${categoryBasePath}/${baseSlug}/`;

  const entryDefaultCategory = category || "";

  const normalised = raw
    .filter((item) => {
      if (!item || typeof item.href !== "string") return false;

      const href = item.href.trim();
      if (!href) return false;

      // Avoid self-linking by mistake.
      if (href === selfHref) return false;

      return true;
    })
    .map<RelatedArticle>((item) => {
      const title =
        (item.title && item.title.trim().length > 0
          ? item.title.trim()
          : (entry.data as any).title) || getBaseSlug(entry);

      const categoryValue =
        (item.category && item.category.trim()) || entryDefaultCategory;

      const readingTime =
        typeof item.readingTimeMinutes === "number"
          ? item.readingTimeMinutes
          : undefined;

      return {
        title,
        href: item.href!.trim(),
        category: categoryValue,
        readingTimeMinutes: readingTime,
        excerpt: item.excerpt,
        dateISO: item.dateISO,
      };
    });

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
  options: GetRelatedArticlesOptions = {},
): Promise<RelatedArticle[]> {
  const manual = getManualOverrides(entry);
  const limit = options.limit ?? 6;

  if (manual) {
    return manual.slice(0, limit);
  }

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
    const categorySlug = getCategorySlug(post);
    const sameCategory = categorySlug === currentCategory;

    const overlap = tagOverlapScore(entry, post);
    const date = getSafeDate(post);

    // Heuristic scoring:
    // - Same category = +3
    // - Each overlapping tag = +2
    // Behaviour is deterministic and stable.
    const score = (sameCategory ? 3 : 0) + overlap * 2;

    return { post, score, date };
  });

  // Filter out completely unrelated posts unless we have no tags at all.
  const entryTags = Array.isArray((entry.data as any).tags)
    ? ((entry.data as any).tags as unknown[])
    : [];
  const hasTags = entryTags.length > 0;

  const filtered = hasTags ? scored.filter((item) => item.score > 0) : scored;

  // If everything got filtered out (e.g. no overlaps), fall back to same-category by recency.
  const pool =
    filtered.length > 0
      ? filtered
      : scored.filter(
          (item) => getCategorySlug(item.post) === currentCategory,
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
    const categorySlug = getCategorySlug(post);
    const base = getBaseSlug(post);

    const readingTime =
      typeof (post.data as any).readingTime === "number"
        ? ((post.data as any).readingTime as number)
        : undefined;

    // Prefer category-aware URL when we have one; otherwise fall back to /blog/<slug>/.
    const href =
      categorySlug && categorySlug.trim().length > 0
        ? `${categoryBasePath}/${categorySlug}/${base}/`
        : `${categoryBasePath}/${base}/`;

    return {
      title: (post.data as any).title,
      href,
      category: categorySlug || "",
      readingTimeMinutes: readingTime,
      excerpt: (post.data as any).description,
      dateISO: date.toISOString(),
    };
  });
}
