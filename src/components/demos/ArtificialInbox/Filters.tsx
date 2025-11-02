import * as React from "react";
import {
  AdjustmentsHorizontalIcon,
  ArrowLeftIcon,
  ArrowsUpDownIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  EyeSlashIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  ViewColumnsIcon,
} from "@heroicons/react/16/solid";

import { Button } from "@/components/primitives/Button";
import { Tooltip } from "@/components/primitives/Tooltip";
import {
  ArtificialSkeletonList,
  ArtificialSkeletonTable,
  ArtificialSkeletonTopBar,
  type ArtificialTableOptionsProps,
} from "@/components/demos/ArtificialInbox/Skeletons";
import {
  selectHasChanges,
  useArtificialInboxStore,
  type ArtificialInboxGroupBy,
  type ArtificialInboxSortBy,
} from "@/components/demos/ArtificialInbox/Store";
import { EmojiPicker } from "@/components/primitives/EmojiPicker";
import { Input } from "@/components/primitives/Input";
import {
  List,
  ListItem,
  ListItemContainer,
  ListItemIcon,
  ListItemTitle,
} from "@/components/primitives/List";
import {
  ArtificialInboxKanabanLayoutIcon,
  ArtificialInboxListLayoutIcon,
  ArtificialInboxTableLayoutIcon,
} from "@/components/demos/ArtificialInbox/Icons";
import { cn } from "@/lib/utils";
import { Select, SelectOption } from "@/components/primitives/Select";
import { Sortable, SortableItem } from "@/components/primitives/Sortable";
import { useHotkeys } from "react-hotkeys-hook";
import { Badge } from "@/components/primitives/Badge";

const SKELETON_OPTIONS: ArtificialTableOptionsProps = {
  draft: 6,
  quoted: 4,
  bound: 3,
};

export function ArtificialInboxFilters() {
  return (
    <div className="relative right-16 bottom-0 rounded-md overflow-hidden bg-background w-full shadow-floating aspect-video">
      <div className="w-full flex flex-col">
        <ArtificialSkeletonTopBar />
        <FiltersMain />
      </div>
    </div>
  );
}

function FiltersMain() {
  const view = useArtificialInboxStore((state) => state.view);
  return (
    <>
      <div className="flex items-center justify-end gap-1 h-12 px-3 border-b">
        <Tooltip content="Settings">
          <div>
            <Button size="icon" variant="ghost" className="bg-gray-3">
              <AdjustmentsHorizontalIcon className="size-4 opacity-70" />
            </Button>
          </div>
        </Tooltip>
      </div>
      <ArtificialSkeletonTable options={SKELETON_OPTIONS} />
      <div className="bg-background absolute z-50 flex flex-col shadow-lg inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm top-24">
        {view === "columns" ? <FiltersSheetColumns /> : <FiltersSheetDefault />}
      </div>
    </>
  );
}

function FiltersSheetDefault() {
  const setView = useArtificialInboxStore((state) => state.setView);
  const hasChanges = useArtificialInboxStore(selectHasChanges);
  return (
    <>
      <header className="flex items-center gap-1.5 p-3 h-14 border-b">
        <FiltersNameEmoji />
        {hasChanges && <Badge>Unsaved</Badge>}
      </header>
      <div className="flex flex-col divide-y h-full">
        <FiltersLayoutOptions />
        <List>
          <ListItem onClick={() => setView("columns")}>
            <ListItemContainer>
              <ListItemIcon>
                <ViewColumnsIcon />
              </ListItemIcon>
              <ListItemTitle>Columns</ListItemTitle>
            </ListItemContainer>
            <div className="flex items-center justify-end gap-1 ml-auto">
              <span className="text-sm text-gray-10 text-right font-medium">
                6 visible
              </span>
              <ChevronRightIcon className="size-4 opacity-50" />
            </div>
          </ListItem>
          <ListItem className="hover:bg-transparent pr-0">
            <ListItemContainer>
              <ListItemIcon>
                <Squares2X2Icon />
              </ListItemIcon>
              <ListItemTitle>Group</ListItemTitle>
            </ListItemContainer>
            <FiltersGroupSelect />
          </ListItem>
          <ListItem className="hover:bg-transparent pr-0">
            <ListItemContainer>
              <ListItemIcon>
                <ArrowsUpDownIcon />
              </ListItemIcon>
              <ListItemTitle>Sort</ListItemTitle>
            </ListItemContainer>
            <FiltersSortSelect />
          </ListItem>
        </List>
        <ArtificialSkeletonList count={4} />
        <ArtificialSkeletonList count={3} />
      </div>
    </>
  );
}

