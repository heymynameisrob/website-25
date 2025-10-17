import * as React from "react";
import { motion, useMotionValue, animate } from "motion/react";
import type { Post } from "@/content.config";
import { clamp } from "@/lib/utils";
import { ScrollStripPost } from "@/components/ScrollPost";
import { ArrowRightIcon } from "@heroicons/react/16/solid";
import { useMediaQuery } from "@uidotdev/usehooks";

const PADDING = 32;

export function ScrollStrip({ posts }: { posts: Post[] }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const translateX = useMotionValue(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const getBounds = React.useCallback(() => {
    if (!containerRef.current) return { leftBound: 0, rightBound: 0 };

    const viewportWidth = window.innerWidth;
    const containerWidth = containerRef.current.scrollWidth;

    // Left bound: can't scroll past the beginning (translateX = 0)
    const leftBound = 0;
    // Right bound: can't scroll past the end
    const rightBound = -(containerWidth - viewportWidth) + PADDING;

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
          const prevElement =
            currentElement.previousElementSibling as HTMLAnchorElement;
          if (prevElement) prevElement.focus();
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          const nextElement =
            currentElement.nextElementSibling as HTMLAnchorElement;
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
    [translateX, getBounds],
  );

  React.useEffect(() => {
    if (isMobile) return;

    // Prevent document scrolling entirely
    document.body.style.overflow = "hidden";
    window.history.scrollRestoration = "manual";
    document.documentElement.scrollTo(0, 0);

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleWheel, isMobile]);

  if (isMobile) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <ScrollStripPost
              key={post.id}
              post={post}
              onFocus={() => {}}
              onKeyDown={() => {}}
            />
          ))}
          <a
            href="/posts"
            className="group flex flex-col p-6 gap-6 bg-gray-2 aspect-square h-full shrink-0 rounded-sm border transition-all focus dark:bg-gray-3 hover:bg-gray-3 dark:hover:bg-gray-4 lg:p-8 lg:gap-8"
          >
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h3 className="text-gray-10">Blog</h3>
                <ArrowRightIcon className="size-4 opacity-70" />
              </div>
              <p>Read more</p>
            </div>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed p-8 bottom-0 h-[50vh] flex items-end justify-start overflow-hidden pointer-events-none">
      <motion.div
        ref={containerRef}
        style={{ x: translateX }}
        layout
        className="flex gap-8 pointer-events-auto h-full"
      >
        {posts.map((post) => (
          <ScrollStripPost
            key={post.id}
            post={post}
            onFocus={(e) => scrollElementIntoView(e)}
            onKeyDown={handleKeyDown}
          />
        ))}
        <a
          href="/posts"
          className="group grid place-items-center p-6 gap-6 bg-gray-2 aspect-square h-full shrink-0 rounded-sm border transition-all focus dark:bg-gray-3 hover:bg-gray-3 dark:hover:bg-gray-4 lg:p-8 lg:gap-8"
          onFocus={(e) => scrollElementIntoView(e.currentTarget)}
          onKeyDown={handleKeyDown}
        >
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-gray-10">Blog</h3>
              <ArrowRightIcon className="size-4 opacity-70" />
            </div>
            <p>Read more</p>
          </div>
        </a>
      </motion.div>
    </div>
  );
}
