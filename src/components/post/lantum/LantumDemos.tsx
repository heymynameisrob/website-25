import { LantumBulk } from "@/components/demos/LantumBulk";
import { LantumGrid } from "@/components/demos/LantumGrid";
import { PostDemo } from "@/components/post/PostDemo";

function renderGrid() {
  return <LantumGrid />;
}

function renderBulkActions() {
  return <LantumBulk />;
}

export function LantumGridDemo() {
  return (
    <PostDemo initialOptions={null} caption="Drag and drop the shift to re-assign to someone else">
      {renderGrid}
    </PostDemo>
  );
}

export function LantumBulkDemo() {
  return (
    <PostDemo
      initialOptions={null}
      caption="Hold ⇧ when clicking a session to activate selecting mode"
    >
      {renderBulkActions}
    </PostDemo>
  );
}
