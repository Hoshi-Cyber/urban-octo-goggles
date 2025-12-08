// src/data/authors/schema.ts
// Unified schema model for multi-domain editorial authors
// Supports both internal (CVWriting.co.ke) and broader-topic editorial brands

/** Author classification */
export type AuthorType = "individual" | "brand";

/**
 * High-level domains an author can operate in.
 * This is deliberately coarse to keep the model stable over time.
 */
export type AuthorDomain =
  | "career" // CV, cover letters, job search, LinkedIn
  | "business" // business, operations, productivity
  | "editorial" // general editorial / thought leadership
  | "other"; // catch-all / future domains

/** External or internal link (social, website, portfolio, etc.) */
export interface AuthorSocialLink {
  /** Human-readable label, e.g. "LinkedIn", "Website" */
  label: string;
  /** Absolute or internal URL */
  href: string;
  /** Optional classification of the link */
  kind?: "social" | "site" | "portfolio";
}

/** Image reference for avatars / logos / hero artwork */
export interface AuthorImageRef {
  /** Source path or URL to the image */
  src: string;
  /** Accessible alternative text for the image */
  alt: string;
}

/** Small stat block for the hero band (e.g. "Articles – 20+") */
export interface AuthorStat {
  label: string; // e.g. "Articles"
  value: string; // e.g. "24+"
}

/**
 * Core author model used across editorial domains.
 * This is the canonical shape that author data files must conform to.
 */
export interface AuthorModel {
  /**
   * Stable internal ID, used to associate posts with this author.
   * Example: "mezame-editorial"
   */
  id: string;

  /**
   * Slug used in URLs.
   * Example: /about/editorial/mezame-editorial/
   */
  slug: string;

  /**
   * Display name rendered on the page.
   * Example: "Mezame Editorial"
   */
  displayName: string;

  /** Author classification (e.g. "brand" for Mezame Editorial) */
  type: AuthorType;

  /**
   * Short positioning line under the name.
   * Example: "Editorial arm of CVWriting.co.ke"
   */
  role: string;

  /**
   * One–two line commercial/editorial summary for the hero,
   * tuned for the target audience.
   *
   * This is the primary field consumed by AuthorHero for the summary
   * paragraph (it falls back to other fields only if this is empty).
   */
  summary?: string;

  /**
   * Backwards-compatible short bio field.
   * Kept for existing data but new content should prefer `summary`.
   */
  bioShort: string;

  /**
   * Optional extended bio for richer contexts (about pages, press, etc.).
   */
  bioLong?: string;

  /**
   * Optional eyebrow label rendered above the author name in the hero.
   * Example: "Editorial author", "Featured contributor", etc.
   */
  eyebrow?: string;

  /**
   * Main avatar or logo for the author.
   * Use a square image where possible; the hero component will render it
   * as a large, softly-rounded square.
   *
   * The union with `string` allows simple string paths while still
   * supporting structured refs.
   */
  avatar?: AuthorImageRef | string;

  /**
   * Optional hero / banner artwork for the background of the hero band.
   * If provided, the AuthorHero will use this as a soft background image.
   */
  heroImage?: AuthorImageRef | string;

  /**
   * Optional alias for hero artwork, useful if other contexts prefer
   * "bannerImage" naming.
   */
  bannerImage?: AuthorImageRef | string;

  /**
   * High-level domains this author operates in.
   * Example: ["career", "editorial"]
   */
  domains: AuthorDomain[];

  /**
   * Categories considered "core" for this author.
   * These feed the Core Vertical section on the author page.
   * Example: ["cv-tips", "career-growth", "linkedin"]
   */
  coreCategories: string[];

  /**
   * Categories that are allowed but not part of the primary commercial focus.
   * Articles in these categories will appear in the Extended Topics section.
   * Example: ["writing", "productivity"]
   */
  extendedCategories?: string[];

  /**
   * Whether to show the standard services CTA block on the author page.
   * This lets some authors function purely as editorial brands if needed.
   */
  showServicesCta: boolean;

  /**
   * Optional micro-stats for the hero band.
   * Example: [{ label: "Articles", value: "20+" }]
   *
   * Note: the main "Articles published" stat in AuthorHero is driven by the
   * computed `postsCount` field below; this array is for any additional
   * bespoke stats.
   */
  stats?: AuthorStat[];

  /**
   * Primary thematic focus surfaced in the hero stats section.
   * Example: "CVs & careers in Kenya"
   */
  focus?: string;

  /**
   * Computed number of posts associated with this author.
   * This is typically injected at runtime by AuthorPageTemplate based on
   * the post collection, not hand-authored in data files.
   */
  postsCount?: number;

  /**
   * Canonical direct links for this author.
   * These are read by AuthorHero to render social / site buttons and
   * are all optional.
   */

  /** Main website or portfolio URL */
  website?: string;
  websiteUrl?: string;

  /** LinkedIn profile URL */
  linkedin?: string;
  linkedinUrl?: string;

  /** Facebook page/profile URL */
  facebook?: string;
  facebookUrl?: string;

  /** X (formerly Twitter) handle/profile URL */
  x?: string;
  xUrl?: string;
  twitter?: string;
  twitterUrl?: string;

  /** Instagram profile URL */
  instagram?: string;
  instagramUrl?: string;

  /** Quora profile URL */
  quora?: string;
  quoraUrl?: string;

  /**
   * Generic external or internal links controlled by the author, such as
   * additional social profiles or site / portfolio URLs.
   * This is kept for flexibility and backwards compatibility.
   */
  links?: AuthorSocialLink[];
}

/**
 * Primary exported type alias used throughout the app.
 * This keeps naming consistent with Fix Plan 004 documentation.
 */
export type EditorialAuthor = AuthorModel;
