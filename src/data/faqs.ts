// src/data/faqs.ts
// Single loader for all FAQ data (Fix Plan 207 – section 3)

import itemsJson from "./faqs/items.json";
import groupsJson from "./faqs/groups.json";
import faqPageConfigJson from "./faqs/faq-page.json";
import pricingConfigJson from "./faqs/pricing.json";

// Types from schema
import type {
  FaqItemId,
  FaqGroupId,
  FaqPageSlug,
  FaqPageConfig,
  FaqItemMap,
  FaqGroupMap,
} from "./faqs/schema";

// Cast JSON to typed maps/configs
const itemMap = itemsJson as FaqItemMap;
const groupMap = groupsJson as FaqGroupMap;

const faqPageConfig = faqPageConfigJson as FaqPageConfig;
const pricingConfig = pricingConfigJson as FaqPageConfig;

const pageConfigs: Record<FaqPageSlug, FaqPageConfig> = {
  [faqPageConfig.slug]: faqPageConfig,
  [pricingConfig.slug]: pricingConfig,
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

// Public API – per-page loaders

/**
 * Main FAQ page ("/faq/").
 * Usage in src/pages/faq/index.astro:
 *   import { getFaqPageFaqs } from "../../data/faqs";
 *   const { topQuestions, groups: faqGroups } = getFaqPageFaqs();
 */
export function getFaqPageFaqs(): ResolvedFaqPage {
  return resolvePage(faqPageConfig);
}

/**
 * Pricing page ("/pricing/") FAQs.
 * Usage in src/pages/pricing/index.astro:
 *   import { getPricingFaqs } from "../../data/faqs";
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
