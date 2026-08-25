import { Calendar } from "@/components/demos/Calendar";
import { Gallery } from "@/components/demos/Gallery";
import { ClipPathSlider } from "@/components/demos/motion/ClipPath";
import { Easing } from "@/components/demos/motion/Easing";
import { Gestures } from "@/components/demos/motion/Gestures";
import { List } from "@/components/demos/motion/List";
import { ResponsiveContainer } from "@/components/demos/motion/ResponsiveContainer";
import { StaggerButtons } from "@/components/demos/motion/StaggerButtons";
import { PostDemo } from "@/components/post/PostDemo";

function renderGallery() {
  return <Gallery />;
}

function renderEasing() {
  return <Easing />;
}

function renderGestures() {
  return <Gestures />;
}

function renderClipPath() {
  return <ClipPathSlider />;
}

function renderCalendar() {
  return <Calendar />;
}

function renderResponsiveContainer() {
  return <ResponsiveContainer />;
}

function renderList() {
  return <List />;
}

function renderStaggerButtons() {
  return <StaggerButtons />;
}

export function GalleryDemo() {
  return (
    <PostDemo
      initialOptions={null}
      className="h-140"
      caption="Tip: Push, pull, or hit esc to close the expanded view"
    >
      {renderGallery}
    </PostDemo>
  );
}

export function EasingDemo() {
  return <PostDemo initialOptions={null}>{renderEasing}</PostDemo>;
}

export function GesturesDemo() {
  return <PostDemo initialOptions={null}>{renderGestures}</PostDemo>;
}

export function ClipPathDemo() {
  return <PostDemo initialOptions={null}>{renderClipPath}</PostDemo>;
}

export function CalendarDemo() {
  return (
    <PostDemo initialOptions={null} className="h-140">
      {renderCalendar}
    </PostDemo>
  );
}

export function ResponsiveContainerDemo() {
  return (
    <PostDemo initialOptions={null} className="h-120">
      {renderResponsiveContainer}
    </PostDemo>
  );
}

export function ListDemo() {
  return <PostDemo initialOptions={null}>{renderList}</PostDemo>;
}

export function StaggerButtonsDemo() {
  return <PostDemo initialOptions={null}>{renderStaggerButtons}</PostDemo>;
}
