// src/data/faqs.ts
//
// Fix Plan 205.1.7 – Standardise Social Proof, FAQ, and Checklist Data Sources
//
// Purpose
// - Provide a canonical, reusable data source for FAQs used as
//   faqItems in BlogPostLayoutProps.
// - Selection and mapping happen at the route/data layer; this file is
//   pure data + small helpers.
// - Frontmatter should reference preset IDs; the route resolves those IDs
//   into concrete FAQ items before passing them to BlogPostLayout.
//
// Contract
// - Type-safe by indexing off BlogPostLayoutProps["faqItems"].
// - Display components consume items as-is and do not implement selection logic.

import type { BlogPostLayoutProps } from "@/components/blog/post/BlogPostLayout";

// A single FAQ item, kept in sync with layout props.
export type FaqItem = NonNullable<BlogPostLayoutProps["faqItems"]>[number];

export interface FaqPreset {
  /** Stable identifier referenced from frontmatter, e.g. "cv-writing-general". */
  id: string;
  /** Human-readable label for internal use / CMS tooling. */
  label: string;
  /** Optional description for editors explaining when to use this preset. */
  description?: string;
  /** The actual FAQ entries to render. */
  items: FaqItem[];
}

/**
 * Canonical FAQ presets for CVWriting.co.ke.
 *
 * Notes:
 * - These are generic, reusable FAQ sets for core content clusters.
 * - Real deployments can extend/override while keeping the same structure.
 */
export const FAQ_PRESETS: FaqPreset[] = [
  {
    id: "cv-writing-general",
    label: "General CV writing service FAQs",
    description:
      "Use on core CV writing guides, sales pages, and service-related blog posts.",
    items: [
      {
        question: "How long does it take to get my CV after I place an order?",
        answer:
          "Standard turnaround is 3–5 working days after we receive your completed intake form and any supporting documents. If you need it faster, we offer an express option at an additional fee, subject to writer availability.",
      },
      {
        question: "Do you write CVs for all career levels?",
        answer:
          "Yes. We support fresh graduates, early-career professionals, mid-level managers, senior leaders, and executives. The depth of strategy, stakeholder messaging, and outcome framing is adjusted to your level and career goals.",
      },
      {
        question: "Can you help if I have career gaps or several job changes?",
        answer:
          "Yes. We specialise in complex profiles, including career gaps, multiple short roles, and sector switches. The CV is structured to de-risk your story for recruiters by focusing on outcomes, context, and clarity instead of just timelines.",
      },
      {
        question: "Will my CV work for both Kenyan and international applications?",
        answer:
          "Our default structure is optimised for the Kenyan market and modern ATS systems, but we can adapt for regional or global roles on request. If you are targeting specific markets (e.g. UK, EU, remote-first companies), we factor that into formatting and language.",
      },
    ],
  },
  {
    id: "cv-format-kenya-2025",
    label: "2025 Kenya CV format FAQs",
    description:
      "Use on CV format, layout, and structure guides focused on the Kenyan job market.",
    items: [
      {
        question: "What is the ideal CV length for jobs in Kenya in 2025?",
        answer:
          "For most professionals, 2–3 pages is the sweet spot. Fresh graduates can often fit into 1–2 pages, while senior leaders with 15+ years of experience may reasonably use 3–4 pages if every section is outcome-driven and easy to scan.",
      },
      {
        question: "Should I include my photo, ID number, or marital status on my CV?",
        answer:
          "No. For most modern employers and ATS platforms, photos and personal identifiers (ID number, marital status, religion, etc.) are unnecessary and can even introduce bias. Focus on results, responsibilities, and skills that are relevant to the role.",
      },
      {
        question: "Do Kenyan recruiters still prefer chronological CVs?",
        answer:
          "Yes, a reverse-chronological structure is still standard. However, we combine it with a strong top summary, skills snapshot, and outcome-focused bullet points so your most relevant value is obvious within the first 10–15 seconds of reading.",
      },
      {
        question: "How important are keywords and ATS optimisation in Kenya?",
        answer:
          "ATS filters are increasingly common, especially in larger organisations, government-linked entities, and well-known brands. We weave in role-specific keywords without turning your CV into a buzzword list, keeping it readable for humans first.",
      },
    ],
  },
  {
    id: "linkedin-kenya",
    label: "LinkedIn and personal branding FAQs",
    description:
      "Use on LinkedIn optimisation, personal branding, and visibility-focused content.",
    items: [
      {
        question: "Why should my CV and LinkedIn profile match?",
        answer:
          "Recruiters often cross-check your CV against your LinkedIn profile. Misalignment can trigger doubt or additional questions. We keep both aligned on core facts while tailoring each to its channel: the CV for screening, LinkedIn for visibility and network.",
      },
      {
        question: "How often should I update my LinkedIn profile?",
        answer:
          "At minimum, update it when you change roles or achieve major outcomes. For active job seekers, it’s wise to refresh your headline, About section, and featured items every 3–6 months to reflect your current targets and achievements.",
      },
      {
        question: "Do I need to post content on LinkedIn to get good roles?",
        answer:
          "You don’t have to become a full-time creator, but occasional high-quality posts showcasing your work, thinking, or results can significantly increase inbound opportunities. Even simple, well-structured updates once or twice a month help.",
      },
      {
        question: "Can you help with both my CV and LinkedIn together?",
        answer:
          "Yes. We offer combined CV + LinkedIn optimisation packages so your story, positioning, and keywords are aligned across both assets. This is particularly useful if you are targeting competitive roles or planning a career move within 6–12 months.",
      },
    ],
  },
];

/**
 * Internal index for O(1) lookup by preset id.
 */
const FAQ_PRESETS_BY_ID: Record<string, FaqPreset> = FAQ_PRESETS.reduce<
  Record<string, FaqPreset>
>((acc, preset) => {
  acc[preset.id] = preset;
  return acc;
}, {});

/**
 * Resolve one or more FAQ preset IDs into a flattened FaqItem[].
 *
 * Typical usage at the route layer:
 * - frontmatter.faqPresets: string | string[]
 * - const faqItems = getFaqItems(frontmatter.faqPresets)
 * - props.faqItems = faqItems;
 *
 * Unknown IDs are ignored to keep the site resilient to content errors.
 */
export function getFaqItems(
  presetIds?: string | string[] | null
): FaqItem[] | undefined {
  if (!presetIds) return undefined;

  const ids = Array.isArray(presetIds) ? presetIds : [presetIds];

  const items: FaqItem[] = [];

  for (const id of ids) {
    const preset = FAQ_PRESETS_BY_ID[id];
    if (!preset) continue;
    items.push(...preset.items);
  }

  return items.length > 0 ? items : undefined;
}
