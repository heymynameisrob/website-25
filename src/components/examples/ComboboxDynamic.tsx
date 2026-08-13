import * as React from "react";

import { cn, getTagColor } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/16/solid";
import {
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxRoot,
  useCombobox,
} from "@/components/Combobox";

type Tag = {
  value: string;
  label: string;
};

const INITIAL_TAGS: Tag[] = [
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "enhancement", label: "Enhancement" },
  { value: "documentation", label: "Documentation" },
  { value: "help-wanted", label: "Help Wanted" },
];

export function ComboboxDynamic() {
  const [tags, setTags] = React.useState<Tag[]>(INITIAL_TAGS);
  const [selected, setSelected] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const handleAddTag = React.useCallback(() => {
    if (!query.trim()) return;

    const newValue = query.toLowerCase().replace(/\s+/g, "-");
    const exists = tags.some((tag) => tag.value === newValue);

    if (!exists) {
      const newTag = { value: newValue, label: query.trim() };
      setTags((prev) => [...prev, newTag]);
      setSelected(newValue);
      setQuery("");
      setOpen(false);
    }
  }, [query, tags]);

  const filteredTags = React.useMemo(() => {
    if (!query) return tags;
    return tags.filter((tag) =>
      tag.label.toLowerCase().includes(query.toLowerCase()),
    );
  }, [tags, query]);

  const hasNoResults = query.trim() && filteredTags.length === 0;

  const selectedTag = tags.find((tag) => tag.value === selected);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && hasNoResults && query.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <ComboboxRoot
      value={selected}
      onValueChange={setSelected}
      onValueSelected={() => setOpen(false)}
      query={query}
      onQueryChange={setQuery}
    >
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        <PopoverTrigger
          className={cn(
            "px-2 w-[260px] inline-flex items-center justify-between h-9 gap-2 bg-gray-1 shadow-container rounded-lg text-sm font-medium",
            "focus-visible:ring-2 ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-gray-1",
            "transition-all hover:bg-gray-2 data-[state=open]:ring-2 data-[state=open]:ring-offset-2 data-[state=open]:ring-offset-gray-1",
            "dark:bg-gray-2 dark:hover:bg-gray-3",
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {selectedTag ? (
              <>
                <span
                  className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    getTagColor(selectedTag.label),
                  )}
                />
                <span className="truncate text-primary">
                  {selectedTag.label}
                </span>
              </>
            ) : (
              <span className="truncate text-gray-10">Select a label</span>
            )}
          </div>
          <ChevronDownIcon className="w-4 h-4 opacity-60" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-0">
          <ComboboxInput
            className="dark:bg-gray-2 border-b"
            onKeyDown={handleInputKeyDown}
          />
          <ComboboxList
            className="max-h-[300px] p-1 overflow-y-scroll"
            autoFocus={true}
          >
            {tags.map((tag) => (
              <ComboboxItem
                key={tag.value}
                value={tag.value}
                keywords={[tag.label]}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full shrink-0",
                      getTagColor(tag.label),
                    )}
                  />
                  <span className="truncate text-primary">{tag.label}</span>
                </div>
              </ComboboxItem>
            ))}
            <ComboboxEmpty>
              {query.trim() ? (
                <div className="flex flex-col items-center gap-1">
                  <span className="text-sm text-gray-10">
                    Press{" "}
                    <kbd className="px-1 py-0.5 bg-gray-3 rounded text-xs">
                      Enter
                    </kbd>{" "}
                    to add "{query}"
                  </span>
                </div>
              ) : (
                <span>No results found</span>
              )}
            </ComboboxEmpty>
          </ComboboxList>
        </PopoverContent>
      </Popover>
    </ComboboxRoot>
  );
}
