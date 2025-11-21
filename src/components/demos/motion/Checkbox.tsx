import * as React from "react";
import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function Checkbox({ checked, onCheckedChange, className }: CheckboxProps) {
  return (
    <div
      className={cn(
        "relative pointer-events-none w-5 h-5 rounded-lg transition-all duration-300 shrink-0",
        checked
          ? "bg-accent shadow-[inset_0_0_0_2px_var(--accent)] delay-[400ms]"
          : "shadow-[inset_0_0_0_2px_var(--border)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 21 21"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          "absolute inset-0 w-full h-full fill-none",
          checked && "animate-[checkboxFill_600ms_ease_forwards_300ms]",
        )}
        style={{
          strokeDasharray: checked ? "16 86.12" : "86.12",
          strokeDashoffset: checked ? "102.22" : "86.12",
          transition: "stroke-dasharray 600ms, stroke-dashoffset 600ms",
          stroke: "var(--accent)",
        }}
      >
        <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L7,1 C4,1 1,4 1,7 L1,14 C1,17 4,20 7,20 L14,20 C17,20 20,17 20,14 L20,7.99769186" />
      </svg>
    </div>
  );
}
