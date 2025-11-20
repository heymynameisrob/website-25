import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";

export function ClipPathSlider() {
  const constraintsRef = React.useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = React.useState(300);
  const y = useMotionValue(0);

  const clipPath = useTransform(
    y,
    [0, containerHeight],
    ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
  );

  React.useEffect(() => {
    if (constraintsRef.current) {
      const height = constraintsRef.current.offsetHeight;
      setContainerHeight(height);
      y.set(height / 2);
    }
  }, [y]);

  return (
    <div
      ref={constraintsRef}
      className="relative grid [grid-template-areas:'stack'] aspect-video max-w-xl w-full mx-auto rounded-lg border overflow-hidden bg-gray-3"
    >
      <div className="w-full h-full bg-green-500 [grid-area:stack]" />
      <motion.div
        className="w-full h-full bg-red-500 [grid-area:stack]"
        style={{ clipPath }}
      />
      <motion.div
        drag="y"
        dragConstraints={constraintsRef}
        dragElastic={0}
        dragMomentum={false}
        style={{ y }}
        onDoubleClick={() => {
          y.set(containerHeight / 2);
        }}
        className="group absolute inset-x-0 -top-1 h-2 bg-gray-4 cursor-grab active:cursor-grabbing flex items-center justify-center z-10"
      >
        <div className="w-8 h-4 rounded-md bg-gray-4 shadow-raised grid place-items-center text-secondary group-active:scale-[0.96] transition-all ease-out">
          <EllipsisHorizontalIcon className="size-4 opacity-70" />
        </div>
      </motion.div>
    </div>
  );
}
