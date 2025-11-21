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
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={sideOffset}
            {...props}
            className={cn(
              "flex items-center z-50 overflow-hidden rounded-lg bg-black text-white px-1.5 py-1 h-7 text-xs font-medium tracking-tight shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "dark:bg-gray-2",
              className,
            )}
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
