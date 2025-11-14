// src/components/blog/compose/PostTags/types.ts

export interface PostTagItem {
  /**
   * Human-readable tag label, e.g. "Interview Tips".
   */
  label: string;

  /**
   * Destination URL for this tag, e.g. "/blog/tag/interview-tips/".
   * Routing logic is handled by the caller; this component only renders the link.
   */
  href: string;

  /**
   * Optional machine slug, if needed for analytics or future data wiring.
   */
  slug?: string;
}

export interface PostTagsProps {
  /**
   * List of tags to render as clickable pills.
   * When empty or undefined, the component renders nothing.
   */
  tags?: PostTagItem[];
}
