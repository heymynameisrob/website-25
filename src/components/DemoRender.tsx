import type { Post } from "@/content.config";

interface DemoRendererProps {
  post: Post;
}

export const demoRegistry: Record<string, React.ReactNode> = {
  comp1: <div>Blerg</div>,
  comp2: <div>Blarg</div>,
  // ... add other demos
} as const;

export type DemoId = keyof typeof demoRegistry;
export function DemoRenderer({ post }: DemoRendererProps) {
  if (!post.data.component) return null;

  const component = demoRegistry[post.data.component];
  if (!component) return null;

  return component;
}
