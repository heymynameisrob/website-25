import * as React from "react";
import { motion } from "motion/react";

type MotionVariant = "fadeIn" | "fadeInUp" | "scaleIn";

export function useMotionVariants(variant: MotionVariant = "fadeIn") {
  switch (variant) {
    case "fadeIn":
      return {
        initial: { opacity: 0, filter: "blur(3px)" },
        animate: { opacity: 1, filter: "blur(0px)" },
        transition: { duration: 0.4, type: "spring", bounce: 0 },
      };
    case "fadeInUp":
      return {
        initial: { opacity: 0, y: 10, filter: "blur(3px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        transition: { duration: 0.4, type: "spring", bounce: 0 },
      };
    case "scaleIn":
      return {
        initial: { opacity: 0, scale: 0.9, filter: "blur(3px)" },
        animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
        transition: { duration: 0.4, type: "spring", bounce: 0 },
      };
  }
}

export function Motion({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & Omit<React.ComponentProps<typeof motion.div>, "children" | "className">) {
  return (
    <motion.div className={className} {...props}>
      {children}
    </motion.div>
  );
}
