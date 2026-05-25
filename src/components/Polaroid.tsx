import * as React from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, type Transition } from "framer-motion";

interface PolaroidProps extends React.PropsWithChildren {
  imageSrc: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  className?: string;
}

export function Polaroid({
  children,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  className,
}: PolaroidProps) {
  return (
    <figure
      className={cn(
        "w-64 p-2 rounded-xs shadow-md bg-[#fffdfa] dark:bg-gray-3 dark:ring-[0.5px] dark:ring-border",
        className
      )}
    >
      <div className="aspect-[3.4/2.8] overflow-hidden object-cover bg-background ring-[0.5px] ring-border shadow-[inset_0px_1px_1px_rgba(0,_0,_0,_0.8)] rounded-px">
        <img
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover select-none"
          draggable={false}
        />
      </div>
      <figcaption className="p-2 text-center h-14">{children}</figcaption>
    </figure>
  );
}

interface PolaroidItem {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface PolaroidsProps extends React.PropsWithChildren {
  images: PolaroidItem[];
  imageWidth?: number;
  imageHeight?: number;
  className?: string;
}

const SPRING: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 15,
};

export function Polaroids({
  children,
  images,
  imageWidth,
  imageHeight,
  className,
}: PolaroidsProps) {
  const [stack, setStack] = React.useState(() => images.map((_, i) => i));

  function handleDragEnd() {
    setStack(prev => {
      const next = [...prev];
      const top = next.pop()!;
      next.unshift(top);
      return next;
    });
  }

  const visibleStack = stack.slice(-2);

  return (
    <div className={cn("relative select-none w-fit", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        {visibleStack.map((imageIndex, visiblePosition) => {
          const item = images[imageIndex];
          const isTop = visiblePosition === visibleStack.length - 1;

          return (
            <motion.div
              key={item.src}
              layout
              animate={{
                scale: isTop ? 1 : 0.95,
                x: isTop ? 0 : 8,
                y: isTop ? 0 : 4,
                rotate: isTop ? "-2deg" : "4deg",
              }}
              transition={SPRING}
              drag={isTop ? "x" : false}
              dragElastic={0.3}
              dragSnapToOrigin
              dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
              dragTransition={SPRING}
              whileDrag={{
                cursor: "grabbing",
                scale: 0.9,
                opacity: 0.8,
                rotate: "-3deg",
              }}
              onDragEnd={isTop ? handleDragEnd : undefined}
              className={cn(
                isTop ? "relative cursor-grab active:cursor-grabbing" : "absolute top-0"
              )}
              style={{ zIndex: visiblePosition }}
            >
              <Polaroid
                imageSrc={item.src}
                imageAlt={item.alt}
                imageWidth={item.width ?? imageWidth}
                imageHeight={item.height ?? imageHeight}
              >
                {isTop ? children : undefined}
              </Polaroid>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
