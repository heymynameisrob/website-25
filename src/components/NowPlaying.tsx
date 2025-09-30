import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { AnimatePresence, motion } from "motion/react";
import { fetcher } from "@/lib/fetch";

import type { Track } from "@/lib/types";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/primitives/HoverCard";
import { ChevronRightIcon } from "@heroicons/react/16/solid";

export function NowPlaying() {
  const { data } = useSWR<Track>("/api/now-playing", fetcher, {
    refreshInterval: 30_000, // 30 seconds
  });
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLAnchorElement>(null);
  const [shouldMarquee, setShouldMarquee] = useState(false);
  const [marqueeDistance, setMarqueeDistance] = useState(0);

  useEffect(() => {
    if (!textRef.current || !containerRef.current || !data) return;

    const textWidth = textRef.current.scrollWidth;
    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const overflows = textWidth > containerWidth;
    setShouldMarquee(overflows);
    if (overflows) {
      setMarqueeDistance(textWidth - containerWidth); // Just enough to show the end
    }
  }, [data]);

  if (!data) return null;

  const image = data.image.find((img) => img.size === "extralarge")?.url;

  if (!data.nowPlaying) return null;

  return (
    <div className="flex items-center gap-1 animate-in fade-in fill-mode-both duration-300 overflow-x-clip h-8">
      <div className="shrink-0 size-5 relative rounded-md overflow-hidden bg-gray-4">
        <img
          src={image}
          loading="lazy"
          className="absolute inset-0 object-cover"
        />
      </div>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={data.url}
          initial={{ y: 10, filter: "blur(2px)", opacity: 0 }}
          animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
          exit={{ y: 10, filter: "blur(2px)", opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.2 }}
          className="w-full overflow-hidden"
        >
          <a
            ref={containerRef}
            href={data.url}
            target="_blank"
            rel="noopener nofollow"
            className="block hover:opacity-70"
          >
            <motion.div
              ref={textRef}
              className="flex items-center gap-px whitespace-nowrap w-fit"
              animate={
                shouldMarquee
                  ? {
                      x: [0, 0, -marqueeDistance, -marqueeDistance, 0, 0],
                    }
                  : { x: 0 }
              }
              transition={
                shouldMarquee
                  ? {
                      x: {
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                        times: [0, 0.1, 0.4, 0.6, 0.9, 1],
                      },
                    }
                  : undefined
              }
            >
              <p className="shrink-0 text-xs font-medium text-primary">
                {data.name} –
              </p>
              <p className="shrink-0 text-xs text-secondary">{data.artist}</p>
            </motion.div>
          </a>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Icon() {
  return (
    <div className="grid place-items-center w-8 h-6 rounded-lg bg-gray-3 overlflow-clip">
      <span className="relative flex items-center justify-between size-3">
        <motion.span
          className="w-[3px] h-full bg-cyan-400 origin-bottom rounded-t-[1px]"
          animate={{
            scaleY: [0.3, 1, 0.5, 0.75, 0.5],
          }}
          transition={{
            duration: 1.2,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.span
          className="w-[3px] h-full bg-cyan-400 origin-bottom rounded-t-[1px]"
          animate={{
            scaleY: [0.3, 1, 0.5, 0.75, 0.5],
          }}
          transition={{
            duration: 1.2,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.2,
          }}
        />
        <motion.span
          className="w-[4px] h-full bg-cyan-400 origin-bottom rounded-t-[1px]"
          animate={{
            scaleY: [0.3, 1, 0.5, 0.75, 0.5],
          }}
          transition={{
            duration: 1.2,
            ease: "linear",
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
        />
      </span>
    </div>
  );
}
