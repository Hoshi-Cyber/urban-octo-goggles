// src/content/config.ts
import { defineCollection, z } from "astro:content";

const urlRegex =
  /^(https?:\/\/)([\w.-]+)(:[0-9]+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;%=]*)?$/i;

const publicAssetRegex = /^\/assets\/.+\.(webp|png|jpe?g|gif|svg)$/i;

/**
 * Internal path for same-site routes, e.g. "/about/severino".
 * Used for authorUrl, heroSoftCta.href, inlineOffer.ctaHref, finalCta.primaryHref, etc.
 */
const internalPathRegex = /^\/[a-z0-9\-/_]+$/i;

export const collections = {
  blog: defineCollection({
    type: "content",
    schema: ({ image }) =>
      z.object({
        // -------------------------------------------------------------------
        // Core identity (maps into BlogPostLayoutProps core fields)
        // -------------------------------------------------------------------
        title: z.string().min(5),
        description: z.string().min(30),

        /**
         * Category slug used for URLs, e.g. "cv-writing", "career-growth".
         */
        category: z.string().regex(/^[a-z0-9-]+$/),

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
         * Optional last updated date (used as dateModified in schema).
         */
        updated: z.coerce.date().optional(),

        /**
         * Precomputed reading time in minutes, if you choose to store it.
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
         * Open Graph / Twitter image.
         * Strings only: external URL or /assets/... served from public.
         */
        ogImage: z
          .union([
            z.string().regex(urlRegex),
            z.string().regex(publicAssetRegex),
          ])
          .optional(),

        // -------------------------------------------------------------------
        // Hero / cover imaging
        // -------------------------------------------------------------------

        /**
         * Generic cover image used across the site (e.g. feed cards, hero).
         * You can continue to use this for backwards compatibility.
         */
        cover: z
          .object({
            src: z
              .union([image(), z.string().regex(publicAssetRegex)])
              .optional(),
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
         * Prefer this over `cover` when wired into BlogPostLayout.
         */
        heroImage: z
          .object({
            src: z.union([image(), z.string().regex(publicAssetRegex)]),
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
        // IA: top-of-article scaffolding
        // -------------------------------------------------------------------

        /**
         * Key takeaways (3–5 bullets). Shown near the top of the article.
         * Kept optional for migration; IA validation will enforce where required.
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
         * Optional implementation checklist config (inline fallback).
         * `lead` is plain/markdown text that will be rendered to HTML;
         * `items` is the list of checklist bullet points.
         *
         * Canonical path is via `checklistPresets` + central checklist bank.
         */
        checklist: z
          .object({
            title: z.string().min(3).optional(),
            lead: z.string().optional(),
            items: z
              .array(z.string().min(3))
              .min(1, "Provide at least 1 checklist item"),
          })
          .optional(),

        // -------------------------------------------------------------------
        // Inline offer block (mid-article CTA)
        // -------------------------------------------------------------------

        inlineOffer: z
          .object({
            heading: z
              .string()
              .min(5)
              .default("Prefer an expert to handle this for you?"),
            bullets: z
              .array(z.string().min(5))
              .min(2, "Provide at least 2 bullet points for the offer"),
            ctaLabel: z
              .string()
              .min(3)
              .default("View CV Writing Packages"),
            ctaHref: z
              .union([
                z.string().regex(urlRegex),
                z.string().regex(internalPathRegex),
              ])
              .default("/services/cv-writing"),
            trustNote: z.string().optional(),
            eyebrow: z.string().optional(),
          })
          .optional(),

        // -------------------------------------------------------------------
        // Standardised data source presets (canonical path – 205.1.7)
        // -------------------------------------------------------------------

        /**
         * IDs referencing SOCIAL_PROOF_PRESETS in src/data/testimonials.ts.
         * Can be a single preset or an ordered list.
         */
        socialProofPresets: z
          .union([z.string(), z.array(z.string())])
          .optional(),

        /**
         * IDs referencing FAQ_PRESETS in src/data/faqs.ts.
         */
        faqPresets: z
          .union([z.string(), z.array(z.string())])
          .optional(),

        /**
         * IDs referencing CHECKLIST_PRESETS in src/data/checklists.ts.
         */
        checklistPresets: z
          .union([z.string(), z.array(z.string())])
          .optional(),

        // -------------------------------------------------------------------
        // Social proof (testimonial strip – inline fallback)
        // -------------------------------------------------------------------

        /**
         * Legacy/inline social proof items.
         * Canonical path is via `socialProofPresets`.
         */
        socialProofItems: z
          .array(
            z.object({
              quote: z.string().min(10),
              author: z.string().optional(),
              role: z.string().optional(),
              avatarSrc: z.string().regex(publicAssetRegex).optional(),
              /**
               * Optional rating or other numeric signal if you want later.
               */
              rating: z.number().int().min(1).max(5).optional(),
              /**
               * Optional custom class for layout/visual tweaks.
               */
              class: z.string().optional(),
            }),
          )
          .optional(),

        // -------------------------------------------------------------------
        // FAQ (inline fallback)
        // -------------------------------------------------------------------

        /**
         * Legacy/inline FAQ items.
         * Canonical path is via `faqPresets`.
         */
        faqItems: z
          .array(
            z.object({
              question: z.string().min(5),
              /**
               * HTML or markdown-like answer; route layer can render/escape.
               */
              answerHtml: z.string().min(10),
            }),
          )
          .optional(),

        // -------------------------------------------------------------------
        // Final CTA (bottom-of-article hard CTA)
        // -------------------------------------------------------------------

        finalCta: z
          .object({
            heading: z
              .string()
              .min(5)
              .default("Ready for a CV that actually gets interviews?"),
            /**
             * Body copy as markdown/MDX; will be rendered to HTML.
             */
            body: z
              .string()
              .min(10)
              .default(
                "Let our team audit and rewrite your CV so you can focus on preparing for interviews, not formatting documents.",
              ),
            primaryLabel: z
              .string()
              .min(3)
              .default("Get Your CV Rewritten"),
            primaryHref: z
              .union([
                z.string().regex(urlRegex),
                z.string().regex(internalPathRegex),
              ])
              .default("/services/cv-writing"),
            secondaryLabel: z.string().optional(),
            secondaryHref: z
              .union([
                z.string().regex(urlRegex),
                z.string().regex(internalPathRegex),
              ])
              .optional(),
          })
          .default({
            heading: "Ready for a CV that actually gets interviews?",
            body:
              "Let our team audit and rewrite your CV so you can focus on preparing for interviews, not formatting documents.",
            primaryLabel: "Get Your CV Rewritten",
            primaryHref: "/services/cv-writing",
          }),

        // -------------------------------------------------------------------
        // Related posts (manual override, optional)
        // -------------------------------------------------------------------

        relatedPosts: z
          .array(
            z.object({
              title: z.string().min(3),
              href: z.string().regex(internalPathRegex),
              category: z.string().regex(/^[a-z0-9-]+$/),
              readingTimeMinutes: z.number().int().positive().optional(),
            }),
          )
          .optional(),

        // -------------------------------------------------------------------
        // Layout / IA versioning
        // -------------------------------------------------------------------

        layoutVersion: z
          .enum(["blog-post-v1"])
          .default("blog-post-v1"),
      }),
  }),
};
