import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";

interface FilterMenuContextValue {
  query: string;
  setQuery: (query: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string | undefined;
  setValue: (value: string) => void;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  listId: string;
}

const FilterMenuContext = React.createContext<FilterMenuContextValue | null>(
  null,
);

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

  const selectedUser = USERS.find((user) => user.value === selected);

  return (
    <FilterMenu value={selected} onValueChange={setSelected}>
      <FilterMenuTrigger className="px-2 w-[160px] inline-flex items-center justify-between h-9 gap-2 bg-gray-1 border transition-all whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0 [&_svg]:opacity-80 text-primary hover:bg-gray-2 active:bg-gray-2 data[state=open]:bg-gray-2 data-[state=open]:bg-gray-2">
        <div className="flex items-center gap-2">
          {selected.length > 0 ? (
            <div className="w-4 h-4 rounded-full bg-cyan-500" />
          ) : null}
          {selectedUser?.label ?? "Select a user"}
        </div>
        <ChevronDownIcon className="w-4 h-4 opacity-60" />
      </FilterMenuTrigger>
      <FilterMenuContent align="start" className="w-56">
        <FilterMenuInput />
        <FilterMenuList>
          {USERS.map((user) => (
            <FilterMenuItem
              key={user.value}
              value={user.value}
              keywords={[user.label]}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-cyan-500" />
                <span>{user.label}</span>
              </div>
            </FilterMenuItem>
          ))}
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
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue,
  );
  const [query, setQuery] = React.useState<string>("");
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const listId = React.useId();

  const contextValue = React.useMemo<FilterMenuContextValue>(
    () => ({
      query,
      setQuery,
      open,
      setOpen,
      value: value ?? internalValue,
      setValue: onValueChange ?? setInternalValue,
      selectedIndex,
      setSelectedIndex,
      listId,
    }),
    [query, open, value, internalValue, onValueChange, selectedIndex, listId],
  );

  return (
    <FilterMenuContext.Provider value={contextValue}>
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
  React.ComponentRef<typeof PopoverPrimitive.Content>,
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

interface FilterMenuListContextValue {
  visibleItems: string[];
  itemsRef: React.RefObject<Map<string, HTMLElement | null>>;
  setSelectedIndex: (index: number) => void;
}

const FilterMenuListContext =
  React.createContext<FilterMenuListContextValue | null>(null);

function useFilterMenuList() {
  const ctx = React.useContext(FilterMenuListContext);
  if (ctx === null) {
    throw Error("FilterMenuList Context must not be null");
  }
  return ctx;
}

interface FilterMenuListProps {
  children: React.ReactNode;
  loop?: boolean;
  className?: string;
}

/**
 * FilterMenuList
 * Container for FilterMenuItem components
 * Handles keyboard navigation and manages visible items after filtering
 */
export const FilterMenuList = React.forwardRef<
  HTMLDivElement,
  FilterMenuListProps
>(({ children, loop = false, className }, ref) => {
  const {
    query,
    setValue,
    selectedIndex,
    setSelectedIndex,
    setOpen,
    open,
    listId,
  } = useFilterMenu();

  const itemsRef = React.useRef<Map<string, HTMLElement | null>>(new Map());
  const [visibleItems, setVisibleItems] = React.useState<string[]>([]);

  // Collect visible items from the DOM after render
  React.useEffect(() => {
    const items: string[] = [];
    itemsRef.current.forEach((el, value) => {
      if (el && el.dataset.visible === "true") {
        items.push(value);
      }
    });
    setVisibleItems(items);
  }, [query]);

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }

      const itemCount = visibleItems.length;
      if (itemCount === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (e.metaKey) {
          setSelectedIndex(itemCount - 1);
        } else {
          setSelectedIndex((prev: number) => {
            if (prev >= itemCount - 1) {
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
              return loop ? itemCount - 1 : prev;
            }
            return prev - 1;
          });
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selectedValue = visibleItems[selectedIndex];
        if (selectedValue) {
          setValue(selectedValue);
          setOpen(false);
        }
      }
    },
    [visibleItems, selectedIndex, loop, setOpen, setSelectedIndex, setValue],
  );

  // Reset selected index when query changes
  React.useEffect(() => {
    setSelectedIndex(0);
  }, [query, setSelectedIndex]);

  // Only attach keyboard listener when menu is open
  React.useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, open]);

  // Scroll selected item into view
  React.useEffect(() => {
    const selectedValue = visibleItems[selectedIndex];
    if (selectedValue) {
      const element = itemsRef.current.get(selectedValue);
      element?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, visibleItems]);

  const selectedValue = visibleItems[selectedIndex];

  const listContextValue = React.useMemo(
    () => ({ visibleItems, itemsRef, setSelectedIndex }),
    [visibleItems, setSelectedIndex],
  );

  return (
    <FilterMenuListContext.Provider value={listContextValue}>
      <div
        ref={ref}
        id={listId}
        role="listbox"
        aria-activedescendant={
          selectedValue ? `${listId}-${selectedValue}` : undefined
        }
        className={cn(
          "flex flex-col gap-px max-h-[300px] p-1 overflow-y-scroll scroll-my-2 scrollbar-hide animate-in duration-200 ease-out",
          className,
        )}
      >
        {children}
      </div>
    </FilterMenuListContext.Provider>
  );
});

