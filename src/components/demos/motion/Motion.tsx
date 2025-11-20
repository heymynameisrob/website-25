import { motion } from "motion/react";
import React from "react";

export function Motion() {
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      animate={{
        borderRadius: active ? "20px" : "9999999999px",
        rotate: active ? 90 : 0,
        scale: active ? 1 : 0.8,
      }}
      className="aspect-square bg-accent w-full max-w-sm mx-auto"
      transition={{
        scale: {
          type: "spring",
          stiffness: 128,
          damping: 15,
          mass: 1.5,
          delay: 0.25,
        },
        borderRadius: {
          type: "spring",
          stiffness: 128,
          damping: 15,
          delay: 0.4,
        },
        rotate: {
          type: "spring",
          stiffness: 128,
          damping: 15,
          mass: 1.5,
          delay: 0.5,
        },
      }}
    />
  );
}
