import * as React from "react";
import * as Portal from "@radix-ui/react-portal";
import { AnimatePresence, motion } from "motion/react";
import Masonry from "react-masonry-css";
import { cn } from "@/lib/utils";

type Image = {
  url: string;
  caption: string;
  aspectRatio?: "tall" | "square" | "wide";
};

type TransitionType = "open" | "navigate";

const BREAKPOINT_COLS = {
  default: 3,
  1024: 3,
  768: 2,
  640: 1,
};

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
    url: "https://ucarecdn.com/e8984722-d538-461d-8459-7bf36770ec6d/",
    caption: "Photo 3",
    aspectRatio: "tall",
  },
  {
    url: "https://ucarecdn.com/2d4d807d-ecb7-4d42-a44f-8036a147770d/",
    caption: "Photo 4",
    aspectRatio: "wide",
  },
  {
    url: "https://ucarecdn.com/129e6811-e758-4c4c-bca9-69ee645a50b1/",
    caption: "Photo 5",
    aspectRatio: "tall",
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
    <div className="p-2">
      <Masonry
        breakpointCols={BREAKPOINT_COLS}
        className="flex items-start -ml-2 w-auto"
        columnClassName=" pl-2 bg-clip-padding"
      >
        {IMAGES.map((img) => (
          <motion.button
            key={img.url}
            layoutId={transitionType === "open" ? img.url : undefined}
            whileHover={{ opacity: 0.8 }}
            className="relative break-inside-avoid focus rounded-lg"
            onClick={() => handleImageOpen(img.url)}
          >
            <img
              src={img.url}
              className="!m-0 w-full h-auto object-cover rounded-lg border"
              alt="Preview image"
            />
          </motion.button>
        ))}
      </Masonry>

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

  const aspectRatio = IMAGES.find((p) => p.url === image)?.aspectRatio;

  return (
    <Portal.Portal>
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
            className="fixed inset-0 z-10 bg-black/10 backdrop-blur"
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false} mode="popLayout">
        {image ? (
          <div className="fixed inset-0 grid place-items-center z-10 pointer-events-none">
            <motion.div
              key={image}
              layoutId={transitionType === "open" ? image : undefined}
              className={cn(
                "relative aspect-square w-[80vw] max-w-[800px] shadow-2xl",
                aspectRatio === "tall" && "aspect-[3/4]",
                aspectRatio === "wide" && "aspect-[4/3]",
              )}
            >
              <img
                src={image}
                className="absolute inset-0 w-full h-full object-cover rounded-[32px]"
                alt="Expanded image" // Adding alt for accessibility
              />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </Portal.Portal>
  );
}
