/**
 * Blog pagination helpers (SSG) — Fix Plan 146
 * - Pure utilities for numbered pagination across /blog and friends
 * - No framework/runtime dependencies
 * - Consistent with /blog/index.astro and /blog/page/[page].astro usage
 */

export type PageLinks = {
  canonical: string;
  relPrev: string | null;
  relNext: string | null;
};

export type PaginateResult = {
  totalItems: number;
  perPage: number;
  totalPages: number;
  currentPage: number;
  start: number; // inclusive
  end: number; // exclusive
};

export function pageCount(totalItems: number, perPage: number): number {
  if (perPage <= 0) throw new Error("perPage must be > 0");
  return Math.max(1, Math.ceil(totalItems / perPage));
}

export function clampPage(page: number, totalPages: number): number {
  if (!Number.isFinite(page) || page < 1) return 1;
  if (page > totalPages) return totalPages;
  return page;
}

/**
 * Compute slice indices for the given page (1-indexed).
 * Returns [start, end) suitable for Array.prototype.slice.
 */
export function sliceRange(
  currentPage: number,
  perPage: number,
): { start: number; end: number } {
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  return { start, end };
}

/**
 * Convenience: paginate + slice indices in one call.
 */
export function paginate(
  totalItems: number,
  perPage: number,
  currentPage: number,
): PaginateResult {
  const totalPages = pageCount(totalItems, perPage);
  const page = clampPage(currentPage, totalPages);
  const { start, end } = sliceRange(page, perPage);
  return { totalItems, perPage, totalPages, currentPage: page, start, end };
}

/**
 * Build a proper base path:
 * - ensures leading slash
 * - strips trailing slash (we add it later)
 */
export function normalizeBasePath(basePath: string): string {
  const s = basePath.trim();
  const withLead = s.startsWith("/") ? s : `/${s}`;
  return withLead.endsWith("/") ? withLead.slice(0, -1) : withLead;
}

/**
 * Page href for numbered pagination.
 * - page 1 => `${basePath}/`
 * - page N => `${basePath}/page/${N}/`
 */
export function pageHref(basePath: string, page: number): string {
  const base = normalizeBasePath(basePath);
  return page <= 1 ? `${base}/` : `${base}/page/${page}/`;
}

/**
 * Prev/Next/Canonical links for <head> and UI.
 * - prev of page 2 is the root index (e.g., /blog/)
 * - prev of page >2 is /blog/page/{n-1}/
 * - next of last page is null
 */
export function makeRelLinks(
  currentPage: number,
  totalPages: number,
  basePath: string,
): PageLinks {
  const base = normalizeBasePath(basePath);
  const canonical = pageHref(base, currentPage);

  let relPrev: string | null = null;
  if (currentPage > 1) {
    relPrev = currentPage === 2 ? `${base}/` : pageHref(base, currentPage - 1);
  }

  const relNext =
    currentPage < totalPages ? pageHref(base, currentPage + 1) : null;

  return { canonical, relPrev, relNext };
}

/**
 * Slice an array into the visible items for a given page.
 */
export function pageItems<T>(
  items: T[],
  currentPage: number,
  perPage: number,
): T[] {
  const { start, end } = sliceRange(currentPage, perPage);
  return items.slice(start, end);
}

/**
 * Build an array like [1, 2, ..., totalPages] for numeric pagination UIs.
 */
export function pagesArray(totalPages: number): number[] {
  return Array.from({ length: totalPages }, (_, i) => i + 1);
}

/**
 * Safety: ensure page param from route is a valid positive integer.
 * Falls back to 1 if invalid.
 */
export function parsePageParam(param: string | number | undefined): number {
  const n =
    typeof param === "number" ? param : Number(String(param ?? "").trim());
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}
