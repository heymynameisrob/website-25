/** AI port of N8nIconPicker. Code's not great. */
import { Search, Shuffle, X } from "lucide-react";
import { createPortal } from "react-dom";
import {
  type CSSProperties,
  type ChangeEvent,
  type FocusEvent,
  Fragment,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useId,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/Tabs";
import { Tooltip } from "@/components/Tooltip";
import type { IconRegistryEntry } from "@/components/demos/IconPickerRegistry";
import { cn } from "@/lib/utils";

const COLUMNS = 12;
const INITIAL_ROWS = 10;
const ROW_BATCH_SIZE = 10;
const SKIN_TONE_STORAGE_KEY = "icon-picker-skin-tone";

const colors = [
  { label: "Blue", value: "#5b6cff" },
  { label: "Light blue", value: "#38bdf8" },
  { label: "Azure", value: "#0284c7" },
  { label: "Purple", value: "#8b5cf6" },
  { label: "Pink", value: "#ec4899" },
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Green", value: "#22c55e" },
  { label: "Dark green", value: "#15803d" },
  { label: "Gray", value: "#737373" },
] as const;

const skinTones = [
  { label: "Default skin tone", emoji: "🖐️" },
  { label: "Light skin tone", emoji: "🖐🏻" },
  { label: "Medium-light skin tone", emoji: "🖐🏼" },
  { label: "Medium skin tone", emoji: "🖐🏽" },
  { label: "Medium-dark skin tone", emoji: "🖐🏾" },
  { label: "Dark skin tone", emoji: "🖐🏿" },
] as const;

const categoryLabels: Record<string, string> = {
  people: "Smileys & people",
  nature: "Animals & nature",
  foods: "Food & drink",
  activity: "Activity",
  places: "Travel & places",
  objects: "Objects",
  symbols: "Symbols",
  flags: "Flags",
};

export type TabType = "icons" | "emojis";

type IconValue = {
  type: "icon";
  value: string;
  color?: string;
};

type EmojiValue = {
  type: "emoji";
  value: string;
};

export type IconOrEmoji = IconValue | EmojiValue;

type EmojiSkin = {
  native: string;
};

type EmojiEntry = {
  id: string;
  name: string;
  keywords: string[];
  skins: EmojiSkin[];
};

type EmojiCategory = {
  id: string;
  emojis: string[];
};

export type EmojiData = {
  categories: EmojiCategory[];
  emojis: Record<string, EmojiEntry>;
};

export type PickerItem = {
  id: string;
  label: string;
  section: string;
  type: TabType;
  value: string;
  render: ReactNode;
  keywords?: string[];
};

export type IconRegistry = Record<string, IconRegistryEntry>;

export type IconPickerContentProps = {
  iconRegistry: IconRegistry | null;
  emojiData: EmojiData | null;
  value?: IconOrEmoji;
  onChange?: (value: IconOrEmoji) => void;
  onTabChange?: (tab: TabType) => void;
  mode?: "all" | "icons";
  colorPicker?: "visible" | "hidden";
  defaultTab?: TabType;
  className?: string;
};

function humanizeIconName(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/-/g, " ");
}

function selectEvenlyFromGroups<T>(groups: T[][], limit: number): T[] {
  const selectedCounts = groups.map(function initializeCount() {
    return 0;
  });
  let selectedTotal = 0;
  let hasAvailableItems = true;

  while (selectedTotal < limit && hasAvailableItems) {
    hasAvailableItems = false;
    groups.forEach(function selectNextItem(group, index) {
      if (selectedTotal >= limit || selectedCounts[index] >= group.length) return;
      selectedCounts[index] += 1;
      selectedTotal += 1;
      hasAvailableItems = true;
    });
  }

  return groups.flatMap(function getSelectedItems(group, index) {
    return group.slice(0, selectedCounts[index]);
  });
}

function getStoredSkinTone(): number {
  if (typeof window === "undefined") return 0;
  return Number.parseInt(window.localStorage.getItem(SKIN_TONE_STORAGE_KEY) ?? "0", 10) || 0;
}

function getDefaultTab(
  value: IconOrEmoji | undefined,
  mode: "all" | "icons",
  fallback: TabType
): TabType {
  if (mode === "icons") return "icons";
  if (value) return value.type === "emoji" ? "emojis" : "icons";
  return fallback;
}

type ColorOptionProps = {
  color: string;
  label: string;
  value: string;
  onChange: (color: string) => void;
};

