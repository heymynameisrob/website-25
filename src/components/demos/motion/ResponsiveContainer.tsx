import * as React from "react";
import { useMeasure } from "@uidotdev/usehooks";
import { AnimatePresence, motion, MotionConfig } from "motion/react";

import { Skeleton } from "@/components/primitives/Skeleton";
import { Button } from "@/components/primitives/Button";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getDeterministicWidth } from "@/components/demos/ArtificialInbox/Skeletons";

type ViewState = "default" | "confirm-discard" | "success";

export function ResponsiveContainer() {
  const [state, setState] = React.useState<ViewState>("default");
  const [ref, bounds] = useMeasure();

  const handleSave = () => {
    setState("success");
    setTimeout(() => {
      setState("default");
    }, 5000);
  };

  const handleDiscard = () => {
    setState("confirm-discard");
  };

  const handleConfirmDiscard = () => {
    setState("default");
  };

  const handleCancelDiscard = () => {
    setState("default");
  };

  const content = React.useMemo(() => {
    switch (state) {
      case "default":
        return (
          <ViewContainer>
            <span className="text-lg font-semibold">My Document</span>
            <ViewSkeleton count={8} />
          </ViewContainer>
        );
      case "confirm-discard":
        return (
          <ViewContainer>
            <span className="text-lg font-semibold">Discard changes?</span>
            <p className="text-sm text-gray-11">
              This action cannot be undone. All unsaved changes will be lost.
            </p>
          </ViewContainer>
        );
      case "success":
        return (
          <ViewContainer className="justify-center items-center text-center py-8">
            <div className="size-10 grid rounded-full place-items-center bg-green-200 text-green-900 dark:bg-green-500/20 dark:text-white">
              <CheckIcon className="size-6" />
            </div>
            <span className="text-lg font-semibold">Saved successfully!</span>
            <p className="text-sm text-gray-11">
              Your changes have been saved.
            </p>
          </ViewContainer>
        );
    }
  }, [state]);

  return (
    <MotionConfig transition={{ duration: 0.5, type: "spring", bounce: 0 }}>
      <motion.div
        animate={{ height: bounds.height ?? 0 }}
        className="rounded-xl overflow-hidden bg-background shadow-floating w-96 mx-auto"
      >
        <div ref={ref} className="overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              className="flex flex-col gap-4 p-4"
              key={state}
              initial={{ y: 10, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -10, opacity: 0, filter: "blur(4px)" }}
            >
              {content}
              <footer className="flex items-center justify-between gap-2">
                {state === "default" && (
                  <>
                    <Button size="sm" variant="ghost" onClick={handleDiscard}>
                      Discard
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      Save
                    </Button>
                  </>
                )}
                {state === "confirm-discard" && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelDiscard}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleConfirmDiscard}
                    >
                      Discard
                    </Button>
                  </>
                )}
              </footer>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </MotionConfig>
  );
}

function ViewContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex flex-col gap-3", className)}>{children}</div>;
}

function ViewSkeleton({ count }: { count: number }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 w-full">
      {Array.from({ length: count }).map((_, i) => {
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
  );
}
