// src/data/authors/index.ts
// Centralised export registry for all editorial authors
// Updated to strictly support the enhanced AuthorHero model
// (avatar, heroImage, social links, summary, focus, etc.)

import type { EditorialAuthor } from "./schema";

// Import each author definition (each must conform to EditorialAuthor)
import { mezameEditorialAuthor } from "./mezame-editorial";

/**
 * Export named authors for direct imports where necessary.
 * This keeps backwards compatibility with existing imports.
 */
export { mezameEditorialAuthor };

/**
 * Registry of all authors keyed by stable identifier.
 *
 * NOTE:
 * - Keys here MUST match the `slug` or canonical identifier used across the app.
 * - Add additional authors here as the editorial system grows.
 */
export const authors: Record<string, EditorialAuthor> = {
  mezameEditorialAuthor,
};

/**
 * Strongly typed union of all valid author registry keys.
 * Used throughout the application for
 * - routing
 * - lookups
 * - mapping posts to authors
 */
export type AuthorSlug = keyof typeof authors;
