import { useDraggable } from "@dnd-kit/core";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { DraggableProps } from "./types";

export const Draggable = (props: DraggableProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    data: {
      supports: props.data,
    },
  });

  return (
    <motion.button
      ref={setNodeRef}
      className={cn(
        "flex flex-col text-left p-1 rounded-sm h-10 w-full text-sm bg-teal-400 text-teal-950 shadow-none rotate-0 hover:cursor-grab active:cursor-grabbing",
        props.disabled && "pointer-events-none",
      )}
      layout="position"
      animate={
        transform
          ? {
              x: transform.x,
              y: transform.y,
              scale: props.isDragging ? 0.96 : 1,
              zIndex: props.isDragging ? 1 : 0,
              rotate: transform.x > 0 ? 5 : transform.x < 0 ? -5 : 0,
            }
          : {
              x: 0,
              y: 0,
              scale: 1,
            }
      }
      transition={{
        duration: !props.isDragging ? 0.2 : 0,
        ease: "easeOut",
        zIndex: {
          delay: props.isDragging ? 0 : 0.25,
        },
      }}
      {...listeners}
      {...attributes}
    >
      {props.children}
    </motion.button>
  );
};
