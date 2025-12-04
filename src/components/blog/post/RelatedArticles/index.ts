// src/components/blog/post/RelatedArticles/index.ts
// Barrel file: re-export the Astro component and expose shared types.
// This preserves the default component for `import RelatedArticles from ".../RelatedArticles"`

export { default } from "./index.astro";

export type RelatedArticlesBandVariant = "tinted" | "flat";

export interface RelatedArticle {
  title: string;
  href: string;
  category: string;
  readingTimeMinutes?: number;
  excerpt?: string;
  dateISO?: string;
}

export interface RelatedArticlesProps {
  items: RelatedArticle[];
  title?: string;
  /**
   * Controls whether the surrounding band (owned by BlogPostLayout)
   * is rendered using the tinted blog band background or a flat
   * surface background.
   */
  bandVariant?: RelatedArticlesBandVariant;
}
