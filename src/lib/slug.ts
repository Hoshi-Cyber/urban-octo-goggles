// File: src/lib/slug.ts

/**
 * Single source of truth for slugs and blog URLs.
 * Dev: keep links RELATIVE so localhost review stays on localhost.
 * Prod: only emit ABSOLUTE when PUBLIC_SITE_URL is set (e.g. https://cvwriting.co.ke).
 */

/** Normalize any string to a URL-safe slug. Falls back to "uncategorized". */
export const toSlug = (s: string): string =>
  String(s || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "uncategorized";

/** Category slug helper with default. */
export const categorySlug = (c?: string): string => toSlug(c || "uncategorized");

/** Last path segment of a content entry slug. Throws if empty. */
export const postSlugFromEntry = (entrySlug: string): string => {
  const s = String(entrySlug ?? "").split("/").pop()?.trim();
  if (!s) throw new Error("postSlugFromEntry: empty slug");
  return s;
};

/** Relative blog post path from a collection entry. */
export const postUrlFromEntry = (entry: {
  slug: string;
  data?: { category?: string };
}): string => `/blog/${categorySlug(entry.data?.category)}/${postSlugFromEntry(entry.slug)}/`;

/** Runtime flags */
export const IS_PROD = import.meta.env.PROD;
const SITE_URL_ENV = (import.meta.env.PUBLIC_SITE_URL as string | undefined) ?? "";

/**
 * Absolute URL helper.
 * - If `site` argument is provided, use it.
 * - Else if PUBLIC_SITE_URL is set (production), use it.
 * - Otherwise return the input path unchanged (dev → keep relative).
 */
export function abs(path: string, site?: URL | string | null): string {
  const base = site ? site.toString() : SITE_URL_ENV;
  if (!base) return path;
  try {
    return new URL(path, base).toString();
  } catch {
    return path;
  }
}
