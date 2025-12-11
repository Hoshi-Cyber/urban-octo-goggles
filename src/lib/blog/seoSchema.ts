/**
 * File: src/lib/blog/seoSchema.ts
 *
 * Purpose (Fix Plan 006 Step 3.2):
 * - Central helper for generating JSON-LD for blog articles.
 * - Builds a single @graph containing:
 *   • WebPage
 *   • WebSite
 *   • BlogPosting
 *   • BreadcrumbList
 *   • Organization (publisher)
 *   • Person (author, embedded inside BlogPosting)
 *
 * Responsibilities:
 * - Accept a normalised SEO input object from the route layer.
 * - Construct JSON-LD that matches "Seo Schema Spec Blog Articles V1".
 * - Do NOT touch Astro components or layout concerns.
 *
 * Usage (route example):
 *
 *   import { buildBlogArticleGraph } from "@/lib/blog/seoSchema";
 *
 *   const schema = buildBlogArticleGraph({
 *     url: canonicalAbs,
 *     title: metaTitle || entry.data.title,
 *     description: metaDescription || entry.data.description,
 *     category: entry.data.category,
 *     tags: entry.data.tags,
 *     publishedAt: entry.data.date.toISOString(),
 *     updatedAt: entry.data.updated?.toISOString(),
 *     imageUrl: resolvedOgImageUrl,
 *     authorName: entry.data.author,
 *     siteName: site.siteName,
 *     siteUrl: site.siteUrl,
 *     siteLogoUrl: site.logoUrl,
 *     readingTimeMinutes: entry.data.readingTime,
 *     breadcrumbs: breadcrumbItemsAbsolute,
 *   });
 *
 *   <Seo
 *     slot="head"
 *     title={...}
 *     description={...}
 *     canonicalUrl={canonicalAbs}
 *     ogImage={resolvedOgImageUrl}
 *     siteName={site.siteName}
 *     structuredData={schema}
 *   />
 */

/** Single breadcrumb step with absolute URL. */
export interface BreadcrumbItem {
  name: string;
  /** Absolute URL */
  item: string;
}

/**
 * Input shape for building blog article JSON-LD.
 * This deliberately decouples us from Astro content types.
 */
export interface BlogArticleSchemaInput {
  /** Canonical absolute URL for the article. */
  url: string;
  /** Meta/SEO title (metaTitle || title). */
  title: string;
  /** Meta/SEO description (metaDescription || description). */
  description?: string;
  /** Category slug or human-readable section label. */
  category?: string;
  /** Keyword tags. */
  tags?: string[];
  /** ISO date string (YYYY-MM-DD or full ISO) for first publication. */
  publishedAt?: string;
  /** ISO date string for last modification, if any. */
  updatedAt?: string;
  /** Primary hero/OG image URL (absolute preferred). */
  imageUrl?: string;
  /** Article author display name. */
  authorName?: string;
  /** Site / brand name (publisher). */
  siteName: string;
  /** Absolute base URL for the site (e.g. "https://cvwriting.co.ke"). */
  siteUrl: string;
  /** Absolute logo URL for publisher. */
  siteLogoUrl?: string;
  /**
   * Reading time in minutes.
   * Used to derive timeRequired (PTXM).
   */
  readingTimeMinutes?: number;
  /**
   * Pre-built breadcrumb trail with absolute URLs.
   * Expected order:
   *   Home → Blog → Category → Article
   */
  breadcrumbs?: BreadcrumbItem[];
}

/** Utility: ensure a string is present and non-empty. */
function hasString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/** Utility: build timeRequired in ISO 8601 duration (PTXM). */
function buildTimeRequired(readingTimeMinutes?: number): string | undefined {
  if (!readingTimeMinutes || !Number.isFinite(readingTimeMinutes)) {
    return undefined;
  }

  const minutes = Math.max(1, Math.round(readingTimeMinutes));
  return `PT${minutes}M`;
}

/** Utility: normalise date to ISO 8601 (YYYY-MM-DD or full ISO). */
function normaliseIsoDate(date?: string): string | undefined {
  if (!hasString(date)) return undefined;

  // If it's already a reasonable ISO string, return as-is.
  // We deliberately avoid heavy parsing in this helper.
  return date;
}

/**
 * Build WebSite node for the @graph.
 */
