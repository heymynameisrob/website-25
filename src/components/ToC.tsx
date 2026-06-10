import * as React from "react";
import { cn } from "@/lib/utils";

type Heading = {
  depth: number;
  slug: string;
  text: string;
};

type ToCProps = {
  headings: Heading[];
  title: string;
};

const TITLE_SLUG = "page-title";
const MAX_HEADING_DEPTH = 3;

export function ToC({ headings, title }: ToCProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const manualActiveRef = React.useRef<number | null>(null);
  const visibleIndicesRef = React.useRef<Set<number>>(new Set());

  // Title is entry 0, body headings are offset by 1
  const allEntries = React.useMemo(() => {
    const filtered = headings.filter(h => h.depth <= MAX_HEADING_DEPTH);
    return [{ slug: TITLE_SLUG, text: title, depth: 1 }, ...filtered];
  }, [headings, title]);

  React.useEffect(() => {
    const elements = allEntries.map(e => document.getElementById(e.slug));

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const index = elements.findIndex(el => el === entry.target);
          if (index === -1) continue;
          if (entry.isIntersecting) {
            visibleIndicesRef.current.add(index);
          } else {
            visibleIndicesRef.current.delete(index);
          }
        }

        // If the user clicked a heading that's still visible, keep it active
        if (manualActiveRef.current !== null) {
          if (visibleIndicesRef.current.has(manualActiveRef.current)) {
            setActiveIndex(manualActiveRef.current);
            return;
          }
          // Clicked heading left the viewport — clear override, fall through
          manualActiveRef.current = null;
        }

        if (visibleIndicesRef.current.size > 0) {
          setActiveIndex(Math.min(...visibleIndicesRef.current));
        }
      },
      { rootMargin: "0px 0px -80% 0px" }
    );

    for (const el of elements) {
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [allEntries]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string, index: number) => {
    e.preventDefault();
    manualActiveRef.current = index;
    setActiveIndex(index);
    const el = document.getElementById(slug);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      history.pushState(null, "", slug === TITLE_SLUG ? "" : `#${slug}`);
    }
  };

  return (
    <nav
      role="navigation"
      className="not-prose hidden h-fit xl:visible xl:flex xl:flex-col xl:gap-4"
    >
      <ul className="flex flex-col gap-4">
        {allEntries.map((entry, index) => (
          <li key={entry.slug} className="flex h-fit">
            <a
              className={cn(
                "hover:text-primary inline-block h-5 truncate text-sm no-underline transition-colors focus rounded-md",
                activeIndex === index ? "text-primary font-medium" : "text-gray-9",
                entry.depth === 3 && "pl-4"
              )}
              href={entry.slug === TITLE_SLUG ? "#" : `#${entry.slug}`}
              onClick={e => handleClick(e, entry.slug, index)}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
