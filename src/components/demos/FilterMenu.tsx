import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";
import { matchSorter } from "match-sorter";
import { useDebounce } from "@uidotdev/usehooks";

const FilterMenuContext = React.createContext<any>(null);
function useFilterMenu() {
  const ctx = React.useContext(FilterMenuContext);
  if (ctx === null) {
    throw Error("FilterMenu Context must be not be null");
  }
  return ctx;
}

const USERS = [
  { value: "dave-hawkins", label: "Dave Hawkins" },
  { value: "rob-hough", label: "Rob Hough" },
  { value: "jon-lay", label: "Jon Lay" },
  { value: "tim-bates", label: "Tim Bates" },
];

export const FilterMenuExample = () => {
  const [selected, setSelected] = React.useState("");

  return (
    <FilterMenu value={selected} onValueChange={setSelected}>
      <FilterMenuTrigger className="px-2 w-[160px] inline-flex items-center justify-between h-9 gap-2 bg-gray-1 border transition-all whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0 [&_svg]:opacity-80 text-primary hover:bg-gray-2 active:bg-gray-2 data[state=open]:bg-gray-2 data-[state=open]:bg-gray-2">
        <div className="flex items-center gap-2">
          {selected.length > 0 ? (
            <div className="w-4 h-4 rounded-full bg-cyan-500" />
          ) : null}
          {USERS.find((user) => user.value === selected)?.label ??
            "Select a user"}
        </div>
        <ChevronDownIcon className="w-4 h-4 opacity-60" />
      </FilterMenuTrigger>
      <FilterMenuContent align="start" className="w-56">
        <FilterMenuInput />
        <FilterMenuList items={USERS} keys={["label", "role"]}>
          {(item) => (
            <FilterMenuItem value={item.value}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-cyan-500" />
                <span>{item.label}</span>
              </div>
            </FilterMenuItem>
          )}
        </FilterMenuList>
      </FilterMenuContent>
    </FilterMenu>
  );
};

/**
 * FilterMenu
 * A filterable list menu component displayed within a popover.
 * Useful for long lists where only one item can be selected
 */
export const FilterMenu = ({
  children,
  value,
  onValueChange,
  defaultValue = undefined,
  modal = false,
}: {
  children: React.ReactNode;
  value?: string | undefined;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  modal?: boolean;
}) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [_value, _setValue] = React.useState<string | undefined>(defaultValue);
  const [query, setQuery] = React.useState<string>("");
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);

  const values = {
    query,
    setQuery,
    open,
    setOpen,
    value: value ?? _value,
    setValue: onValueChange ?? _setValue,
    selectedIndex,
    setSelectedIndex,
  };

  return (
    <FilterMenuContext.Provider value={values}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen} modal={modal}>
        {children}
      </PopoverPrimitive.Root>
    </FilterMenuContext.Provider>
  );
};
FilterMenu.displayName = "FilterMenu";

/**
 * FilterMenuTrigger
 * A wrapper around PopoverTrigger
 */
export const FilterMenuTrigger = PopoverPrimitive.Trigger;
FilterMenuTrigger.displayName = "FilterMenuTrigger";

export const FilterMenuPortal = PopoverPrimitive.Portal;
FilterMenuPortal.displayName = "FilterMenuPortal";

/**
 * FilterMenuContent
 * A wrapper around PopoverContent
 */
export const FilterMenuContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Content
    ref={ref}
    align={align}
    sideOffset={sideOffset}
    className={cn(
      "z-50 w-72 rounded-lg border overflow-hidden bg-background p-0 text-secondary shadow-md outline-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
));
FilterMenuContent.displayName = "FilterMenuContent";

interface FilterMenuListProps<T extends { value: string }> {
  items: T[];
  children: (item: T) => React.ReactElement;
  loop?: boolean;
  className?: string;
  keys?: string[];
}
interface ItemElementProps {
  id: string;
  key: string;
  ref: (el: HTMLElement | null) => void;
  "aria-selected": boolean;
  onMouseMove: () => void;
}

/**
 * FilterMenuList
 * Pass items into here so you can access them as children
 * Items MUST have a "value" that is a unique identifier that is used to control the selected item
 * Handles key navigation and filtering by default
 * Pass optional keys to search for
 */
export const FilterMenuList = React.forwardRef<
  HTMLDivElement,
  FilterMenuListProps<any>