FilterMenuList.displayName = "FilterMenuList";

/**
 * FilterMenuInput
 * Search input for filtering menu items
 */
export const FilterMenuInput = React.forwardRef<
  HTMLInputElement,
  { className?: string }
>(({ className, ...props }, ref) => {
  const { setQuery, query, open, listId } = useFilterMenu();

  return (
    <div
      className={cn(
        "relative z-10 flex items-center gap-2 px-3 h-9 bg-gray-1 border-b border-gray-3 rounded-t-md caret-blue-600",
        "dark:bg-gray-1",
        className,
      )}
    >
      <MagnifyingGlassIcon
        className="shrink-0 w-4 h-4 opacity-50 pointer-events-none"
        aria-hidden="true"
      />
      <input
        ref={ref}
        type="search"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-haspopup="listbox"
        aria-autocomplete="list"
        aria-label="Search options"
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
    value: string;
    keywords?: string[];
    onSelect?: () => void;
    className?: string;
  }
>(({ children, value, keywords = [], onSelect, className, ...props }, ref) => {
  const {
    setOpen,
    value: currentValue,
    setValue,
    query,
    selectedIndex,
    listId,
  } = useFilterMenu();
  const { visibleItems, itemsRef, setSelectedIndex } = useFilterMenuList();

  // Determine if this item matches the current query
  const isVisible = React.useMemo(() => {
    if (query.length === 0) return true;
    const searchText = [value, ...keywords].join(" ").toLowerCase();
    return searchText.includes(query.toLowerCase());
  }, [value, keywords, query]);

  // Get this item's index among visible items
  const itemIndex = visibleItems.indexOf(value);
  const isHighlighted = itemIndex === selectedIndex;
  const isChecked = currentValue === value;

  // Register ref with parent, cleanup on unmount to prevent memory leak
  const setRef = React.useCallback(
    (el: HTMLButtonElement | null) => {
      if (el) {
        itemsRef.current.set(value, el);
      } else {
        itemsRef.current.delete(value);
      }
      if (typeof ref === "function") {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    },
    [value, itemsRef, ref],
  );

  if (!isVisible) return null;

  return (
    <button
      type="button"
      tabIndex={-1}
      ref={setRef}
      id={`${listId}-${value}`}
      role="option"
      data-visible="true"
      aria-selected={isChecked}
      data-highlighted={isHighlighted || undefined}
      // Use onMouseDown instead of onClick to fire before input blur
      onMouseDown={() => {
        onSelect !== undefined ? onSelect() : setValue(value);
        setOpen(false);
      }}
      onMouseMove={() => {
        if (!isHighlighted && itemIndex !== -1) {
          setSelectedIndex(itemIndex);
        }
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center transition-all rounded-md py-1.5 pr-7 pl-2 text-sm font-medium text-secondary outline-hidden data-[highlighted]:bg-gray-2 data-[highlighted]:text-primary data-disabled:pointer-events-none data-disabled:opacity-50",
        "focus-visible:ring-2 focus-visible:ring-ring",
        "dark:hover:bg-gray-3",
        isChecked
          ? "data-[highlighted]:bg-gray-3 bg-gray-3 text-primary"
          : null,
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        {isChecked ? <CheckIcon className="h-4 w-4" /> : null}
      </span>
      {children}
    </button>
  );
});

FilterMenuItem.displayName = "FilterMenuItem";
