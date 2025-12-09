/** File: src/lib/blog/categories.ts */

/**
 * Canonical category definitions for the blog.
 * Single source of truth for:
 * - Category slugs used in routes
 * - Display names and descriptions
 * - Hero / card copy for UI
 * - Default layout presets and funnel stages
 * - Optional hero/OG image configs
 */

/** URL-safe slugs for all blog categories. */
export type CategorySlug =
  | "cv-strategy"
  | "linkedin"
  | "career-growth"
  | "kenya-market"
  | "hiring-insights";

/** Reusable image configuration for hero/OG images. */
export type ImageConfig = {
  src: string;
  alt: string;
};

/** Allowed layout presets for BlogPostLayout. */
export type BlogPostPreset =
  | "conversionArticle"
  | "editorialArticle"
  | "analysisArticle"
  | "shortInsight"
  | "campaignLanding";

/** Funnel stage markers used for content and CTA intensity. */
export type FunnelStage = "TOFU" | "MOFU" | "BOFU" | "MOFU_BOFU";

/** Full category metadata model. */
export type BlogCategory = {
  /** URL-safe slug (used in routes and content frontmatter). */
  slug: CategorySlug;
  /** Human-readable category name used in UI. */
  name: string;
  /** Short description used in intros, SEO snippets, etc. */
  description: string;
  /** Category hero title (H1) for category landing pages. */
  heroTitle: string;
  /** Category hero subtitle for landing pages. */
  heroSubtitle: string;
  /** Short subtitle used on category cards (UI). */
  cardSubtitle: string;
  /** Microcopy / body text used on category cards (UI). */
  cardBody: string;
  /** Default layout preset for posts in this category. */
  defaultPreset: BlogPostPreset;
  /** Default funnel stage for posts in this category. */
  defaultFunnelStage: FunnelStage;
  /** Optional hero image for category pages. */
  heroImage?: ImageConfig;
  /** Optional OG image for category pages. */
  ogImage?: ImageConfig;
};

/**
 * Canonical category config.
 * All category- and routing-related logic should derive from this list.
 *
 * NOTE:
 * - Slugs represent the new 5-category taxonomy:
 *   - cv-strategy
 *   - linkedin
 *   - career-growth
 *   - kenya-market
 *   - hiring-insights
 */
export const CATEGORIES: BlogCategory[] = [
  {
    slug: "cv-strategy",
    name: "CV & Application Strategy",
    description:
      "Clear, practical frameworks for CVs, cover letters, and ATS-ready applications tailored to the Kenyan market.",
    heroTitle: "Build a CV That Gets You Shortlisted",
    heroSubtitle: "Clear, practical frameworks for the modern Kenyan job market.",
    cardSubtitle: "Clear, practical guides for stronger applications.",
    cardBody:
      "Proven CV, cover letter, and ATS frameworks tailored for the Kenyan job market.",
    defaultPreset: "conversionArticle",
    defaultFunnelStage: "BOFU",
  },
  {
    slug: "linkedin",
    name: "LinkedIn & Professional Branding",
    description:
      "Guides for positioning your LinkedIn profile for visibility, credibility, and recruiter search.",
    heroTitle: "Strengthen Your Professional Presence Online",
    heroSubtitle: "Position yourself for visibility, credibility, and recruiter search.",
    cardSubtitle: "Be visible. Be credible.",
    cardBody:
      "Position your profile for recruiter search, clarity, and professional authority.",
    defaultPreset: "conversionArticle",
    defaultFunnelStage: "MOFU_BOFU",
  },
  {
    slug: "career-growth",
    name: "Career Growth & Transitions",
    description:
      "Practical frameworks for progression, transitions, and leadership decisions in the Kenyan context.",
    heroTitle: "Navigate Career Decisions with Clarity",
    heroSubtitle: "Practical frameworks for progression, transitions, and leadership.",
    cardSubtitle: "Navigate your next step with confidence.",
    cardBody:
      "Practical career strategy, progression insights, and transition frameworks for Kenyan professionals.",
    defaultPreset: "editorialArticle",
    defaultFunnelStage: "MOFU",
  },
  {
    slug: "kenya-market",
    name: "Kenya Job Market & Sector Insights",
    description:
      "Data-backed sector outlooks, salary trends, and hiring patterns across the Kenyan economy.",
    heroTitle: "Understand the Trends Shaping Work in Kenya",
    heroSubtitle: "Sector outlooks, hiring patterns, and salary intelligence.",
    cardSubtitle: "Local trends that shape real opportunities.",
    cardBody:
      "Sector outlooks, salary benchmarks, and hiring insights grounded in Kenya’s evolving economy.",
    defaultPreset: "analysisArticle",
    defaultFunnelStage: "TOFU",
  },
  {
    slug: "hiring-insights",
    name: "Interviews, Shortlisting & Recruiter Systems",
    description:
      "Interview preparation and recruiter-process insights for Kenyan jobseekers.",
    heroTitle: "Learn How Hiring Really Works",
    heroSubtitle: "Interview prep, shortlisting insights, and recruiter behaviour.",
    cardSubtitle: "Understand how hiring really works.",
    cardBody:
      "Interview prep, recruiter behaviour, and shortlisting dynamics to help you stand out and get hired.",
    defaultPreset: "conversionArticle",
    defaultFunnelStage: "MOFU_BOFU",
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
export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return CATEGORIES.find((category) => category.slug === slug);
}

/**
 * New helper: get category by slug (semantic alias for getCategoryBySlug).
 * Prefer this in new code.
 */
export function getCategory(slug: string): BlogCategory | undefined {
  return getCategoryBySlug(slug);
}

/**
 * New helper: get all category metadata.
 * Useful for CategoryGrid, static paths, etc.
 */
export function getAllCategories(): BlogCategory[] {
  return CATEGORIES;
}

/**
 * Base path for all category routes.
 * Example: /blog/cv-strategy, /blog/cv-strategy/page/2
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
  const category = getCategoryBySlug(slug);

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
  const category = getCategoryBySlug(slug);

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
