// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { fileURLToPath } from "node:url";

export default defineConfig({
  // Optional: set a default site URL; Netlify / custom domain can override
  site: process.env.ASTRO_SITE || undefined,

  // Keep your trailing slash behavior
  trailingSlash: "always",

  // IMPORTANT: build as a static site, not SSR
  output: "static",

  // Standard integrations
  integrations: [react(), tailwind(), mdx()],

  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)), // Windows-safe
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".astro"],
    },
  },
});
