// src/site.config.ts
// Central, typed site configuration used across pages, layouts, and SEO utilities.

export type SocialLink = Readonly<{
  label: "Twitter" | "LinkedIn" | "Facebook" | "YouTube" | "Instagram" | "WhatsApp" | "Email" | "Phone" | "GitHub";
  href: string;
  handle?: string;
  rel?: string;
}>;

export type SiteConfig = Readonly<{
  // Canonical base
  siteUrl: `https://${string}`;                     // e.g. https://cvwriting.co.ke
  siteName: string;                                // e.g. CV Writing Kenya
  title: string;                                   // default <title>
  description: string;                             // default <meta name="description">
  defaultLang: "en" | "sw" | string;
  locale: string;                                  // BCP-47, e.g. en-KE

  // Brand & organization (used for JSON-LD)
  organization: {
    name: string;
    legalName?: string;
    url: `https://${string}`;
    logo: string;                                  // path under /assets or absolute
    sameAs: string[];                              // social URLs
  };

  // Social & sharing
  twitter: {
    site: string;                                  // @handle (site)
    creator?: string;                              // @creator
    card: "summary_large_image" | "summary";
  };
  social: SocialLink[];

  // Defaults for Open Graph / Twitter images
  images: {
    ogDefault: string;                             // Prefer JPG/PNG for social
    coverPlaceholder: string;                      // WebP for on-page placeholders
    width: number;                                 // 1200 recommended
    height: number;                                // 675 recommended
  };

  // SEO switches
  seo: {
    index: boolean;                                // robots index
    follow: boolean;                               // robots follow
    addCanonical: boolean;
    addOg: boolean;
    addTwitter: boolean;
    addJsonLdOrg: boolean;
  };

  // Pagination & content
  pagination: {
    blogPageSize: number;                          // cards per page on /blog
  };

  // Utility: build absolute URLs
  absoluteUrl: (path: string) => string;
}>;

const cfg: SiteConfig = {
  // Canonical base and basic metadata
  siteUrl: "https://cvwriting.co.ke",
  siteName: "CV Writing Kenya",
  title: "CV Writing Kenya",
  description:
    "Professional CV, Cover Letter and LinkedIn writing services tailored to Kenya’s job market",
  defaultLang: "en",
  locale: "en-KE",

  // Organization
  organization: {
    name: "CV Writing Kenya",
    legalName: "CV Writing Kenya",
    url: "https://cvwriting.co.ke",
    logo: "/assets/logos/logo-wordmark-1600x400.png",          // replace with your actual logo path
    sameAs: [
      "https://www.linkedin.com/company/cvwritingkenya",
      "https://x.com/cvwritingke",
    ],
  },

  // Social
  twitter: {
    site: "@cvwritingke",                                // update if different
    creator: "@cvwritingke",
    card: "summary_large_image",
  },
  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/cvwritingkenya" },
    { label: "Twitter", href: "https://x.com/cvwritingke", handle: "@cvwritingke" },
    { label: "Email", href: "mailto:info@cvwriting.co.ke" },
    { label: "Phone", href: "tel:+254700000000" },
  ],

  // Image defaults
  images: {
    ogDefault: "/assets/images/og/default-og.jpg",       // serve JPG/PNG for social
    coverPlaceholder: "/assets/images/placeholder/blog-hero.webp",
    width: 1200,
    height: 675,
  },

  // SEO controls
  seo: {
    index: true,
    follow: true,
    addCanonical: true,
    addOg: true,
    addTwitter: true,
    addJsonLdOrg: true,
  },

  // Pagination
  pagination: {
    blogPageSize: 8,
  },

  // Helper
  absoluteUrl: (path: string) => {
    const base = "https://cvwriting.co.ke";
    if (!path) return base;
    return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  },
};

export default cfg;
