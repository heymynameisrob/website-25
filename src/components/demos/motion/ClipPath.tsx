import * as React from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

import { EllipsisHorizontalIcon } from "@heroicons/react/16/solid";

export function ClipPathSlider() {
  const constraintsRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(300);
  const x = useMotionValue(0);

  const clipPath = useTransform(
    x,
    [0, containerWidth],
    ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"],
  );

  React.useEffect(() => {
    if (constraintsRef.current) {
      const width = constraintsRef.current.offsetWidth;
      setContainerWidth(width);
      x.set(width / 2);
    }
  }, [x]);

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
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0}
        dragMomentum={false}
        style={{ x }}
        onDoubleClick={() => {
          x.set(containerWidth / 2);
        }}
        className="group absolute inset-y-0 w-8 -left-4 cursor-grab active:cursor-grabbing grid-stack z-10"
      >
        <div className="w-2 h-full bg-gray-4 -left-1" />
        <div className="w-8 h-8 rounded-md bg-background shadow-raised grid place-items-center text-secondary group-active:scale-[0.9] transition-all ease-out">
          <EllipsisHorizontalIcon className="size-4 opacity-70 rotate-90" />
        </div>
      </motion.div>
    </div>
  );
}
