import { getDeterministicWidth } from "@/components/demos/ArtificialInbox/Skeletons";
import { Avatar } from "@/components/primitives/Avatar";
import { Skeleton } from "@/components/primitives/Skeleton";
import { cn } from "@/lib/utils";
import { BrainCircuit } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

export function Thinking() {
  return (
    <div className="group overflow-hidden max-w-xl mx-auto bg-background border rounded-xl">
      <article className="p-3 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            src="https://ucarecdn.com/75709875-783d-47e9-a60a-6d43e1d5d344/-/preview/100x100/"
            fallback="RH"
            className="size-5"
          />
          <span className="text-sm font-medium">Rob Hough</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 w-full">
          {Array.from({ length: 8 }).map((_, i) => {
            const width = getDeterministicWidth(i);
            return (
              <React.Fragment key={i}>
                <Skeleton className="w-24 h-3.5" style={{ width }} />
                <Skeleton className="w-8 h-3.5" />
                <Skeleton className="w-16 h-3.5" />
                <Skeleton className="w-12 h-3.5" />
              </React.Fragment>
            );
          })}
        </div>
      </article>
      <ThinkingIndicator />
    </div>
  );
}

const STATUSES = [
  "Thinking",
  "Searching workspace",
  "Analyzing results",
  "Writing response",
];

function ThinkingIndicator() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % STATUSES.length);
    }, 2_000);

    return () => clearTimeout(timer);
  });

  return (
    <motion.article
      initial={{ opacity: 0, filter: "blur(2px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(2px)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col border-t px-3.5 py-2 h-11 bg-gray-1 w-full"
    >
      <div className="group flex items-center gap-3">
        <div className="relative size-7 grid place-items-center rounded-full shrink-0">
          <div className="absolute inset-0 rounded-full p-[2px] bg-[conic-gradient(from_0deg,transparent_0%,var(--color-blue-500)_10%,var(--color-blue-500)_25%,transparent_35%)] animate-spin" />
          <div className="relative z-10 size-6 bg-gray-4 ring-1 ring-gray-1 rounded-full grid place-items-center">
            <BrainCircuit className="size-4 text-gray-10" />
          </div>
        </div>
        <div className="relative h-5 w-56 overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.span
              key={index}
              className={cn(
                "absolute inset-0 text-sm font-medium text-gray-12 select-none",
              )}
              initial={{ y: 8, opacity: 0, filter: "blur(1px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -8, opacity: 0, filter: "blur(1px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {STATUSES[index]}...
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}
