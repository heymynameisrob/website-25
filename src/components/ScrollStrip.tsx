import * as React from "react";
import { motion, useMotionValue, animate } from "motion/react";
import type { Post } from "@/content.config";
import { clamp } from "@/lib/utils";

const PADDING = 32;

export function ScrollStrip({ posts }: { posts: Post[] }) {
  const translateX = useMotionValue(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const getBounds = React.useCallback(() => {
    if (!containerRef.current) return { leftBound: 0, rightBound: 0 };

    const viewportWidth = window.innerWidth;
    const containerWidth = containerRef.current.scrollWidth;

    // Left bound: can't scroll past the beginning (translateX = 0)
    const leftBound = 0;
    // Right bound: can't scroll past the end
    const rightBound = -(containerWidth - viewportWidth);

    return { leftBound, rightBound };
  }, []);

  const scrollElementIntoView = React.useCallback(
    (element: HTMLElement) => {
      if (!containerRef.current) return;

      /** Positional Elements */
      const viewportWidth = window.innerWidth;
      const currentX = translateX.get();
      const elementLeft = element.offsetLeft;
      const elementWidth = element.offsetWidth;
      const elementRight = elementLeft + elementWidth;
      const elementCenter = elementLeft + elementWidth / 2;

      /** Visibile Bounds */
      const visibleLeft = -currentX;
      const visibleRight = visibleLeft + viewportWidth;
      const needsScrolling =
        elementLeft < visibleLeft + PADDING ||
        elementRight > visibleRight - PADDING;

      if (needsScrolling) {
        const { leftBound, rightBound } = getBounds();
        const viewportCenter = viewportWidth / 2;

        // Try to center the element in the viewport
        let targetX = -(elementCenter - viewportCenter);

        // If centering would go out of bounds, adjust to show the element with PADDING
        if (targetX > leftBound) {
          targetX = -(elementLeft - PADDING);
        } else if (targetX < rightBound) {
          targetX = -(elementRight - viewportWidth + PADDING);
        }

        const newX = clamp(targetX, [rightBound, leftBound]);
        animate(translateX, newX, {
          type: "spring",
          stiffness: 300,
          damping: 30,
          restDelta: 0.01,
        });
      }
    },
    [translateX, getBounds],
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (!containerRef.current) return;

      const currentElement = e.currentTarget;

      switch (e.key) {
        case "ArrowLeft": {
          e.preventDefault();
          const prevElement = currentElement.previousElementSibling as HTMLAnchorElement;
          if (prevElement) prevElement.focus();
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          const nextElement = currentElement.nextElementSibling as HTMLAnchorElement;
          if (nextElement) nextElement.focus();
          break;
        }
        case "Escape":
          e.preventDefault();
          currentElement.blur();
          break;
        case "Enter":
          // Let the default behavior handle the link navigation
          return;
      }
    },
    [],
  );

  const handleWheel = React.useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      const currentX = translateX.get();
      const { leftBound, rightBound } = getBounds();

      const newX = clamp(currentX - delta, [rightBound, leftBound]);
      translateX.set(newX);
    },
    [translateX, getBounds]
  );

  React.useEffect(() => {
    // Prevent document scrolling entirely
    document.body.style.overflow = "hidden";
    window.history.scrollRestoration = "manual";
    document.documentElement.scrollTo(0, 0);

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel]);

  return (
    <div className="fixed p-8 bottom-0 h-[50vh] flex items-end justify-start overflow-hidden pointer-events-none">
      <motion.div
        ref={containerRef}
        style={{ x: translateX }}
        layout
        className="flex gap-8 pointer-events-auto h-full"
      >
        {posts.map((post) => (
          <a
            href={`/posts/${post.id}`}
            key={post.id}
            className="group flex flex-col p-8 gap-8 bg-gray-3 aspect-square h-full shrink-0 rounded-2xl transition-all focus"
            onFocus={(e) => scrollElementIntoView(e.currentTarget)}
            onKeyDown={handleKeyDown}
          >
            <div className="flex items-center justify-between gap-4">
              <h3>{post.data.title}</h3>
              <p className="text-gray-9">{post.data.type}</p>
            </div>
            <div className="relative bg-gray-5 w-full h-full rounded-lg overflow-hidden">
              <img
                src={post.data.image_url}
                loading="lazy"
                className="absolute inset-0 object-cover h-full w-full rounded-lg grayscale group-hover:grayscale-0 transition-all duration-400 ease-out"
              />
            </div>
          </a>
        ))}
      </motion.div>
    </div>
  );
}
