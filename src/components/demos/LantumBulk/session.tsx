import { cn } from "@/lib/utils";
import type { SessionProps } from "./types";

export const Session = ({ onClick, selected, children }: SessionProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col p-1 text-left rounded-sm bg-teal-400 text-teal-950 h-10 w-full text-sm outline-hidden",
        selected && "ring-2 ring-offset-2 ring-offset-background ring-cyan-500",
      )}
    >
      {children}
    </button>
  );
};
