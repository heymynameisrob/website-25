import * as React from "react";
import { Calculator } from "@/components/demos/Calculator";
import { Form } from "@/components/demos/Form";
import { Button } from "@/components/primitives/Button";
import { ArrowPathIcon } from "@heroicons/react/16/solid";

import type { Post } from "@/content.config";
import { Tooltip } from "@/components/primitives/Tooltip";
import { motion, useAnimation } from "motion/react";

interface DemoRendererProps {
  post: Post;
}

export const demoRegistry: Record<string, React.ReactNode> = {
  calculator: <Calculator />,
  form: <Form />,
} as const;

export type DemoId = keyof typeof demoRegistry;
export function DemoRenderer({ post }: DemoRendererProps) {
  const [key, setKey] = React.useState(0);
  const controls = useAnimation();

  const handleMouseDown = () => {
    controls.start({
      rotate: 50,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    });
  };

  const handleMouseUp = () => {
    controls.start({
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    });
    setKey((prev) => prev + 1);
  };

  const handleRemount = () => {
    setKey((prev) => prev + 1);
  };

  if (!post.data.component) return null;

  const component = demoRegistry[post.data.component];
  if (!component) return null;

  return (
    <figure className="relative grid place-items-center w-full aspect-video border bg-background rounded-lg before:pointer-events-none before:absolute before:inset-0 bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--border)] lg:rounded-2xl">
      <React.Fragment key={key}>{component}</React.Fragment>
      <Tooltip content="Reset" side="left" sideOffset={2}>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Reset demo"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleRemount}
          className="absolute bottom-1 right-1 text-primary"
        >
          <motion.div animate={controls}>
            <ArrowPathIcon className="w-4 h-4 opacity-70" />
          </motion.div>
        </Button>
      </Tooltip>
    </figure>
  );
}
