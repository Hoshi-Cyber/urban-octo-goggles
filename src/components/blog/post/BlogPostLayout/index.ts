// File: src/components/blog/post/BlogPostLayout/index.ts
// Thin adapter around the .astro layout plus exported types for consumers.

import type { AstroComponentFactory } from "astro";

export { default } from "./index.astro";

/**
 * IA presets and slice keys (Fix Plan 213):
 * - Preset defines intent (minimal vs conversion vs educational).
 * - Slice keys define which bands render and in what order.
 */
export type BlogPostLayoutPreset =
  | "minimalArticle"
  | "conversionArticle"
  | "educationalGuide";

export type BlogPostLayoutSliceKey =
  | "toc"
  | "body"
  | "checklist"
  | "inlineOffer"
  | "socialProof"
  | "faq"
  | "finalCta"
  | "related";

/**
 * Public props contract for BlogPostLayout.
 * Mirrors the interface used inside index.astro (Fix Plan 205 + 213).
 */
export interface BlogPostLayoutProps {
  // Breadcrumbs
  breadcrumbs: { href: string; label: string }[];

  // Hero / meta
  category: string;
  title: string;
  heroTagline?: string;
  publishedAt?: string;
  updatedAt?: string;
  readingTimeMinutes?: number;
  authorName?: string;
  authorUrl?: string;
  heroImage?: {
    src: string;
    alt: string;
  };
  heroSoftCta?: {
    label: string;
    href: string;
    ctaId?: string;
  };

  // Content slices
  introHtml?: string;
  keyTakeaways?: string[];

  // Table of contents
  toc?: {
    id: string;
    label: string;
    level: number;
    href?: string;
  }[];
  showToc?: boolean;

  // Body content
  /**
   * Optional explicit body renderer (e.g. MDX component).
   * If omitted, the <slot /> content will be used.
   */
  Content?: AstroComponentFactory;

  // Conversion & trust (resolved via central data banks at route layer)
  inlineOffer?: {
    heading: string;
    bullets: string[];
    ctaLabel: string;
    ctaHref: string;
    trustNote?: string;
    eyebrow?: string;
  };

  socialProofItems?: {
    quote: string;
    author: string;
    role?: string;
    avatarSrc?: string;
    rating?: number;
    class?: string;
  }[];

  faqItems?: {
    question: string;
    answerHtml: string;
  }[];

  finalCta?: {
    heading: string;
    bodyHtml: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };

  relatedArticles?: {
    title: string;
    href: string;
    category: string;
    readingTimeMinutes?: number;
    excerpt?: string;
    dateISO?: string;
  }[];

  /**
   * Implementation checklist:
   * - Resolved from preset IDs via src/data/checklists in the route,
   *   with optional legacy inline fallback.
   */
  checklist?: {
    title?: string;
    leadHtml?: string;
    items: string[];
  };

  /**
   * IA preset and optional explicit slice ordering (Fix Plan 213):
   * - preset: high-level intent for the article.
   * - slices: optional explicit ordered list of slice keys; when provided,
   *   it takes precedence over the preset defaults.
   */
  preset?: BlogPostLayoutPreset;
  slices?: BlogPostLayoutSliceKey[];
}
