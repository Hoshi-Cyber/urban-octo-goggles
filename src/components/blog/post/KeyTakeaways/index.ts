// src/components/blog/post/KeyTakeaways/index.ts
// Thin adapter around the .astro component plus exported props type.

/**
 * KeyTakeawaysProps
 *
 * Fix Plan 213 – content contract:
 * - 3–5 concise, insight-focused bullet points.
 * - Use for “what this post says” summary at the top of the article.
 * - Do NOT use for implementation steps; those belong in ChecklistSection.
 */
export interface KeyTakeawaysProps {
  /**
   * 3–5 concise, insight-focused bullet points.
   * Longer or action-oriented items should move to ChecklistSection.
   */
  items: string[];

  /**
   * Optional heading label. Defaults to "Key takeaways".
   */
  title?: string;
}

export { default } from "./index.astro";
