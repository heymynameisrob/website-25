import * as React from "react";
import { motion, useAnimation } from "motion/react";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { Button } from "@/components/primitives/Button";
import { Tooltip } from "@/components/primitives/Tooltip";
import { useArtificialInboxStore } from "@/components/demos/ArtificialInbox/Store";
import { FilterMenuExample } from "@/components/demos/UIExample";
import { Checkin } from "@/components/demos/Checkin";
import { LantumGrid } from "@/components/demos/LantumGrid";
import { LantumBulk } from "@/components/demos/LantumBulk";
import { ArtificialInboxTabs } from "@/components/demos/ArtificialInbox/Tabs";
import { ArtificialInboxFilters } from "@/components/demos/ArtificialInbox/Filters";
import { ArtificialTasks } from "@/components/demos/ArtificialInbox/Task";
import { Calendar } from "@/components/demos/Calendar";
import { Gallery } from "@/components/demos/Gallery";
import { Calculator } from "@/components/demos/Calculator";
import { Form } from "@/components/demos/Form";
import { cn } from "@/lib/utils";

const COMPONENT_MAP: Record<string, React.ReactNode> = {
  "filter-menu": <FilterMenuExample />,
  checkin: <Checkin />,
  "lantum-grid": <LantumGrid />,
  "lantum-bulk": <LantumBulk />,
  "artificial-inbox-tabs": <ArtificialInboxTabs />,
  "artificial-inbox-filters": <ArtificialInboxFilters />,
  "artificial-inbox-tasks": <ArtificialTasks />,
  calendar: <Calendar />,
  gallery: <Gallery />,
  calculator: <Calculator />,
  form: <Form />,
};

export function DemoWrapper({
  componentId,
  className,
}: {
  componentId: string;
  className?: string;
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
    if (componentId.startsWith("artificial-")) {
      resetArtificialInboxStore();
    }
    setKey((prev) => prev + 1);
  };

  return (
    <figure
      className={cn(
        "relative grid place-items-center aspect-square bg-gray-2",
        className,
      )}
    >
      <React.Fragment key={key}>{COMPONENT_MAP[componentId]}</React.Fragment>
    </figure>
  );
}
