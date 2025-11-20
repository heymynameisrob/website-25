import { Button } from "@/components/primitives/Button";
import {
  ArrowTurnUpLeftIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import { useMeasure } from "@uidotdev/usehooks";
import { UndoIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

export function Toolbar() {
  const [state, setState] = React.useState<"idle" | "success">("idle");
  const [ref, bounds] = useMeasure();

  console.log("Render");

  const content = React.useMemo(() => {
    switch (state) {
      case "idle":
        return <Tools onDelete={() => setState("success")} />;
      case "success":
        return <Success onUndo={() => setState("idle")} />;
    }
  }, [state]);

  return (
    <motion.div
      animate={{
        width: bounds.width || "auto",
      }}
      transition={{
        type: "spring",
        stiffness: 550,
        damping: 45,
        mass: 0.7,
      }}
      className="dark bg-black text-white rounded-full shadow-floating"
    >
      <div
        ref={ref}
        className="flex items-center justify-between gap-2 px-1.5 py-2 h-12"
        style={{ width: "max-content" }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={state}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {content}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Success({ onUndo }: { onUndo: () => void }) {
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onUndo();
    }, 5000);

    return () => clearTimeout(timeout);
  }, [onUndo]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
      }}
      className="flex items-center justify-between gap-2 w-full"
    >
      <div className="flex items-center gap-2 pl-3">
        <CheckCircleIcon className="shrink-0 size-4 opacity-70" />
        <span className="shrink-0 font-medium text-white">
          Document deleted
        </span>
      </div>
      <Button
        variant="ghost"
        className="gap-1.5 hover:bg-white/10 rounded-full"
        onClick={onUndo}
      >
        <span>Undo</span>
      </Button>
    </motion.div>
  );
}

function Tools({ onDelete }: { onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <Button
        rounded-full
        variant="ghost"
        className="gap-1.5 hover:bg-white/10 rounded-full text-red-400"
        onClick={onDelete}
      >
        <TrashIcon className="size-4" />
        <span>Delete</span>
      </Button>
      <Button
        variant="ghost"
        className="gap-1.5 hover:bg-white/10 rounded-full"
      >
        <DocumentDuplicateIcon className="size-4" />
        <span>Copy</span>
      </Button>
      <Button
        variant="ghost"
        className="gap-1.5 hover:bg-white/10 rounded-full"
      >
        <ArrowTurnUpLeftIcon className="size-4" />
        <span>Move to...</span>
      </Button>
      <Button
        variant="ghost"
        className="gap-1.5 hover:bg-white/10 rounded-full"
      >
        <UserIcon className="size-4" />
        <span>Assign</span>
      </Button>
    </div>
  );
}
