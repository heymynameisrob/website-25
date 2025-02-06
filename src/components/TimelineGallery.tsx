import * as React from "react";
import { motion } from "framer-motion";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";

interface Post {
  data: {
    video_url?: string;
    image_url?: string;
    media?: MediaObj[];
    title: string;
  };
}

type MediaObj = {
  type: "image" | "video";
  url: string;
};

interface MediaItemProps {
  src: string;
  type: "image" | "video";
  alt?: string;
}

function MediaItem({ src, type, alt }: MediaItemProps) {
  const { elementRef, isInView } = useIntersectionObserver();

  return (
    <div
      ref={elementRef}
      className="relative aspect-square border rounded-lg select-none pointer-events-none group-hover:opacity-90 transition-opacity overflow-hidden lg:rounded-2xl min-w-[200px]"
    >
      {type === "video" && isInView && (
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-50 animate-in fade-in"
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
        <motion.img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
}

function useHasOverflow(ref: React.RefObject<HTMLElement>) {
  const [hasOverflow, setHasOverflow] = React.useState(false);

  React.useEffect(() => {
    const checkOverflow = () => {
      if (ref.current) {
        const { scrollWidth, clientWidth } = ref.current;
        setHasOverflow(scrollWidth > clientWidth);
      }
    };

    checkOverflow();

    // Handle window resize
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [ref]);

  return hasOverflow;
}

export function TimelineGallery({ post }: { post: Post }) {
  const carouselRef = React.useRef<HTMLDivElement>(null);
  const hasOverflow = useHasOverflow(
    carouselRef as React.RefObject<HTMLElement>,
  );
  const { video_url, image_url, media, title } = post.data;

  const hasMedia = video_url || image_url || (media && media.length > 0);
  if (!hasMedia) return null;

  return (
    <motion.div
      ref={carouselRef}
      className={`flex flex-row items-center gap-4 mt-2 ${
        hasOverflow ? "overflow-x-scroll" : "overflow-x-hidden"
      }`}
      whileTap={hasOverflow ? { cursor: "grabbing" } : undefined}
    >
      <motion.div
        drag={hasOverflow ? "x" : false}
        dragConstraints={carouselRef}
        className="flex flex-row items-center gap-4"
      >
        {media?.map(({ url, type }, index) => (
          <div key={`${url}-${index}`} className="snap-center shrink-0">
            <MediaItem
              key={`${url}-${index}`}
              src={url}
              type={type}
              alt={`${title} - ${index + 1}`}
            />
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
