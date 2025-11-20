import { Avatar } from "@/components/primitives/Avatar";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@heroicons/react/16/solid";
import { Loader2, LoaderIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React from "react";

export function Loader() {
  const [status, setStatus] = React.useState<"running" | "success">("running");

  const content = React.useMemo(() => {
    switch (status) {
      case "success":
        return <CheckIcon className="size-6 text-green-700" />;
      case "running":
        return <LoaderIcon className="size-6 animate-spin text-gray-10" />;
      default:
        return null;
    }
  }, [status]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (status === "running") {
        setStatus("success");
      } else {
        setStatus("running");
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-full p-[2px]">
      {status === "running" && (
        <motion.div
          animate={{
            rotate: 360,
            transition: { duration: 1, ease: "linear", repeat: Infinity },
          }}
          className="absolute -inset-10 bg-[conic-gradient(from_0deg,transparent_0%,var(--color-blue-500)_25%,transparent_35%)]"
        />
      )}
      {status === "success" && (
        <motion.div
          initial={{ opacity: 1, rotate: 0 }}
          animate={{
            opacity: 0,
            rotate: 360,
            transition: { duration: 1, ease: "linear" },
          }}
          className="absolute -inset-10 bg-[conic-gradient(from_0deg,transparent_0%,var(--color-green-500)_25%,transparent_35%)] animate"
        />
      )}

      <div className="z-1 flex items-center justify-center rounded-full bg-gray-2 p-0.5">
        <div
          className={cn(
            "size-[64px] items-center justify-center rounded-full grid place-items-center border-2",
            status === "success"
              ? "bg-green-200 border-green-300"
              : "bg-gray-3 border-gray-4",
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
              transition={{
                type: "spring",
                duration: 0.3,
                bounce: 0,
              }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
