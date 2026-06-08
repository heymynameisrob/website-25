// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";

/**
 * Shiki transformer that extracts `title="Foo.tsx"` from a fenced code block's
 * info string and surfaces it as `data-filename` on the rendered <pre>. Picked
 * up by the shared transformer in markdown.shikiConfig and mdx.shikiConfig.
 *
 * Usage in MDX / markdown:
 *   ```tsx title="AgentChatInput.tsx"
 *   ...
 *   ```
 */
const titleToFileNameTransformer = {
  name: "title-to-file-name",
  pre(/** @type {any} */ node) {
    // `this` is the shiki transformer context, where `options.meta` is the
    // shiki codeToHast options. Astro's wrapper passes meta as
    // `{ __raw: <raw string> }` (see @astrojs/markdown-remark/dist/shiki.js).
    const rawMeta = /** @type {any} */ (this).options?.meta?.__raw;
    if (typeof rawMeta !== "string") return;

    const match = rawMeta.match(/\btitle\s*=\s*"([^"]+)"/);
    if (!match) return;

    node.properties ??= {};
    node.properties.dataFileName = match[1];
  },
};

const shikiConfig = {
  themes: {
    light: "github-light",
    dark: "github-dark",
  },
  // Cast: the `transformers` field is typed as a stricter shape by
  // @astrojs/markdown-remark, but our transformer is structurally compatible.
  transformers: [titleToFileNameTransformer],
};

// https://astro.build/config
export default defineConfig({
  site: getBaseUrl(),
  output: "static",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  image: {
    remotePatterns: [{ protocol: "https", hostname: "ucarecdn.com" }],
  },
  markdown: {
    // The shikiConfig types from @astrojs/markdown-remark are stricter than
    // what we need here; cast to keep `ts-check` happy without losing the
    // themes / transformers we actually care about.
    shikiConfig: /** @type {any} */ (shikiConfig),
  },
  integrations: [react(), mdx({ shikiConfig: /** @type {any} */ (shikiConfig) })],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["tegaki"],
    },
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
