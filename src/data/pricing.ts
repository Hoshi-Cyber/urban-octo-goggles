// src/data/pricing.ts
// Centralised pricing data helper + legacy FAQ wrapper.
//
// 1. Pricing plans (source of truth: ./pricing.json)
//    - Typed access via PricingPlan, pricingPlans, getPricingPlans()
// 2. Add-ons and speed options (mirrors pricing page copy)
// 3. Legacy FAQs compatibility (default export) – DO NOT REMOVE without
//    refactoring any remaining `import faqs from "./pricing"` usages.

import pricingData from "./pricing.json";
import { getPricingFaqs, type ResolvedFaqItem } from "./faqs";

/**
 * Primary pricing plan model
 * Mirrors the structure in src/data/pricing.json and <PricingTable />.
 */
export type PricingPlan = {
  id: string;
  name: string;
  description?: string;
  priceRange: string;
  features: string[];
  ctaLabel: string;
  highlight?: boolean;
};

/**
 * Strongly-typed view of ./pricing.json
 * Source of truth for:
 * - Home pricing preview
 * - Pricing page plans
 * - Any future funnels/emails that need plan metadata
 */
export const pricingPlans: PricingPlan[] = pricingData as PricingPlan[];

/**
 * Convenience accessor for pricing plans.
 * Use this instead of importing the JSON directly in TS modules.
 */
export function getPricingPlans(): PricingPlan[] {
  return pricingPlans;
}

/**
 * Optional: structured add-ons layer for Pricing page.
 * Currently mirrors the copy rendered inline on src/pages/pricing/index.astro.
 */
export type PricingAddon = {
  id: string;
  name: string;
  price: string;
  description: string;
};

export const pricingAddons: PricingAddon[] = [
  {
    id: "linkedin-revamp",
    name: "Full LinkedIn Revamp",
    price: "KSh 2,000",
    description:
      "Complete LinkedIn profile rewrite with recruiter-focused keywords.",
  },
  {
    id: "extra-cover-letter",
    name: "Extra cover letter",
    price: "KSh 1,500",
    description: "Additional cover letter for a second role or application.",
  },
  {
    id: "ats-report",
    name: "ATS score & optimisation report",
    price: "KSh 1,000",
    description:
      "Before/after ATS scan and recommendations to improve scoring.",
  },
  {
    id: "niche-keywords",
    name: "Niche keyword enhancement",
    price: "KSh 1,000",
    description:
      "Extra keyword pass for specialised sectors like tech, NGO and banking.",
  },
  {
    id: "annual-refresh",
    name: "Annual CV refresh",
    price: "KSh 3,000",
    description:
      "One CV update within 12 months for promotions or role changes.",
  },
];

/**
 * Optional: structured speed options layer for Pricing page.
 */
export type SpeedOption = {
  id: string;
  name: string;
  uplift: string; // e.g. "+25%"
  turnaround: string; // e.g. "48 hours"
  description: string;
};

export const pricingSpeedOptions: SpeedOption[] = [
  {
    id: "express-48h",
    name: "Express",
    uplift: "+25%",
    turnaround: "48 hours",
    description: "For upcoming deadlines and shortlisting windows.",
  },
  {
    id: "priority-24h",
    name: "Priority",
    uplift: "+40%",
    turnaround: "24 hours",
    description: "For senior roles and urgent recruitment cycles.",
  },
];

/**
 * Legacy pricing FAQ model + default export
 * ----------------------------------------------------
 * This section maintains backwards compatibility with older code that did:
 *
 *   import faqs from "./pricing";
 *
 * and expected an array of `{ q: string; a: string }`.
 * The underlying content is now provided by getPricingFaqs() in ./faqs.
 */

export type LegacyPricingFaq = {
  q: string;
  a: string;
};

// Resolve canonical FAQ data from the shared FAQ layer
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
  }),
);

/**
 * Named export for legacy FAQ consumers that prefer an explicit identifier.
 */
export const pricingFaqs: LegacyPricingFaq[] = faqs;

/**
 * Default export preserved for legacy imports:
 *   import faqs from "./pricing";
 */
export default faqs;
