import * as React from "react";
import { motion } from "motion/react";

type MotionComponent = keyof typeof motion;

export function AnimateInUp({
  children,
  className,
  delay,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: MotionComponent;
}) {
  const Component = motion[as] as React.ElementType;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.4,
        type: "spring",
        bounce: 0,
        delay: delay ?? 0,
      }}
    >
      {children}
    </Component>
  );
}

export function AnimateIn({
  children,
  className,
  delay,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: MotionComponent;
}) {
  const Component = motion[as] as React.ElementType;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, filter: "blur(3px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{
        duration: 0.4,
        type: "spring",
        bounce: 0,
        delay: delay ?? 0,
      }}
    >
      {children}
    </Component>
  );
}
