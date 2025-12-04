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
