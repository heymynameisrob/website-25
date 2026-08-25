import { IconPicker } from "@/components/demos/IconPicker";
import { PostDemo } from "@/components/post/PostDemo";

function renderIconPicker() {
  return <IconPicker />;
}

export function IconPickerDemo() {
  return (
    <PostDemo
      initialOptions={null}
      caption="React port of the N8nIconPicker, which was built in Vue"
    >
      {renderIconPicker}
    </PostDemo>
  );
}
