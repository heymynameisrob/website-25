import { cn } from "@/lib/utils";

const DEFAULT_GRADIENT_COLORS = ["--color-gray-9", "--color-gray-7"] as const;

type GradientColors = readonly [`--${string}`, `--${string}`?];

export type TextShimmerProps = {
  as?: string;
  duration?: number;
  spread?: number;
  gradientColors?: GradientColors;
  children: React.ReactNode;
  disabled?: boolean;
} & React.HTMLAttributes<HTMLElement>;

export function TextShimmer({
  as = "span",
  className,
  duration = 1.5,
  spread = 60,
  gradientColors = DEFAULT_GRADIENT_COLORS,
  children,
  disabled = false,
  ...props
}: TextShimmerProps) {
  const dynamicSpread = Math.min(Math.max(spread, 5), 45);
  const Component = as as React.ElementType;
  const [outerColor, innerColor = DEFAULT_GRADIENT_COLORS[1]] = gradientColors;

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
          : `linear-gradient(to right, var(${outerColor}) ${50 - dynamicSpread}%, var(${innerColor}) 50%, var(${outerColor}) ${50 + dynamicSpread}%)`,
        animationDuration: `${duration}s`,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
