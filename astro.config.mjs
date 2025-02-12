// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwind from "@astrojs/tailwind";

import mdx from "@astrojs/mdx";

import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  site: getBaseUrl(),
  output: "static",
  adapter: vercel(),
  markdown: {
    shikiConfig: {
      theme: "andromeeda",
    },
  },
  integrations: [react(), tailwind({
    applyBaseStyles: false, // Stops tailwind styles being added twice
  }), mdx(), image()],
});

function getBaseUrl() {
  const envURL = process.env.VERCEL_URL;
  const isLocal = !envURL;
  const isPreview = !!process.env.VERCEL_ENV;

  if (isLocal) return "http://localhost:4321";
  if (isPreview) return `https://${envURL}`;

  return "https://heymynameisrob.com";
}