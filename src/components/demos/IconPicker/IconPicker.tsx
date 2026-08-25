import { useState } from "react";

import { Button } from "@/components/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import { Tooltip } from "@/components/Tooltip";
import IconPickerContent, {
  type EmojiData,
  type IconOrEmoji,
  type IconRegistry,
  type TabType,
} from "@/components/demos/IconPicker/IconPickerContent";
import IconPickerValue from "@/components/demos/IconPicker/IconPickerValue";

export type {
  IconOrEmoji,
  IconPickerContentProps,
} from "@/components/demos/IconPicker/IconPickerContent";

const BUTTON_TOOLTIP = "Choose an icon or emoji";
const DEFAULT_VALUE: IconOrEmoji = {
  type: "icon",
  value: "sparkles",
  color: "#737373",
};

type IconPickerRegistryModule = typeof import("@/components/demos/IconPickerRegistry");

let registryPromise: Promise<IconPickerRegistryModule> | undefined;
let emojiDataPromise: Promise<EmojiData> | undefined;

function loadIconRegistry(): Promise<IconPickerRegistryModule> {
  registryPromise ??= import("@/components/demos/IconPickerRegistry").catch(
    function resetFailedRegistry(error) {
      registryPromise = undefined;
      throw error;
    }
  );
  return registryPromise;
}

function loadEmojiData(): Promise<EmojiData> {
  return (emojiDataPromise ??= import("@emoji-mart/data")
    .then(function getEmojiData(module) {
      return module.default as unknown as EmojiData;
    })
    .catch(function resetFailedEmojiData(error) {
      emojiDataPromise = undefined;
      throw error;
    }));
}

export function IconPicker() {
  const [value, setValue] = useState<IconOrEmoji>(DEFAULT_VALUE);
  const [iconRegistry, setIconRegistry] = useState<IconRegistry | null>(null);
  const [emojiData, setEmojiData] = useState<EmojiData | null>(null);
  const [open, setOpen] = useState(false);

  function handleChange(nextValue: IconOrEmoji) {
    setValue(nextValue);
    setOpen(false);
  }

  function preloadIcons() {
    if (iconRegistry) return;
    void loadIconRegistry().then(function storeRegistry(module) {
      setIconRegistry(module.iconRegistry);
    });
  }

  function preloadEmojis() {
    if (emojiData) return;
    void loadEmojiData().then(function storeEmojiData(data) {
      setEmojiData(data);
    });
  }

  function preloadTab(tab: TabType) {
    if (tab === "emojis") preloadEmojis();
    else preloadIcons();
  }

  function preloadSelectedTab() {
    preloadTab(value.type === "emoji" ? "emojis" : "icons");
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) preloadSelectedTab();
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <Tooltip content={BUTTON_TOOLTIP}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            aria-label={BUTTON_TOOLTIP}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="size-9"
            onMouseEnter={preloadSelectedTab}
            onFocus={preloadSelectedTab}
            onPointerDown={preloadSelectedTab}
          >
            <IconPickerValue value={value} />
          </Button>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent align="start" className="w-100 overflow-hidden p-0 scrollbar-gutter-auto">
        {(value.type === "emoji" ? emojiData : iconRegistry) ? (
          <IconPickerContent
            iconRegistry={iconRegistry}
            emojiData={emojiData}
            value={value}
            onChange={handleChange}
            onTabChange={preloadTab}
          />
        ) : (
          <div className="h-110 w-100" aria-label="Loading icon picker" />
        )}
      </PopoverContent>
    </Popover>
  );
}
