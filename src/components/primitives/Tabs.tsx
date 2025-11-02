import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("flex items-center gap-2 text-primary", className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium text-secondary rounded-md cursor-default transition-all focus disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "border border-transparent rounded-md hover:bg-gray-3 data-[state=active]:bg-gray-3 data-[state=active]:text-primary data-[state=active]:shadow-xs data-[state=active]:border-inherit",
        underlined:
          "bg-transparent hover:border-gray-300 border-b-2 border-transparent data-[state=active]:text-primary data-[state=active]:border-primary rounded-none data-[state=active]:bg-transparent",
      },
      size: {
        md: "px-3 py-1.5 h-9",
        sm: "px-2 py-1 h-7",
        lg: "px-4 py-2 text-base h-10",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    variant?: "default" | "underlined";
    size?: "md" | "sm" | "lg";
  }
>(({ className, variant = "default", size = "md", ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size }), className)}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "rounded-lg transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
