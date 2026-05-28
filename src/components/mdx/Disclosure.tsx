import type { ReactNode } from "react";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/HoverCard";
import { cn } from "@/lib/utils";

interface DisclosureProps {
  label: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function Disclosure({ label, children, className, contentClassName }: DisclosureProps) {
  return (
    <HoverCard openDelay={300} closeDelay={0}>
      <HoverCardTrigger asChild>
        <span
          className={cn(
            "inline cursor-help decoration-accent decoration-dashed underline underline-offset-3 transition-colors hover:text-primary",
            className
          )}
          tabIndex={0}
        >
          {label}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className={cn("max-w-xs text-sm p-0 w-96", contentClassName)}>
        {children}
      </HoverCardContent>
    </HoverCard>
  );
}
