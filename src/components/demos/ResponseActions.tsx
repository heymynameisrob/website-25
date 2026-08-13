import { motion } from "motion/react";
import {
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  ShareIcon,
} from "@heroicons/react/16/solid";

import { Button } from "@/components/Button";
import { Tooltip } from "@/components/Tooltip";

const actionOptions = [
  { name: "Copy", icon: DocumentDuplicateIcon },
  { name: "Good response", icon: HandThumbUpIcon },
  { name: "Bad response", icon: HandThumbDownIcon },
  { name: "Share", icon: ShareIcon },
  { name: "More", icon: EllipsisHorizontalIcon },
];

export function ResponseActions() {
  return (
    <div className="p-3 flex items-center justify-start gap-3 -mx-3">
      {actionOptions.map((option, index) => {
        const Icon = option.icon;
        return (
          <motion.div
            key={option.name}
            initial={{ y: 8, opacity: 0, filter: "blur(2px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            transition={{ ease: "easeOut", duration: 0.2, delay: index * 0.1 }}
          >
            <Tooltip content={option.name} side="bottom">
              <Button size="icon" variant="ghost">
                <Icon className="size-4 opacity-60" />
              </Button>
            </Tooltip>
          </motion.div>
        );
      })}
    </div>
  );
}
