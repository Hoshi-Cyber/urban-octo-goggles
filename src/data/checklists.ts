// src/data/checklists.ts
//
// Fix Plan 205.1.7 – Standardise Social Proof, FAQ, and Checklist Data Sources
//
// Purpose
// - Provide a canonical, reusable data source for checklists used as
//   checklist in BlogPostLayoutProps.
// - Selection and mapping happen at the route/data layer; this file is
//   pure data + small helpers.
// - Frontmatter should reference preset IDs; the route resolves those IDs
//   into concrete checklist items before passing them to BlogPostLayout.
//
// Contract
// - Type-safe by indexing off BlogPostLayoutProps["checklist"].
// - Display components consume items as-is and do not implement selection logic.

import type { BlogPostLayoutProps } from "@/components/blog/post/BlogPostLayout";

// A single checklist item, kept in sync with layout props.
export type ChecklistItem = NonNullable<
  BlogPostLayoutProps["checklist"]
>[number];

export interface ChecklistPreset {
  /** Stable identifier referenced from frontmatter, e.g. "cv-before-sending". */
  id: string;
  /** Human-readable label for internal use / CMS tooling. */
  label: string;
  /** Optional description for editors explaining when to use this preset. */
  description?: string;
  /** The actual checklist items to render. */
  items: ChecklistItem[];
}

/**
 * Canonical checklist presets for CVWriting.co.ke.
 *
 * Notes:
 * - These are generic, reusable checklists for core content clusters.
 * - Real deployments can extend/override while keeping the same structure.
 */
export const CHECKLIST_PRESETS: ChecklistPreset[] = [
  {
    id: "cv-before-sending",
    label: "Final CV check before sending",
    description:
      "Use on tactical CV guides that end with ‘before you hit send’ implementation steps.",
    items: [
      {
        label: "File name is clean and professional",
        description:
          "Use a clear pattern like ‘FirstName-LastName-Role-CV.pdf’ instead of ‘CV-Final(3).docx’.",
      },
      {
        label: "Contact details are up to date",
        description:
          "Confirm your phone number, email, and city are correct and match your LinkedIn profile.",
      },
      {
        label: "Top summary matches the role you’re applying for",
        description:
          "Your headline and first 3–5 lines should speak directly to the job title and core outcomes.",
      },
      {
        label: "Experience bullets are outcome-focused",
        description:
          "Each bullet should show an action + outcome (numbers or clear impact), not just duties.",
      },
      {
        label: "Keywords from the job description are included naturally",
        description:
          "Mirror important skills, tools, and sector terms used in the posting without keyword stuffing.",
      },
      {
        label: "Formatting is consistent and easy to scan",
        description:
          "Check font sizes, spacing, headings, and bullet alignment on both desktop and mobile.",
      },
      {
        label: "You have exported a locked PDF version",
        description:
          "Send a PDF unless the employer specifically requests Word; confirm it opens correctly.",
      },
    ],
  },
  {
    id: "cv-rewrite-implementation",
    label: "CV rewrite implementation steps",
    description:
      "Use on in-depth CV strategy articles that show how to apply the framework in practice.",
    items: [
      {
        label: "Collect raw inputs",
        description:
          "Gather old CVs, job descriptions for target roles, performance reviews, and major project notes.",
      },
      {
        label: "Define your target role and positioning",
        description:
          "Write down the 1–2 primary role types you’re targeting and the value story you want to emphasise.",
      },
      {
        label: "Draft a new top summary and headline",
        description:
          "Use a clear value statement that highlights scope, key strengths, and the type of problems you solve.",
      },
      {
        label: "Rewrite one role at a time using outcome bullets",
        description:
          "For each role, keep 4–7 strong bullets focused on results, not task lists.",
      },
      {
        label: "Align skills and tools section with target roles",
        description:
          "Group skills into clear clusters (technical, leadership, sector) and drop outdated or irrelevant items.",
      },
      {
        label: "Run a clarity and scan test",
        description:
          "Give the CV to a trusted friend or mentor and ask them what role they think you’re targeting after a 20-second scan.",
      },
      {
        label: "Update LinkedIn to match the new CV",
        description:
          "Refresh your headline, About section, and experience bullets so there are no contradictions.",
      },
    ],
  },
  {
    id: "linkedin-optimization-steps",
    label: "LinkedIn optimisation checklist",
    description:
      "Use on LinkedIn, personal branding, and visibility-focused articles.",
    items: [
      {
        label: "Headline clearly states role and value",
        description:
          "Avoid only writing your job title; combine role, niche, and value (e.g. ‘Product Manager | Fintech | Turning user data into clear roadmap bets’).",
      },
      {
        label: "Profile photo and banner are professional and current",
        description:
          "Use a clear, recent headshot and a banner that supports your professional story (not random stock).",
      },
      {
        label: "About section follows a clear structure",
        description:
          "Open with who you are, then your key strengths, 3–5 proof points, and a simple call to action.",
      },
      {
        label: "Experience entries match your CV",
        description:
          "Job titles, companies, and dates should align; adapt bullets for LinkedIn’s more narrative style.",
      },
      {
        label: "Skills and endorsements reflect your target roles",
        description:
          "Pin your top 3 skills that matter most to your next role and remove irrelevant or outdated ones.",
      },
      {
        label: "Featured section highlights your best work",
        description:
          "Add links or uploads for key projects, articles, talks, or case studies that strengthen your positioning.",
      },
      {
        label: "Basic activity is visible and professional",
        description:
          "Aim for at least occasional thoughtful comments or posts so your profile doesn’t look dormant.",
      },
    ],
  },
];

/**
 * Internal index for O(1) lookup by preset id.
 */
const CHECKLIST_PRESETS_BY_ID: Record<string, ChecklistPreset> =
  CHECKLIST_PRESETS.reduce<Record<string, ChecklistPreset>>(
    (acc, preset) => {
      acc[preset.id] = preset;
      return acc;
    },
    {}
  );

/**
 * Resolve one or more checklist preset IDs into a flattened ChecklistItem[].
 *
 * Typical usage at the route layer:
 * - frontmatter.checklistPresets: string | string[]
 * - const checklist = getChecklistItems(frontmatter.checklistPresets)
 * - props.checklist = checklist;
 *
 * Unknown IDs are ignored to keep the site resilient to content errors.
 */
export function getChecklistItems(
  presetIds?: string | string[] | null
): ChecklistItem[] | undefined {
  if (!presetIds) return undefined;

  const ids = Array.isArray(presetIds) ? presetIds : [presetIds];

  const items: ChecklistItem[] = [];

  for (const id of ids) {
    const preset = CHECKLIST_PRESETS_BY_ID[id];
    if (!preset) continue;
    items.push(...preset.items);
  }

  return items.length > 0 ? items : undefined;
}
