// src/data/testimonials.ts
//
// Fix Plan 205.1.7 – Standardise Social Proof, FAQ, and Checklist Data Sources
//
// Purpose
// - Provide a canonical, reusable data source for testimonials used as
//   socialProofItems in BlogPostLayoutProps.
// - Selection and mapping happen at the route/data layer; this file is
//   pure data + small helpers.
// - Frontmatter should reference presets/IDs; the route resolves those IDs
//   into concrete SocialProofItem[] before passing them to BlogPostLayout.
//
// Contract
// - Type-safe by indexing off BlogPostLayoutProps["socialProofItems"].
// - Display components (SocialProofStrip) consume items as-is and do not
//   implement any selection/scoring logic.

import type { BlogPostLayoutProps } from "@/components/blog/post/BlogPostLayout";

// A single testimonial / social proof item, kept in sync with layout props.
export type SocialProofItem = NonNullable<
  BlogPostLayoutProps["socialProofItems"]
>[number];

export interface SocialProofPreset {
  /** Stable identifier referenced from frontmatter, e.g. "cv-writing-default". */
  id: string;
  /** Human-readable label for internal use / CMS tooling. */
  label: string;
  /** Optional description for editors explaining when to use this preset. */
  description?: string;
  /** The actual testimonial items to render. */
  items: SocialProofItem[];
}

/**
 * Canonical social proof presets for CVWriting.co.ke.
 *
 * Notes:
 * - These are generic, non-personalised examples suitable as defaults.
 * - Real production deployments can replace or extend these with
 *   live testimonials while keeping the same structure.
 */
export const SOCIAL_PROOF_PRESETS: SocialProofPreset[] = [
  {
    id: "cv-writing-default",
    label: "Default CV Writing testimonials",
    description:
      "Primary social proof strip for core CV writing guides and service pages.",
    items: [
      {
        quote:
          "After rewriting my CV with this framework, I started getting interview invites within two weeks.",
        author: "Grace, Operations Manager – Nairobi",
        context: "Mid-career professional switching from NGO to private sector",
        rating: 5,
      },
      {
        quote:
          "The new CV finally explains my results in numbers. Recruiters actually reply to my applications now.",
        author: "Kenneth, Senior Accountant",
        context: "10+ years’ experience, applying for regional roles",
        rating: 5,
      },
      {
        quote:
          "HR told me my CV was ‘very clear and easy to scan.’ That has never happened before.",
        author: "Aisha, Product Manager",
        context: "Tech sector, targeting regional and remote roles",
        rating: 4,
      },
    ],
  },
  {
    id: "cv-writing-executive",
    label: "Executive / C-suite CV testimonials",
    description:
      "Use on executive CV, board-ready, and senior leadership content.",
    items: [
      {
        quote:
          "The CV moved me from ‘generic GM’ to ‘turnaround specialist’. It completely shifted how headhunters respond.",
        author: "Daniel, Group General Manager",
        context: "Manufacturing & distribution, Kenya and East Africa",
        rating: 5,
      },
      {
        quote:
          "Board recruiters commented that my CV ‘reads like a strategic memo, not a job seeker profile’.",
        author: "Lucy, Non-Executive Director",
        context: "Financial services and fintech boards",
        rating: 5,
      },
    ],
  },
  {
    id: "linkedin-optimization-default",
    label: "LinkedIn optimisation testimonials",
    description:
      "Use on LinkedIn profile, personal branding, and visibility-focused posts.",
    items: [
      {
        quote:
          "Once I aligned my CV and LinkedIn using this structure, I started getting inbound messages from recruiters.",
        author: "Brian, Software Engineer",
        context: "Local roles and remote-first international companies",
        rating: 4,
      },
      {
        quote:
          "My profile finally tells a clear story. The ‘About’ section framework removed all the confusion.",
        author: "Naomi, Marketing Lead",
        context: "Fast-growing Kenyan startup ecosystem",
        rating: 5,
      },
    ],
  },
];

/**
 * Internal index for O(1) lookup by preset id.
 */
const SOCIAL_PROOF_PRESETS_BY_ID: Record<string, SocialProofPreset> =
  SOCIAL_PROOF_PRESETS.reduce<Record<string, SocialProofPreset>>(
    (acc, preset) => {
      acc[preset.id] = preset;
      return acc;
    },
    {}
  );

/**
 * Resolve one or more preset IDs into a flattened SocialProofItem[].
 *
 * Typical usage at the route layer:
 * - frontmatter.socialProofPresets: string | string[]
 * - const socialProofItems = getSocialProofItems(frontmatter.socialProofPresets)
 * - props.socialProofItems = socialProofItems;
 *
 * Unknown IDs are ignored to keep the site resilient to content errors.
 */
export function getSocialProofItems(
  presetIds?: string | string[] | null
): SocialProofItem[] | undefined {
  if (!presetIds) return undefined;

  const ids = Array.isArray(presetIds) ? presetIds : [presetIds];

  const items: SocialProofItem[] = [];

  for (const id of ids) {
    const preset = SOCIAL_PROOF_PRESETS_BY_ID[id];
    if (!preset) continue;
    items.push(...preset.items);
  }

  return items.length > 0 ? items : undefined;
}
