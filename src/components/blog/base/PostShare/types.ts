// src/components/blog/base/PostShare/types.ts

export interface PostShareProps {
  /** Post title – used for link text and share payloads */
  title: string;

  /** Canonical URL to share */
  url: string;

  /** Optional short excerpt to enrich share text */
  excerpt?: string;

  /** Optional "via" handle for X (e.g. "@HoshiConsult") */
  via?: string;
}
