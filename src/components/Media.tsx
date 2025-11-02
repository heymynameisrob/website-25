import * as React from "react";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";
import { motion } from "motion/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/components/primitives/Dialog";

interface MediaItemProps {
  src: string | undefined;
  previewSrcSet?: string;
  darkSrc?: string;
  previewDarkSrcSet?: string;
  type: "image" | "video";
  alt: string;
  caption?: string;
}

function MediaDialog({
  children,
  media,
}: {
  children: React.ReactNode;
  media: {
    src: string;
    type: "image" | "video";
    alt?: string;
    darkSrc?: string;
  };
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const prefetchedRef = React.useRef(false);

  const prefetchImages = React.useCallback(() => {
    if (prefetchedRef.current || media.type === "video") return;

    prefetchedRef.current = true;

    // Prefetch light variant
    const lightImg = new Image();
    lightImg.src = media.src;

    // Prefetch dark variant if exists
    if (media.darkSrc) {
      const darkImg = new Image();
      darkImg.src = media.darkSrc;
    }
  }, [media.src, media.darkSrc, media.type]);

  return (
    <Dialog onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-nesw-resize" onMouseEnter={prefetchImages}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        {isOpen &&
          (media.type === "video" ? (
            <video
              className="w-full h-full object-contain"
              controls
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={media.src} type="video/mp4" />
            </video>
          ) : media.darkSrc ? (
            <>
              <img
                src={media.src}
                alt={media.alt}
                className="w-full h-full object-contain dark:hidden"
              />
              <img
                src={media.darkSrc}
                alt={media.alt}
                className="w-full h-full object-contain hidden dark:block"
              />
            </>
          ) : (
            <img
              src={media.src}
              alt={media.alt}
              className="w-full h-full object-contain"
            />
          ))}
      </DialogContent>
    </Dialog>
  );
}

// Modify the MediaItem component to remove pointer-events-none and wrap content in MediaDialog
export function Media({
  src,
  previewSrcSet,
  darkSrc,
  previewDarkSrcSet,
  type,
  alt,
  caption,
}: MediaItemProps) {
  const { elementRef, isInView } = useIntersectionObserver();

  if (!src) return null;

  return (
    <figure className="flex flex-col my-8">
      <div
        ref={elementRef}
        className="relative aspect-video border rounded-md select-none group-hover:opacity-90 transition-opacity overflow-hidden min-w-[200px]"
      >
        <MediaDialog media={{ src, type, alt, darkSrc }}>
          {type === "video" && isInView && (
            <video
              className="m-0! absolute inset-0 w-full h-full object-cover object-top-left"
              preload="none"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={src} type="video/mp4" />
            </video>
          )}
          {type === "image" &&
            isInView &&
            (darkSrc ? (
              <>
                <img
                  src={src}
                  srcSet={previewSrcSet}
                  alt={alt}
                  className="m-0! absolute inset-0 w-full h-full object-cover dark:hidden"
                />
                <img
                  src={darkSrc}
                  srcSet={previewDarkSrcSet}
                  alt={alt}
                  className="m-0! absolute inset-0 w-full h-full object-cover hidden dark:block"
                />
              </>
            ) : (
              <img
                src={src}
                srcSet={previewSrcSet}
                alt={alt}
                className="m-0! absolute inset-0 w-full h-full object-cover"
              />
            ))}
        </MediaDialog>
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-secondary">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
