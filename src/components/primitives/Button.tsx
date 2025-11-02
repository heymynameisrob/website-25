import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Tooltip } from "@/components/primitives/Tooltip";

const buttonVariants = cva(
  "inline-flex items-center whitespace-nowrap border justify-center rounded-lg text-sm leading-4 font-medium transition-colors outline-hidden focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-background shadow-xs hover:opacity-90",
        accent:
          "bg-accent text-white border border-accent shadow-xs hover:opacity-90",
        destructive: "bg-red-600 shadow-xs text-white hover:bg-destructive/90",
        secondary:
          "bg-background text-primary hover:bg-gray-2 dark:bg-gray-3 dark:hover:bg-gray-4",
        ghost: "border-transparent hover:bg-gray-3",
        link: "underline-offset-4 hover:underline text-accent",
      },
      size: {
        default: "h-10 py-2 px-4",
        xs: "h-6 px-2 rounded-md",
        sm: "h-8 px-3 rounded-md",
        lg: "h-12 text-base rounded-xl px-8",
        icon: "size-6 rounded-md p-px!",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, title, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    if (title) {
      return (
        <Tooltip content={title}>
          <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
          />
        </Tooltip>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
