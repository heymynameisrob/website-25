import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

const STREAMING_TOKEN_ROWS = [
  [18, 30, 22, 26, 16, 24],
  [20, 28, 14, 18, 22, 16],
  [26, 20, 18, 24, 17, 21],
  [16, 19, 23, 28, 15, 20],
  [22, 18, 26, 16, 24, 14],
];

export const StreamingPreview = React.memo(function StreamingPreview() {
  const reduced = useReducedMotion();
  const [userVisible, setUserVisible] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const streamContainerRef = React.useRef<HTMLDivElement | null>(null);
  const streamIntervalRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (reduced) return;

    const clearStreamInterval = () => {
      if (streamIntervalRef.current !== null) {
        window.clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
    };

    const runCycle = () => {
      setUserVisible(false);
      setStep(0);
      clearStreamInterval();

      const showUserTimeout = window.setTimeout(() => {
        setUserVisible(true);
      }, 120);

      const streamStartTimeout = window.setTimeout(() => {
        streamIntervalRef.current = window.setInterval(() => {
          // Pure updater: just advance, clamp to 8 (interval is cleared by
          // the step-8 effect below).
          setStep(prev => (prev >= 8 ? prev : prev + 1));
        }, 520);
      }, 700);

      return () => {
        window.clearTimeout(showUserTimeout);
        window.clearTimeout(streamStartTimeout);
        clearStreamInterval();
      };
    };

    let cleanupCycle = runCycle();
    const cycleId = window.setInterval(() => {
      cleanupCycle();
      cleanupCycle = runCycle();
    }, 6200);

    return () => {
      cleanupCycle();
      window.clearInterval(cycleId);
    };
  }, [reduced]);

  // Stop the stream interval once we hit the final tick so it doesn't keep
  // firing pointlessly until the next cycle restarts. The ref is set by the
  // cycle effect; we only read it here.
  React.useEffect(() => {
    if (step < 8) return;
    if (streamIntervalRef.current === null) return;
    window.clearInterval(streamIntervalRef.current);
    streamIntervalRef.current = null;
  }, [step]);

  React.useEffect(() => {
    if (step <= 0) return;
    const container = streamContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [step]);

  return (
    <div className="w-full h-[200px] flex flex-col px-2 py-3">
      <div
        ref={streamContainerRef}
        className="space-y-2 pt-1 flex-1 min-h-0 overflow-y-auto scroll-smooth pr-1 pb-2 mask-y-from-70%"
      >
        <div className="w-full pt-1 space-y-2">
          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: userVisible ? 1 : 0, y: userVisible ? 0 : 6 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <div className="w-[80%] rounded-xl bg-gray-2 p-2.5 space-y-1.5">
              <div className="h-3 w-full rounded bg-gray-4" />
              <div className="h-3 w-9/12 rounded bg-gray-4" />
            </div>
          </motion.div>
          <div className="h-3 w-10 rounded bg-gray-4" />
          {STREAMING_TOKEN_ROWS.map((row, rowIndex) => {
            const visibleStep = rowIndex + 1;
            if (step < visibleStep) return null;
            return (
              <div key={`stream-${row.join("-")}`} className="flex flex-wrap gap-1.5">
                {row.map(w => (
                  <motion.div
                    key={`stream-${w}`}
                    className="h-3 rounded bg-accent/20 dark:bg-accent/50"
                    style={{ width: `${w}px` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.14 }}
                  />
                ))}
              </div>
            );
          })}
          {step >= 6 ? (
            <div className="flex items-center gap-2 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {[20, 24, 18, 22, 16, 19, 23].map(w => (
                  <motion.div
                    key={`tail-${w}`}
                    className="h-3 rounded bg-accent/20 dark:bg-accent/50"
                    style={{ width: `${w}px` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.14 }}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between h-9 shrink-0 rounded-full ring-1 ring-border bg-gray-1 px-3 py-2.5">
        <div className="h-3 w-24 rounded bg-gray-3" />
        <div className="flex items-center gap-2">
          <div className="size-3 rounded bg-gray-3" />
          <div className="size-5 rounded-full bg-gray-5" />
        </div>
      </div>
    </div>
  );
});
