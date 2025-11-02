import * as React from "react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";

import { cn } from "@/lib/utils";

function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <div
      className="group/select relative w-fit has-[select:disabled]:opacity-50"
      data-slot="select-wrapper"
    >
      <select
        data-slot="select"
        className={cn(
          "bg-background shadow-container placeholder:text-gray-10 selection:bg-gray-3 selection:text-primary h-9 w-full min-w-0 appearance-none rounded-md px-3 py-2 pr-9 text-sm transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed",
          "group-hover/select:bg-gray-2",
          "dark:bg-gray-2 dark:group-hover/select:bg-gray-3",
          "focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-2",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      />
      <ChevronDownIcon
        className="text-gray-10 pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 opacity-50 select-none"
        aria-hidden="true"
        data-slot="select-icon"
      />
    </div>
  );
}

function SelectOption({ ...props }: React.ComponentProps<"option">) {
  return <option data-slot="select-option" {...props} />;
}

function SelectOptGroup({
  className,
  ...props
}: React.ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="select-optgroup"
      className={cn(className)}
      {...props}
    />
  );
}

export { Select, SelectOptGroup, SelectOption };
