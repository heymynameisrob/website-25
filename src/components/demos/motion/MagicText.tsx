import * as React from "react";
import { motion } from "motion/react";

export function MagicText({ title }: { title: string }) {
  const words = title.split(" ");
  const [key, setKey] = React.useState(0);

  const handleAnimationComplete = (i: number) => {
    // Only trigger re-render when the last word completes
    if (i === words.length - 1) {
      setTimeout(() => {
        setKey((prev) => prev + 1);
      }, 1000);
    }
  };

  return (
    <div className="text-xl font-semibold lg:text-4xl">
      <span className="sr-only">{title}</span>
      <div className="inline-flex flex-wrap gap-1 text-primary">
        {words.map((w, i) => (
          <motion.span
            key={`${i}-${key}`}
            initial={{ y: 16, originY: 0.2, filter: "blur(4px)", opacity: 0 }}
            animate={{ y: 0, originY: 0.2, filter: "blur(0px)", opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 30,
              delay: i * 0.05,
            }}
            onAnimationComplete={() => handleAnimationComplete(i)}
          >
            {w}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
