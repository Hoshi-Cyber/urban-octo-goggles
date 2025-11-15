// src/content/config.ts
import { defineCollection, z } from "astro:content";

const urlRegex =
  /^(https?:\/\/)([\w.-]+)(:[0-9]+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;%=]*)?$/i;
const publicAssetRegex = /^\/assets\/.+\.(webp|png|jpe?g|gif|svg)$/i;
/**
 * Internal path for same-site routes, e.g. "/about/severino".
 * Used for authorUrl so author profiles can live on-site.
 */
const internalPathRegex = /^\/[a-z0-9\-/_]+$/i;

export const collections = {
  blog: defineCollection({
    type: "content",
    schema: ({ image }) =>
      z.object({
        title: z.string().min(3),
        description: z.string().min(30),
        category: z.string().regex(/^[a-z0-9-]+$/),
        tags: z.array(z.string().min(2)).min(1).max(12),

        /**
         * Simple author name exposed as a string for BlogPost/PostMeta.
         * Example: "Severino".
         */
        author: z.string().min(2),

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

        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        readingTime: z.number().positive().int().optional(),

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

        canonical: z.string().regex(urlRegex).optional(),

        // Strings only: external URL or /assets/... served from public.
        ogImage: z
          .union([
            z.string().regex(urlRegex),
            z.string().regex(publicAssetRegex),
          ])
          .optional(),
      }),
  }),
};
