import { useState } from "react";

import {
  IconPickerSearchGrid,
  type IconOrEmoji,
  type PickerItem,
  useIconPickerItems,
} from "@/components/demos/IconPicker";
import { PostDemo } from "@/components/post/PostDemo";

const DEMO_COLOR = "#737373";

function DemoGrid() {
  const [value, setValue] = useState<IconOrEmoji>();
  const { iconItems } = useIconPickerItems();

  function selectItem(item: PickerItem) {
    setValue({ type: "icon", value: item.value, color: DEMO_COLOR });
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-gray-1 scrollbar-gutter-auto dark:bg-gray-2">
      <IconPickerSearchGrid
        items={iconItems}
        tab="icons"
        color={DEMO_COLOR}
        selectedValue={value}
        onSelect={selectItem}
      />
    </div>
  );
}

function renderDemo() {
  return <DemoGrid />;
}

export function KeyNavDemo() {
  return (
    <PostDemo
      initialOptions={null}
      className="h-120"
      caption="Focus on the search input to enable key navigation"
    >
      {renderDemo}
    </PostDemo>
  );
}