function ColorOption({ color, label, value, onChange }: ColorOptionProps) {
  function selectColor() {
    onChange(value);
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={color === value}
      aria-label={label}
      onClick={selectColor}
      className={cn(
        "flex size-7 items-center justify-center rounded-full border-2 border-transparent",
        "hover:border-gray-7 focus-visible:outline-2 focus-visible:outline-offset-1",
        color === value && "border-primary"
      )}
    >
      <span className="size-4 rounded-full" style={{ backgroundColor: value }} />
    </button>
  );
}

type IconColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
};

function IconColorPicker({ color, onChange }: IconColorPickerProps) {
  return (
    <Popover>
      <Tooltip content="Select icon color">
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Select icon color"
            className="size-8 px-0"
          >
            <span className="size-4 rounded-full" style={{ backgroundColor: color }} />
          </Button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent
        align="end"
        className="grid w-auto grid-cols-5 gap-1 p-2"
        aria-label="Icon colors"
        forceMount
      >
        {colors.map(function renderColor(option) {
          return (
            <ColorOption
              key={option.value}
              color={color}
              label={option.label}
              value={option.value}
              onChange={onChange}
            />
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

type SkinToneOptionProps = {
  index: number;
  label: string;
  emoji: string;
  tone: number;
  onChange: (tone: number) => void;
};

function SkinToneOption({ index, label, emoji, tone, onChange }: SkinToneOptionProps) {
  function selectTone() {
    onChange(index);
  }

  return (
    <button
      type="button"
      aria-pressed={tone === index}
      aria-label={label}
      className="flex size-8 items-center justify-center rounded-md text-xl hover:bg-gray-3 focus-visible:outline-2"
      onClick={selectTone}
    >
      {emoji}
    </button>
  );
}

type SkinTonePickerProps = {
  tone: number;
  onChange: (tone: number) => void;
};

function SkinTonePicker({ tone, onChange }: SkinTonePickerProps) {
  return (
    <Popover>
      <Tooltip content="Select skin tone">
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Select skin tone"
            className="size-8 px-0 text-lg"
          >
            {skinTones[tone]?.emoji ?? skinTones[0].emoji}
          </Button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent align="start" className="flex w-auto gap-0.5 p-1" aria-label="Skin tones">
        {skinTones.map(function renderTone(option, index) {
          return (
            <SkinToneOption
              key={option.label}
              index={index}
              label={option.label}
              emoji={option.emoji}
              tone={tone}
              onChange={onChange}
            />
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

type PickerGridItemProps = {
  item: PickerItem;
  instanceId: string;
  registerElement: (id: string, element: HTMLButtonElement | null) => void;
  color: string;
  isIcon: boolean;
  isSelected: boolean;
  onSelect: (item: PickerItem) => void;
  onTooltipHide: () => void;
  onTooltipSchedule: (event: MouseEvent<HTMLButtonElement>, label: string) => void;
  onTooltipShow: (event: FocusEvent<HTMLButtonElement>, label: string) => void;
};

function PickerGridItem({
  item,
  instanceId,
  registerElement,
  color,
  isIcon,
  isSelected,
  onSelect,
  onTooltipHide,
  onTooltipSchedule,
  onTooltipShow,
}: PickerGridItemProps) {
  function handleMouseEnter(event: MouseEvent<HTMLButtonElement>) {
    onTooltipSchedule(event, item.label);
  }

  function handleFocus(event: FocusEvent<HTMLButtonElement>) {
    onTooltipShow(event, item.label);
  }

  function preserveSearchFocus(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  function chooseItem() {
    onSelect(item);
  }

  function setElement(element: HTMLButtonElement | null) {
    registerElement(item.id, element);
  }

  return (
    <button
      ref={setElement}
      id={`${instanceId}-${item.id}`}
      type="button"
      role="option"
      tabIndex={-1}
      aria-label={item.label}
      aria-selected={isSelected}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onTooltipHide}
      onFocus={handleFocus}
      onBlur={onTooltipHide}
      onMouseDown={preserveSearchFocus}
      onClick={chooseItem}
      style={isIcon ? ({ color } satisfies CSSProperties) : undefined}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md hover:bg-gray-3",
        "focus-visible:outline-2 focus-visible:outline-offset-1",
        "data-[active=true]:bg-gray-3 data-[active=true]:outline-primary data-[active=true]:outline-2 data-[active=true]:outline-offset-1"
      )}
    >
      {item.render}
    </button>
  );
}

type ItemTooltip = {
  label: string;
  left: number;
  top: number;
};

export type IconPickerItems = {
  iconItems: PickerItem[];
  emojiItems: PickerItem[];
};

export function useIconPickerItems(
  iconRegistry: IconRegistry | null,
  emojiData: EmojiData | null,
  skinTone = 0
): IconPickerItems {
  const iconItems = useMemo(
    function createIconItems() {
      const iconEntries = Object.entries(iconRegistry ?? {});
      const iconGroups = Array.from({ length: 26 }, function createLetterGroup(_, index) {
        const letter = String.fromCharCode(65 + index);
        return iconEntries.flatMap(function mapIcon([name, entry]) {
          const label = humanizeIconName(name);
          if (label.slice(0, 1).toUpperCase() !== letter) return [];
          const Icon = entry.icon;
          return [
            {
              id: `icon-${name}`,
              label,
              section: letter,
              type: "icons" as const,
              value: name,
              render: <Icon aria-hidden="true" size={20} strokeWidth={2} />,
              keywords: entry.keywords,
            },
          ];
        });
      });
      return selectEvenlyFromGroups(iconGroups, iconEntries.length);
    },
    [iconRegistry]
  );

  const emojiItems = useMemo(
    function createEmojiItems() {
      if (!emojiData) return [];
      const emojiGroups = emojiData.categories.map(function mapCategory(category) {
        return category.emojis.flatMap(function mapEmoji(id) {
          const emoji = emojiData.emojis[id];
          if (!emoji?.skins[0]) return [];
          const skin = emoji.skins[skinTone] ?? emoji.skins[0];
          return [
            {
              id: `emoji-${category.id}-${id}`,
              label: emoji.name,
              section: categoryLabels[category.id] ?? humanizeIconName(category.id),
              type: "emojis" as const,
              value: skin.native,
              render: <span className="text-xl leading-none">{skin.native}</span>,
              keywords: emoji.keywords,
            },
          ];
        });
      });
      return selectEvenlyFromGroups(emojiGroups, 1_000);
    },
    [emojiData, skinTone]
  );

  return { iconItems, emojiItems };
}

function useProgressiveItems(items: PickerItem[]): PickerItem[] {
  const [visibleRowCount, setVisibleRowCount] = useState(INITIAL_ROWS);

  useEffect(
    function renderItemsProgressively() {
      setVisibleRowCount(INITIAL_ROWS);
      let frame = 0;
      function renderNextBatch() {
        setVisibleRowCount(function increaseRows(count) {
          if (count * COLUMNS >= items.length) return count;
          frame = window.requestAnimationFrame(renderNextBatch);
          return count + ROW_BATCH_SIZE;
        });
      }
      frame = window.requestAnimationFrame(renderNextBatch);
      return function cancelRender() {
        window.cancelAnimationFrame(frame);
      };
    },
    [items]
  );

  return items.slice(0, visibleRowCount * COLUMNS);
}

export type IconPickerSearchGridProps = {
  items: PickerItem[];
  tab: TabType;
  color: string;
  selectedValue?: IconOrEmoji;
  toolbar?: ReactNode;
  onSelect: (item: PickerItem) => void;
};

export function IconPickerSearchGrid({
  items,
  tab,
  color,
  selectedValue,
  toolbar,
  onSelect,
}: IconPickerSearchGridProps) {
  const [query, setQuery] = useState("");
  const [itemTooltip, setItemTooltip] = useState<ItemTooltip | null>(null);
  const instanceId = useId();
  const listboxId = `${instanceId}-options`;
  const searchRef = useRef<HTMLInputElement>(null);
  const itemElementsRef = useRef(new Map<string, HTMLButtonElement>());
  const activeIndexRef = useRef(-1);
  const activeElementRef = useRef<HTMLElement | null>(null);
  const tooltipTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const filteredItems = useMemo(
    function filterItems() {
      const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
      if (tokens.length === 0) return items;
      return items.filter(function matchesQuery(item) {
        const searchable = `${item.label} ${item.keywords?.join(" ") ?? ""}`.toLowerCase();
        return tokens.every(function includesToken(token) {
          return searchable.includes(token);
        });
      });
    },
    [items, query]
  );
  const visibleItems = useProgressiveItems(filteredItems);

  useEffect(function clearTooltipTimerOnUnmount() {
    return function clearTooltipTimer() {
      if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    };
  }, []);

  useEffect(
    function clearActiveItemWhenResultsChange() {
      clearActiveItem();
    },
    [filteredItems]
  );

  function hideItemTooltip() {
    if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
    tooltipTimerRef.current = undefined;
    setItemTooltip(null);
  }

  function clearActiveItem() {
    activeElementRef.current?.removeAttribute("data-active");
    activeElementRef.current = null;
    activeIndexRef.current = -1;
    searchRef.current?.removeAttribute("aria-activedescendant");
    hideItemTooltip();
  }

  function activateItem(index: number) {
    const item = filteredItems[index];
    if (!item) return;
    const element = itemElementsRef.current.get(item.id);
    if (!element) return;
    activeElementRef.current?.removeAttribute("data-active");
    element.dataset.active = "true";
    activeElementRef.current = element;
    activeIndexRef.current = index;
    searchRef.current?.setAttribute("aria-activedescendant", element.id);
    const scrollArea = element.closest<HTMLElement>(`#${CSS.escape(listboxId)}`);
    if (!scrollArea) return;
    const itemBounds = element.getBoundingClientRect();
    const scrollBounds = scrollArea.getBoundingClientRect();
    if (itemBounds.top < scrollBounds.top || itemBounds.bottom > scrollBounds.bottom) {
      element.scrollIntoView({ block: "nearest" });
    }
  }

  function registerItemElement(id: string, element: HTMLButtonElement | null) {
    if (element) itemElementsRef.current.set(id, element);
    else itemElementsRef.current.delete(id);
  }

  function updateQuery(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
  }

  function clearSearch() {
    setQuery("");
    searchRef.current?.focus();
  }

  function selectRandom() {
    if (filteredItems.length === 0) return;
    const item = filteredItems[Math.floor(Math.random() * filteredItems.length)];
    if (item) onSelect(item);
  }

  function showItemTooltip(target: HTMLElement, label: string) {
    const bounds = target.getBoundingClientRect();
    setItemTooltip({ label, left: bounds.left + bounds.width / 2, top: bounds.top });
  }

  function scheduleItemTooltip(event: MouseEvent<HTMLButtonElement>, label: string) {
    const target = event.currentTarget;
    hideItemTooltip();
    tooltipTimerRef.current = setTimeout(function showScheduledTooltip() {
      showItemTooltip(target, label);
      tooltipTimerRef.current = undefined;
    }, 150);
  }

  function handleItemFocus(event: FocusEvent<HTMLButtonElement>, label: string) {
    showItemTooltip(event.currentTarget, label);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(event.key)) return;
    if (event.key === "Enter") {
      const item = filteredItems[activeIndexRef.current];
      if (item) {
        event.preventDefault();
        onSelect(item);
      }
      return;
    }
    event.preventDefault();
    hideItemTooltip();
    const current = activeIndexRef.current;
    if (current < 0) {
      activateItem(0);
      return;
    }
    const offset =
      event.key === "ArrowLeft"
        ? -1
        : event.key === "ArrowRight"
          ? 1
          : event.key === "ArrowUp"
            ? -COLUMNS
            : COLUMNS;
    const next = Math.max(-1, Math.min(filteredItems.length - 1, current + offset));
    if (next < 0) clearActiveItem();
    else activateItem(next);
  }

  function handleKeyUp(event: KeyboardEvent<HTMLInputElement>) {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    const item = filteredItems[activeIndexRef.current];
    const element = item ? itemElementsRef.current.get(item.id) : null;
    if (item && element) showItemTooltip(element, item.label);
  }

  let previousSection = "";

  return (
    <>
      {itemTooltip && typeof document !== "undefined"
        ? createPortal(
            <div
              role="tooltip"
              className="pointer-events-none fixed z-50 size-0 overflow-visible"
              style={{ left: itemTooltip.left, top: itemTooltip.top }}
            >
              <span className="inline-flex min-h-7 w-max max-w-40 -translate-x-1/2 -translate-y-[calc(100%+8px)] items-center justify-center rounded-lg bg-black px-1.5 py-1 text-center text-xs font-medium tracking-tight whitespace-normal text-white shadow-md break-words">
                {itemTooltip.label.trim()}
              </span>
            </div>,
            document.body
          )
        : null}
      <div className="flex items-center gap-2 p-2">
        <div className="relative min-w-0 flex-1">
          <Search
            aria-hidden="true"
            className="absolute top-1/2 left-2.5 -translate-y-1/2 text-secondary"
            size={15}
          />
          <input
            ref={searchRef}
            value={query}
            onChange={updateQuery}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onBlur={clearActiveItem}
            role="combobox"
            autoFocus
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-expanded="true"
            placeholder="Search icons and emojis"
            className="h-8 w-full rounded-md border bg-gray-1 pr-8 pl-8 text-sm outline-hidden focus:ring-2 focus:ring-gray-7"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={clearSearch}
              className="absolute top-1/2 right-2 -translate-y-1/2 text-secondary hover:text-primary"
            >
              <X aria-hidden="true" size={14} />
            </button>
          ) : null}
        </div>
        {toolbar}
        <Tooltip content={tab === "icons" ? "Select a random icon" : "Select a random emoji"}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="size-8 px-0"
            aria-label={tab === "icons" ? "Select a random icon" : "Select a random emoji"}
            onClick={selectRandom}
          >
            <Shuffle aria-hidden="true" size={16} />
          </Button>
        </Tooltip>
      </div>
      <div
        id={listboxId}
        role="listbox"
        aria-label={tab === "icons" ? "Icons" : "Emojis"}
        className="grid h-100 grid-cols-12 content-start overflow-y-auto px-2 pb-2"
      >
        {visibleItems.length === 0 ? (
          <p className="col-span-12 h-80 overflow-hidden flex w-full items-center justify-center text-sm text-secondary">
            No results found
          </p>
        ) : null}
        {visibleItems.map(function renderItem(item) {
          const showHeading = item.section !== previousSection && !query;
          previousSection = item.section;
          return (
            <Fragment key={item.id}>
              {showHeading ? (
                <div
                  role="presentation"
                  className="col-span-12 py-2 text-xs font-semibold text-secondary"
                >
                  {item.section}
                </div>
              ) : null}
              <PickerGridItem
                item={item}
                instanceId={instanceId}
                registerElement={registerItemElement}
                color={color}
                isIcon={tab === "icons"}
                isSelected={
                  selectedValue?.type === (item.type === "icons" ? "icon" : "emoji") &&
                  selectedValue.value === item.value
                }
                onSelect={onSelect}
                onTooltipHide={hideItemTooltip}
                onTooltipSchedule={scheduleItemTooltip}
                onTooltipShow={handleItemFocus}
              />
            </Fragment>
          );
        })}
      </div>
    </>
  );
}

export function IconPickerContent({
  iconRegistry,
  emojiData,
  value,
  onChange,
  onTabChange,
  mode = "all",
  colorPicker = "visible",
  defaultTab = "icons",
  className,
}: IconPickerContentProps) {
  const [internalValue, setInternalValue] = useState<IconOrEmoji | undefined>(value);
  const selectedValue = value !== undefined ? value : internalValue;
  const [tab, setTab] = useState<TabType>(function initializeTab() {
    return getDefaultTab(selectedValue, mode, defaultTab);
  });
  const [color, setColor] = useState(
    selectedValue?.type === "icon" ? (selectedValue.color ?? colors[9].value) : colors[9].value
  );
  const [skinTone, setSkinTone] = useState(getStoredSkinTone);

  const { iconItems, emojiItems } = useIconPickerItems(iconRegistry, emojiData, skinTone);

  useEffect(
    function synchronizeControlledValue() {
      if (value?.type === "icon") {
        setTab("icons");
        setColor(value.color ?? colors[9].value);
      } else if (value?.type === "emoji" && mode === "all") {
        setTab("emojis");
      }
    },
    [mode, value]
  );

  useEffect(
    function enforceIconMode() {
      if (mode === "icons") setTab("icons");
    },
    [mode]
  );

  useEffect(
    function saveSkinTone() {
      window.localStorage.setItem(SKIN_TONE_STORAGE_KEY, String(skinTone));
    },
    [skinTone]
  );

  function changeTab(nextTab: string) {
    const selectedTab = nextTab as TabType;
    setTab(selectedTab);
    onTabChange?.(selectedTab);
  }

  function selectItem(item: PickerItem) {
    const nextValue: IconOrEmoji =
      item.type === "icons"
        ? { type: "icon", value: item.value, color }
        : { type: "emoji", value: item.value };
    setInternalValue(nextValue);
    onChange?.(nextValue);
  }

  const items = tab === "icons" ? iconItems : emojiItems;
  const toolbar =
    tab === "icons" && colorPicker === "visible" ? (
      <IconColorPicker color={color} onChange={setColor} />
    ) : tab === "emojis" && mode === "all" ? (
      <SkinTonePicker tone={skinTone} onChange={setSkinTone} />
    ) : null;

  return (
    <div className={cn("w-100 overflow-hidden scrollbar-gutter-auto", className)}>
      {mode === "all" ? (
        <Tabs value={tab} onValueChange={changeTab}>
          <TabsList className="items-end h-10 gap-0 border-b px-2">
            <TabsTrigger value="icons" variant="underlined" size="sm" className="h-10 pt-2">
              Icons
            </TabsTrigger>
            <TabsTrigger value="emojis" variant="underlined" size="sm" className="h-10 pt-2">
              Emojis
            </TabsTrigger>
          </TabsList>
        </Tabs>
      ) : null}
      <IconPickerSearchGrid
        items={items}
        tab={tab}
        color={color}
        selectedValue={selectedValue}
        toolbar={toolbar}
        onSelect={selectItem}
      />
    </div>
  );
}

export default IconPickerContent;