function FiltersNameEmoji() {
  const name = useArtificialInboxStore((state) => state.name);
  const setName = useArtificialInboxStore((state) => state.setName);
  const emoji = useArtificialInboxStore((state) => state.emoji);
  const setEmoji = useArtificialInboxStore((state) => state.setEmoji);
  return (
    <div className="flex-1 flex items-center gap-3 pr-1.5">
      <EmojiPicker
        emoji={emoji}
        onEmojiSelect={setEmoji}
        className="bg-gray-2 border border-primary/10 hover:bg-gray-4"
      />
      <Input
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
        className="font-medium px-2 -mx-2 h-8 border-0 focus-visible:bg-gray-3 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:caret-primary"
      />
    </div>
  );
}

function FiltersLayoutOptions() {
  const layout = useArtificialInboxStore((state) => state.layout);
  const setLayout = useArtificialInboxStore((state) => state.setLayout);

  return (
    <div className="flex items-center justify-between px-1.5 py-3 gap-1.5">
      <button
        onClick={() => setLayout("board")}
        className={cn(
          "group flex-1 flex flex-col gap-2 p-3 focus:outline-none",
          layout === "board"
            ? "layout-option-active"
            : "layout-option-inactive",
        )}
      >
        <div
          className={cn(
            "hover:ring-ring ring-2 ring-offset-2 ring-offset-background ring-transparent rounded-lg transition-all group-focus-visible:ring-2 group-focus-visible:ring-ring",
            layout === "board" && "ring-2 ring-blue-600 hover:ring-blue-600",
          )}
        >
          <ArtificialInboxKanabanLayoutIcon />
        </div>
        <span className="text-sm font-medium">Board</span>
      </button>
      <button
        onClick={() => setLayout("list")}
        className={cn(
          "group flex-1 flex flex-col gap-2 p-3 focus:outline-none",
          layout === "list" ? "layout-option-active" : "layout-option-inactive",
        )}
      >
        <div
          className={cn(
            "hover:ring-ring ring-2 ring-offset-2 ring-offset-background ring-transparent rounded-lg transition-all group-focus-visible:ring-2 group-focus-visible:ring-ring",
            layout === "list" && "ring-2 ring-blue-600 hover:ring-blue-600",
          )}
        >
          <ArtificialInboxListLayoutIcon />
        </div>
        <span className="text-sm font-medium">List</span>
      </button>
      <button
        onClick={() => setLayout("table")}
        className={cn(
          "group flex-1 flex flex-col gap-2 p-3 focus:outline-none",
          layout === "table"
            ? "layout-option-active"
            : "layout-option-inactive",
        )}
      >
        <div
          className={cn(
            "hover:ring-ring ring-2 ring-offset-2 ring-offset-background ring-transparent rounded-lg transition-all group-focus-visible:ring-2 group-focus-visible:ring-ring",
            layout === "table" && "ring-2 ring-blue-600 hover:ring-blue-600",
          )}
        >
          <ArtificialInboxTableLayoutIcon />
        </div>
        <span className="text-sm font-medium">Table</span>
      </button>
    </div>
  );
}

