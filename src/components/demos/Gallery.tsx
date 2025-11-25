import * as React from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  usePresence,
} from "motion/react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useClickAway } from "@uidotdev/usehooks";

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
  const [selectedImage, setSelectedImage] = React.useState<Image | null>(null);
  const ref = useClickAway<HTMLDivElement>(() => setSelectedImage(null));

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
    <>
      {selectedImage && <ExpandedImage ref={ref} image={selectedImage} />}
      <ul className="flex flex-col lg:grid lg:grid-cols-2 gap-2">
        {IMAGES.map((image) => (
          <button
            key={image.url}
            onClick={() => setSelectedImage(image)}
            className="aspect-square h-[200px] rounded-2xl hover:opacity-80 cursor-pointer overflow-hidden outline-none focus transition-all"
          >
            <img src={image.url} alt={image.caption} loading="eager" />
          </button>
        ))}
      </ul>
    </>
  );
}

const ExpandedImage = React.forwardRef<HTMLDivElement, { image: Image }>(
  ({ image }, ref) => {
    return (
      <>
        <div className="absolute inset-0 bg-background/50 backdrop-blur-md z-10 pointer-events-none" />
        <div className="absolute inset-4 grid place-items-center z-50">
          <div
            ref={ref}
            className="aspect-square h-[400px] rounded-2xl cursor-pointer overflow-hidden outline-none focus transition-all"
          >
            <img src={image.url} alt={image.caption} loading="eager" />
          </div>
        </div>
      </>
    );
  },
);
ExpandedImage.displayName = "ExpandedImage";
