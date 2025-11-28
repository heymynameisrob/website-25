import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  AdjustmentsHorizontalIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  HandThumbDownIcon,
  HandThumbUpIcon,
  MicrophoneIcon,
  PaperClipIcon,
  ShareIcon,
} from "@heroicons/react/16/solid";

import { TextShimmer } from "@/components/demos/TextShimmer";
import { Button } from "@/components/primitives/Button";
import { Tooltip } from "@/components/primitives/Tooltip";
import { useTextStream } from "@/lib/hooks/useTextStream";
import { cn } from "@/lib/utils";

export function Prompt() {
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [value, setValue] = React.useState(
    "Give me some British artists I might like",
  );

  const handleSubmit = () => {
    setIsSubmitted(true);
    setValue("");
  };

  return (
    <div className="w-[480px] flex flex-col gap-4">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={isSubmitted ? "stream" : "welcome"}
          initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
          transition={{
            ease: "easeOut",
            duration: 0.3,
          }}
        >
          {isSubmitted ? (
            <TextStream onComplete={() => setIsCompleted(true)} />
          ) : (
            <Welcome />
          )}
        </motion.div>
      </AnimatePresence>
      <motion.div layout="position">
        <PromptInput
          value={value}
          onValueChange={setValue}
          disabled={isCompleted ? false : isSubmitted}
          onSubmit={handleSubmit}
          isSubmitted={isSubmitted}
        />
      </motion.div>
    </div>
  );
}

function PromptInput({
  disabled,
  value,
  onValueChange,
  onSubmit,
  isSubmitted,
}: {
  disabled?: boolean;
  value: string;
  onValueChange: (value: string) => void;
  isSubmitted?: boolean;
  onSubmit: () => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      onSubmit();
    }
    return;
  };
  return (
    <motion.div
      className={cn(
        "w-full min-w-96 flex items-center justify-between gap-2 bg-background cursor-text rounded-3xl p-3 shadow-container overflow-hidden transition-all focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-ring focus-within:ring-offset-gray-2",
        isSubmitted && "items-end",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <div className="w-full flex flex-col">
        <textarea
          value={value}
          name="prompt"
          placeholder="Ask anything"
          onKeyDown={handleKeyDown}
          rows={1}
          className={cn(
            "px-1.5 text-primary min-h-11 w-full resize-none border-none bg-transparent shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            isSubmitted ? "min-h-11" : "min-h-6",
          )}
          disabled={disabled}
          // Just for display purposes
          onChange={() => {}}
          readOnly={true}
        />
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              key={isSubmitted ? "show" : "hide"}
              initial={{ opacity: 0, y: -14, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ ease: "easeOut", duration: 0.2 }}
              className="flex items-center gap-2"
            >
              <Tooltip content="Attach file">
                <Button size="icon" variant="ghost" className="rounded-full">
                  <PaperClipIcon className="size-4 opacity-70" />
                </Button>
              </Tooltip>
              <Tooltip content="Adjust settings">
                <Button size="icon" variant="ghost" className="rounded-full">
                  <AdjustmentsHorizontalIcon className="size-4 opacity-70" />
                </Button>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="shrink-0 flex items-center justify-end gap-1">
        <Tooltip content="Dictate">
          <Button size="icon" variant="ghost" className="rounded-full">
            <MicrophoneIcon className="size-4 opacity-70" />
          </Button>
        </Tooltip>
        <Tooltip content="Send">
          <Button
            size="icon"
            variant="default"
            className="rounded-full"
            onClick={onSubmit}
          >
            <ArrowUpIcon className="size-4" />
          </Button>
        </Tooltip>
      </div>
    </motion.div>
  );
}

function TextStream({ onComplete }: { onComplete: () => void }) {
  const { message, displayedText, status } = useTextStream({ onComplete });

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
        {status === "thinking" ? (
          <Thinking />
        ) : (
          <>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="prose [--prose-color:var(--color-gray-12)] text-base [&_ul]:mb-6 [&_p]:inline"
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
          </>
        )}
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

function Welcome() {
  return (
    <div className="flex flex-col justify-center items-center text-center mb-4">
      <span className="text-xl font-semibold text-primary lg:text-2xl">
        What do you want to know?
      </span>
    </div>
  );
}

const STATUSES = [
  "Understanding query",
  "Searching the web",
  "Analyzing results",
];

function Thinking() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % STATUSES.length);
    }, 2_000);

    return () => clearTimeout(timer);
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: -4, filter: "blur(2px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ ease: "easeOut", duration: 0.2, delay: 0.5 }}
      className="flex w-full items-center justify-between"
    >
      <button className="flex items-center gap-1 text-sm transition-opacity hover:opacity-80 outline-none focus rounded-md">
        <TextShimmer className="font-medium">{STATUSES[index]}</TextShimmer>
        <ChevronRightIcon className="text-secondary size-4" />
      </button>
      <button
        type="button"
        className="text-secondary underline decoration-gray-7 hover:decoration-gray-12 text-sm transition-all outline-none focus rounded-md"
      >
        Stop
      </button>
    </motion.div>
  );
}