function FiltersGroupSelect() {
  const groupBy = useArtificialInboxStore((state) => state.groupBy);
  const setGroupBy = useArtificialInboxStore((state) => state.setGroupBy);

  return (
    <div className="ml-auto">
      <Select
        className="h-7 ml-auto px-2 py-0.5 pr-8 w-[120px] text-sm font-medium"
        value={groupBy}
        onChange={(e) => setGroupBy(e.target.value as ArtificialInboxGroupBy)}
      >
        <SelectOption value="status">Status</SelectOption>
        <SelectOption value="client">Client</SelectOption>
      </Select>
    </div>
  );
}

function FiltersSortSelect() {
  const sortBy = useArtificialInboxStore((state) => state.sortBy);
  const setSortBy = useArtificialInboxStore((state) => state.setSortBy);

  return (
    <div className="ml-auto">
      <Select
        className="h-7 ml-auto px-2 py-0.5 pr-2 w-[120px] text-sm font-medium"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as ArtificialInboxSortBy)}
      >
        <SelectOption value="last_edited">Last edited</SelectOption>
        <SelectOption value="alphabetically">A-Z</SelectOption>
      </Select>
    </div>
  );
}

function FiltersSheetColumns() {
  const [query, setQuery] = React.useState("");
  const columns = useArtificialInboxStore((state) => state.columns);
  const setColumns = useArtificialInboxStore((state) => state.setColumns);
  const view = useArtificialInboxStore((state) => state.view);
  const setView = useArtificialInboxStore((state) => state.setView);

  useHotkeys(
    "esc",
    () => {
      setView("default");
    },
    {
      enableOnFormTags: true,
      enabled: view === "columns",
    },
  );

  const handleToggleColumn = (id: string) => {
    const updatedColumns = columns.map((col) =>
      col.id === id ? { ...col, value: !col.value } : col,
    );
    setColumns(updatedColumns);
  };

  const handleSort = (sortedColumns: typeof columns) => {
    setColumns(sortedColumns);
  };

  const filteredColumns = React.useMemo(() => {
    if (!query.trim()) return columns;

    const searchTerm = query.toLowerCase();
    return columns.filter((col) => {
      const idMatch = col.id.toLowerCase().includes(searchTerm);
      const labelMatch = col.label.toLowerCase().includes(searchTerm);
      return idMatch || labelMatch;
    });
  }, [query, columns]);

  return (
    <>
      <header className="flex items-center gap-1.5 p-3 h-14 border-b">
        <Button size="icon" variant="ghost" onClick={() => setView("default")}>
          <ArrowLeftIcon className="size-4 opacity-70" />
        </Button>
        <h2 className="text-sm font-medium text-primary">Columns</h2>
      </header>
      <div className="flex flex-col py-3 h-full">
        <div className="px-3">
          <div className="h-9 px-1.5 rounded-md border bg-background flex items-center gap-2 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring focus-within:ring-background">
            <MagnifyingGlassIcon className="shrink-0 size-4 opacity-70" />
            <Input
              type="search"
              placeholder="Search columns"
              className="h-9 px-0 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              value={query}
              autoFocus
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <List>
          <Sortable
            items={filteredColumns}
            onSort={handleSort}
            orientation="vertical"
          >
            {filteredColumns.map((col) => (
              <SortableItem key={col.id} id={col.id}>
                <ListItem className="hover:bg-transparent">
                  <ListItemContainer>
                    <ListItemIcon className="cursor-grab active:cursor-grabbing">
                      <EllipsisVerticalIcon className="size-4 opacity-50" />
                    </ListItemIcon>
                    <ListItemTitle>{col.label}</ListItemTitle>
                  </ListItemContainer>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="ml-auto"
                    onClick={() => handleToggleColumn(col.id)}
                  >
                    {col.value ? (
                      <EyeIcon className="size-4 opacity-70" />
                    ) : (
                      <EyeSlashIcon className="size-4 opacity-70" />
                    )}
                  </Button>
                </ListItem>
              </SortableItem>
            ))}
          </Sortable>
        </List>
      </div>
    </>
  );
}
