import * as React from "react";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
  type Transition,
} from "framer-motion";

interface PolaroidProps extends React.PropsWithChildren {
  imageSrc: string;
  imageAlt: string;
  imageWidth?: number;
  imageHeight?: number;
  className?: string;
  isTop?: boolean;
  baseRotation?: number;
  x?: MotionValue<number>;
  onDragEnd?: () => void;
  layout?: boolean;
  initialImageSrc?: string;
}

const SPRING: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 15,
};

export function Polaroid({
  children,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  className,
  isTop = true,
  baseRotation = 0,
  x,
  onDragEnd,
  layout,
  initialImageSrc,
}: PolaroidProps) {
  const fallbackX = useMotionValue(0);
  const activeX = x ?? fallbackX;
  const rotate = useTransform(activeX, [0, 400], [baseRotation, baseRotation + 10], {
    clamp: false,
  });

  return (
    <motion.div
      layout={layout}
      animate={{
        scale: isTop ? 1 : 0.95,
        x: isTop ? 0 : 8,
        y: isTop ? 0 : 4,
      }}
      transition={SPRING}
      drag={isTop && !!x ? "x" : false}
      dragElastic={0.3}
      dragSnapToOrigin
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragTransition={SPRING}
      whileDrag={
        isTop && !!x
          ? {
              cursor: "grabbing",
              scale: 0.9,
              opacity: 0.8,
            }
          : {}
      }
      onDragEnd={onDragEnd}
      className={cn(
        isTop ? "relative cursor-grab active:cursor-grabbing" : "absolute top-0",
        className
      )}
      style={{
        zIndex: isTop ? 1 : 0,
        rotate: isTop ? rotate : `${baseRotation}deg`,
      }}
    >
      <figure className="w-64 p-2 rounded-xs shadow-md bg-[#fffdfa] dark:bg-gray-3 dark:ring-[0.5px] dark:ring-border">
        <div className="aspect-[3.4/2.8] overflow-hidden object-cover bg-background ring-[0.5px] ring-border shadow-[inset_0px_1px_1px_rgba(0,_0,_0,_0.8)] rounded-px">
          <img
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            loading={initialImageSrc ? "eager" : "lazy"}
            decoding="async"
            className="w-full h-full object-cover select-none"
            draggable={false}
          />
        </div>
        <figcaption className="p-2 text-center h-14">{children}</figcaption>
      </figure>
    </motion.div>
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
  maxRotate?: number;
}

function mix(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

export function Polaroids({
  children,
  images,
  imageWidth,
  imageHeight,
  className,
  maxRotate = 5,
}: PolaroidsProps) {
  const [stack, setStack] = React.useState(() => images.map((_, i) => i));
  const x = useMotionValue(0);

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
          const baseRotation = mix(-maxRotate, maxRotate, Math.sin(imageIndex));

          return (
            <Polaroid
              key={item.src}
              imageSrc={item.src}
              imageAlt={item.alt}
              imageWidth={item.width ?? imageWidth}
              imageHeight={item.height ?? imageHeight}
              isTop={isTop}
              baseRotation={baseRotation}
              x={x}
              onDragEnd={isTop ? handleDragEnd : undefined}
              initialImageSrc={images[0].src}
              layout
            >
              {isTop ? children : undefined}
            </Polaroid>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