>(
  <T extends { value: string }>(
    {
      items,
      children,
      loop = false,
      keys = ["value"],
      className,
    }: FilterMenuListProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const {
      query,
      value: currentValue,
      setValue,
      selectedIndex,
      setSelectedIndex,
      setOpen,
    } = useFilterMenu();

    const itemsRef = React.useRef<(HTMLElement | null)[]>([]);

    const debouncedQuery = useDebounce(query, 80);

    const matches = React.useMemo(() => {
      const sortedItems = items.sort((a, b) => {
        if (a.value === currentValue) return -1;
        if (b.value === currentValue) return 1;
        return 0;
      });

      if (debouncedQuery.length === 0) return sortedItems;
      return matchSorter(sortedItems, debouncedQuery, { keys });
    }, [keys, currentValue, debouncedQuery, items]);

    const handleKeyDown = React.useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (e.metaKey) {
            setSelectedIndex(items.length - 1);
          } else {
            setSelectedIndex((prev: number) => {
              if (prev >= items.length - 1) {
                return loop ? 0 : prev;
              }
              return prev + 1;
            });
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          if (e.metaKey) {
            setSelectedIndex(0);
          } else {
            setSelectedIndex((prev: number) => {
              if (prev <= 0) {
                return loop ? items.length - 1 : prev;
              }
              return prev - 1;
            });
          }
        } else if (e.key === "Enter") {
          if (
            itemsRef.current !== null &&
            itemsRef.current[selectedIndex] !== null
          ) {
            const selectedItem = itemsRef.current[selectedIndex];
            if (selectedItem !== null) {
              setValue(selectedItem.id);
            }
            setOpen(false);
          }
        }
      },
      [
        itemsRef,
        selectedIndex,
        items.length,
        loop,
        setOpen,
        setSelectedIndex,
        setValue,
      ],
    );

    React.useEffect(() => {
      setSelectedIndex(0);
    }, [query, setSelectedIndex]);

    React.useEffect(() => {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // NOTE (@heymynameisrob): Keep an eye on this, sometimes it bugs out.
    React.useEffect(() => {
      if (
        itemsRef.current !== null &&
        itemsRef.current[selectedIndex] !== null
      ) {
        itemsRef.current[selectedIndex]?.scrollIntoView({
          block: "nearest",
        });
      }
    }, [selectedIndex]);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-px max-h-[300px] p-1 overflow-y-scroll scroll-my-2 scrollbar-hide animate-in duration-200 ease-out",
          className,
        )}
      >
        {matches.map((item, index) =>
          React.cloneElement(children(item), {
            id: item.value,
            key: item.value,
            ref: (el: HTMLElement | null) => (itemsRef.current[index] = el),
            "aria-selected": index === selectedIndex,
            onMouseMove: () =>
              index !== selectedIndex && setSelectedIndex(index),
          } as ItemElementProps),
        )}
      </div>
    );
  },
);

FilterMenuList.displayName = "FilterMenuList";

/**
 * FilterMenuInput
 * Wrapper around <input /> that debounces input value
 */
export const FilterMenuInput = React.forwardRef<
  HTMLInputElement,
  { className?: string }
>(({ className, ...props }, ref) => {
  const { setQuery, query } = useFilterMenu();

  return (
    <div
      ref={ref}
      className={cn(
        "relative z-10 flex items-center gap-2 px-3 h-9 bg-gray-1 border-b border-gray-3 rounded-t-md caret-blue-600",
        "dark:bg-gray-1",
        className,
      )}
    >
      <MagnifyingGlassIcon className="shrink-0 w-4 h-4 opacity-50 pointer-events-none" />
      <input
        type="search"
        autoFocus
        autoComplete="off"
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-9 text-sm px-0 border-none outline-hidden bg-transparent focus:outline-hidden focus:border-none focus:ring-0"
        {...props}
      />
    </div>
  );
});

FilterMenuInput.displayName = "FilterMenuInput";

export const FilterMenuItem = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    value: string | undefined;
    onSelect?: () => void;
    className?: string;
  }
>(({ children, value, onSelect, className, ...props }, ref) => {
  const { setOpen, value: currentValue, setValue } = useFilterMenu();

  return (
    <button
      tabIndex={0}
      ref={ref}
      onMouseDown={() => {
        onSelect !== undefined ? onSelect() : setValue(value);
        setOpen(false);
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center transition-all rounded-md py-1.5 pr-7 pl-2 text-sm  font-medium text-secondary outline-hidden aria-selected:bg-gray-2 aria-selected:text-primary data-disabled:pointer-events-none data-disabled:opacity-50",
        "focus-visible:ring-2 focus-visible:ring-ring",
        "dark:hover:bg-gray-3",
        currentValue === value
          ? "aria-selected:bg-gray-3 bg-gray-3 text-primary"
          : null,
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        {currentValue === value ? <CheckIcon className="h-4 w-4" /> : null}
      </span>
      {children}
    </button>
  );
});

FilterMenuItem.displayName = "FilterMenuItem";
