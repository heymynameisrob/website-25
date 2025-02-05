import tailwindAnimate from "tailwindcss-animate";
import tailwindTypography from "@tailwindcss/typography";
import tailwindMask from "@pyncz/tailwind-mask-image";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        primary: "var(--gray-12)",
        secondary: "var(--gray-11)",
        accent: "var(--accent)",
        ring: "var(--gray-7)",
        gray: {
          1: "var(--gray-1)",
          2: "var(--gray-2)",
          3: "var(--gray-3)",
          4: "var(--gray-4)",
          5: "var(--gray-5)",
          6: "var(--gray-6)",
          7: "var(--gray-7)",
          8: "var(--gray-8)",
          9: "var(--gray-9)",
          10: "var(--gray-10)",
          11: "var(--gray-11",
          12: "var(--gray-12)",
        },
      },
      borderColor: {
        DEFAULT: "var(--border)",
        primary: "var(--border)",
        secondary: "var(--border-secondary)",
        accent: "var(--border-accent)",
      },
      fontFamily: {
        sans: ["Geist", "sans-serif"],
        mono: ["Berkley Mono", "monospace"],
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--gray-11)",
            "--tw-prose-headings": "var(--gray-12)",
            "--tw-prose-lead": "var(--gray-12)",
            "--tw-prose-links": "var(--gray-12)",
            "--tw-prose-bold": "var(--gray-12)",
            "--tw-prose-counters": "var(--gray-11)",
            "--tw-prose-bullets": "var(--gray-9)",
            "--tw-prose-hr": "var(--color-border)",
            "--tw-prose-quotes": "var(--gray-12)",
            "--tw-prose-quote-borders": "var(--color-border)",
            "--tw-prose-captions": "var(--gray-11)",
            "--tw-prose-code": "var(--gray-12)",
            "--tw-prose-pre-code": "var(--gray-12)",
            "--tw-prose-pre-bg": "var(--gray-3)",
            "--tw-prose-th-borders": "var(--color-border)",
            "--tw-prose-td-borders": "var(--color-border)",
          },
        },
      }),
    },
  },
  plugins: [tailwindAnimate, tailwindTypography, tailwindMask],
};
