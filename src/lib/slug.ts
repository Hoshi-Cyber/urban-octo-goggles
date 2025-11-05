// File: src/lib/slug.ts

/**
 * Single source of truth for slugs and blog URLs.
 * Fix Plan 141 consolidation.
 */

/** Normalize any string to a URL-safe slug. Falls back to "uncategorized". */
export const toSlug = (s: string): string =>
  String(s || "")
    .normalize("NFKD") // split diacritics
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "uncategorized";

/** Category slug helper with default. */
export const categorySlug = (c?: string): string =>
  toSlug(c || "uncategorized");

/** Last path segment of a content entry slug. Throws if empty. */
export const postSlugFromEntry = (entrySlug: string): string => {
  const s = String(entrySlug ?? "")
    .split("/")
    .pop()
    ?.trim();
  if (!s) throw new Error("postSlugFromEntry: empty slug");
  return s;
};

/** Canonical blog post URL from a collection entry. */
export const postUrlFromEntry = (entry: {
  slug: string;
  data?: { category?: string };
}): string =>
  `/blog/${categorySlug(entry.data?.category)}/${postSlugFromEntry(entry.slug)}/`;

/** Absolute URL helper that respects Astro.site when provided. */
export const abs = (path: string, site?: URL | string | null): string =>
  site ? new URL(path, site.toString()).toString() : path;
