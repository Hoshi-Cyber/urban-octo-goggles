// src/components/blog/compose/PostNav/types.ts

export interface LegacyPostItem {
  data: {
    title: string;
    category: string;
    description?: string;
    date?: string | Date;
    /**
     * Optional explicit URL, if the route precomputes it.
     */
    url?: string;
  };
  slug: string;
}

export interface SimplePostItem {
  /**
   * Post title to display in navigation.
   */
  title: string;
  /**
   * Fully resolved URL for this post.
   */
  url: string;
  /**
   * Optional category identifier for analytics or context.
   */
  category?: string;
}

/**
 * Input shape accepted by PostNav.
 * Supports both the legacy { data, slug } model and the simpler
 * { title, url, category? } model.
 */
export type PostNavItemInput = LegacyPostItem | SimplePostItem;

/**
 * Normalised navigation target used internally by the component.
 */
export interface NavItemResolved {
  title: string;
  href: string;
  category?: string;
}

/**
 * Public props for PostNav.
 */
export interface PostNavProps {
  prev?: PostNavItemInput | null;
  next?: PostNavItemInput | null;
}
