// src/lib/url.ts
export const slugify = (s: string) =>
  String(s || "uncategorized")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const postPath = (category: string, slug: string) =>
  `/blog/${slugify(category)}/${slug.replace(/^\/|\/$/g, "")}/`;

export const categoryPath = (category: string) => `/blog/${slugify(category)}/`;
