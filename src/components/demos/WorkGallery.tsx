import type { ComponentType } from "react";

import { AsciiGlobe } from "@/components/demos/AsciiGlobe";
import { AsciiGrid } from "@/components/demos/AsciiGrid";
import { AsciiSmiley } from "@/components/demos/AsciiSmiley";
import { ArtificialInboxFilters } from "@/components/demos/ArtificialInbox/Filters";
import { ArtificialInboxTabs } from "@/components/demos/ArtificialInbox/Tabs";
import { ArtificialTasks } from "@/components/demos/ArtificialInbox/Task";
import { Calendar } from "@/components/demos/Calendar";
import { Checkin } from "@/components/demos/Checkin";
import { CushionCommand } from "@/components/demos/CushionCommand";
import { Form } from "@/components/demos/Form";
import { Gallery } from "@/components/demos/Gallery";
import { IconPicker } from "@/components/demos/IconPicker/IconPicker";
import { LantumBulk } from "@/components/demos/LantumBulk";
import { LantumGrid } from "@/components/demos/LantumGrid";
import { MagicText } from "@/components/demos/MagicText";
import { ClipPathSlider } from "@/components/demos/motion/ClipPath";
import { Easing } from "@/components/demos/motion/Easing";
import { Gestures } from "@/components/demos/motion/Gestures";
import { List } from "@/components/demos/motion/List";
import { ResponsiveContainer } from "@/components/demos/motion/ResponsiveContainer";
import { StaggerButtons } from "@/components/demos/motion/StaggerButtons";
import { Thinking } from "@/components/demos/motion/Thinking";
import { Prompt } from "@/components/demos/Prompt";
import { ResponseActions } from "@/components/demos/ResponseActions";
import { Toolbar } from "@/components/demos/Toolbar";
import { PostDemo } from "@/components/post/PostDemo";

interface GalleryItem {
  title: string;
  component: ComponentType;
  className?: string;
}

const DEMOS: GalleryItem[] = [
  { title: "ASCII globe", component: AsciiGlobe, className: "p-0" },
  { title: "Response actions", component: ResponseActions },
  { title: "Calendar", component: Calendar, className: "h-140" },
  { title: "Toolbar", component: Toolbar },
  { title: "Email login", component: Form },
  { title: "Check-in", component: Checkin },
  { title: "Prompt", component: Prompt },
];

/** Show each standalone demo in the shared frame with a title caption. */
export function WorkGallery() {
  return <>{DEMOS.map(renderDemo)}</>;
}

/** Keep each demo's content under the frame's viewport mount control. */
function renderDemo({ title, component: Component, className }: GalleryItem) {
  function renderContent() {
    return <Component />;
  }

  return (
    <PostDemo key={title} initialOptions={null} caption={title} className={className}>
      {renderContent}
    </PostDemo>
  );
}
