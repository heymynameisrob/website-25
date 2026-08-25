import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { PostDemo } from "@/components/post/PostDemo";

const ROW_COUNT = 12;
const ROWS = Array.from({ length: ROW_COUNT }, function createRow(_, index) {
  return index;
});
const ROW_INTERVAL = 90;
const ROWS_PER_SECTION = 3;
const SEQUENCE_DURATION = ROW_COUNT * ROW_INTERVAL + 600;
const LOOP_DELAY = 4000;
const EXIT_DURATION = 200;
const ENTER_TRANSITION = {
  duration: 0.2,
  ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
};

function ProgressiveRows({ run }: { run: number }) {
  const shouldReduceMotion = useReducedMotion();
  const [visibleRowCount, setVisibleRowCount] = React.useState(0);

  React.useEffect(
    function renderRowsProgressively() {
      if (shouldReduceMotion) {
        setVisibleRowCount(ROW_COUNT);
        return;
      }

      setVisibleRowCount(1);
      const interval = window.setInterval(function addRow() {
        setVisibleRowCount(function updateVisibleRowCount(currentCount) {
          const nextCount = Math.min(currentCount + 1, ROW_COUNT);

          if (nextCount === ROW_COUNT) window.clearInterval(interval);
          return nextCount;
        });
      }, ROW_INTERVAL);

      return function cancelProgressiveRender() {
        window.clearInterval(interval);
      };
    },
    [run, shouldReduceMotion]
  );

  return (
    <div className="flex flex-col gap-1 px-2 pb-2" aria-hidden="true">
      {ROWS.slice(0, visibleRowCount).map(function renderRow(row) {
        return (
          <motion.div
            key={row}
            className="flex shrink-0 flex-col gap-1"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={shouldReduceMotion ? { duration: 0 } : ENTER_TRANSITION}
          >
            {row % ROWS_PER_SECTION === 0 ? (
              <span className="py-1 text-xs font-semibold text-gray-9">
                {String.fromCharCode(65 + row / ROWS_PER_SECTION)}
              </span>
            ) : null}
            <div className="grid grid-cols-12 gap-1">
              {ROWS.map(function renderGridItem(column) {
                return <span key={column} className="aspect-square rounded-md bg-gray-4" />;
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function ProgressiveRenderStage() {
  const shouldReduceMotion = useReducedMotion();
  const [run, setRun] = React.useState(0);
  const [isOpen, setIsOpen] = React.useState(true);

  React.useEffect(
    function loopSequence() {
      if (shouldReduceMotion) return;

      const closeTimer = window.setTimeout(function closePopover() {
        setIsOpen(false);
      }, SEQUENCE_DURATION + LOOP_DELAY);
      const restartTimer = window.setTimeout(
        function restartSequence() {
          setIsOpen(true);
          setRun(function incrementRun(currentRun) {
            return currentRun + 1;
          });
        },
        SEQUENCE_DURATION + LOOP_DELAY + EXIT_DURATION
      );

      return function cancelLoop() {
        window.clearTimeout(closeTimer);
        window.clearTimeout(restartTimer);
      };
    },
    [run, shouldReduceMotion]
  );

  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          key={run}
          role="status"
          aria-label="Rows rendering progressively"
          className="w-72 aspect-square overflow-hidden rounded-lg border bg-gray-1 shadow-lg scrollbar-gutter-auto"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.98 }}
          transition={shouldReduceMotion ? { duration: 0 } : ENTER_TRANSITION}
          style={{ transformOrigin: "top center" }}
        >
          <div className="flex items-center gap-2 p-2" aria-hidden="true">
            <div className="h-8 flex-1 rounded-md border bg-gray-2 px-2">
              <span className="block h-2.5 w-2/5 translate-y-2.5 rounded bg-gray-4" />
            </div>
            <span className="size-8 rounded-md border bg-gray-2 p-2">
              <span className="block size-full rounded-sm bg-gray-4" />
            </span>
          </div>
          <ProgressiveRows run={run} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function renderDemo() {
  return <ProgressiveRenderStage />;
}

export function ProgressiveRenderDemo() {
  return (
    <PostDemo
      initialOptions={null}
      caption="Rows render in small batches, then the sequence repeats."
    >
      {renderDemo}
    </PostDemo>
  );
}
