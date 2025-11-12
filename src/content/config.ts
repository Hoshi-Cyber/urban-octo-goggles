// src/content/config.ts
import { defineCollection, z } from "astro:content";

const urlRegex =
  /^(https?:\/\/)([\w.-]+)(:[0-9]+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;%=]*)?$/i;
const publicAssetRegex = /^\/assets\/.+\.(webp|png|jpe?g|gif|svg)$/i;

export const collections = {
  blog: defineCollection({
    type: "content",
    schema: ({ image }) =>
      z.object({
        title: z.string().min(3),
        description: z.string().min(30),
        category: z.string().regex(/^[a-z0-9-]+$/),
        tags: z.array(z.string().min(2)).min(1).max(12),
        author: z.union([
          z.string().min(2),
          z.object({
            name: z.string().min(2),
            role: z.string().optional(),
            url: z.string().url().optional(),
            avatar: image().optional(),
          }),
        ]),
        date: z.coerce.date(),
        updated: z.coerce.date().optional(),
        readingTime: z.number().positive().int().optional(),

        cover: z
          .object({
            src: z.union([image(), z.string().regex(publicAssetRegex)]).optional(),
            alt: z.string().optional(),
            width: z.number().optional(),
            height: z.number().optional(),
          })
          .optional(),

        canonical: z.string().regex(urlRegex).optional(),

        // Strings only: external URL or /assets/... served from public.
        ogImage: z
          .union([z.string().regex(urlRegex), z.string().regex(publicAssetRegex)])
          .optional(),
      }),
  }),
};
