import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { ArrowUpRight, Code2Icon, FullscreenIcon, RefreshCcw } from "lucide-react";
import { Button, buttonVariants } from "@/components/primitives/Button";
import { Tooltip } from "@/components/primitives/Tooltip";
import { CushionCommand } from "@/components/demos/CushionCommand";
import { Thinking } from "@/components/demos/motion/Thinking";
import { Prompt } from "@/components/demos/Prompt";

interface DemoItem {
  id: string;
  name: string;
  description: string;
  fileName: string;
  preview: React.ReactNode;
  component: React.ReactNode;
}

const SKELETON_PULSE = {
  animate: { opacity: [0.5, 1, 0.5] },
  transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" as const },
};

function CmdkPreview() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const rowRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setSelectedIndex(prev => (prev >= 6 ? 0 : prev + 1));
    }, 700);
    return () => window.clearInterval(id);
  }, []);

  React.useEffect(() => {
    const target = rowRefs.current[selectedIndex];
    const container = listRef.current;
    if (!target || !container) return;
    const top = target.offsetTop + target.clientHeight - container.clientHeight;
    container.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, [selectedIndex]);

  const rows = [
    { keyHint: "+", w: "w-24" },
    { keyHint: "#", w: "w-32" },
    { keyHint: "@", w: "w-20" },
    { keyHint: null, w: "w-24" },
    { keyHint: null, w: "w-20" },
    { keyHint: null, w: "w-40" },
    { keyHint: null, w: "w-28" },
  ] as const;

  return (
    <div className="w-full aspect-[4/3] rounded-xl border border-gray-4 bg-background overflow-hidden text-left">
      <div className="sticky top-0 z-10 h-10 border-b border-gray-4 bg-background px-3 flex items-center">
        <div className="h-3 w-4/5 rounded bg-gray-4" />
      </div>
      <div ref={listRef} className="p-2 space-y-1.5 max-h-[180px] overflow-y-auto scroll-smooth">
        <div className="h-3 w-24 rounded bg-gray-4 mx-1" />
        {rows.slice(0, 3).map((row, index) => {
          const rowKey = `s-${row.w}-${row.keyHint ?? "none"}`;
          return (
          <motion.div
            key={rowKey}
            ref={el => {
              rowRefs.current[index] = el;
            }}
            className="h-9 rounded-lg px-2 flex items-center justify-between"
            animate={{ backgroundColor: selectedIndex === index ? "var(--color-gray-2)" : "transparent" }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center gap-2">
              <div className="size-4 rounded bg-gray-4" />
              <div className={`h-3 rounded bg-gray-5 ${row.w}`} />
            </div>
            {row.keyHint && <div className="h-5 w-5 rounded bg-gray-3" />}
          </motion.div>
          );
        })}
        <div className="h-3 w-16 rounded bg-gray-4 mx-1 mt-1" />
        {rows.slice(3).map((row, idx) => {
          const index = idx + 3;
          return (
            <motion.div
              key={`g-${index}`}
              ref={el => {
                rowRefs.current[index] = el;
              }}
              className="h-9 rounded-lg px-2 flex items-center justify-between"
              animate={{ backgroundColor: selectedIndex === index ? "var(--color-gray-2)" : "transparent" }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-center gap-2">
                <div className="size-4 rounded bg-gray-4" />
                <div className={`h-3 rounded bg-gray-5 ${row.w}`} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ThinkingPreview() {
  return <StreamingPreview />;
}

function StreamingPreview() {
  const [userVisible, setUserVisible] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const streamContainerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let streamInterval: number | null = null;
    let streamStartTimeout: number | null = null;

    const runCycle = () => {
      setUserVisible(false);
      setStep(0);

      const showUserTimeout = window.setTimeout(() => {
        setUserVisible(true);
      }, 120);

      streamStartTimeout = window.setTimeout(() => {
        streamInterval = window.setInterval(() => {
          setStep(prev => {
            if (prev >= 8) {
              window.clearInterval(streamInterval!);
              streamInterval = null;
              return 8;
            }
            return prev + 1;
          });
        }, 520);
      }, 700);

      return () => {
        window.clearTimeout(showUserTimeout);
        if (streamStartTimeout) window.clearTimeout(streamStartTimeout);
        if (streamInterval) window.clearInterval(streamInterval);
      };
    };

    let cleanupCycle = runCycle();
    const cycleId = window.setInterval(() => {
      cleanupCycle();
      cleanupCycle = runCycle();
    }, 6200);

    return () => {
      cleanupCycle();
      window.clearInterval(cycleId);
    };
  }, []);

  React.useEffect(() => {
    if (step <= 0) return;
    const container = streamContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [step]);

  const tokenRows = [
    [18, 30, 22, 26, 16, 24],
    [20, 28, 14, 18, 22, 16],
    [26, 20, 18, 24, 17, 21],
    [16, 19, 23, 28, 15, 20],
    [22, 18, 26, 16, 24, 14],
  ];

  return (
    <div className="w-full h-[200px] flex flex-col px-2 py-3">
        <div
          ref={streamContainerRef}
          className="space-y-2 pt-1 flex-1 min-h-0 overflow-y-auto scroll-smooth pr-1 pb-2 mask-y-from-70%"
        >
        <div className="w-full pt-1 space-y-2">
          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: userVisible ? 1 : 0, y: userVisible ? 0 : 6 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <div className="w-[80%] rounded-xl bg-gray-2 p-2.5 space-y-1.5">
              <div className="h-3 w-full rounded bg-gray-4" />
              <div className="h-3 w-9/12 rounded bg-gray-4" />
            </div>
          </motion.div>
          <div className="h-3 w-10 rounded bg-gray-4" />
            {tokenRows.map((row, rowIndex) => {
              const visibleStep = rowIndex + 1;
              if (step < visibleStep) return null;
              const rowKey = `row-${row.join("-")}`;
              return (
                <div key={rowKey} className="flex flex-wrap gap-1.5">
                  {row.map(w => (
                    <motion.div
                      key={`${rowKey}-${w}`}
                      className="h-3 rounded bg-[#dbe6cf]"
                      style={{ width: `${w}px` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.14 }}
                    />
                  ))}
                </div>
              );
            })}
            {step >= 6 && (
              <div className="flex items-center gap-2 pt-1">
                <div className="flex flex-wrap gap-1.5">
                  {[20, 24, 18, 22, 16, 19, 23].map(w => (
                    <motion.div
                      key={`tail-${w}`}
                      className="h-3 rounded bg-[#dbe6cf]"
                      style={{ width: `${w}px` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.14 }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      <div className="flex items-center justify-between h-9 shrink-0 rounded-full ring-1 ring-border bg-gray-1 px-3 py-2.5">
        <div className="h-3 w-24 rounded bg-gray-3" />

          <div className="flex items-center gap-2">
            <div className="size-3 rounded bg-gray-3" />
            <div className="size-5 rounded-full bg-gray-5" />
          </div>
      </div>
    </div>
  );
}

function AgentFeedbackPreview() {
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    const cycle = () => {
      setExpanded(false);
      const expandTimeout = window.setTimeout(() => setExpanded(true), 3300);
      const collapseTimeout = window.setTimeout(() => setExpanded(false), 4700);
      return () => {
        window.clearTimeout(expandTimeout);
        window.clearTimeout(collapseTimeout);
      };
    };

    const clearTimers = cycle();
    const intervalId = window.setInterval(() => {
      clearTimers();
      cycle();
    }, 5400);

    return () => {
      clearTimers();
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="w-full max-w-[260px] rounded-xl border border-gray-4 bg-background overflow-hidden">
      <div className="p-3 space-y-2">
        <StreamingCommentSkeleton />
      </div>
      <div className="h-px w-full bg-gray-3" />
      <motion.div layout transition={{ duration: 0.35, ease: "easeInOut" }} className="relative p-3 overflow-hidden">
        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: expanded ? 0 : 1, height: expanded ? 0 : "auto" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <div className="relative flex size-4 items-center justify-center overflow-hidden rounded-full p-[1px]">
            <motion.div
              className="absolute top-[-50%] left-[-50%] h-[200%] w-[200%]"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0%, var(--color-primary) 10%, var(--color-primary) 25%, transparent 35%)",
              }}
              animate={{ transform: ["rotate(0deg)", "rotate(360deg)"] }}
              transition={{ duration: 0.475, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative z-10 flex size-full items-center justify-center rounded-full bg-background">
              <div className="size-2.5 rounded-full bg-gray-5" />
            </div>
          </div>
          <motion.div className="h-3 w-28 rounded bg-gray-3" {...SKELETON_PULSE} transition={{ ...SKELETON_PULSE.transition, delay: 0.1 }} />
          <motion.div
            className="ml-1 size-2 rounded-full bg-gray-7"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div
          className="space-y-2"
          animate={{ opacity: expanded ? 1 : 0, height: expanded ? "auto" : 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
        >
          <StreamingCommentSkeleton />
        </motion.div>
      </motion.div>
    </div>
  );
}

function StreamingCommentSkeleton() {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="size-4 rounded-full bg-gray-4" />
        <div className="h-3 w-20 rounded bg-[#dbe6cf]" />
      </div>
      <div className="h-3 rounded bg-[#dbe6cf]" style={{ width: "100%" }} />
      <div className="h-3 rounded bg-[#dbe6cf]" style={{ width: "94%" }} />
    </>
  );
}

const DEMOS_WITH_PREVIEWS: DemoItem[] = [
  {
    id: "cmdk",
    name: "Command K",
    description: "⌘K menu used in cushion.so. Full workspace search with pagniation and shortcuts",
    fileName: "CushionCommand.tsx",
    preview: <CmdkPreview />,
    component: <CushionCommand />,
  },
  {
    id: "thinking",
    name: "Agent Feedback",
    description:
      "Cushion agent giving status feedback, showing how the model is processing the request and what tools it's using, then replying with the model response to the query.",
    fileName: "motion/Thinking.tsx",
    preview: <AgentFeedbackPreview />,
    component: <Thinking />,
  },
  {
    id: "ai-stream",
    name: "Streaming",
    description:
      "Prompt and streamdown of text, typical in AI chatbots. Parses markdown and animates in each chunk to simulate a SSE stream from API.",
    fileName: "Prompt.tsx",
    preview: <StreamingPreview />,
    component: <Prompt />,
  },
];

export function HomeWorkGrid() {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [modalResetKey, setModalResetKey] = React.useState(0);
  const activeDemo = React.useMemo(() => DEMOS_WITH_PREVIEWS.find(item => item.id === activeId), [activeId]);

  return (
    <>
      <section className="w-full" data-home-work-grid>
        <div className="grid grid-cols-2 gap-3">
          {DEMOS_WITH_PREVIEWS.map(item => (
            <article
              key={item.id}
              onClick={() => setActiveId(item.id)}
              className="relative grid place-items-center p-5 aspect-[4/3] bg-gray-2 rounded-lg border overflow-hidden cursor-pointer"
            >
                {item.preview}
                <span className="sr-only">{item.name}</span>
              <div className="absolute inset-x-0 bottom-0 p-2 flex justify-end gap-2 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <Tooltip content="Reset">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={event => {
                      event.stopPropagation();
                    }}
                  >
                    <RefreshCcw className="size-4 opacity-70" />
                  </Button>
                </Tooltip>
                <Tooltip content="Fullscreen">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={event => {
                      event.stopPropagation();
                      setActiveId(item.id);
                    }}
                  >
                    <FullscreenIcon className="size-4 opacity-70" />
                  </Button>
                </Tooltip>
              </div>
            </article>
          ))}
        </div>
      </section>

      <DialogPrimitive.Root open={!!activeId} onOpenChange={open => !open && setActiveId(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 backdrop-blur-sm z-40" />
          <DialogPrimitive.Content
            onCloseAutoFocus={event => event.preventDefault()}
            className={cn(
              "fixed inset-0 z-50 h-full bg-background outline-none",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:blur-in-md",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:blur-out-md"
            )}
          >
            <div className="flex flex-col lg:grid lg:grid-cols-[340px_1fr] h-full p-4">
              <aside className="w-full flex flex-col p-4 gap-4">
                <h3 className="text-lg font-medium font-serif text-primary">{activeDemo?.name}</h3>
                <p className="text-base font-medium text-gray-10 tracking-[-0.01em] text-balance">{activeDemo?.description}</p>
                <ul className="flex flex-col gap-2 mt-4">
                  <li>
                    <button onClick={() => setModalResetKey(prev => prev + 1)} className="flex items-center gap-2 text-gray-10 font-medium hover:text-primary transition-all tracking-[-0.01em]">
                      <RefreshCcw className="size-4" />
                      <span>Reset instance</span>
                    </button>
                  </li>
                  <li>
                    <a
                      href={`https://github.com/heymynameisrob/website-25/blob/main/src/components/demos/${activeDemo?.fileName || ""}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-10 font-medium hover:text-primary transition-all tracking-[-0.01em]"
                    >
                      <Code2Icon className="size-4 mr-2" />
                      <span>View on Github</span>
                      <ArrowUpRight className="ml-1 size-4 opacity-50" />
                    </a>
                  </li>
                </ul>
              </aside>
              <section className="grid place-items-center">
                <motion.div key={`${activeDemo?.id}-${modalResetKey}`}>{activeDemo?.component}</motion.div>
              </section>
            </div>
            <div className="absolute top-4 right-4">
              <DialogPrimitive.Close className={buttonVariants({ size: "icon", variant: "ghost" })}>
                <XMarkIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
}
