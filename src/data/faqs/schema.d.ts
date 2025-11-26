// src/data/faqs/schema.d.ts

// Basic ID aliases
export type FaqItemId = string;
export type FaqGroupId = string;
export type FaqPageSlug = string;

/**
 * Single FAQ item, stored in src/data/faqs/items.json
 *
 * Example JSON shape:
 * {
 *   "how-process-works": {
 *     "id": "how-process-works",
 *     "question": "How does the process work from payment to final CV?",
 *     "answer": "Once you confirm your package and make payment, we send you a short intake form...",
 *     "tags": ["process", "getting-started"]
 *   }
 * }
 */
export interface FaqItem {
  /** Stable, URL-safe ID (kebab-case). Matches the key in items.json. */
  id: FaqItemId;
  question: string;
  /** May contain simple inline HTML (links, <strong>, <em>, <br />). */
  answer: string;
  /** Optional tags for filtering, search, or analytics. */
  tags?: string[];
}

/**
 * Logical FAQ group/section, stored in src/data/faqs/groups.json
 *
 * Example JSON shape:
 * {
 *   "pricing-payment": {
 *     "id": "pricing-payment",
 *     "title": "Pricing & payment",
 *     "itemIds": ["how-much-does-it-cost", "what-payment-methods", "do-you-offer-refunds"]
 *   }
 * }
 */
export interface FaqGroup {
  /** Stable ID for the group. Matches the key in groups.json. */
  id: FaqGroupId;
  /** Displayed section title, e.g. "Pricing & payment". */
  title: string;
  /** Ordered list of FAQ item IDs belonging to this group. */
  itemIds: FaqItemId[];
}

/**
 * Per-page FAQ configuration, e.g. src/data/faqs/faq-page.json, pricing.json, etc.
 *
 * Example JSON shape:
 * {
 *   "slug": "faq-page",
 *   "topItemIds": ["how-process-works", "how-much-does-it-cost"],
 *   "groupIds": ["getting-started", "pricing-payment", "process-timelines"]
 * }
 */
export interface FaqPageConfig {
  /** Logical slug for the page context, e.g. "faq-page" or "pricing". */
  slug: FaqPageSlug;
  /** Optional list of FAQ item IDs to feature at the top of the page. */
  topItemIds?: FaqItemId[];
  /** Ordered list of group IDs used on the page. */
  groupIds: FaqGroupId[];
}

/** Convenience maps for the JSON catalogues */
export type FaqItemMap = Record<FaqItemId, FaqItem>;
export type FaqGroupMap = Record<FaqGroupId, FaqGroup>;
export type FaqPageConfigMap = Record<FaqPageSlug, FaqPageConfig>;
