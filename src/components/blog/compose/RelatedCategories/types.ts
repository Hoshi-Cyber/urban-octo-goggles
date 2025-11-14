// src/components/blog/compose/RelatedCategories/types.ts

export interface RelatedPostCover {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

/**
 * Legacy related item shape: { data, slug }.
 * Allows reuse of existing blog collection entries without refactoring.
 */
export interface LegacyRelatedItem {
  data: {
    title: string;
    category: string;
    description?: string;
    date?: string | Date;
    readingTime?: string | number;
    cover?: RelatedPostCover;
    /**
     * Optional fully resolved URL, if the route precomputes it.
     */
    url?: string;
  };
  slug: string;
}

/**
 * Simple, explicit related item shape for new wiring.
 */
export interface SimpleRelatedItem {
  title: string;
  url: string;
  category: string;
  date?: string | Date;
  readingTime?: string | number;
  cover?: RelatedPostCover;
}

export type RelatedInputItem = LegacyRelatedItem | SimpleRelatedItem;

export interface NormalisedRelatedItem {
  title: string;
  href: string;
  category?: string;
  date?: string | Date;
  readingTime?: string | number;
  cover?: RelatedPostCover;
  dateLabel?: string;
  readingTimeLabel?: string;
}

/**
 * Public props for RelatedCategories.
 */
export interface RelatedCategoriesProps {
  /**
   * List of related posts to surface.
   * When empty or undefined, the component renders nothing.
   */
  items?: RelatedInputItem[];

  /**
   * Optional generic heading, e.g. "Related articles".
   * Defaults to "Related articles".
   */
  heading?: string;

  /**
   * Optional label used to build a contextual heading:
   * e.g. "More in Career Growth".
   */
  categoryLabel?: string;
}
