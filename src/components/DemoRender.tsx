import { Calculator } from "@/components/demos/Calculator";
import type { Post } from "@/content.config";

interface DemoRendererProps {
  post: Post;
}

export const demoRegistry: Record<string, React.ReactNode> = {
  calculator: <Calculator />,
  comp2: <div>Blarg</div>,
  // ... add other demos
} as const;

export type DemoId = keyof typeof demoRegistry;
export function DemoRenderer({ post }: DemoRendererProps) {
  if (!post.data.component) return null;

  const component = demoRegistry[post.data.component];
  if (!component) return null;

  return (
    <figure className="relative grid place-items-center w-full aspect-video border bg-background rounded-lg after:pointer-events-none after:absolute after:inset-0 bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--border)] lg:rounded-2xl">
      {component}
    </figure>
  );
}
