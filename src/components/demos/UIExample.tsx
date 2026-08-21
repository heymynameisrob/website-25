import * as React from "react";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { Checkin } from "@/components/demos/Checkin";
import { LantumGrid } from "@/components/demos/LantumGrid";
import { LantumBulk } from "@/components/demos/LantumBulk";
import { Button } from "@/components/Button";
import { Tooltip } from "@/components/Tooltip";
import { motion, useAnimation, useInView } from "motion/react";
import { ArtificialInboxTabs } from "@/components/demos/ArtificialInbox/Tabs";
import { ArtificialInboxFilters } from "@/components/demos/ArtificialInbox/Filters";
import { useArtificialInboxStore } from "@/components/demos/ArtificialInbox/Store";
import { ArtificialTasks } from "@/components/demos/ArtificialInbox/Task";
import { Calendar } from "@/components/demos/Calendar";
import { Gallery } from "@/components/demos/Gallery";
import { Calculator } from "@/components/demos/Calculator";
import { Form } from "@/components/demos/Form";
import { MagicText } from "@/components/demos/MagicText";
import { ResponsiveContainer } from "@/components/demos/motion/ResponsiveContainer";
import { Loader } from "@/components/demos/motion/Loader";
import { Thinking } from "@/components/demos/motion/Thinking";
import { Easing } from "@/components/demos/motion/Easing";
import { Gestures } from "@/components/demos/motion/Gestures";
import { ClipPathSlider } from "@/components/demos/motion/ClipPath";
import { List } from "@/components/demos/motion/List";
import { StaggerButtons } from "@/components/demos/motion/StaggerButtons";
import { CushionCommand } from "@/components/demos/CushionCommand";
import { IconPicker } from "@/components/demos/IconPicker";
import { Prompt } from "@/components/demos/Prompt";
import { AgentLoopDemo } from "@/components/remotion";
import { AgentChatInputDemo } from "@/components/post/agents/AgentChatInput";
import { AgentMessages } from "@/components/post/agents/AgentMessages/AgentMessages";

export function UIExample({
  component,
  children,
}: {
  component: string;
  children: React.ReactNode;
}) {
  const [key, setKey] = React.useState(0);
  const containerRef = React.useRef<HTMLElement>(null);
  const shouldMountDemo = useInView(containerRef, {
    amount: "some",
    margin: "200px 0px",
  });
  const controls = useAnimation();
  const resetArtificialInboxStore = useArtificialInboxStore(state => state.reset);

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
  };

  const handleRemount = () => {
    // Reset the ArtificialInbox store if component starts with "artificial-"
    if (component.startsWith("artificial-")) {
      resetArtificialInboxStore();
    }
    setKey(prev => prev + 1);
  };

  return (
    <figure ref={containerRef} className="flex flex-col justify-center items-center gap-2 my-12">
      <div className="group relative w-full not-prose font-sans grid place-items-center aspect-3/2 bg-gray-2 rounded-lg ring-[0.5px] ring-border focus overflow-hidden">
        {shouldMountDemo ? (
          <React.Fragment key={key}>
            {COMPONENT_MAP[component as keyof typeof COMPONENT_MAP] ?? null}
          </React.Fragment>
        ) : null}
        <Tooltip content="Reset" side="left" sideOffset={2}>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Reset demo"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleRemount}
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all"
          >
            <motion.div animate={controls}>
              <ArrowPathIcon className="w-4 h-4 opacity-70" />
            </motion.div>
          </Button>
        </Tooltip>
      </div>
      <figcaption className="text-xs text-gray-10 font-sans">{children}</figcaption>
    </figure>
  );
}

const COMPONENT_MAP = {
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
  "motion-magic-text": <MagicText />,
  "motion-responsive": <ResponsiveContainer />,
  "motion-calendar": <Calendar />,
  "motion-loader": <Loader />,
  "motion-thinking": <Thinking />,
  "motion-easing": <Easing />,
  "motion-gestures": <Gestures />,
  "motion-clip": <ClipPathSlider />,
  "motion-list": <List />,
  "motion-stagger": <StaggerButtons />,
  "home-command-k": <CushionCommand />,
  "icon-picker": <IconPicker />,
  "home-agent-feedback": <Thinking />,
  "home-streaming": <Prompt />,
  "agent-loop": <AgentLoopDemo />,
  "agent-chat-input": <AgentChatInputDemo />,
  "agent-messages": <AgentMessages />,
};
