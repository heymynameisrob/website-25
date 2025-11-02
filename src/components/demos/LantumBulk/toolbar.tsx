import { motion, AnimatePresence } from "motion/react";
import { useMeasure } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/primitives/Button";
import type { ToolbarProps } from "./types";
import { ToolbarMenu } from "./ToolbarMenu";
import { CheckCircleIcon } from "./icons";

export const Toolbar = ({
  isSelecting,
  isToast,
  onRemove,
  onUndo,
  onClose,
}: ToolbarProps) => {
  const [ref, bounds] = useMeasure();

  return (
    <AnimatePresence>
      {isSelecting ? (
        <motion.div
          key="toolbar"
          initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
          animate={{
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
          }}
          exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.2, bounce: 0, type: "spring" }}
          className="absolute left-0 right-0 bottom-4 grid place-items-center pointer-events-none"
        >
          <div
            className={cn(
              "bg-black rounded-xl border shadow-floating text-white max-w-4xl",
            )}
          >
            <motion.div
              animate={{
                width: isToast ? 240 : 420,
                height: bounds.height as number,
              }}
            >
              <div
                ref={ref}
                className="p-1 flex justify-between items-stretch gap-px w-full pointer-events-auto max-w-[420px]"
              >
                {isToast ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                    }}
                    className="flex items-center justify-between gap-2 w-full p-1 pr-2"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon />
                      <small className="shrink-0 font-medium text-white">
                        Sessions removed
                      </small>
                    </div>
                    <Button
                      onClick={onUndo}
                      size="sm"
                      className="h-6 text-xs! rounded-sm bg-white/10"
                      variant="secondary"
                    >
                      Undo
                    </Button>
                  </motion.div>
                ) : (
                  <ToolbarMenu onClose={onClose} onRemove={onRemove} />
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
