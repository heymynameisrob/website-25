import * as React from "react";

import { cn } from "@/lib/utils";
import {
  CheckIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/16/solid";

/**
 * Props for the Combobox Root component
 * Controls the overall state and behavior of the combobox
 */
interface ComboboxRootProps {
  /** Child components to render within the combobox */
  children: React.ReactNode;
  /** Controlled value of the selected item */
  value?: string | undefined;
  /** Callback fired when the selected value changes */
  onValueChange?: (value: string) => void;
  /** Initial value when uncontrolled */
  defaultValue?: string;
  /** Callback fired when a value is selected (e.g., to close a popover) */
  onValueSelected?: () => void;
  /** Controlled search query string */
  query?: string;
  /** Callback fired when the search query changes */
  onQueryChange?: (query: string) => void;
  /** Whether keyboard navigation should loop from last to first item and vice versa */
  loop?: boolean;
}

/**
 * Props for the Combobox List component
 * Container for ComboboxItem components that manages visible items after filtering
 */
interface ComboboxListProps {
  /** The ComboboxItem components to render */
  children: React.ReactNode;
  /** Additional CSS classes for the list container */
  className?: string;
  /** Whether to auto-focus on the currently selected value when query is empty */
  autoFocus?: boolean;
}

/**
 * Props for the Combobox Input component
 * Search input for filtering menu items and handling keyboard navigation
 */
interface ComboboxInputProps
  extends Omit<
    React.ComponentPropsWithoutRef<"input">,
    "value" | "onChange" | "type" | "role" | "autoComplete"
  > {
  /** Additional CSS classes for the input container */
  className?: string;
  /** Placeholder text for the search input */
  placeholder?: string;
}

/**
 * Props for the Combobox Item component
 * Individual selectable item within the combobox list
 */
interface ComboboxItemProps {
  /** Content to render within the item */
  children: React.ReactNode;
  /** Unique value identifier for this item */
  value: string;
  /** Additional keywords to match when filtering */
  keywords?: string[];
  /** Custom callback when item is selected (overrides default setValue behavior) */
  onSelect?: () => void;
  /** Additional CSS classes for the item */
  className?: string;
}

/**
 * Props for the Combobox Group component
 * Groups related ComboboxItem components with an optional label
 */
interface ComboboxGroupProps {
  /** ComboboxItem components to render within the group */
  children: React.ReactNode;
  /** Optional label displayed above the group */
  label?: string;
  /** Additional CSS classes for the group container */
  className?: string;
}

/**
 * Props for the Combobox Empty component
 * Displays when the list has no visible items (e.g., no search results)
 */
interface ComboboxEmptyProps {
  /** Content to display when list is empty */
  children: React.ReactNode;
  /** Additional CSS classes for the empty state container */
  className?: string;
}

interface ComboboxContextValue {
  /** The current search/filter query string */
  query: string;
  /** Function to update the search query */
  setQuery: (query: string) => void;
  /** The currently selected value */
  value: string | undefined;
  /** Function to update the selected value */
  setValue: (value: string) => void;
  /** Index of the currently highlighted item in the visible items list */
  selectedIndex: number;
  /** Function to update the highlighted item index */
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  /** Unique identifier for the listbox element, used for ARIA attributes */
  listId: string;
  /** Callback fired when a value is selected */
  onValueSelected?: () => void;
  /** Array of item values that are currently visible after filtering */
  visibleItems: string[];
  /** Function to update the visible items array */
  setVisibleItems: React.Dispatch<React.SetStateAction<string[]>>;
  /** Whether keyboard navigation should loop from last to first item and vice versa */
  loop: boolean;
  /** Whether pointer selection is disabled (during keyboard navigation) */
  disablePointerSelection: boolean;
  /** Function to update pointer selection disabled state */
  setDisablePointerSelection: React.Dispatch<React.SetStateAction<boolean>>;
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
    throw Error("You need to wrap this in ComboboxRoot");
  }
  return ctx;
}

