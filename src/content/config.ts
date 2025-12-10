// src/content/config.ts
import { defineCollection, z } from "astro:content";
import type {
  CategorySlug,
  BlogPostPreset,
  FunnelStage,
} from "../lib/blog/categories";
import { CATEGORY_SLUGS } from "../lib/blog/categories";
import type { LengthCategory, PostIntent } from "../lib/blog/playbooks";

const urlRegex =
  /^(https?:\/\/)([\w.-]+)(:[0-9]+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;%=]*)?$/i;

// Only allow images that live under /public/assets/... with common extensions
const publicAssetRegex =
  /^\/(assets|images)\/.+\.(webp|png|jpe?g|gif|svg)$/i;

/**
 * Internal path for same-site routes, e.g. "/about/severino".
 * Used for authorUrl, heroSoftCta.href, inlineOffer.ctaHref, finalCta.primaryHref, etc.
 */
const internalPathRegex = /^\/[a-z0-9\-/_]+$/i;

/**
 * Category slug enum derived from the canonical CATEGORY_SLUGS list.
 * Keeps the content schema in lockstep with src/lib/blog/categories.ts.
 */
const categoryEnum = z.enum(
  CATEGORY_SLUGS as [CategorySlug, ...CategorySlug[]],
);

/**
 * Length category options for playbooks (mirrors src/lib/blog/playbooks.ts).
 */
const lengthCategoryEnum = z.enum(
  ["short", "standard", "long"] as [LengthCategory, ...LengthCategory[]],
);

/**
 * Intent options for playbooks (mirrors src/lib/blog/playbooks.ts).
 */
const postIntentEnum = z.enum(
  ["educationFirst", "balanced", "hardSell"] as [
    PostIntent,
    ...PostIntent[],
  ],
);

/**
 * Funnel stage options (mirrors src/lib/blog/categories.ts FunnelStage).
 */
const funnelStageEnum = z.enum(
  ["TOFU", "MOFU", "BOFU", "MOFU_BOFU"] as [FunnelStage, ...FunnelStage[]],
);

/**
 * Layout preset enum (mirrors BlogPostPreset in src/lib/blog/categories.ts).
 */
const layoutPresetEnum = z.enum(
  [
    "conversionArticle",
    "editorialArticle",
    "analysisArticle",
    "shortInsight",
    "campaignLanding",
  ] as [BlogPostPreset, ...BlogPostPreset[]],
);

