import { cn } from "@/lib/utils";

export type TextShimmerProps = {
  as?: string;
  duration?: number;
  spread?: number;
  children: React.ReactNode;
  disabled?: boolean;
} & React.HTMLAttributes<HTMLElement>;

export function TextShimmer({
  as = "span",
  className,
  duration = 1.5,
  spread = 60,
  children,
  disabled = false,
  ...props
}: TextShimmerProps) {
  const dynamicSpread = Math.min(Math.max(spread, 5), 45);
  const Component = as as React.ElementType;

  return (
    <Component
      className={cn(
        "bg-size-[200%_auto] bg-clip-text font-medium text-transparent",
        "animate-[shimmer_infinite_linear]",
        className,
        disabled && "animate-none text-gray-9"
      )}
      style={{
        backgroundImage: disabled
          ? "none"
          : `linear-gradient(to right, var(--color-gray-9) ${50 - dynamicSpread}%, var(--color-gray-7) 50%, var(--color-gray-9) ${50 + dynamicSpread}%)`,
        animationDuration: `${duration}s`,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
