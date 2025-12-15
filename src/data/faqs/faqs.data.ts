// src/data/faqs.ts
// Single loader for all FAQ data (Fix Plan 207 – section 3)

import itemsJson from "./faq-items.json";
import groupsJson from "./faq-groups.json";
import faqPageConfigJson from "./faq-page.json";
import pricingConfigJson from "./faq-pricing.json";
import cvWritingConfigJson from "./faq-cv-writing.json";

// Types from schema
import type {
  FaqItemId,
  FaqGroupId,
  FaqPageSlug,
  FaqPageConfig,
  FaqItemMap,
  FaqGroupMap,
} from "./schema";

// Cast JSON to typed maps/configs
const itemMap = itemsJson as FaqItemMap;
const groupMap = groupsJson as FaqGroupMap;

const faqPageConfig = faqPageConfigJson as FaqPageConfig;
const pricingConfig = pricingConfigJson as FaqPageConfig;
const cvWritingConfig = cvWritingConfigJson as FaqPageConfig;

const pageConfigs: Record<FaqPageSlug, FaqPageConfig> = {
  [faqPageConfig.slug]: faqPageConfig,
  [pricingConfig.slug]: pricingConfig,
  [cvWritingConfig.slug]: cvWritingConfig,
};

// Resolved shapes for UI components (FAQAccordion, etc.)
export type ResolvedFaqItem = {
  id: FaqItemId;
  question: string;
  answer: string;
};

export type ResolvedFaqGroup = {
  id: FaqGroupId;
  title: string;
  items: ResolvedFaqItem[];
};

export type ResolvedFaqPage = {
  slug: FaqPageSlug;
  topQuestions: ResolvedFaqItem[];
  groups: ResolvedFaqGroup[];
};

// Internal helpers
function resolveItem(id: FaqItemId): ResolvedFaqItem | null {
  const raw = itemMap[id];

  if (!raw) {
    if (import.meta.env && (import.meta.env as any).DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[faqs] Missing FAQ item for id="${id}"`);
    }
    return null;
  }

  return {
    id: raw.id,
    question: raw.question,
    answer: raw.answer,
  };
}

function resolveGroup(id: FaqGroupId): ResolvedFaqGroup | null {
  const raw = groupMap[id];

  if (!raw) {
    if (import.meta.env && (import.meta.env as any).DEV) {
      // eslint-disable-next-line no-console
      console.warn(`[faqs] Missing FAQ group for id="${id}"`);
    }
    return null;
  }

  const items: ResolvedFaqItem[] = [];

  for (const itemId of raw.itemIds) {
    const resolved = resolveItem(itemId);
    if (resolved) items.push(resolved);
  }

  return {
    id: raw.id,
    title: raw.title,
    items,
  };
}

function resolvePage(config: FaqPageConfig): ResolvedFaqPage {
  const topQuestions: ResolvedFaqItem[] = [];

  if (config.topItemIds && Array.isArray(config.topItemIds)) {
    for (const itemId of config.topItemIds) {
      const resolved = resolveItem(itemId);
      if (resolved) topQuestions.push(resolved);
    }
  }

  const groups: ResolvedFaqGroup[] = [];

  for (const groupId of config.groupIds) {
    const resolved = resolveGroup(groupId);
    if (resolved) groups.push(resolved);
  }

  return {
    slug: config.slug,
    topQuestions,
    groups,
  };
}

// Home page Quick FAQ selector (Fix Plan 009 – section 2.1)
const HOME_QUICK_FAQ_IDS: FaqItemId[] = [
  "who-we-serve",
  "ats-and-kenyan-portals",
  "turnaround-time-cv-delivery",
  "what-to-provide-to-get-started",
  "revisions-included",
  "bundle-cv-linkedin-cover-letter",
];

/**
 * Quick FAQ items for the home page strip.
 * Returns resolved items ready for FAQAccordion.
 */
export function getHomeQuickFaqItems(): ResolvedFaqItem[] {
  const items: ResolvedFaqItem[] = [];

  for (const id of HOME_QUICK_FAQ_IDS) {
    const resolved = resolveItem(id);
    if (resolved) items.push(resolved);
  }

  return items;
}

// Public API – per-page loaders

/**
 * Main FAQ page ("/faq/").
 * Usage in src/pages/faq/index.astro:
 *   import { getFaqPageFaqs } from "../../data/faqs/faqs.data/faqs.data";
 *   const { topQuestions, groups: faqGroups } = getFaqPageFaqs();
 */
export function getFaqPageFaqs(): ResolvedFaqPage {
  return resolvePage(faqPageConfig);
}

/**
 * Pricing page ("/pricing/") FAQs.
 * Usage in src/pages/pricing/index.astro:
 *   import { getPricingFaqs } from "../../data/faqs/faqs.data/faqs.data";
 *   const { topQuestions, groups } = getPricingFaqs();
 */
export function getPricingFaqs(): ResolvedFaqPage {
  return resolvePage(pricingConfig);
}

/**
 * Generic loader by slug, for future pages (services, etc.).
 */
export function getFaqsForSlug(slug: FaqPageSlug): ResolvedFaqPage | null {
  const config = pageConfigs[slug];
  if (!config) return null;
  return resolvePage(config);
}

// Optional: expose raw maps if ever needed elsewhere (read-only usage)
export const faqItems: FaqItemMap = itemMap;
export const faqGroups: FaqGroupMap = groupMap;
