import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useTextStream } from "@/lib/hooks/useTextStream";
import { Tooltip } from "@/components/primitives/Tooltip";
import { Button } from "@/components/primitives/Button";
import {
  DocumentDuplicateIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisHorizontalIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  ShareIcon,
} from "@heroicons/react/16/solid";
import { GitBranch, RefreshCcw } from "lucide-react";

export function TextStream() {
  const { message, displayedText, status } = useTextStream();

  return (
    <div className="w-full aspect-square flex flex-col justify-start items-start gap-4 mx-auto">
      <article className="w-full flex flex-col items-end gap-2 pl-24">
        <span className="text-sm font-medium text-gray-10">You</span>
        <div className="p-3 rounded-xl bg-gray-3">
          <div className="prose [--prose-color:var(--color-gray-12)] text-base">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{message}</ReactMarkdown>
          </div>
        </div>
      </article>
      <article className="flex flex-col items-start gap-2 w-full">
        <span className="text-sm font-medium text-gray-10">AI</span>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="prose [--prose-color:var(--color-gray-12)] text-base [&_p]:inline"
          >
            {displayedText && (
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {displayedText}
              </ReactMarkdown>
            )}
            {status !== "complete" && (
              <span className="inline-block align-middle size-3.5 rounded-full bg-gray-7 not-prose ml-1 animate-blink" />
            )}
          </motion.div>
          {status === "complete" && <ResponseActions />}
        </AnimatePresence>
      </article>
    </div>
  );
}

const actionOptions = [
  { name: "Copy", icon: DocumentDuplicateIcon },
  { name: "Good response", icon: HandThumbUpIcon },
  { name: "Bad response", icon: HandThumbDownIcon },
  { name: "Share", icon: ShareIcon },
  { name: "More", icon: EllipsisHorizontalIcon },
];

function ResponseActions() {
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
