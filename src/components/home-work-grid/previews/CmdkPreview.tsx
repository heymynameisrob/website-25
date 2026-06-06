import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

const CMDK_ROWS = [
  { id: "plus-command", keyHint: "+", w: "w-24" },
  { id: "tag-command", keyHint: "#", w: "w-32" },
  { id: "mention-command", keyHint: "@", w: "w-20" },
  { id: "short-action", keyHint: null, w: "w-24" },
  { id: "quick-action", keyHint: null, w: "w-20" },
  { id: "long-action", keyHint: null, w: "w-40" },
  { id: "medium-action", keyHint: null, w: "w-28" },
] as const;

export const CmdkPreview = React.memo(function CmdkPreview() {
  const reduced = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const rowRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  React.useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setSelectedIndex(prev => (prev >= 6 ? 0 : prev + 1));
    }, 700);
    return () => window.clearInterval(id);
  }, [reduced]);

  React.useEffect(() => {
    const target = rowRefs.current[selectedIndex];
    const container = listRef.current;
    if (!target || !container) return;
    requestAnimationFrame(() => {
      const top = target.offsetTop + target.clientHeight - container.clientHeight;
      container.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  }, [selectedIndex]);

  return (
    <div className="w-full aspect-[4/3] rounded-xl border border-gray-4 bg-background overflow-hidden text-left">
      <div className="sticky top-0 z-10 h-10 border-b border-gray-4 bg-background px-3 flex items-center">
        <div className="h-3 w-4/5 rounded bg-gray-4" />
      </div>
      <div ref={listRef} className="p-2 space-y-1.5 max-h-[180px] overflow-y-auto scroll-smooth">
        <div className="h-3 w-24 rounded bg-gray-4 mx-1" />
        {CMDK_ROWS.slice(0, 3).map((row, index) => (
          <motion.div
            key={`cmdk-top-${row.id}`}
            ref={el => {
              rowRefs.current[index] = el;
            }}
            className="h-9 rounded-lg px-2 flex items-center justify-between"
            animate={{
              backgroundColor: selectedIndex === index ? "var(--color-gray-2)" : "transparent",
            }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center gap-2">
              <div className="size-4 rounded bg-gray-4" />
              <div className={`h-3 rounded bg-gray-5 ${row.w}`} />
            </div>
            {row.keyHint && <div className="h-5 w-5 rounded bg-gray-3" />}
          </motion.div>
        ))}
        <div className="h-3 w-16 rounded bg-gray-4 mx-1 mt-1" />
        {CMDK_ROWS.slice(3).map((row, idx) => {
          const index = idx + 3;
          return (
            <motion.div
              key={`cmdk-bottom-${row.id}`}
              ref={el => {
                rowRefs.current[index] = el;
              }}
              className="h-9 rounded-lg px-2 flex items-center justify-between"
              animate={{
                backgroundColor: selectedIndex === index ? "var(--color-gray-2)" : "transparent",
              }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-center gap-2">
                <div className="size-4 rounded bg-gray-4" />
                <div className={`h-3 rounded bg-gray-5 ${row.w}`} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
