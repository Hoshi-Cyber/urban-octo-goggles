// src/utils/slug.ts
// Robust, URL-safe slugifier with no external deps.

export function slug(input: string): string {
  return String(input ?? "")
    .normalize("NFKD")               // split accents
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")     // non-alphanumerics → hyphen
    .replace(/^-+|-+$/g, "");        // trim leading/trailing hyphens
}

export const slugify = slug; // alias for compatibility
export default slug;
