// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import { fileURLToPath } from "node:url";

// Toggle Netlify adapter via env. Default: disabled for local dev.
const useNetlify = process.env.USE_NETLIFY === "true";

let adapter;
if (useNetlify) {
  const { default: netlify } = await import("@astrojs/netlify");
  adapter = netlify();
}

export default defineConfig({
  site: process.env.ASTRO_SITE || undefined,
  trailingSlash: "always",
  // Keep SSR to align with page reading params from Astro.params
  output: "server",
  adapter, // undefined in local dev; Netlify when USE_NETLIFY=true
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
