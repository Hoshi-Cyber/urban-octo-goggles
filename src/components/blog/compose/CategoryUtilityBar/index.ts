// File: src/components/blog/compose/CategoryUtilityBar/index.ts
/**
 * Type exports for CategoryUtilityBar.
 * Fix Plan 162: parity with SSR media fields so the client renderer
 * can output <img> with intrinsic sizing and proper loading hints.
 *
 * Note: `tags` remains for filtering, but cards do not render tag chips.
 */

export type Post = {
  slug: string;
  title: string;
  url: string;
  date: string;                 // ISO
  tags: string[];
  estReadMin: number | null;

  // Preferred SSR-parity media fields
  thumbnailSrc?: string | null;
  thumbnailAlt?: string | null;
  thumbnailW?: number | null;
  thumbnailH?: number | null;

  // Legacy back-compat (older payloads)
  cover?: { src: string | null; alt: string | null };
};

export type Props = {
  category: string;  // e.g., "cv-tips"
  pageSize: number;  // must match server PER_PAGE
  mountId?: string;  // id of the server grid container to replace
};

// Re-export the client component as default (Astro import target)
export { default } from "./index.client";
