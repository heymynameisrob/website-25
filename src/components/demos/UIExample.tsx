import * as React from "react";
import {
  FilterMenu,
  FilterMenuContent,
  FilterMenuInput,
  FilterMenuItem,
  FilterMenuList,
  FilterMenuTrigger,
} from "@/components/demos/FilterMenu";
import { ChevronDownIcon, ArrowPathIcon } from "@heroicons/react/16/solid";
import { Checkin } from "@/components/demos/Checkin";
import { LantumGrid } from "@/components/demos/LantumGrid";
import { LantumBulk } from "@/components/demos/LantumBulk";
import { Button } from "@/components/primitives/Button";
import { Tooltip } from "@/components/primitives/Tooltip";
import { motion, useAnimation } from "motion/react";
import { ArtificialInboxTabs } from "@/components/demos/ArtificialInbox/Tabs";
import { ArtificialInboxFilters } from "@/components/demos/ArtificialInbox/Filters";
import { useArtificialInboxStore } from "@/components/demos/ArtificialInbox/Store";
import { ArtificialTasks } from "@/components/demos/ArtificialInbox/Task";
import { MagicText } from "@/components/demos/motion/MagicText";
import { ResponsiveContainer } from "@/components/demos/motion/ResponsiveContainer";

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
  const [key, setKey] = React.useState(0);
  const controls = useAnimation();
  const resetArtificialInboxStore = useArtificialInboxStore(
    (state) => state.reset,
  );

  const handleMouseDown = () => {
    controls.start({
      rotate: 50,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    });
  };

  const handleMouseUp = () => {
    controls.start({
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
      },
    });
    setKey((prev) => prev + 1);
  };

  const handleRemount = () => {
    // Reset the ArtificialInbox store if component starts with "artificial-"
    if (component.startsWith("artificial-")) {
      resetArtificialInboxStore();
    }
    setKey((prev) => prev + 1);
  };

  return (
    <figure className="flex flex-col justify-center items-center gap-2 my-8 demo not-prose overflow-hidden">
      <div className="relative grid place-items-center w-full aspect-3/2 border bg-gray-2 rounded-md after:pointer-events-none after:absolute after:inset-0 bg-[radial-gradient(var(--pattern-fg)_1px,transparent_0)] bg-size-[10px_10px] bg-fixed [--pattern-fg:var(--border)] my-0">
        <React.Fragment key={key}>{COMPONENT_MAP[component]}</React.Fragment>
        <Tooltip content="Reset" side="left" sideOffset={2}>
          <Button
            size="icon"
            aria-label="Reset demo"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleRemount}
            className="absolute bottom-2 right-2"
          >
            <motion.div animate={controls}>
              <ArrowPathIcon className="w-4 h-4 opacity-70" />
            </motion.div>
          </Button>
        </Tooltip>
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
      <FilterMenuTrigger className="px-2 w-[160px] inline-flex items-center justify-between h-9 gap-2 bg-gray-1 border transition-all whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-hidden cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:w-4 [&_svg]:h-4 [&_svg]:shrink-0 [&_svg]:opacity-80 text-primary hover:bg-gray-2 active:bg-gray-2 data[state=open]:bg-gray-2 data-[state=open]:bg-gray-2">
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

const COMPONENT_MAP = {
  "filter-menu": <FilterMenuExample />,
  checkin: <Checkin />,
  "lantum-grid": <LantumGrid />,
  "lantum-bulk": <LantumBulk />,
  "artificial-inbox-tabs": <ArtificialInboxTabs />,
  "artificial-inbox-filters": <ArtificialInboxFilters />,
  "artificial-inbox-tasks": <ArtificialTasks />,
  "motion-magic-text": (
    <MagicText title="There's one word for that: Magic Text!" />
  ),
  "motion-responsive": <ResponsiveContainer />,
};
