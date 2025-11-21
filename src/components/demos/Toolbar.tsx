import { Checkbox } from "@/components/demos/motion/Checkbox";
import { Button } from "@/components/primitives/Button";
import {
  ArrowTurnUpLeftIcon,
  ArrowUturnLeftIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/16/solid";
import { useMeasure } from "@uidotdev/usehooks";
import { Loader2, SaveIcon, UndoIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

export function Toolbar() {
  const [state, setState] = React.useState<"idle" | "success" | "loading">(
    "idle",
  );
  const [ref, bounds] = useMeasure();

  console.log("Render");

  const content = React.useMemo(() => {
    switch (state) {
      case "idle":
        return <Tools onSave={() => setState("loading")} />;
      case "loading":
        return (
          <Saving
            onComplete={() => setState("success")}
            onUndo={() => setState("idle")}
          />
        );
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
      className=" bg-black text-white rounded-full shadow-floating"
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

function Saving({
  onComplete,
  onUndo,
}: {
  onComplete: () => void;
  onUndo: () => void;
}) {
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onComplete();
    }, 2_000);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
      }}
      className="flex items-center justify-between gap-2 w-full"
    >
      <div className="flex items-center gap-2 pl-3 overflow-x-hidden min-w-32">
        <Loader2 className="size-5 animate-spin" />
        <span className="shrink-0 font-medium text-white">Saving...</span>
        <Button
          size="icon"
          variant="ghost"
          className="ml-auto size-8 shrink-0 gap-1.5 hover:bg-white/10 rounded-full text-secondary"
          onClick={onUndo}
        >
          <XMarkIcon className="size-4 opacity-70" />
        </Button>
      </div>
    </motion.div>
  );
}

function Success({ onUndo }: { onUndo: () => void }) {
  const [checked, setChecked] = React.useState(false);
  React.useEffect(() => {
    const check = setTimeout(() => {
      setChecked(true);
    }, 250);

    return () => clearTimeout(check);
  }, [onUndo]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onUndo();
    }, 4_000);

    return () => clearTimeout(timeout);
  }, [onUndo]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
      }}
      className="flex items-center justify-between gap-2 w-full px-3"
    >
      <div className="flex items-center gap-2 overflow-x-hidden">
        <Checkbox checked={checked} />
        <span className="shrink-0 font-medium text-white">
          Saved successfully
        </span>
      </div>
    </motion.div>
  );
}

function Tools({ onSave }: { onSave: () => void }) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        className="gap-1.5 hover:bg-white/10 rounded-full focus ring-gray-11"
      >
        <DocumentDuplicateIcon className="size-4" />
        <span>Copy</span>
      </Button>
      <Button
        variant="ghost"
        className="gap-1.5 hover:bg-white/10 rounded-full focus ring-gray-11"
      >
        <ArrowTurnUpLeftIcon className="size-4" />
        <span>Move to...</span>
      </Button>
      <Button
        variant="ghost"
        className="gap-1.5 hover:bg-white/10 rounded-full focus ring-gray-11"
      >
        <UserIcon className="size-4" />
        <span>Assign</span>
      </Button>
      <Button
        rounded-full
        variant="ghost"
        className="gap-1.5 hover:bg-white/10 rounded-full focus ring-gray-11"
        onClick={onSave}
      >
        <SaveIcon className="size-4" />
        <span>Save</span>
      </Button>
    </div>
  );
}
