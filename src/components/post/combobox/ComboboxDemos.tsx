import { PostDemo } from "@/components/post/PostDemo";
import { ComboboxPopoverMenu } from "@/components/examples/ComboboxMenu";
import { ComboboxSidebar } from "@/components/examples/ComboboxSidebar";
import { ComboboxBasic } from "@/components/examples/ComboboxBasic";
import { ComboboxDynamic } from "@/components/examples/ComboboxDynamic";
import type { ComboboxCountry } from "@/components/examples/ComboboxMenu";

const DEMO_COUNTRIES: ComboboxCountry[] = [
  ["Australia", "au"],
  ["Brazil", "br"],
  ["Canada", "ca"],
  ["France", "fr"],
  ["Germany", "de"],
  ["India", "in"],
  ["Japan", "jp"],
  ["New Zealand", "nz"],
  ["South Africa", "za"],
  ["United Kingdom", "gb"],
  ["United States", "us"],
].map(([name, code]) => ({
  name: { common: name },
  flags: {
    png: `https://flagcdn.com/w40/${code}.png`,
    svg: `https://flagcdn.com/${code}.svg`,
    alt: `${name} flag`,
  },
}));

function renderPopoverMenu() {
  return <ComboboxPopoverMenu items={DEMO_COUNTRIES} />;
}

function renderSidebar() {
  return <ComboboxSidebar />;
}

function renderBasic() {
  return <ComboboxBasic />;
}

function renderDynamic() {
  return <ComboboxDynamic />;
}

export function ComboboxPopoverMenuDemo() {
  return (
    <PostDemo initialOptions={null} caption="Typical combobox mounted in a popover menu, making a filterable dropdown menu">
      {renderPopoverMenu}
    </PostDemo>
  );
}

export function ComboboxSidebarDemo() {
  return (
    <PostDemo initialOptions={null} caption="Mount as a filterable list with async search">
      {renderSidebar}
    </PostDemo>
  );
}

export function ComboboxBasicDemo() {
  return (
    <PostDemo initialOptions={null} caption="Traditional combobox/autocomplete">
      {renderBasic}
    </PostDemo>
  );
}

export function ComboboxDynamicDemo() {
  return (
    <PostDemo initialOptions={null} caption="Add new tags dynamically">
      {renderDynamic}
    </PostDemo>
  );
}
