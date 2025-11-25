import * as React from "react";
import {
  animate,
  AnimatePresence,
  LayoutGroup,
  motion,
  MotionConfig,
  useMotionValue,
  usePresence,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useClickAway } from "@uidotdev/usehooks";
import { Tooltip } from "@/components/primitives/Tooltip";

type Image = {
  url: string;
  caption: string;
  aspectRatio?: "tall" | "square" | "wide";
};

type TransitionType = "open" | "navigate";

/** Image List */
const IMAGES: Image[] = [
  {
    url: "/milos.jpeg",
    caption: "Milos having a mardy. Summer 2025",
    aspectRatio: "square",
  },
  {
    url: "https://ucarecdn.com/13ed369a-bf01-40cb-a951-d8e4a572f257/",
    caption: "Me in grey, rainy Paris. March 2024.",
    aspectRatio: "square",
  },
  {
    url: "/ireland.jpeg",
    caption: "A beautiful bay in South Cork. May 2025.",
    aspectRatio: "square",
  },
  {
    url: "https://ucarecdn.com/4b0ee38c-7ac6-4b9e-b287-cb39685d8670/",
    caption: "Me and Harriet zip-lining in Costa Rica. August 2024.",
    aspectRatio: "square",
  },
];

export function Gallery() {
  const [selectedImage, setSelectedImage] = React.useState<Image | null>(null);
  const ref = useClickAway<HTMLDivElement>(() => setSelectedImage(null));

  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 200], [1, 0.5]);
  const scale = useTransform(y, [0, 200], [1, 0.9]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <MotionConfig transition={{ type: "spring", duration: 0.6 }}>
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/50 backdrop-blur-md z-10 pointer-events-none"
          />
        )}

        {selectedImage && (
          <div
            className="absolute z-50 flex items-center justify-center"
            ref={ref}
          >
            <motion.div
              layoutId={`image-${selectedImage.url}`}
              className="size-[400px] rounded-2xl cursor-default overflow-hidden"
              style={{ y, opacity, scale }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.8}
              onDragEnd={(_, info) => {
                if (info.offset.y > 100 || info.velocity.y > 500) {
                  setSelectedImage(null);
                }
              }}
              onClick={() => setSelectedImage(null)}
            >
              <img
                src={selectedImage.url}
                alt={selectedImage.caption}
                loading="eager"
                className="w-full h-full object-cover pointer-events-none"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ul className="relative flex flex-col lg:grid lg:grid-cols-2 gap-2">
        {IMAGES.map((image) => {
          const isSelected = selectedImage?.url === image.url;
          return (
            <li
              key={image.url}
              className="size-[200px]"
              onClick={() => setSelectedImage(image)}
            >
              <AnimatePresence>
                {!isSelected && (
                  <Tooltip content={image.caption}>
                    <motion.div
                      layoutId={`image-${image.url}`}
                      className="size-[200px] rounded-2xl cursor-default overflow-hidden hover:opacity-80"
                    >
                      <img
                        src={image.url}
                        alt={image.caption}
                        loading="eager"
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    </motion.div>
                  </Tooltip>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </MotionConfig>
  );
}

const ExpandedImage = React.forwardRef<HTMLDivElement, { image: Image }>(
  ({ image }, ref) => {
    return (
      <>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/50 backdrop-blur-md z-10 pointer-events-none"
          />
        </AnimatePresence>
        <AnimatePresence>
          <div className="absolute inset-4 grid place-items-center z-50">
            <motion.div
              ref={ref}
              layoutId={`image-${image.url}`}
              className="aspect-square h-[400px] rounded-2xl cursor-pointer overflow-hidden outline-none focus transition-all"
            >
              <img src={image.url} alt={image.caption} loading="eager" />
            </motion.div>
          </div>
        </AnimatePresence>
      </>
    );
  },
);
ExpandedImage.displayName = "ExpandedImage";
