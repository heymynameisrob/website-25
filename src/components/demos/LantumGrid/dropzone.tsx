import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import type { DropzoneProps } from "./types";

export const Dropzone = (props: DropzoneProps) => {
  const { isOver, setNodeRef, active } = useDroppable({
    id: props.id,
    data: {
      type: props.data,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-[90px] border-l border-r-0 p-2",
        isOver
          ? "bg-cyan-50 border-cyan-500 border-dashed border-2 border-r-2 dark:bg-cyan-500/10"
          : "bg-background",
        isOver &&
          active &&
          active.data.current &&
          !active.data.current.supports.includes(props.data) &&
          "bg-red-50 border-red-500 border-2 border-r-2 dark:bg-red-500/10",
      )}
    >
      {props.children}
    </div>
  );
};
