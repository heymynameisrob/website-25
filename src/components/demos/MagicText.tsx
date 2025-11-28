import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

export function MagicText({
  children = "Hey My Name is Rob",
}: {
  children?: string;
}) {
  const chunks = children.split("");
  const [showFirst, setShowFirst] = React.useState(true);

  const transition = {
    type: "spring",
    stiffness: 250,
    damping: 30,
  } as const;

  // Calculate timing for coordination
  const animateInDuration = chunks.length * 0.06 + 0.5; // Time for all letters to animate in
  const exitDuration = 0.3; // Approximate exit animation time

  React.useEffect(() => {
    const timer = setTimeout(
      () => {
        setShowFirst((prev) => !prev);
      },
      (animateInDuration + exitDuration) * 1000,
    );

    return () => clearTimeout(timer);
  }, [showFirst, animateInDuration, exitDuration]);

  return (
    <div className="w-fit grid-stack" aria-label={children}>
      <div
        className="text-xl lg:text-6xl [&>span]:inline-block -tracking-[1px] text-primary font-bold"
        aria-hidden
      >
        <AnimatePresence>
          {showFirst &&
            chunks.map((letter, index) => {
              const delay = index * 0.06;
              return (
                <motion.span
                  className="inline-block"
                  initial={{
                    y: 16,
                    filter: "blur(4px)",
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    y: 0,
                    filter: "blur(0px)",
                    opacity: 1,
                  }}
                  exit={{
                    y: 16,
                    filter: "blur(4px)",
                    opacity: 0,
                  }}
                  key={`first-${index}`}
                  style={{
                    ...(letter === " " && {
                      display: "inline",
                    }),
                  }}
                  transition={{
                    delay,
                    ...transition,
                  }}
                >
                  {letter}
                </motion.span>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
}
