// src/lib/blog/playbooks.ts
//
// Fix Plan 213.4 – Conversion Stack Gating & Playbooks
// ----------------------------------------------------
// Purpose:
// - Centralise decisions about which BlogPostLayout slices should render
//   for a given post, based on lengthCategory and intent.
// - This file is *route-only* logic: no component imports.
// - It MUST NOT introduce any new slice keys beyond those already defined
//   in BlogPostLayout (Fix Plan 213).
//
// Notes:
// - BlogPostLayout remains the single source of truth for IA + band order.
// - This helper only chooses which existing slices to request for a post.
// - Route layer (e.g. src/pages/blog/[category]/[slug].astro) is responsible for:
//   • Reading lengthCategory / intent from frontmatter.
//   • Calling resolveSlicesForPost and passing the result as the `slices` prop.
//   • Applying separate TOC gating via showToc (word/heading thresholds).

// Mirrors the content meta fields used in src/content/blog/**/*.mdx
export type LengthCategory = "short" | "standard" | "long";

export type PostIntent = "educationFirst" | "balanced" | "hardSell";

// MUST mirror BlogPostLayoutSliceKey defined in
// src/components/blog/post/BlogPostLayout/index.astro (Fix Plan 213).
export type BlogPostLayoutSliceKey =
  | "toc"
  | "body"
  | "checklist"
  | "inlineOffer"
  | "socialProof"
  | "faq"
  | "finalCta"
  | "related";

export interface SlicePlaybookOptions {
  lengthCategory?: LengthCategory | null;
  intent?: PostIntent | null;
}

/**
 * Fix Plan 213 default for the "conversionArticle" preset.
 * This is the baseline stack when no length/intent meta is provided.
 */
const CONVERSION_DEFAULT_SLICES: readonly BlogPostLayoutSliceKey[] = [
  "toc",
  "body",
  "checklist",
  "inlineOffer",
  "socialProof",
  "faq",
  "finalCta",
  "related",
] as const;

// Utility to always return a fresh array so callers can safely mutate.
function cloneSlices(
  slices: readonly BlogPostLayoutSliceKey[],
): BlogPostLayoutSliceKey[] {
  return slices.slice();
}

/**
 * Resolve the slice order for a given post based on lengthCategory and intent.
 *
 * Constraints:
 * - Only uses legal slice keys:
 *   "toc" | "body" | "checklist" | "inlineOffer" | "socialProof" | "faq" | "finalCta" | "related"
 * - Never changes BlogPostLayout's internal IA or presets.
 * - If no meta is provided, falls back to the Fix Plan 213 default.
 *
 * TOC note:
 * - This function may include "toc" in the result.
 * - The actual TOC band still depends on showToc + data presence in BlogPostLayout.
 * - TOC gating (wordCount/headingCount) should be applied separately in the route.
 */
export function resolveSlicesForPost(
  options: SlicePlaybookOptions = {},
): BlogPostLayoutSliceKey[] {
  const lengthCategory: LengthCategory =
    options.lengthCategory ?? "standard";
  const intent: PostIntent = options.intent ?? "balanced";

  // SHORT POSTS
  // -----------
  // Goal: keep IA lean and avoid conversion fatigue.
  if (lengthCategory === "short") {
    if (intent === "educationFirst") {
      // Soft, lean stack:
      // - TOC (if allowed by TOC gating)
      // - Body
      // - Single inline offer
      // - Related articles
      return ["toc", "body", "inlineOffer", "related"];
    }

    if (intent === "balanced") {
      // Slightly stronger, but still avoids heavy stack:
      // - No checklist/FAQ for short posts by default.
      return ["toc", "body", "inlineOffer", "socialProof", "related"];
    }

    if (intent === "hardSell") {
      // Harder push for short, conversion-intent posts:
      // - Still avoid checklist/FAQ to keep short posts from feeling bloated.
      return ["toc", "body", "inlineOffer", "socialProof", "finalCta", "related"];
    }
  }

  // STANDARD POSTS
  // --------------
  if (lengthCategory === "standard") {
    if (intent === "educationFirst") {
      // Education-first stack:
      // - Emphasise checklist/FAQ before heavier conversion bands.
      return [
        "toc",
        "body",
        "checklist",
        "faq",
        "inlineOffer",
        "socialProof",
        "finalCta",
        "related",
      ];
    }

    if (intent === "hardSell") {
      // Strong conversion stack:
      // - Inline offer and social proof early, checklist as closing reinforcement.
      return [
        "toc",
        "body",
        "inlineOffer",
        "socialProof",
        "faq",
        "finalCta",
        "related",
        "checklist",
      ];
    }

    // standard + balanced → fall through to default conversion stack.
  }

  // LONG POSTS
  // ----------
  // For long-form content, prefer the full conversion stack as per Fix Plan 213
  // regardless of intent, to keep behaviour predictable.
  if (lengthCategory === "long") {
    return cloneSlices(CONVERSION_DEFAULT_SLICES);
  }

  // FALLBACK
  // --------
  // Any unsupported combo or missing meta falls back to the original
  // conversionArticle default from Fix Plan 213.
  return cloneSlices(CONVERSION_DEFAULT_SLICES);
}

/**
 * Future-proof helper:
 * Given optional meta from frontmatter, provide a normalised playbook input.
 *
 * This keeps the rest of the code from having to worry about null/undefined
 * and centralises defaulting logic in one place.
 */
export function normalisePlaybookOptions(
  lengthCategory?: LengthCategory | null,
  intent?: PostIntent | null,
): SlicePlaybookOptions {
  return {
    lengthCategory: lengthCategory ?? "standard",
    intent: intent ?? "balanced",
  };
}
