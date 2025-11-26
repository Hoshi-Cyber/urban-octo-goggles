// src/data/pricing.ts
// Legacy compatibility wrapper for pricing FAQs.
// New code should prefer:
//   import { getPricingFaqs } from "./faqs";
//
// This module exists only so any older imports expecting
// `[{ q: string; a: string }, ...]` still work, but the
// underlying content now comes from the central JSON layer.

import { getPricingFaqs, type ResolvedFaqItem } from "./faqs";

export type LegacyPricingFaq = {
  q: string;
  a: string;
};

const resolved = getPricingFaqs();

/**
 * Flatten all pricing FAQs (top questions + groups) into the
 * legacy [{ q, a }] shape, with no duplicated IDs.
 */
const uniqueById = new Map<string, ResolvedFaqItem>();

for (const item of resolved.topQuestions) {
  uniqueById.set(item.id, item);
}

for (const group of resolved.groups) {
  for (const item of group.items) {
    if (!uniqueById.has(item.id)) {
      uniqueById.set(item.id, item);
    }
  }
}

const faqs: LegacyPricingFaq[] = Array.from(uniqueById.values()).map(
  (item) => ({
    q: item.question,
    a: item.answer,
  })
);

export default faqs;