export const collections = {
  blog: defineCollection({
    type: "content",
    schema: () =>
      z.object({
        // -------------------------------------------------------------------
        // Core identity (maps into BlogPostLayoutProps core fields)
        // -------------------------------------------------------------------
        title: z.string().min(5),
        description: z.string().min(30),

        /**
         * Category slug used for URLs and taxonomy.
         * Must be one of the canonical CategorySlug values:
         * - cv-strategy
         * - linkedin
         * - career-growth
         * - kenya-market
         * - hiring-insights
         */
        category: categoryEnum,

        /**
         * Tags for discovery/related posts.
         */
        tags: z.array(z.string().min(2)).min(1).max(12),

        /**
         * Simple author name exposed as a string for BlogPost/PostMeta.
         * Example: "Severino".
         */
        author: z.string().min(2).default("CVWriting Editorial Team"),

        /**
         * Optional author profile URL, can be either:
         * - full external URL (https://...)
         * - internal path (e.g. "/about/severino")
         */
        authorUrl: z
          .union([
            z.string().regex(urlRegex),
            z.string().regex(internalPathRegex),
          ])
          .optional(),

        /**
         * Primary published date (used as datePublished in schema).
         */
        date: z.coerce.date(),

        /**
         * Optional updated date (used as dateModified in schema).
         */
        updated: z.coerce.date().optional(),

        /**
         * Optional reading time in minutes, if you choose to store it.
         * Otherwise can be computed from MDX at runtime.
         */
        readingTime: z.number().positive().int().optional(),

        // -------------------------------------------------------------------
        // SEO / discovery / canonical
        // -------------------------------------------------------------------

        /**
         * Optional override for the slug used in the URL.
         * If omitted, the entry slug from Astro content is used.
         */
        slugOverride: z.string().min(1).optional(),

        /**
         * Optional explicit meta title (otherwise derived from `title`).
         */
        metaTitle: z.string().min(5).optional(),

        /**
         * Optional explicit meta description (otherwise derived from `description`).
         */
        metaDescription: z.string().min(30).optional(),

        /**
         * Canonical URL for the article, if different from the primary URL.
         */
        canonical: z.string().regex(urlRegex).optional(),

        /**
         * Optional hreflang alternates for multi-region or multi-language content.
         * Example:
         *  alternates:
         *    - hrefLang: "en-ke"
         *      href: "https://cvwriting.co.ke/blog/..."
         */
        alternates: z
          .array(
            z.object({
              hrefLang: z.string().min(2),
              href: z.string().regex(urlRegex),
            }),
          )
          .optional(),

        /**
         * Open Graph / Twitter image.
         * RELAXED: Accept either the original object contract OR a plain string path.
         */
        ogImage: z
          .union([
            z.object({
              src: z.string().regex(publicAssetRegex),
              alt: z.string().min(3),
              width: z.number().optional(),
              height: z.number().optional(),
            }),
            z.string().regex(publicAssetRegex),
          ])
          .optional(),

        // -------------------------------------------------------------------
        // Hero / cover imaging
        // -------------------------------------------------------------------

        /**
         * Generic cover image used across the site (e.g. feed cards, hero).
         * We keep this as simple string paths into /public.
         */
        cover: z
          .object({
            src: z.string().regex(publicAssetRegex).optional(),
            alt: z.string().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
          })
          .optional(),

        /**
         * Hero tagline under the H1 (e.g. “Built from 500+ CV projects…”).
         */
        heroTagline: z.string().optional(),

        /**
         * Dedicated hero image for the single-post hero region.
         * String-only path into /public, no image().
         */
        heroImage: z
          .object({
            src: z.string().regex(publicAssetRegex),
            alt: z.string().min(3),
            width: z.number().optional(),
            height: z.number().optional(),
          })
          .optional(),

        /**
         * Optional soft CTA link in the hero (e.g. “View CV Writing Packages”).
         */
        heroSoftCta: z
          .object({
            label: z
              .string()
              .min(3)
              .default("View CV Writing Packages"),
            href: z
              .union([
                z.string().regex(urlRegex),
                z.string().regex(internalPathRegex),
              ])
              .default("/services/cv-writing"),
            /**
             * Optional tracking identifier (used by analytics / CTA tracking).
             */
            ctaId: z.string().optional(),
          })
          .optional(),

        // -------------------------------------------------------------------
        // Content meta: IA, playbooks, funnel
        // -------------------------------------------------------------------

        /**
         * Optional explicit layout preset override.
         * When omitted, defaults are derived from the category via
         * resolvePresetForCategory in src/lib/blog/categories.ts.
         */
        layoutPreset: layoutPresetEnum.optional(),

        /**
         * Optional funnel stage override for this specific article.
         * When omitted, defaults are derived from the category via
         * resolveFunnelStageForCategory in src/lib/blog/categories.ts.
         */
        funnelStage: funnelStageEnum.optional(),

        /**
         * Optional length category hint for BlogPostLayout slice playbooks.
         * Mirrors LengthCategory in src/lib/blog/playbooks.ts.
         */
        lengthCategory: lengthCategoryEnum.optional(),

        /**
         * Optional conversion intent hint for BlogPostLayout slice playbooks.
         * Mirrors PostIntent in src/lib/blog/playbooks.ts.
         */
        intent: postIntentEnum.optional(),

        /**
         * Introductory HTML or markdown string rendered above the first H2.
         * Used for 1–2 paragraph context/introduction separate from the main
         * MDX body structure.
         */
        introHtml: z.string().optional(),

        /**
         * Key takeaways (3–5 bullets). Shown near the top of the article.
         * Kept optional at schema level; IA validator enforces where required
         * (e.g. pillar/tactical articles).
         */
        keyTakeaways: z
          .array(z.string().min(5))
          .min(3, "Provide at least 3 key takeaways")
          .max(5, "Keep key takeaways to a maximum of 5")
          .optional(),

        // -------------------------------------------------------------------
        // IA: checklist (implementation checklist section)
        // -------------------------------------------------------------------

        /**
         * Canonical implementation checklist.
         * Used by BlogPostLayout for the checklist band.
         *
         * Each item can be:
         * - A simple string: "Update your CV headline for clarity"
         * - A richer object with label + optional description.
         */
        checklist: z
          .array(
            z.union([
              z.string().min(3),
              z.object({
                label: z.string().min(3),
                description: z.string().min(5).optional(),
              }),
            ]),
          )
          .optional(),

        /**
         * DEPRECATED: use `checklist` instead.
         * Kept temporarily for backward compatibility with older content.
         */
        checklistItems: z
          .array(
            z.object({
              label: z.string().min(3),
              description: z.string().min(5).optional(),
            }),
          )
          .optional(),

        // -------------------------------------------------------------------
        // IA: inline offer module (mid-article)
        // -------------------------------------------------------------------

        /**
         * Optional inline offer inserted mid-article.
         * All fields inside are optional to avoid hard failures on
         * partially-filled blocks.
         */
        inlineOffer: z
          .object({
            eyebrow: z.string().min(3).optional(),
            title: z.string().min(5).optional(),
            body: z.string().min(20).optional(),
            /**
             * CTA label (e.g. “Book CV Rewrite”).
             */
            ctaLabel: z.string().min(3).optional(),
            /**
             * CTA href:
             * - external URL or
             * - internal path to a service/landing page.
             */
            ctaHref: z
              .union([
                z.string().regex(urlRegex),
                z.string().regex(internalPathRegex),
              ])
              .optional()
              .default("/services/cv-writing"),
            /**
             * Optional small badge or tag above the title (e.g. “Most Popular”).
             */
            badge: z.string().optional(),
          })
          .optional(),

        // -------------------------------------------------------------------
        // IA: social proof strip
        // -------------------------------------------------------------------

        /**
         * Optional social proof items displayed near the bottom of the article.
         */
        socialProofItems: z
          .array(
            z.object({
              quote: z.string().min(5),
              name: z.string().optional(),
              role: z.string().optional(),
            }),
          )
          .optional(),

        // -------------------------------------------------------------------
        // IA: FAQ band
        // -------------------------------------------------------------------

        /**
         * Optional FAQ items for the article.
         */
        faqItems: z
          .array(
            z.object({
              question: z.string().min(5),
              answer: z.string().min(10),
            }),
          )
          .optional(),

        // -------------------------------------------------------------------
        // IA: final CTA at the bottom of the article
        // -------------------------------------------------------------------

        finalCta: z
          .object({
            /**
             * Eyebrow text above the CTA title.
             */
            eyebrow: z.string().optional(),

            /**
             * Primary CTA title (e.g. “Ready for more interviews?”).
             */
            title: z.string().min(5),

            /**
             * Supporting copy under the title.
             */
            body: z.string().min(20),

            /**
             * Primary CTA button label.
             */
            primaryLabel: z.string().min(3),

            /**
             * Primary CTA href:
             * - external URL or
             * - internal path.
             */
            primaryHref: z
              .union([
                z.string().regex(urlRegex),
                z.string().regex(internalPathRegex),
              ])
              .default("/contact/"),

            /**
             * Optional secondary CTA button label.
             */
            secondaryLabel: z.string().optional(),

            /**
             * Optional secondary CTA href:
             * - external URL or
             * - internal path.
             */
            secondaryHref: z
              .union([
                z.string().regex(urlRegex),
                z.string().regex(internalPathRegex),
              ])
              .optional(),

            /**
             * Optional tracking ID (for analytics/attribution).
             */
            ctaId: z.string().optional(),
          })
          .optional(),

        // -------------------------------------------------------------------
        // Layout / IA versioning
        // -------------------------------------------------------------------

        /**
         * Layout version marker for BlogPostLayout.
         * "blog-post-v1" is the current default; additional versions can be
         * introduced later without breaking existing content.
         */
        layoutVersion: z.enum(["blog-post-v1"]).default("blog-post-v1"),
      }),
  }),
};
