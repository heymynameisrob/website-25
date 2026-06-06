import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

const SKELETON_PULSE = {
  animate: { opacity: [0.5, 1, 0.5] },
  transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" as const },
};

function StreamingCommentSkeleton() {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="size-4 rounded-full bg-gray-4" />
        <div className="h-3 w-20 rounded bg-accent/20 dark:bg-accent/50" />
      </div>
      <div className="h-3 rounded bg-accent/20 dark:bg-accent/50" style={{ width: "100%" }} />
      <div className="h-3 rounded bg-accent/20 dark:bg-accent/50" style={{ width: "94%" }} />
    </>
  );
}

export const AgentFeedbackPreview = React.memo(function AgentFeedbackPreview() {
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = React.useState(false);
  const timersRef = React.useRef<(() => void) | null>(null);

  React.useEffect(() => {
    if (reduced) return;
    const cycle = () => {
      setExpanded(false);
      const expandTimeout = window.setTimeout(() => setExpanded(true), 3300);
      const collapseTimeout = window.setTimeout(() => setExpanded(false), 4700);
      return () => {
        window.clearTimeout(expandTimeout);
        window.clearTimeout(collapseTimeout);
      };
    };

    timersRef.current = cycle();
    const intervalId = window.setInterval(() => {
      timersRef.current?.();
      timersRef.current = cycle();
    }, 5400);

    return () => {
      timersRef.current?.();
      window.clearInterval(intervalId);
    };
  }, [reduced]);

  return (
    <div className="w-full max-w-[260px] rounded-xl border border-gray-4 bg-background overflow-hidden">
      <div className="p-3 space-y-2">
        <StreamingCommentSkeleton />
      </div>
      <div className="h-px w-full bg-gray-3" />
      <motion.div
        layout
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="relative p-3 overflow-hidden"
      >
        <motion.div
          className="grid"
          animate={{ opacity: expanded ? 0 : 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{
            gridTemplateRows: expanded ? "0fr" : "1fr",
            transition: "grid-template-rows 0.3s ease-in-out",
          }}
        >
          <div className="overflow-hidden [grid-row:1] [grid-column:1]">
            <div className="flex items-center gap-2">
              <div className="relative flex size-4 items-center justify-center overflow-hidden rounded-full p-[1px]">
                <motion.div
                  className="absolute top-[-50%] left-[-50%] h-[200%] w-[200%]"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0%, var(--color-primary) 10%, var(--color-primary) 25%, transparent 35%)",
                  }}
                  animate={reduced ? {} : { transform: ["rotate(0deg)", "rotate(360deg)"] }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 0.475, repeat: Infinity, ease: "linear" }
                  }
                />
                <div className="relative z-10 flex size-full items-center justify-center rounded-full bg-background">
                  <div className="size-2.5 rounded-full bg-gray-5" />
                </div>
              </div>
              <motion.div
                className="h-3 w-28 rounded bg-gray-3"
                {...SKELETON_PULSE}
                transition={{ ...SKELETON_PULSE.transition, delay: 0.1 }}
              />
              <motion.div
                className="ml-1 size-2 rounded-full bg-gray-7"
                animate={reduced ? {} : { opacity: [0.2, 1, 0.2] }}
                transition={
                  reduced ? { duration: 0 } : { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
                }
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid"
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{
            gridTemplateRows: expanded ? "1fr" : "0fr",
            transition: "grid-template-rows 0.35s ease-in-out",
          }}
        >
          <div className="overflow-hidden [grid-row:1] [grid-column:1]">
            <StreamingCommentSkeleton />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
});
