import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

import type { PropsWithChildren } from "react";

type TooltipProps = PropsWithChildren<{
  content: string | React.ReactNode;
  side?: "top" | "right" | "bottom" | "left" | undefined;
  sideOffset?: number;
  align?: "center" | "start" | "end" | undefined;
  className?: string;
}>;

export function Tooltip({
  children,
  content,
  side = "top",
  sideOffset = 4,
  align = "center",
  className,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={50}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={sideOffset}
          {...props}
          className={cn(
            "flex items-center z-max overflow-hidden rounded-md bg-background px-1.5 py-1 h-7 text-xs font-medium tracking-tight text-primary border shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            "dark:bg-gray-2",
            className,
          )}
        >
          {content}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
