import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { PostTypes } from "@/lib/types";

// Define the schema separately
export const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  type: z.enum([...PostTypes]),
  media: z
    .array(z.object({ type: z.enum(["image", "video"]), url: z.string() }))
    .optional(),
  isExternal: z.boolean().default(false).optional(),
  video_url: z.string().optional(),
  image_url: z.string().optional(),
  externalLink: z.string().optional(),
});

// Export the type
export type Post = { id: string; data: z.infer<typeof postSchema> };
export type PostFrontmatter = z.infer<typeof postSchema>;

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: postSchema,
});

export const collections = { posts };
