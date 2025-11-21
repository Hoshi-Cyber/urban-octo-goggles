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
 * Fix Plan 205.1.4 – IA Validation / Linting for MDX:
 * - IA validation is implemented via scripts/validate-blog-ia.ts
 *   and run through npm / CI hooks (build/pre-commit).
 * - MDX integration is left standard here; remark/rehype plugin
 *   slots are explicitly defined for future IA plugin wiring if needed.
 */

export default defineConfig({
  // Use env var if set; otherwise leave undefined
  site: process.env.ASTRO_SITE || undefined,

  // Keep your existing URL pattern
  trailingSlash: "always",

  // We are using Netlify SSR, so keep server output
  output: "server",

  // Netlify adapter for SSR
  adapter: netlify(),

  integrations: [
    react(),
    tailwind(),
    mdx({
      // Reserved for future IA-related remark/rehype plugins if the
      // validation layer is ever moved into the MDX pipeline.
      remarkPlugins: [],
      rehypePlugins: [],
    }),
  ],

  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)), // Windows-safe alias
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
