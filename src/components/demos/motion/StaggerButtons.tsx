import { motion } from "motion/react";
import { Button } from "@/components/primitives/Button";
import { Tooltip } from "@/components/primitives/Tooltip";
import { HeartIcon, ShareIcon, BookmarkIcon } from "@heroicons/react/16/solid";

const FADE_IN_BLUR = {
  initial: { opacity: 0, y: 10, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: 10, filter: "blur(2px)" },
} as const;

const ACTION_TRANSITION = {
  type: "spring" as const,
  duration: 0.2,
  bounce: 0,
} as const;

interface AnimatedActionProps {
  delay: number;
  children: React.ReactNode;
}

function AnimatedAction({ delay, children }: AnimatedActionProps) {
  return (
    <motion.div {...FADE_IN_BLUR} transition={{ ...ACTION_TRANSITION, delay }}>
      {children}
    </motion.div>
  );
}

export function StaggerButtons() {
  return (
    <div className="flex items-center gap-3 scale-200">
      <AnimatedAction delay={0}>
        <Tooltip content="Like">
          <Button size="icon" variant="ghost">
            <HeartIcon className="size-4 opacity-70" />
          </Button>
        </Tooltip>
      </AnimatedAction>
      <AnimatedAction delay={0.05}>
        <Tooltip content="Share">
          <Button size="icon" variant="ghost">
            <ShareIcon className="size-4 opacity-70" />
          </Button>
        </Tooltip>
      </AnimatedAction>
      <AnimatedAction delay={0.1}>
        <Tooltip content="Save">
          <Button size="icon" variant="ghost">
            <BookmarkIcon className="size-4 opacity-70" />
          </Button>
        </Tooltip>
      </AnimatedAction>
    </div>
  );
}
