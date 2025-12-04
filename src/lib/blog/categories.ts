/** File: src/lib/blog/categories.ts */

/**
 * Canonical category definitions for the blog.
 * Single source of truth for:
 * - Category slugs used in routes
 * - Display names and descriptions
 * - Optional hero/OG image configs
 */

/** URL-safe slugs for all blog categories. */
export type CategorySlug =
  | "cv-tips"
  | "linkedin"
  | "career-growth"
  | "kenya-market";

/** Reusable image configuration for hero/OG images. */
export type ImageConfig = {
  src: string;
  alt: string;
};

/** Full category metadata model. */
export type BlogCategory = {
  /** URL-safe slug (used in routes and content frontmatter). */
  slug: CategorySlug;
  /** Human-readable category name used in UI. */
  name: string;
  /** Short description used in intros, SEO snippets, etc. */
  description: string;
  /** Optional hero image for category pages. */
  heroImage?: ImageConfig;
  /** Optional OG image for category pages. */
  ogImage?: ImageConfig;
};

/**
 * Canonical category config.
 * All category- and routing-related logic should derive from this list.
 */
export const CATEGORIES: BlogCategory[] = [
  {
    slug: "cv-tips",
    name: "CV Tips",
    description:
      "Practical CV and cover letter tips tailored to Kenya’s job market.",
  },
  {
    slug: "linkedin",
    name: "LinkedIn & Online Profiles",
    description:
      "Guides on optimising your LinkedIn and online profiles for visibility and credibility.",
  },
  {
    slug: "career-growth",
    name: "Career Growth",
    description:
      "Strategies for job search, promotions, career resilience and long-term growth.",
  },
  {
    slug: "kenya-market",
    name: "Kenya Job Market",
    description:
      "Insights on hiring trends, salary ranges and employer expectations in Kenya.",
  },
];

/**
 * Exported list of all category slugs for routing (getStaticPaths, etc.).
 */
export const CATEGORY_SLUGS: CategorySlug[] = CATEGORIES.map(
  (category) => category.slug,
);

/**
 * Legacy alias maintained for compatibility with existing code.
 * Wherever possible, prefer CategorySlug or BlogCategory.
 */
export type Category = CategorySlug;

/** Pagination size (kept at 8 for QA). */
export const PER_PAGE = 8;

/**
 * Look up category metadata by slug.
 * Returns undefined if the slug does not match any known category.
 */
export function getCategoryBySlug(
  slug: string,
): BlogCategory | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

/**
 * Base path for all category routes.
 * Example: /blog/cv-tips, /blog/cv-tips/page/2
 */
export const categoryBasePath = "/blog";

/**
 * Build the canonical URL path for a given category and page.
 *
 * Page 1:
 *   /blog/{category}
 *
 * Page N (N > 1):
 *   /blog/{category}/page/{N}
 */
export function categoryPagePath(
  category: CategorySlug,
  page: number,
): string {
  const safePage = Math.max(1, Math.floor(page) || 1);

  if (safePage === 1) {
    return `${categoryBasePath}/${category}`;
  }

  return `${categoryBasePath}/${category}/page/${safePage}`;
}

/**
 * Human-friendly category title for UI usage.
 * Falls back gracefully if an unknown slug is provided.
 */
export function prettyCategoryTitle(slug: string): string {
  const category = getCategoryBySlug(slug as CategorySlug);

  if (category) {
    return category.name;
  }

  // Fallback: transform "some-slug" -> "Some Slug"
  return slug
    .split("-")
    .filter(Boolean)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join(" ");
}

/**
 * Build a category-specific page title.
 * This is used for <title> tags on category listing pages.
 */
export function buildCategoryTitle(slug: string): string {
  const pretty = prettyCategoryTitle(slug);
  return `${pretty} · Blog Category`;
}

/**
 * Build a category-specific meta description.
 * Uses the canonical description where available.
 */
export function buildCategoryDescription(slug: string): string {
  const category = getCategoryBySlug(slug as CategorySlug);

  if (category?.description) {
    return category.description;
  }

  const pretty = prettyCategoryTitle(slug);
  return `Articles and insights in the ${pretty} category.`;
}

/**
 * Return a list of "related" categories for a given category.
 * Simple behaviour: all other categories, optionally limited.
 */
export function relatedCategories(
  current: CategorySlug,
  limit = 3,
): BlogCategory[] {
  const others = CATEGORIES.filter(
    (category) => category.slug !== current,
  );
  return others.slice(0, limit);
}

/**
 * Generic pagination result model.
 */
export type PaginatedResult<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

/**
 * Simple, robust paginator used by category pages.
 *
 * - Accepts any array of items (already filtered/sorted).
 * - Uses PER_PAGE by default unless an explicit perPage is provided.
 * - Clamps page to the valid range [1, totalPages].
 */
export function paginate<T>(
  items: T[],
  page: number,
  perPage: number = PER_PAGE,
): PaginatedResult<T> {
  const totalItems = items.length;

  // Guard against invalid values.
  const safePerPage = perPage && perPage > 0 ? perPage : PER_PAGE;
  const requestedPage = Math.max(1, Math.floor(page) || 1);

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / safePerPage),
  );
  const currentPage = Math.min(requestedPage, totalPages);

  const start = (currentPage - 1) * safePerPage;
  const end = start + safePerPage;

  const pageItems = items.slice(start, end);

  return {
    items: pageItems,
    currentPage,
    totalPages,
    totalItems,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}
