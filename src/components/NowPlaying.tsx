import useSWR from "swr";
import { AnimatePresence, motion } from "motion/react";
import { fetcher } from "@/lib/fetch";

import type { Track } from "@/lib/types";

export function NowPlaying() {
  const { data } = useSWR<Track>("/api/now-playing", fetcher);

  if (!data) return null;

  const image = data.image.find((img) => img.size === "medium")?.url;

  return (
    <AnimatePresence mode="popLayout">
      {data.nowPlaying ? (
        <motion.div
          initial={{ y: 20, filter: "blur(4px)", opacity: 0 }}
          animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
          exit={{ y: 20, filter: "blur(4px)", opacity: 0 }}
          className="fixed bottom-8 left-0 right-0 grid place-items-center z-50"
        >
          <div className="flex justify-between items-center gap-4 w-96 bg-gray-1 border rounded-xl p-2 shadow-lg dark:shadow-2xl relative after:absolute after:inset-0 after:rounded-xl after:bg-gradient-to-r dark:after:from-white/5 after:to-transparent">
            <a
              href={data.url}
              target="_blank"
              rel="noopener nofollow"
              className="flex w-full items-center gap-2"
            >
              <img
                src={image}
                alt={data.album}
                loading="lazy"
                className="aspect-square size-12 rounded-md"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium text-primary truncate">
                  {data.name}
                </p>
                <p className="font-mono uppercase text-sm text-secondary truncate">
                  {data.artist}
                </p>
              </div>
            </a>
            <Icon />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Icon() {
  return (
    <div className="grid items-center px-3">
      <span className="relative flex items-center justify-between size-5 mask-linear mask-from-100 mask-to-50">
        <motion.span
          className="w-[5px] h-full bg-cyan-400 origin-bottom rounded-t-[1px]"
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
          className="w-[5px] h-full bg-cyan-400 origin-bottom rounded-t-[1px]"
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
          className="w-[5px] h-full bg-cyan-400 origin-bottom rounded-t-[1px]"
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
