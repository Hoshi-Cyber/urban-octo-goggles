// src/data/authors/mezame-editorial.ts
// Concrete author record for the Mezame Editorial brand

import type { EditorialAuthor } from "./schema";

export const mezameEditorialAuthor: EditorialAuthor = {
  id: "mezame-editorial",
  slug: "mezame-editorial",

  displayName: "Mezame Editorial",
  type: "brand",

  // Hero meta
  role: "Editorial arm of CVWriting.co.ke",
  eyebrow: "Editorial brand",
  summary:
    "Evidence-based CV, career, and job-market guidance written for Kenyan professionals and job seekers. Mezame Editorial translates the hiring landscape into practical, actionable insights.",

  // Backwards-compatible bio fields
  bioShort:
    "Evidence-based CV, career, and job-market guidance written for Kenyan professionals and job seekers. Mezame Editorial translates the hiring landscape into practical, actionable insights.",
  bioLong:
    "Mezame Editorial produces deeply researched, data-driven writing designed to help Kenyan job seekers and professionals navigate the competitive hiring environment with clarity and confidence. Our content spans CV strategy, interview preparation, LinkedIn optimisation, personal branding, and the evolving Kenyan job market.",

  // Primary hero focus line (used in stats)
  focus: "CVs & careers in Kenya",

  // Main avatar/logo – use a square asset; the hero will render with smooth corners
  avatar: {
    src: "/assets/images/authors/avatars-1.png",
    alt: "Mezame Editorial brand avatar",
  },

  // Optional hero / banner artwork for the background of the hero band
  heroImage: {
    src: "/assets/images/hero/hero-1.png",
    alt: "Abstract editorial hero artwork for Mezame Editorial",
  },
  bannerImage: {
    src: "/assets/images/banner/baanner-1.png",
    alt: "Abstract editorial hero artwork for Mezame Editorial",
  },

  // High-level domains this author operates in
  domains: ["career", "editorial"],

  // Core commercial and audience-relevant content areas
  coreCategories: ["cv-tips", "career-growth", "linkedin", "job-search"],

  // Allowed but non-primary topics (displayed in Extended Topics)
  extendedCategories: ["writing", "kenya-market", "productivity"],

  // Whether to show the standard CV-Writing services CTA section
  showServicesCta: true,

  // Optional hero micro-stats (additional to the computed postsCount stat)
  stats: [
    {
      label: "Primary audience",
      value: "Kenyan professionals & job seekers",
    },
    {
      label: "Focus",
      value: "CVs & careers in Kenya",
    },
  ],

  // Canonical direct links used by AuthorHero to render social/site buttons
  website: "https://cvwriting.co.ke",
  websiteUrl: "https://cvwriting.co.ke",

  linkedin: "https://www.linkedin.com",
  linkedinUrl: "https://www.linkedin.com",

  facebook: "https://www.facebook.com",
  facebookUrl: "https://www.facebook.com",

  x: "https://x.com",
  xUrl: "https://x.com",
  twitter: "https://x.com",
  twitterUrl: "https://x.com",

  instagram: "https://www.instagram.com",
  instagramUrl: "https://www.instagram.com",

  quora: "https://www.quora.com",
  quoraUrl: "https://www.quora.com",

  // Optional generic links collection (kept for backwards compatibility / flexibility)
  links: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com",
      kind: "social",
    },
    {
      label: "Website",
      href: "https://cvwriting.co.ke",
      kind: "site",
    },
  ],
};
