import * as React from "react";
import { ArrowUpIcon, SquareIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/Button";
import { PostDemo } from "@/components/post/PostDemo";
import { Switch } from "@/components/Switch";

interface SendStopOptions {
  isStreaming: boolean;
}

interface SendStopRenderProps {
  options: SendStopOptions;
  setOptions: React.Dispatch<React.SetStateAction<SendStopOptions>>;
}

const INITIAL_OPTIONS: SendStopOptions = { isStreaming: false };
const TRANSITION = { type: "spring" as const, duration: 0.2, bounce: 0 };

function SendStopButton({ isStreaming }: { isStreaming: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Button
      type="button"
      size="icon"
      variant={isStreaming ? "destructive" : "accent"}
      className="size-10"
      aria-label={isStreaming ? "Stop response" : "Send message"}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={isStreaming ? "stop" : "send"}
          className="grid place-items-center"
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.5 }}
          transition={shouldReduceMotion ? { duration: 0 } : TRANSITION}
        >
          {isStreaming ? (
            <SquareIcon className="size-3.5 fill-current" />
          ) : (
            <ArrowUpIcon className="size-4" />
          )}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}

function renderSendStopButton({ options }: SendStopRenderProps) {
  return <SendStopButton isStreaming={options.isStreaming} />;
}

function renderSendStopControls({ options, setOptions }: SendStopRenderProps) {
  function handleStreamingChange(isStreaming: boolean) {
    setOptions(function updateOptions(currentOptions) {
      return { ...currentOptions, isStreaming };
    });
  }

  return (
    <div className="flex items-center gap-2 font-sans text-sm font-medium text-primary">
      <Switch
        id="send-stop-streaming"
        checked={options.isStreaming}
        onCheckedChange={handleStreamingChange}
      />
      <label htmlFor="send-stop-streaming">Streaming</label>
    </div>
  );
}

export function SendStopButtonDemo() {
  return (
    <PostDemo
      initialOptions={INITIAL_OPTIONS}
      controls={renderSendStopControls}
      caption="Toggle the streaming state to switch between the send and stop actions."
    >
      {renderSendStopButton}
    </PostDemo>
  );
}
