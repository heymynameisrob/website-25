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
  type: "image" | "video";
  alt: string;
  caption?: string;
}

function MediaDialog({
  children,
  media,
}: {
  children: React.ReactNode;
  media: { src: string; type: "image" | "video"; alt?: string };
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-nesw-resize">{children}</div>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        {media.type === "video" ? (
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
        ) : (
          <img
            src={media.src}
            alt={media.alt}
            className="w-full h-full object-contain"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// Modify the MediaItem component to remove pointer-events-none and wrap content in MediaDialog
export function Media({ src, type, alt, caption }: MediaItemProps) {
  const { elementRef, isInView } = useIntersectionObserver();

  if (!src) return null;

  return (
    <figure className="flex flex-col">
      <div
        ref={elementRef}
        className="relative aspect-video border rounded-md select-none group-hover:opacity-90 transition-opacity overflow-hidden min-w-[200px]"
      >
        <MediaDialog media={{ src, type, alt }}>
          {type === "video" && isInView && (
            <video
              className="!m-0 absolute inset-0 w-full h-full object-cover object-left-top"
              preload="none"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={src} type="video/mp4" />
            </video>
          )}
          {type === "image" && isInView && (
            <img
              src={`${src}/-/preview/`}
              alt={alt}
              className="!m-0 absolute inset-0 w-full h-full object-cover"
            />
          )}
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