function buildWebSiteNode(input: BlogArticleSchemaInput) {
  const siteId = `${input.siteUrl.replace(/\/+$/, "")}#website`;

  return {
    "@type": "WebSite",
    "@id": siteId,
    url: input.siteUrl,
    name: input.siteName,
    publisher: {
      "@id": `${input.siteUrl.replace(/\/+$/, "")}#organization`,
    },
  };
}

/**
 * Build Organization (publisher) node for the @graph.
 */
function buildOrganizationNode(input: BlogArticleSchemaInput) {
  const base = input.siteUrl.replace(/\/+$/, "");

  const node: Record<string, unknown> = {
    "@type": "Organization",
    "@id": `${base}#organization`,
    name: input.siteName,
    url: input.siteUrl,
  };

  if (hasString(input.siteLogoUrl)) {
    node.logo = {
      "@type": "ImageObject",
      url: input.siteLogoUrl,
    };
  }

  return node;
}

/**
 * Build WebPage node for the @graph.
 */
function buildWebPageNode(input: BlogArticleSchemaInput) {
  const url = input.url;
  const base = input.siteUrl.replace(/\/+$/, "");
  const pageId = `${url}#webpage`;

  const node: Record<string, unknown> = {
    "@type": "WebPage",
    "@id": pageId,
    url,
    name: input.title,
    isPartOf: {
      "@id": `${base}#website`,
    },
    inLanguage: "en-KE",
  };

  if (hasString(input.description)) {
    node.description = input.description;
  }

  if (hasString(input.imageUrl)) {
    node.primaryImageOfPage = {
      "@type": "ImageObject",
      "@id": `${url}#primaryimage`,
      url: input.imageUrl,
    };
  }

  const published = normaliseIsoDate(input.publishedAt);
  if (published) {
    node.datePublished = published;
  }

  const modified = normaliseIsoDate(input.updatedAt || input.publishedAt);
  if (modified) {
    node.dateModified = modified;
  }

  if (input.breadcrumbs && input.breadcrumbs.length > 0) {
    node.breadcrumb = {
      "@id": `${url}#breadcrumb`,
    };
  }

  return node;
}

/**
 * Build BlogPosting node for the @graph.
 */
function buildBlogPostingNode(input: BlogArticleSchemaInput) {
  const url = input.url;
  const pageId = `${url}#webpage`;

  const node: Record<string, unknown> = {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: input.title,
    mainEntityOfPage: {
      "@id": pageId,
    },
    isPartOf: {
      "@id": pageId,
    },
    inLanguage: "en-KE",
  };

  if (hasString(input.description)) {
    node.description = input.description;
  }

  if (hasString(input.imageUrl)) {
    node.image = input.imageUrl;
  }

  const published = normaliseIsoDate(input.publishedAt);
  if (published) {
    node.datePublished = published;
  }

  const modified = normaliseIsoDate(input.updatedAt || input.publishedAt);
  if (modified) {
    node.dateModified = modified;
  }

  if (hasString(input.category)) {
    node.articleSection = input.category;
  }

  if (input.tags && input.tags.length > 0) {
    node.keywords = input.tags.join(", ");
  }

  const timeRequired = buildTimeRequired(input.readingTimeMinutes);
  if (timeRequired) {
    node.timeRequired = timeRequired;
  }

  if (hasString(input.authorName)) {
    node.author = {
      "@type": "Person",
      name: input.authorName,
    };
  } else {
    node.author = {
      "@type": "Organization",
      name: input.siteName,
    };
  }

  node.publisher = {
    "@id": `${input.siteUrl.replace(/\/+$/, "")}#organization`,
  };

  return node;
}

/**
 * Build BreadcrumbList node for the @graph.
 */
function buildBreadcrumbListNode(input: BlogArticleSchemaInput) {
  const { breadcrumbs } = input;
  if (!breadcrumbs || breadcrumbs.length === 0) return null;

  const url = input.url;

  return {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };
}

/**
 * Public API:
 * Build the full JSON-LD graph for a blog article page.
 *
 * Returns an object ready to be passed into:
 *   - <Seo structuredData={...} />
 *   - or <StructuredData data={...} />
 */
export function buildBlogArticleGraph(input: BlogArticleSchemaInput) {
  const graph: Array<Record<string, unknown>> = [];

  const organization = buildOrganizationNode(input);
  const website = buildWebSiteNode(input);
  const webPage = buildWebPageNode(input);
  const blogPosting = buildBlogPostingNode(input);
  const breadcrumbList = buildBreadcrumbListNode(input);

  graph.push(organization, website, webPage, blogPosting);
  if (breadcrumbList) {
    graph.push(breadcrumbList);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
