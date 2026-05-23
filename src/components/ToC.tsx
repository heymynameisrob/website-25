import * as React from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";

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

  const handleInView = (index: number) => {
    setActiveIndex(index);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", `#${slug}`);
    }
  };

  return (
    <>
      {headings
        .filter(h => h.depth < 3)
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
        className="not-prose hidden h-fit xl:visible xl:flex xl:flex-col xl:gap-4"
      >
        <ul className="flex flex-col gap-4">
          {headings
            .filter(h => h.depth < 3)
            .map((heading, index) => (
              <li key={heading.slug} className="flex h-fit">
                <a
                  className={cn(
                    "hover:text-primary inline-block h-5 truncate text-sm no-underline transition-colors focus rounded-md",
                    activeIndex === index ? "text-primary" : "text-gray-9"
                  )}
                  href={`#${heading.slug}`}
                  onClick={e => handleClick(e, heading.slug)}
                >
                  {heading.text}
                </a>
              </li>
            ))}
        </ul>
      </nav>
    </>
  );
}
