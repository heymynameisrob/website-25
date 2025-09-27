import * as React from "react";
import {
  Tabs,
  TabsTrigger,
  TabsList,
  TabsContent,
} from "@/components/primitives/Tabs";
import {
  FilterMenu,
  FilterMenuContent,
  FilterMenuInput,
  FilterMenuItem,
  FilterMenuList,
  FilterMenuTrigger,
} from "@/components/demos/FilterMenu";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { Checkin } from "@/components/demos/Checkin";
import { LantumGrid } from "@/components/demos/LantumGrid";
import { LantumBulk } from "@/components/demos/LantumBulk";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export type ButtonSize = "sm" | "xs" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  className?: string;
}

export function UIExample({
  component,
  children,
}: {
  component: "filter-menu" | "checkin";
  children: React.ReactNode;
}) {
  const COMPONENT_MAP = {
    "filter-menu": <FilterMenuExample />,
    checkin: <Checkin />,
    "lantum-grid": <LantumGrid />,
    "lantum-bulk": <LantumBulk />,
  };

  return (
    <figure className="flex flex-col justify-center items-center gap-2 my-[2em] demo">
      <div className="relative grid place-items-center w-full aspect-[3/2] border bg-gray-3 rounded-md after:pointer-events-none after:absolute after:inset-0 bg-[image:radial-gradient(var(--pattern-fg)_1px,_transparent_0)] bg-[size:10px_10px] bg-fixed [--pattern-fg:var(--border)] my-0">
        {COMPONENT_MAP[component]}
      </div>
      <span className="text-xs text-secondary">{children}</span>
    </figure>
  );
}

const USERS = [
  { value: "dave-hawkins", label: "Dave Hawkins" },
  { value: "rob-hough", label: "Rob Hough" },
  { value: "jon-lay", label: "Jon Lay" },
  { value: "tim-bates", label: "Tim Bates" },
];

export const FilterMenuExample = () => {
  const [selected, setSelected] = React.useState("");

  return (
    <FilterMenu value={selected} onValueChange={setSelected}>
      <FilterMenuTrigger className="px-2 w-[160px] inline-flex items-center justify-between h-9 gap-2 bg-gray-1 border transition-all whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0 [&_svg]:opacity-80 text-primary hover:bg-gray-2 active:bg-gray-2 data[state=open]:bg-gray-2 data-[state=open]:bg-gray-2">
        <div className="flex items-center gap-2">
          {selected.length > 0 ? (
            <div className="w-4 h-4 rounded-full bg-cyan-500" />
          ) : null}
          {USERS.find((user) => user.value === selected)?.label ??
            "Select a user"}
        </div>
        <ChevronDownIcon className="w-4 h-4 opacity-60" />
      </FilterMenuTrigger>
      <FilterMenuContent align="start" className="w-56">
        <FilterMenuInput />
        <FilterMenuList items={USERS} keys={["label", "role"]}>
          {(item) => (
            <FilterMenuItem value={item.value}>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-cyan-500" />
                <span>{item.label}</span>
              </div>
            </FilterMenuItem>
          )}
        </FilterMenuList>
      </FilterMenuContent>
    </FilterMenu>
  );
};
