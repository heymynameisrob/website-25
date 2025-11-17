import * as React from "react";
import { useMeasure } from "@uidotdev/usehooks";
import { motion, useInView } from "motion/react";

import { Skeleton } from "@/components/primitives/Skeleton";
import { Button } from "@/components/primitives/Button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useHotkeys } from "react-hotkeys-hook";

export function ResponsiveContainer() {
  const [index, setIndex] = React.useState<number>(0);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef);
  const [ref, bounds] = useMeasure();

  const handleNext = () => {
    setIndex((prev) => (prev === 2 ? 2 : prev + 1));
  };
  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? 0 : prev - 1));
  };

  useHotkeys(
    "ArrowRight",
    () => {
      handleNext();
    },
    {
      preventDefault: true,
      enabled: isInView,
    },
  );

  useHotkeys(
    "ArrowLeft",
    () => {
      handlePrev();
    },
    {
      preventDefault: true,
      enabled: isInView,
    },
  );

  const content = React.useMemo(() => {
    switch (index) {
      case 0:
        return (
          <ViewContainer>
            <span className="text-lg font-semibold">Step 1</span>
            <ViewSkeleton count={4} />
          </ViewContainer>
        );
      case 1:
        return (
          <ViewContainer>
            <span className="text-lg font-semibold">Step 2</span>
            <ViewSkeleton count={16} />
          </ViewContainer>
        );
      case 2:
        return (
          <ViewContainer>
            <span className="text-lg font-semibold">Step 3</span>
            <ViewSkeleton count={8} />
          </ViewContainer>
        );
    }
  }, [index]);

  return (
    <div ref={containerRef}>
      <motion.div
        animate={{ height: bounds.height ?? 0 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0 }}
        className="rounded-md overflow-hidden bg-background shadow-floating max-w-md mx-auto"
      >
        <div ref={ref} className="flex flex-col gap-3 p-3">
          {content}
          <footer className="flex items-center justify-between gap-2">
            <Button
              size="icon"
              className="rounded-full"
              disabled={index === 0}
              onClick={handlePrev}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <Button
              size="icon"
              className="rounded-full"
              disabled={index === 2}
              onClick={handleNext}
            >
              <ArrowRight className="size-4" />
            </Button>
          </footer>
        </div>
      </motion.div>
    </div>
  );
}

function ViewContainer({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-3">{children}</div>;
}

function ViewSkeleton({ count }: { count: number }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <>
          <Skeleton className="w-24 h-3.5" />
          <Skeleton className="w-8 h-3.5" />
          <Skeleton className="w-16 h-3.5" />
          <Skeleton className="w-12 h-3.5" />
        </>
      ))}
    </div>
  );
}
