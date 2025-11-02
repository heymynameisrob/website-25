import * as React from "react";
import { Calculator } from "@/components/demos/Calculator";
import { Form } from "@/components/demos/Form";
import { Button } from "@/components/primitives/Button";
import { ArrowPathIcon } from "@heroicons/react/16/solid";

import type { Post } from "@/content.config";
import { Tooltip } from "@/components/primitives/Tooltip";
import { motion, useAnimation } from "motion/react";
import { Gallery } from "@/components/demos/Gallery";
import { Calendar } from "@/components/demos/Calendar";
import { Image } from "astro:assets";

interface DemoRendererProps {
  post: Post & {
    data: Post["data"] & {
      optimizedImageSrc?: string;
      optimizedImageDarkSrc?: string;
    };
  };
}

export const demoRegistry: Record<string, React.ReactNode> = {
  calculator: <Calculator />,
  form: <Form />,
  photos: <Gallery />,
  calendar: <Calendar />,
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
    <figure className="relative grid place-items-center w-full aspect-square overflow-hidden border bg-background rounded-lg lg:aspect-3/2">
      {post.data.optimizedImageDarkSrc || post.data.imageDark ? (
        <>
          <img
            src={post.data.optimizedImageSrc ?? post.data.image?.src}
            loading="lazy"
            className="absolute inset-0 object-cover pointer-events-none z-0 dark:hidden"
          />
          <img
            src={post.data.optimizedImageDarkSrc ?? post.data.imageDark?.src}
            loading="lazy"
            className="absolute inset-0 object-cover pointer-events-none z-0 hidden dark:block"
          />
        </>
      ) : (
        <img
          src={post.data.optimizedImageSrc ?? post.data.image?.src}
          loading="lazy"
          className="absolute inset-0 object-cover pointer-events-none z-0"
        />
      )}
      <div className="relative rounded-md w-full aspect-square max-w-md bg-background overflow-hidden text-primary shadow-floating z-max">
        <React.Fragment key={key}>{component}</React.Fragment>
      </div>
      <Tooltip content="Reset" side="left" sideOffset={2}>
        <Button
          size="icon"
          variant="ghost"
          aria-label="Reset demo"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleRemount}
          className="absolute bottom-2 right-2 text-primary bg-background shadow-xl"
        >
          <motion.div animate={controls}>
            <ArrowPathIcon className="w-4 h-4 opacity-70" />
          </motion.div>
        </Button>
      </Tooltip>
    </figure>
  );
}
