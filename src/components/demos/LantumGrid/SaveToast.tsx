import { AnimatePresence, motion } from "motion/react";
import { Loader2 } from "lucide-react";
import type { SaveToastProps } from "./types";

export const SaveToast = ({ showToast, saving }: SaveToastProps) => {
  return (
    <AnimatePresence>
      {showToast ? (
        <motion.div
          key="toast"
          initial={{ y: 10, opacity: 0, filter: "blur(2px)" }}
          animate={{
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
          }}
          exit={{ y: 10, opacity: 0, filter: "blur(2px)" }}
          transition={{ duration: 0.3, bounce: 0, type: "spring" }}
          className="absolute bottom-4 right-4 bg-black text-white p-2 shadow-xl rounded-md flex items-center gap-1"
        >
          <motion.div
            transition={{
              type: "spring",
              duration: 0.2,
              bounce: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key={String(saving)}
            className="flex items-center gap-1"
          >
            {saving ? (
              <>
                <Loader2
                  className="animate-spin"
                  size={14}
                  color="rgba(255, 255, 255, 0.65)"
                />
                <small className="text-xs font-medium">Saving...</small>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-3"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <small className="text-xs font-medium">Saved!</small>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
