import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Define the schema separately
export const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  isExternal: z.boolean().default(false).optional(),
  video_url: z.string().optional(),
  image_url: z.string().optional(),
  externalLink: z.string().optional(),
});

// Export the type
export type Post = { id: string; data: z.infer<typeof postSchema> };

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content" }),
  schema: postSchema,
});

export const collections = { posts };
