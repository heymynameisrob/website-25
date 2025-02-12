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

  if (!data) return null;

  const image = data.image.find((img) => img.size === "extralarge")?.url;

  if (!data.nowPlaying) return null;

  return (
    <div className="flex items-baseline gap-1 -mx-2 animate-in fade-in fill-mode-both duration-300 overflow-y-clip">
      <Icon />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={data.url}
          initial={{ y: 10, filter: "blur(2px)", opacity: 0 }}
          animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
          exit={{ y: 10, filter: "blur(2px)", opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.2 }}
        >
          <HoverCard>
            <HoverCardTrigger aria-disabled={!image}>
              <a
                href={data.url}
                target="_blank"
                rel="noopener nofollow"
                className="flex w-full items-center gap-2 hover:opacity-70"
              >
                <p className="text-sm font-medium text-primary truncate">
                  {data.name}
                </p>
                <ChevronRightIcon className="w-3 h-3 opacity-60" />
                <p className="text-sm text-secondary truncate">{data.artist}</p>
              </a>
            </HoverCardTrigger>
            <HoverCardContent
              align="start"
              className="aspect-square p-0 rounded-lg overflow-clip data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
            >
              <img
                src={image}
                alt={data.album}
                loading="lazy"
                className="object-fit w-full h-full"
              />
            </HoverCardContent>
          </HoverCard>
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function Icon() {
  return (
    <div className="grid items-center px-3 overlflow-clip">
      <span className="relative flex items-center justify-between size-4">
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
