import * as React from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, type Transition } from "framer-motion";

const ANIMATE_WHILE_DRAG_SETTNGS = {
  cursor: "grabbing",
  scale: 0.9,
  opacity: 0.8,
  rotate: "-3deg",
}

const ANIMATE_SPRING_SETTINGS: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 15
}

export function DragStack() {
  const [stack, setStack] = React.useState(["bg-red-500", "bg-blue-500"]);

  function handleDragEnd() {
    setStack((prev) => {
      const next = [...prev];
      const top = next.pop()!;
      next.unshift(top);
      return next;
    });
  }

  return (
    <div className="relative isolate pb-[50%] px-[20%]">
      <AnimatePresence mode="popLayout" initial={false}>
        {stack.map((color, index) => {
          const isTop = index === stack.length - 1;

          return (
            <motion.div
              key={color}
              animate={{ scale: isTop ? 1 : 0.95, x: isTop ? 0 : 8, y: isTop ? 0 : 8, rotate: isTop ? "-2deg" : "4deg" }}
              transition={ANIMATE_SPRING_SETTINGS}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: -100, right: -100 }}
              dragTransition={ANIMATE_SPRING_SETTINGS}
              dragElastic={0.3}
              dragSnapToOrigin
              className={cn("absolute inset-0 w-64 aspect-square", color)}
              style={{ zIndex: index }}
              whileDrag={ANIMATE_WHILE_DRAG_SETTNGS}
              onDragEnd={handleDragEnd}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
