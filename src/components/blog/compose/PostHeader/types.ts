// src/components/blog/compose/PostHeader/types.ts

export interface PostHeaderProps {
  /**
   * Post title (rendered as the main H1).
   */
  title: string;

  /**
   * Human-readable category label, e.g. "Career Strategy".
   * Used as the default eyebrow label when `eyebrow` is not provided.
   */
  category: string;

  /**
   * Absolute or root-relative URL for the category archive,
   * e.g. "/blog/career-strategy/".
   * Used for the clickable eyebrow link when present.
   */
  categoryUrl: string;

  /**
   * Optional eyebrow label above the H1.
   * When omitted, `category` is used as the eyebrow text.
   */
  eyebrow?: string;

  /**
   * Optional short dek / lead line under the title.
   */
  dek?: string;

  /**
   * Optional id applied to the <header>.
   */
  id?: string;

  /**
   * Optional additional class name appended to the root header element.
   */
  class?: string;
}
