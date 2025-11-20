import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

type Image = {
  url: string;
  caption: string;
  aspectRatio?: "tall" | "square" | "wide";
};

type TransitionType = "open" | "navigate";

/** Image List */
const IMAGES: Image[] = [
  {
    url: "https://ucarecdn.com/1962184f-0c11-445b-943e-28be734814d9/",
    caption: "Photo 1",
    aspectRatio: "square",
  },
  {
    url: "https://ucarecdn.com/13ed369a-bf01-40cb-a951-d8e4a572f257/",
    caption: "Photo 2",
    aspectRatio: "square",
  },
  {
    url: "https://ucarecdn.com/9595131d-ce50-4d19-bfcc-f6c6c305d25c/",
    caption: "Photo 6",
    aspectRatio: "square",
  },
  {
    url: "https://ucarecdn.com/4b0ee38c-7ac6-4b9e-b287-cb39685d8670/",
    caption: "Photo 7",
    aspectRatio: "square",
  },
];

export function Gallery() {
  const [currentImage, setCurrentImage] = React.useState<string | null>(null);
  const [transitionType, setTransitionType] =
    React.useState<TransitionType>("open");

  const handleImageOpen = (image: string) => {
    setTransitionType("open");
    setCurrentImage(image);
  };

  /** Stop scrolling when image dialog is open */
  React.useEffect(() => {
    document.body.style.overflow = currentImage ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [currentImage]);

  return (
    <div className="not-prose w-full max-w-md mx-auto">
      <div className="w-full grid grid-cols-2 gap-4">
        {IMAGES.map((img) => (
          <motion.button
            key={img.url}
            layoutId={img.url}
            whileHover={{ opacity: 0.8 }}
            className="relative aspect-square rounded-2xl bg-gray-2 overflow-hidden border focus transition-all"
            onClick={() => handleImageOpen(img.url)}
          >
            <img
              src={img.url}
              className="absolute inset-0 object-cover"
              alt="Preview image"
            />
          </motion.button>
        ))}
      </div>

      <GalleryDialog
        image={currentImage}
        onImageChange={setCurrentImage}
        transitionType={transitionType}
        setTransitionType={setTransitionType}
      />
    </div>
  );
}

function GalleryDialog({
  image,
  onImageChange,
  setTransitionType,
  transitionType,
}: {
  image: string | null;
  onImageChange: React.Dispatch<React.SetStateAction<string | null>>;
  transitionType: TransitionType;
  setTransitionType: React.Dispatch<React.SetStateAction<TransitionType>>;
}) {
  const next = React.useCallback(() => {
    if (!image) return;

    const index = IMAGES.findIndex((p) => p.url === image);
    if (index === IMAGES.length - 1) return;

    setTransitionType("navigate");
    onImageChange(IMAGES[index + 1].url);
  }, [image, onImageChange, setTransitionType]);

  const prev = React.useCallback(() => {
    if (!image) return;

    const index = IMAGES.findIndex((p) => p.url === image);
    if (index === 0) return;

    setTransitionType("navigate");
    onImageChange(IMAGES[index - 1].url);
  }, [image, onImageChange, setTransitionType]);

  React.useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setTransitionType("open");
        onImageChange(null);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (event.metaKey || event.ctrlKey) {
          setTransitionType("navigate");
          onImageChange(IMAGES[0].url);
        } else {
          prev();
        }
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (event.metaKey || event.ctrlKey) {
          setTransitionType("navigate");
          onImageChange(IMAGES[IMAGES.length - 1].url);
        } else {
          next();
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [next, prev, onImageChange, transitionType, setTransitionType]);

  return (
    <>
      <AnimatePresence>
        {image ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setTransitionType("open");
              onImageChange(null);
            }}
            className="absolute inset-0 z-10 backdrop-blur-sm"
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {image ? (
          <div className="absolute inset-10 grid place-items-center z-10 pointer-events-none">
            <motion.div
              key={image}
              layoutId={image}
              className={cn(
                "relative aspect-square w-full max-w-md rounded-3xl shadow-2xl overflow-hidden",
              )}
            >
              <img
                src={image}
                className="absolute inset-0 object-cover"
                alt="Expanded image" // Adding alt for accessibility
              />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
