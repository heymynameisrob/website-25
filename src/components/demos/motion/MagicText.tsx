import { AnimatePresence, motion } from "motion/react";

export function MagicText({ title }: { title: string }) {
  const words = title.split(" ");
  return (
    <div className="text-xl font-semibold xl:text-3xl">
      <span className="sr-only">{title}</span>
      <div className="inline-flex flex-wrap gap-1 text-primary">
        {words.map((w, i) => (
          <motion.span
            key={i}
            initial={{ y: 16, originY: 0.2, filter: "blur(4px)", opacity: 0 }}
            animate={{ y: 0, originY: 0.2, filter: "blur(0px)", opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 30,
              delay: i * 0.05,
            }}
          >
            {w}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
