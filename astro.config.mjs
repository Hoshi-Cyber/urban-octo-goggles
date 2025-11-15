// astro.config.mjs
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { fileURLToPath } from "node:url";

export default defineConfig({
  // Use env var if set; otherwise leave undefined
  site: process.env.ASTRO_SITE || undefined,

  // Keep your existing URL pattern
  trailingSlash: "always",

  // We are using Netlify SSR, so keep server output
  output: "server",

  // IMPORTANT: install the Netlify adapter explicitly
  adapter: netlify(),

  integrations: [react(), tailwind(), mdx()],

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
