import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "motion/react";

interface PolaroidProps extends React.PropsWithChildren {
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  className?: string;
}

export function Polaroid({ children, imageSrc, imageAlt, imageWidth, imageHeight, className }: PolaroidProps) {
  return (
    <figure className={cn("max-w-64 p-2 rounded-xs shadow-md bg-[#fffdfa]", className)}>
      <div className="aspect-[3.4/2.8] overflow-hidden object-cover bg-background ring-[0.5px] ring-border shadow-[inset_0px_1px_1px_rgba(0,_0,_0,_0.8)] rounded-px">
        <img
          src={imageSrc}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
      </div>
      <figcaption className="p-2 text-center">
        {children}
      </figcaption>
    </figure>
  );
}

interface PolaroidItem {
  src: string;
  alt: string;
}

interface PolaroidsProps extends React.PropsWithChildren {
  images: PolaroidItem[];
  imageWidth: number;
  imageHeight: number;
  className?: string;
}

const STACK_OFFSETS = [
  { rotate: -2, x: 0, y: 0 },
  { rotate: 4, x: 4, y: 4 },
  { rotate: -4, x: 8, y: 8 },
];

export function Polaroids({
  children,
  images,
  imageWidth,
  imageHeight,
  className,
}: PolaroidsProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={cn("relative", className)}>
        {images.map((item, i) => {
          const offset = STACK_OFFSETS[i % STACK_OFFSETS.length];
          const isTop = i === 0;
          return (
            <div
              key={item.src}
              className={cn(isTop ? "relative" : "absolute top-0")}
              style={{
                transform: `rotate(${offset.rotate}deg) translateX(${offset.x}px) translateY(${offset.y}px)`,
                zIndex: images.length - i,
              }}
            >
              <Polaroid
                imageSrc={item.src}
                imageAlt={item.alt}
                imageWidth={imageWidth}
                imageHeight={imageHeight}
              >
                {isTop ? children : undefined}
              </Polaroid>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {images.map((item, i) => {
        const offset = STACK_OFFSETS[i % STACK_OFFSETS.length];
        const isTop = i === 0;
        return (
          <motion.div
            key={item.src}
            className={cn(isTop ? "relative" : "absolute top-0")}
            style={{ zIndex: images.length - i }}
            initial={{
              opacity: 0,
              scale: 0.98,
              bottom:0,
              rotate: 0,
              x: 0,
              y: offset.y + 8,
              filter: "blur(3px)",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              rotate: offset.rotate,
              x: offset.x,
              y: offset.y,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.4,
              type: "spring",
              bounce: 0.1,
              delay: i * 0.12,
            }}
          >
            <Polaroid
              imageSrc={item.src}
              imageAlt={item.alt}
              imageWidth={imageWidth}
              imageHeight={imageHeight}
            >
              {isTop ? children : undefined}
            </Polaroid>
          </motion.div>
        );
      })}
    </div>
  );
}
