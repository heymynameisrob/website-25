import { defineCollection, z, type CollectionEntry } from "astro:content";
import { glob } from "astro/loaders";
import { PostTypes } from "@/lib/types";

// Define the schema separately
export const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.date(),
  type: z.enum([...PostTypes]),
  company: z.string().optional(),
  isExternal: z.boolean().default(false).optional(),
  video_url: z.string().optional(),
  image_url: z.string().optional(),
  externalLink: z.string().optional(),
  component: z.string().optional(),
  canonical: z.string().optional(),
  hide: z.boolean().default(false).optional(),
});

// Export the type
export type Post = CollectionEntry<"posts">;
export type PostFrontmatter = z.infer<typeof postSchema>;

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: ({ image }) =>
    postSchema.extend({
      image: image().optional(),
      imageDark: image().optional(),
    }),
});

export const collections = { posts };
