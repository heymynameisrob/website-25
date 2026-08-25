import { ComboboxPopoverMenu } from "@/components/examples/ComboboxMenu";
import { PostDemo } from "@/components/post/PostDemo";

function renderFilterMenu() {
  return <ComboboxPopoverMenu />;
}

export function FilterMenuDemo() {
  return (
    <PostDemo
      initialOptions={null}
      caption="Primitive example of a filterable dropdown menu AKA combobox"
    >
      {renderFilterMenu}
    </PostDemo>
  );
}