const Root = ({
  children,
  value,
  onValueChange,
  defaultValue = undefined,
  onValueSelected,
  query: controlledQuery,
  onQueryChange,
  loop = false,
}: ComboboxRootProps) => {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue,
  );
  const [internalQuery, setInternalQuery] = React.useState<string>("");
  const query = controlledQuery ?? internalQuery;
  const setQuery = onQueryChange ?? setInternalQuery;
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const [visibleItems, setVisibleItems] = React.useState<string[]>([]);
  const [disablePointerSelection, setDisablePointerSelection] =
    React.useState(false);
  const listIdRef = React.useRef<string>(
    `combobox-${Math.random().toString(36).slice(2, 9)}`,
  );
  const listId = listIdRef.current;

  const contextValue = React.useMemo<ComboboxContextValue>(
    () => ({
      query,
      setQuery,
      value: value ?? internalValue,
      setValue: onValueChange ?? setInternalValue,
      selectedIndex,
      setSelectedIndex,
      listId,
      onValueSelected,
      visibleItems,
      setVisibleItems,
      loop,
      disablePointerSelection,
      setDisablePointerSelection,
    }),
    [
      query,
      setQuery,
      value,
      internalValue,
      onValueChange,
      selectedIndex,
      listId,
      onValueSelected,
      visibleItems,
      loop,
      disablePointerSelection,
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
  /** Array of item values that are currently visible after filtering */
  visibleItems: string[];
  /** Ref to a Map storing references to each item's DOM element by its value */
  itemsRef: React.MutableRefObject<Map<string, HTMLElement | null>>;
  /** Function to update the highlighted item index */
  setSelectedIndex: (index: number) => void;
}

const ComboboxListContext =
  React.createContext<ComboboxListContextValue | null>(null);

function useComboboxList() {
  const ctx = React.useContext(ComboboxListContext);
  if (ctx === null) {
    throw Error("You need to wrap this in ComboboxList");
  }
  return ctx;
}

/**
 * ComboboxList
 * Container for ComboboxItem components
 * Manages visible items after filtering
 */
const List = React.forwardRef<HTMLDivElement, ComboboxListProps>(
  ({ children, className, autoFocus = false }, ref) => {
    const {
      query,
      value,
      selectedIndex,
      setSelectedIndex,
      listId,
      visibleItems,
      setVisibleItems,
      disablePointerSelection,
      setDisablePointerSelection,
    } = useCombobox();

    const itemsRef = React.useRef<Map<string, HTMLElement | null>>(new Map());

    React.useEffect(() => {
      const items: string[] = [];
      itemsRef.current?.forEach((el, itemValue) => {
        if (el && el.dataset.visible === "true") {
          items.push(itemValue);
        }
      });
      setVisibleItems((prev) => {
        if (
          prev.length === items.length &&
          prev.every((v, i) => v === items[i])
        ) {
          return prev;
        }
        return items;
      });
    }, [query, setVisibleItems]);

    React.useEffect(() => {
      if (autoFocus && value && query === "" && visibleItems.length > 0) {
        const valueIndex = visibleItems.indexOf(value);
        if (valueIndex !== -1) {
          setSelectedIndex(valueIndex);
        }
      }
    }, [autoFocus, value, visibleItems, query, setSelectedIndex]);

    React.useEffect(() => {
      setSelectedIndex(0);
    }, [query, setSelectedIndex]);

    /** NOTE (@heymynameisrob): Scroll element into view. */
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
          onPointerMove={() => {
            if (disablePointerSelection) {
              setDisablePointerSelection(false);
            }
          }}
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
 * useComboboxKeyboard
 * Hook for handling keyboard navigation in the combobox
 */
function useComboboxKeyboard(
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>,
) {
  const {
    visibleItems,
    selectedIndex,
    setSelectedIndex,
    setValue,
    onValueSelected,
    loop,
    setDisablePointerSelection,
  } = useCombobox();

  return React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);
      const itemCount = visibleItems.length;
      if (itemCount === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setDisablePointerSelection(true);
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
        setDisablePointerSelection(true);
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
          onValueSelected?.();
        }
      }
    },
    [
      visibleItems,
      selectedIndex,
      loop,
      onValueSelected,
      setSelectedIndex,
      setValue,
      onKeyDown,
      setDisablePointerSelection,
    ],
  );
}

