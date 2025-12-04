// File: src/config/site.ts
// Do NOT default to production origin in dev.
// Use env only; otherwise leave blank so links stay relative.
export const site = {
  siteUrl: process.env.ASTRO_SITE || "",
};

/**
 * Global site configuration used by routing and SEO layers.
 * Step 4/5 of Fix Plan 214: provide blog-level hero/OG defaults
 * so routes can safely fall back when post/category images are missing.
 */
export const siteConfig = {
  blogDefaults: {
    /**
     * Default hero image used by blog routes when a post or category
     * does not provide its own heroImage.
     *
     * Should match a real file under /public.
     * This is aligned with the existing Blog home placeholder.
     */
    heroImage: {
      src: "/images/blog/hero/blog-home-hero.webp",
      alt: "CVWriting.co.ke blog – expert CV and career advice",
    },

    /**
     * Default Open Graph image used for blog pages (home, category, and posts)
     * when no more specific OG image is defined.
     *
     * Should match the OG image already used on /blog.
     */
    ogImage: {
      src: "/assets/images/blog/og/blog-home-hero-og.webp",
      alt: "CVWriting.co.ke blog – default Open Graph image",
    },
  },
};

export default site;
