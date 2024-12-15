// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  markdown: {
    shikiConfig: {
      theme: "andromeeda",
    },
  },
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // Stops tailwind styles being added twice
    }),
    mdx(),
  ],
});
