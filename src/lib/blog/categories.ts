/** File: src/lib/blog/categories.ts */

/** Canonical category config */
export const CATEGORIES = [
  "cv-tips",
  "linkedin",
  "career-growth",
  "kenya-market",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Pagination size (kept at 8 for QA) */
export const PER_PAGE = 8;

/** Category intro copy (used for hero/dek and meta description) */
export const CATEGORY_INTRO: Record<Category, string> = {
  "cv-tips": "Practical, Kenya-ready CV and cover-letter tactics.",
  linkedin: "Profiles, headlines, and outreach that get replies.",
  "career-growth": "Interviews, offers, and career leverage.",
  "kenya-market": "Local trends, roles, and salary intelligence.",
};

/** Pretty titles for categories */
export function prettyCategoryTitle(slug: Category): string {
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

/** Human titles map (stable, overridable if needed) */
export const CATEGORY_TITLES: Record<Category, string> = {
  "cv-tips": "CV Tips",
  linkedin: "LinkedIn",
  "career-growth": "Career Growth",
  "kenya-market": "Kenya Market",
};

/** Marketing title + description helpers (spec-aligned) */
export function buildCategoryTitle(cat: Category): string {
  return `${CATEGORY_TITLES[cat]} | Get Hired Faster in Kenya`;
}

export function buildCategoryDescription(cat: Category): string {
  return (
    CATEGORY_INTRO[cat] ??
    `Articles in ${prettyCategoryTitle(cat)} on CV Writing Kenya`
  );
}

/** Related categories (always show all other categories = 3) */
export type RelatedItem = { title: string; slug: Category };

/** Optional manual ordering per category (omit to use default order in CATEGORIES) */
const RELATED_ORDER: Partial<Record<Category, Category[]>> = {
  // Example: "cv-tips": ["linkedin", "career-growth", "kenya-market"],
};

/** Builder returns the 3 remaining categories in the chosen order */
export function relatedCategories(cat: Category): RelatedItem[] {
  const pool = CATEGORIES.filter((c) => c !== cat);
  const ordered = RELATED_ORDER[cat]
    ? RELATED_ORDER[cat]!.filter((c) => c !== cat)
    : pool;
  return ordered.map((slug) => ({ title: CATEGORY_TITLES[slug], slug }));
}

/** Fast guard and lookup */
const CAT_SET: ReadonlySet<string> = new Set(CATEGORIES);
export function isCategory(x: unknown): x is Category {
  return typeof x === "string" && CAT_SET.has(x);
}

/** Route builders
 * Trailing slash policy: 'always'
 * Keep in sync with astro.config.mjs and all link emitters.
 */
export function categoryBasePath(category: Category): string {
  return `/blog/category/${category}/`;
}
export function categoryPagePath(category: Category, page: number): string {
  return `/blog/category/${category}/page/${page}/`;
}

/** Authoritative post URL helper (single source of truth) */
export function postUrlFromSlug(slug: string): string {
  return `/blog/${slug}/`;
}

/** Simple pagination helper */
export function paginate<T>(items: T[], page: number, perPage = PER_PAGE) {
  const count = Math.max(1, Math.ceil(items.length / perPage));
  const clamped = Math.min(Math.max(1, page || 1), count);
  const start = (clamped - 1) * perPage;
  const end = start + perPage;
  return {
    pageCount: count,
    page: clamped,
    start,
    end,
    slice: items.slice(start, end),
  };
}

/** Utility to decide if pagination UI should render */
export function shouldRenderPagination(totalItems: number, perPage = PER_PAGE) {
  return totalItems > perPage;
}

/** Read-time range helper for hero metrics (optional) */
export function computeReadRange(readMins: number[]): string {
  if (!readMins || readMins.length === 0) return "4–9 min";
  const min = Math.max(1, Math.min(...readMins));
  const max = Math.max(...readMins);
  return min === max ? `${min} min` : `${min}–${max} min`;
}
