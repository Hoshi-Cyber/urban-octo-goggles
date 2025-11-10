// File: src/config/site.ts
// Do NOT default to production origin in dev.
// Use env only; otherwise leave blank so links stay relative.
export const site = {
  siteUrl: process.env.ASTRO_SITE || "",
};
export default site;
