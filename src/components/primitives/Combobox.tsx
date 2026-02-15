import * as React from "react";

import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";

interface ComboboxContextValue {
  query: string;
  setQuery: (query: string) => void;
  value: string | undefined;
  setValue: (value: string) => void;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  listId: string;
  onClose?: () => void;
}

/**
 * Combobox
 * A standalone filterable list menu component.
 * Can be used inside a popover or on its own.
 * Useful for long lists where only one item can be selected.
 */

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useCombobox() {
  const ctx = React.useContext(ComboboxContext);
  if (ctx === null) {
    throw Error("Combobox Context must be not be null");
  }
  return ctx;
}

const Root = ({
  children,
  value,
  onValueChange,
  defaultValue = undefined,
  onClose,
}: {
  children: React.ReactNode;
  value?: string | undefined;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  onClose?: () => void;
}) => {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue,
  );
  const [query, setQuery] = React.useState<string>("");
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const listId = React.useId();

  const contextValue = React.useMemo<ComboboxContextValue>(
    () => ({
      query,
      setQuery,
      value: value ?? internalValue,
      setValue: onValueChange ?? setInternalValue,
      selectedIndex,
      setSelectedIndex,
      listId,
      onClose,
    }),
    [
      query,
      value,
      internalValue,
      onValueChange,
      selectedIndex,
      listId,
      onClose,
    ],
  );

  return (
    <ComboboxContext.Provider value={contextValue}>
      {children}
    </ComboboxContext.Provider>
  );
};
Root.displayName = "Combobox.Root";

interface ComboboxListContextValue {
  visibleItems: string[];
  itemsRef: React.RefObject<Map<string, HTMLElement | null> | null>;
  setSelectedIndex: (index: number) => void;
}

const ComboboxListContext =
  React.createContext<ComboboxListContextValue | null>(null);

function useComboboxList() {
  const ctx = React.useContext(ComboboxListContext);
  if (ctx === null) {
    throw Error("ComboboxList Context must not be null");
  }
  return ctx;
}

interface ComboboxListProps {
  children: React.ReactNode;
  loop?: boolean;
  className?: string;
}

/**
 * ComboboxList
 * Container for ComboboxItem components
 * Handles keyboard navigation and manages visible items after filtering
 */
const List = React.forwardRef<HTMLDivElement, ComboboxListProps>(
  ({ children, loop = false, className }, ref) => {
    const {
      query,
      setValue,
      selectedIndex,
      setSelectedIndex,
      onClose,
      listId,
    } = useCombobox();

    const itemsRef = React.useRef<Map<string, HTMLElement | null>>(new Map());
    const [visibleItems, setVisibleItems] = React.useState<string[]>([]);

    // Collect visible items from the DOM after render
    React.useEffect(() => {
      const items: string[] = [];
      itemsRef.current?.forEach((el, value) => {
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
          onClose?.();
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
            onClose?.();
          }
        }
      },
      [visibleItems, selectedIndex, loop, onClose, setSelectedIndex, setValue],
    );

    // Reset selected index when query changes
    React.useEffect(() => {
      setSelectedIndex(0);
    }, [query, setSelectedIndex]);

    // Attach keyboard listener
    React.useEffect(() => {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    // Scroll selected item into view
    React.useEffect(() => {
      const selectedValue = visibleItems[selectedIndex];
      if (selectedValue) {
        const element = itemsRef.current?.get(selectedValue);
        element?.scrollIntoView({ block: "nearest" });
      }
    }, [selectedIndex, visibleItems]);

    const selectedValue = visibleItems[selectedIndex];

    const listContextValue = React.useMemo(
      () => ({ visibleItems, itemsRef, setSelectedIndex }),
      [visibleItems, setSelectedIndex],
    );

    return (
      <ComboboxListContext.Provider value={listContextValue}>
        <div
          ref={ref}
          id={listId}
          role="listbox"
          aria-activedescendant={
            selectedValue ? `${listId}-${selectedValue}` : undefined
          }
          className={cn("flex flex-col gap-px ", className)}
        >
          {children}
        </div>
      </ComboboxListContext.Provider>
    );
  },
);

List.displayName = "Combobox.List";

/**
 * ComboboxInput
 * Search input for filtering menu items
 */
const Input = React.forwardRef<HTMLInputElement, { className?: string }>(
  ({ className, ...props }, ref) => {
    const { setQuery, query, listId } = useCombobox();

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
  },
);

Input.displayName = "Combobox.Input";

const Item = React.forwardRef<
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
    onClose,
    value: currentValue,
    setValue,
    query,
    selectedIndex,
    listId,
  } = useCombobox();
  const { visibleItems, itemsRef, setSelectedIndex } = useComboboxList();

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
        itemsRef.current?.set(value, el);
      } else {
        itemsRef.current?.delete(value);
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
      onClick={() => {
        onSelect !== undefined ? onSelect() : setValue(value);
        onClose?.();
      }}
      onMouseMove={() => {
        if (!isHighlighted && itemIndex !== -1) {
          setSelectedIndex(itemIndex);
        }
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center transition-all whitespace-nowrap rounded-md py-1.5 pr-7 pl-2 text-sm font-medium text-primary outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50",
        "hover:bg-gray-2 data-[highlighted]:bg-gray-3 ",
        "focus-visible:ring-2 focus-visible:ring-ring",
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

Item.displayName = "Combobox.Item";

/**
 * ComboboxGroup
 * Groups related ComboboxItem components with an optional label
 * Hides itself when all children are filtered out
 */
const Group = React.forwardRef<
  HTMLDivElement,
  {
    children: React.ReactNode;
    label?: string;
    className?: string;
  }
>(({ children, label, className }, ref) => {
  const { query } = useCombobox();
  const groupRef = React.useRef<HTMLDivElement>(null);
  const [hasVisibleItems, setHasVisibleItems] = React.useState(true);

  React.useLayoutEffect(() => {
    if (groupRef.current) {
      const visibleItems = groupRef.current.querySelectorAll(
        '[data-visible="true"]',
      );
      setHasVisibleItems(visibleItems.length > 0);
    }
  }, [query, children]);

  return (
    <div
      ref={(node) => {
        groupRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      role="group"
      aria-label={label}
      className={cn("flex flex-col gap-px", className)}
      hidden={!hasVisibleItems}
    >
      {label ? (
        <div className="px-2 py-1.5 text-xs font-medium text-gray-10 select-none">
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
});

Group.displayName = "Combobox.Group";

export {
  Root,
  List,
  Input,
  Item,
  Group,
  Root as ComboboxRoot,
  List as ComboboxList,
  Input as ComboboxInput,
  Item as ComboboxItem,
  Group as ComboboxGroup,
};
