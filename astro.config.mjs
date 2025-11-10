// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import netlify from "@astrojs/netlify";
import { fileURLToPath } from "url";

export default defineConfig({
  site: "https://cvwriting.co.ke",
  trailingSlash: "always",
  output: "server",
  adapter: netlify(),
  integrations: [
    react(), // enable React islands
    tailwind(),
    mdx(),
  ],
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)), // Allows "@/..." imports
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
