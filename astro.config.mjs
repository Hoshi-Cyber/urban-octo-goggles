// astro.config.mjs
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { fileURLToPath } from "node:url";

/**
 * CVWriting.co.ke – Astro config
 *
 * IA validation is implemented via scripts/validate-blog-ia.ts
 * and run through npm / CI hooks (build/pre-commit).
 */

export default defineConfig({
  // Netlify can set ASTRO_SITE in production; otherwise leave undefined.
  site: process.env.ASTRO_SITE || undefined,

  // Keep your existing URL pattern
  trailingSlash: "always",

  /**
   * Use Netlify SSR output.
   * Your routing (including dynamic blog routes) is already designed
   * for SSR mode and builds successfully with this setting.
   */
  output: "server",

  // Netlify adapter for SSR
  adapter: netlify(),

  integrations: [
    react(),
    tailwind(),
    mdx({
      remarkPlugins: [],
      rehypePlugins: [],
    }),
  ],

  vite: {
    resolve: {
      alias: {
        // Windows-safe alias so `@/` points to `src/`
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      extensions: [
        ".mjs",
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".json",
        ".astro",
      ],
    },
  },
});