/**
 * ComboboxInput
 * Search input for filtering menu items and handling keyboard navigation
 */
const Input = React.forwardRef<HTMLInputElement, ComboboxInputProps>(
  ({ className, placeholder = "Search...", onKeyDown, ...props }, ref) => {
    const { setQuery, query, listId } = useCombobox();
    const handleKeyDown = useComboboxKeyboard(onKeyDown);

    return (
      <div
        className={cn(
          "relative z-10 flex items-center gap-2 px-3 h-9 bg-background border-b rounded-t-lg caret-accent",
          className,
        )}
      >
        <MagnifyingGlassIcon
          className="shrink-0 w-4 h-4 opacity-50 pointer-events-none"
          aria-hidden="true"
        />
        <input
          ref={ref}
          name="search"
          role="combobox"
          aria-controls={listId}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-label="Search options"
          autoFocus
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-9 text-sm px-0 border-none outline-hidden bg-transparent focus:outline-hidden focus:border-none focus:ring-0"
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Combobox.Input";

const Item = React.memo(
  React.forwardRef<HTMLButtonElement, ComboboxItemProps>(
    (
      { children, value, keywords = [], onSelect, className, ...props },
      forwardedRef,
    ) => {
      const {
        onValueSelected,
        value: currentValue,
        setValue,
        query,
        selectedIndex,
        listId,
        disablePointerSelection,
        setDisablePointerSelection,
      } = useCombobox();
      const { visibleItems, itemsRef, setSelectedIndex } = useComboboxList();

      /** TODO (@heymynameisrob): Consider adding fuzzy match (e.g jl would match Jon Lay) */
      const isVisible = React.useMemo(() => {
        if (query.length === 0) return true;
        const searchText = [value, ...keywords].join(" ").toLowerCase();
        return searchText.includes(query.toLowerCase());
      }, [value, keywords, query]);

      const itemIndex = visibleItems.indexOf(value);
      const isHighlighted = itemIndex === selectedIndex;
      const isChecked = currentValue === value;

      const forwardedRefRef = React.useRef(forwardedRef);
      const setRef = React.useCallback(
        (el: HTMLButtonElement | null) => {
          if (el) {
            itemsRef.current?.set(value, el);
          } else {
            itemsRef.current?.delete(value);
          }
          const ref = forwardedRefRef.current;
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        },
        [value, itemsRef],
      );

      React.useLayoutEffect(() => {
        forwardedRefRef.current = forwardedRef;
      });

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
            if (onSelect !== undefined) {
              onSelect();
            } else {
              setValue(value);
            }
            onValueSelected?.();
          }}
          onMouseEnter={() => {
            if (!disablePointerSelection && itemIndex !== -1) {
              setSelectedIndex(itemIndex);
            }
          }}
          className={cn(
            "relative flex w-full cursor-default select-none items-center whitespace-nowrap rounded-md py-1.5 pr-7 pl-2 text-sm font-medium text-primary outline-hidden data-disabled:pointer-events-none data-disabled:opacity-50",
            "hover:bg-gray-2 data-[highlighted]:bg-gray-3 ",
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
    },
  ),
);

Item.displayName = "Combobox.Item";

/**
 * ComboboxGroup
 * Groups related ComboboxItem components with an optional label
 * Hides itself when all children are filtered out
 */
const Group = React.forwardRef<HTMLDivElement, ComboboxGroupProps>(
  ({ children, label, className }, ref) => {
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

/**
 * ComboboxEmpty
 * Displays when the list has no visible items (e.g., no search results)
 */
const Empty = ({ children, className }: ComboboxEmptyProps) => {
  const { visibleItems } = useComboboxList();

  if (visibleItems.length > 0) return null;

  return (
    <div
      role="status"
      className={cn(
        "py-6 text-center text-sm text-gray-10 select-none",
        className,
      )}
    >
      {children}
    </div>
  );
};

Empty.displayName = "Combobox.Empty";

export {
  Root as ComboboxRoot,
  List as ComboboxList,
  Input as ComboboxInput,
  Item as ComboboxItem,
  Group as ComboboxGroup,
  Empty as ComboboxEmpty,
  useCombobox,
};
