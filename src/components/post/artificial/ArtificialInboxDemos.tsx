import { ArtificialInboxFilters } from "@/components/demos/ArtificialInbox/Filters";
import { ArtificialInboxTabs } from "@/components/demos/ArtificialInbox/Tabs";
import { ArtificialTasks } from "@/components/demos/ArtificialInbox/Task";
import { PostDemo } from "@/components/post/PostDemo";

function renderFilters() {
  return <ArtificialInboxFilters />;
}

function renderTabs() {
  return <ArtificialInboxTabs />;
}

function renderTasks() {
  return <ArtificialTasks />;
}

export function ArtificialInboxFiltersDemo() {
  return (
    <PostDemo
      initialOptions={null}
      caption="Side menu has different levels to store lots of options"
    >
      {renderFilters}
    </PostDemo>
  );
}

export function ArtificialInboxTabsDemo() {
  return (
    <PostDemo initialOptions={null} caption="Tip: Drag and drop the tabs to re-order them">
      {renderTabs}
    </PostDemo>
  );
}

export function ArtificialInboxTasksDemo() {
  return (
    <PostDemo initialOptions={null} caption="Tip: Tasks auto-save making it fast to make edits">
      {renderTasks}
    </PostDemo>
  );
}
