import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn, getAvatarColour, getInitialsFromFullName } from "@/lib/utils";

const AVATAR_SIZES = {
  sm: "sm",
  xs: "xs",
  md: "md",
  lg: "lg",
} as const;

type AvatarSizes = (typeof AVATAR_SIZES)[keyof typeof AVATAR_SIZES];

export type AvatarProps = {
  fallback: string;
  size?: AvatarSizes;
  src?: string;
};

export const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & AvatarProps
>(({ className, src, fallback, size = "sm", ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex shrink-0  rounded-full",
      size === AVATAR_SIZES.xs && "size-5 text-[10px]",
      size === AVATAR_SIZES.sm && "size-8",
      size === AVATAR_SIZES.md && "size-10",
      size === AVATAR_SIZES.lg && "size-12",
      className,
    )}
    data-testid="user-avatar"
    {...props}
  >
    <AvatarImage src={src} alt={fallback} className="rounded-full" />
    <AvatarPrimitive.Fallback
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-background font-medium text-sm uppercase",
        size === AVATAR_SIZES.xs && "text-[10px]",
        getAvatarColour(fallback),
      )}
    >
      {getInitialsFromFullName(fallback)}
    </AvatarPrimitive.Fallback>
  </AvatarPrimitive.Root>
));

Avatar.displayName = "Avatar";

const AvatarBadge = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    role?: string;
  }
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute bottom-0 right-0 text-xs bg-background border-background border-2 rounded-full flex items-center px-1",
        className,
      )}
      {...props}
    >
      <span className="text-[10px] font-medium">{children}</span>
    </div>
  );
});
AvatarBadge.displayName = "AvatarBadge";
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    loading="lazy"
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-gray-200",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
