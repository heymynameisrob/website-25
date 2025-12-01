import * as React from "react";
import { motion, useInView } from "motion/react";
import { Text } from "lucide-react";

type Heading = {
  depth: number;
  slug: string;
  text: string;
};

type ToCProps = {
  headings: Heading[];
};

function HeadingObserver({
  slug,
  index,
  onInView,
}: {
  slug: string;
  index: number;
  onInView: (index: number) => void;
}) {
  const ref = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    ref.current = document.getElementById(slug);
  }, [slug]);

  const isInView = useInView(ref, {
    margin: "-80px 0px -80% 0px",
  });

  React.useEffect(() => {
    if (isInView) {
      onInView(index);
    }
  }, [isInView, index, onInView]);

  return null;
}

export function ToC({ headings }: ToCProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const itemRefs = React.useRef<(HTMLLIElement | null)[]>([]);

  const handleInView = (index: number) => {
    setActiveIndex(index);
  };

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const getMarkerTop = () => {
    const item = itemRefs.current[activeIndex];
    if (!item) return 0;
    return item.offsetTop;
  };

  return (
    <>
      {headings
        .filter((h) => h.depth < 3)
        .map((heading, index) => (
          <HeadingObserver
            key={heading.slug}
            slug={heading.slug}
            index={index}
            onInView={handleInView}
          />
        ))}
      <nav
        role="navigation"
        className="not-prose fixed top-0 right-0 hidden h-fit -translate-x-2 p-6 xl:flex xl:flex-col xl:gap-4"
      >
        <div className="flex items-center gap-2 -mx-1">
          <Text className="size-4" />
          <span className="text-sm font-medium">On this page</span>
        </div>
        <div className="relative">
          <div className="absolute -inset-y-1 left-[3px] w-px bg-border mask-linear mask-t-to-transparent mask-t-from-90% mask-b-to-transparent mask-b-from-90%" />
          <motion.div
            id="marker"
            className="absolute left-0 grid place-items-center h-5"
            animate={{ top: getMarkerTop() }}
            transition={{ type: "spring", stiffness: 250, damping: 30 }}
          >
            <div className="size-2 bg-accent rounded-full" />
          </motion.div>
          <ul className="flex flex-col gap-4">
            {headings
              .filter((h) => h.depth < 3)
              .map((heading, index) => (
                <li
                  key={heading.slug}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="flex h-fit"
                >
                  <a
                    className={`hover:text-primary ml-5 inline-block h-5 truncate text-sm no-underline transition-all ${
                      activeIndex === index ? "text-primary" : "text-gray-10"
                    }`}
                    href={`#${heading.slug}`}
                    onClick={() => handleClick(index)}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
