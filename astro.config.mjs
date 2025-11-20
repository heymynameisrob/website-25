// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: getBaseUrl(),
  output: "static",
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
  integrations: [react(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});

function getBaseUrl() {
  const envURL = process.env.VERCEL_URL;
  const isLocal = !envURL;
  const isPreview = !!process.env.VERCEL_ENV;

  if (isLocal) return "http://localhost:4321";
  if (isPreview) return `https://${envURL}`;

  return "https://heymynameisrob.com";
}
