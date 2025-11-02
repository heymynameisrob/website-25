import * as React from "react";
import { ChevronRightIcon } from "@heroicons/react/16/solid";

import { cn } from "@/lib/utils";

interface ListProps extends React.HTMLAttributes<HTMLElement> {}

const List = React.forwardRef<HTMLElement, ListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn("flex flex-col gap-px p-3", className)}
        {...props}
      >
        {children}
      </section>
    );
  },
);
List.displayName = "List";

interface ListItemProps extends React.HTMLAttributes<HTMLElement> {
  onClick?: () => void;
}

const ListItem = React.forwardRef<HTMLElement, ListItemProps>(
  ({ className, children, onClick, ...props }, ref) => {
    if (onClick) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          onClick={onClick}
          className={cn(
            "flex items-center px-2 -mx-1 rounded-md bg-transparent h-8 hover:bg-gray-3 focus-visible:ring-2 focus",
            className,
          )}
          {...props}
        >
          {children}
        </button>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        tabIndex={0}
        className={cn(
          "flex items-center px-2 -mx-1 rounded-md bg-transparent h-8 hover:bg-gray-3 focus-visible:ring-2 focus select-none",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
ListItem.displayName = "ListItem";

interface ListItemChevronProps extends React.HTMLAttributes<HTMLOrSVGElement> {}

const ListItemChevron = React.forwardRef<SVGSVGElement, ListItemChevronProps>(
  ({ className, ...props }, ref) => {
    return (
      <ChevronRightIcon
        ref={ref}
        className={cn("size-4 opacity-50 ml-auto", className)}
        {...props}
      />
    );
  },
);
ListItemChevron.displayName = "ListItemChevron";

interface ListItemContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const ListItemContainer = React.forwardRef<
  HTMLDivElement,
  ListItemContainerProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});
ListItemContainer.displayName = "ListItemContainer";

interface ListItemIconProps extends React.HTMLAttributes<HTMLSpanElement> {}

const ListItemIcon = React.forwardRef<HTMLSpanElement, ListItemIconProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "size-5 grid place-items-center [&_svg]:size-4 [&_svg]:opacity-70",
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);
ListItemIcon.displayName = "ListItemIcon";

interface ListItemTitleProps extends React.HTMLAttributes<HTMLSpanElement> {}

const ListItemTitle = React.forwardRef<HTMLSpanElement, ListItemTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("text-sm font-medium text-primary", className)}
        {...props}
      >
        {children}
      </span>
    );
  },
);
ListItemTitle.displayName = "ListItemTitle";

export {
  List,
  ListItem,
  ListItemChevron,
  ListItemContainer,
  ListItemIcon,
  ListItemTitle,
};
