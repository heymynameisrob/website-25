import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CustomHoverCard } from "@/components/CustomHoverCard";

interface DemoItem {
  id: string;
  name: string;
  description: string;
  href: string;
  preview: React.ReactNode;
}

const SKELETON_PULSE = {
  animate: { opacity: [0.5, 1, 0.5] },
  transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" as const },
};

// Static data hoisted to avoid recreation on every render
const CMDK_ROWS = [
  { keyHint: "+", w: "w-24" },
  { keyHint: "#", w: "w-32" },
  { keyHint: "@", w: "w-20" },
  { keyHint: null, w: "w-24" },
  { keyHint: null, w: "w-20" },
  { keyHint: null, w: "w-40" },
  { keyHint: null, w: "w-28" },
] as const;

const STREAMING_TOKEN_ROWS = [
  [18, 30, 22, 26, 16, 24],
  [20, 28, 14, 18, 22, 16],
  [26, 20, 18, 24, 17, 21],
  [16, 19, 23, 28, 15, 20],
  [22, 18, 26, 16, 24, 14],
];

const GALLERY_ORIGIN_OFFSET: Record<number, { x: number; y: number }> = {
  0: { x: -44, y: -44 },
  1: { x: 44, y: -44 },
  2: { x: -44, y: 44 },
  3: { x: 44, y: 44 },
};

const MARKDOWN_LINES = [
  [30, 46, 24, 38, 20],
  [22, 18, 34, 28, 24, 16],
  [40, 26, 20, 30, 18],
  [18, 32, 24, 28, 22, 14],
  [36, 24, 18, 20, 28],
];

const CmdkPreview = React.memo(function CmdkPreview() {
  const reduced = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const rowRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  React.useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setSelectedIndex(prev => (prev >= 6 ? 0 : prev + 1));
    }, 700);
    return () => window.clearInterval(id);
  }, [reduced]);

  React.useEffect(() => {
    const target = rowRefs.current[selectedIndex];
    const container = listRef.current;
    if (!target || !container) return;
    // Use rAF to avoid forced synchronous layout during render commit
    requestAnimationFrame(() => {
      const top = target.offsetTop + target.clientHeight - container.clientHeight;
      container.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  }, [selectedIndex]);

  return (
    <div className="w-full aspect-[4/3] rounded-xl border border-gray-4 bg-background overflow-hidden text-left">
      <div className="sticky top-0 z-10 h-10 border-b border-gray-4 bg-background px-3 flex items-center">
        <div className="h-3 w-4/5 rounded bg-gray-4" />
      </div>
      <div ref={listRef} className="p-2 space-y-1.5 max-h-[180px] overflow-y-auto scroll-smooth">
        <div className="h-3 w-24 rounded bg-gray-4 mx-1" />
        {CMDK_ROWS.slice(0, 3).map((row, index) => {
          const rowKey = `cmdk-top-${index}`;
          return (
            <motion.div
              key={rowKey}
              ref={el => {
                rowRefs.current[index] = el;
              }}
              className="h-9 rounded-lg px-2 flex items-center justify-between"
              animate={{
                backgroundColor: selectedIndex === index ? "var(--color-gray-2)" : "transparent",
              }}
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
        {CMDK_ROWS.slice(3).map((row, idx) => {
          const index = idx + 3;
          return (
            <motion.div
              key={`cmdk-bottom-${index}`}
              ref={el => {
                rowRefs.current[index] = el;
              }}
              className="h-9 rounded-lg px-2 flex items-center justify-between"
              animate={{
                backgroundColor: selectedIndex === index ? "var(--color-gray-2)" : "transparent",
              }}
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
});

function ThinkingPreview() {
  return <StreamingPreview />;
}

const StreamingPreview = React.memo(function StreamingPreview() {
  const reduced = useReducedMotion();
  const [userVisible, setUserVisible] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const streamContainerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (reduced) return;
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
  }, [reduced]);

  React.useEffect(() => {
    if (step <= 0) return;
    const container = streamContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [step]);

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
          {STREAMING_TOKEN_ROWS.map((row, rowIndex) => {
            const visibleStep = rowIndex + 1;
            if (step < visibleStep) return null;
            return (
              <div key={`stream-${row.join("-")}`} className="flex flex-wrap gap-1.5">
                {row.map(w => (
                  <motion.div
                    key={`stream-${w}`}
                    className="h-3 rounded bg-accent/20 dark:bg-accent/50"
                    style={{ width: `${w}px` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.14 }}
                  />
                ))}
              </div>
            );
          })}
          {step >= 6 ? (
            <div className="flex items-center gap-2 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {[20, 24, 18, 22, 16, 19, 23].map(w => (
                  <motion.div
                    key={`tail-${w}`}
                    className="h-3 rounded bg-accent/20 dark:bg-accent/50"
                    style={{ width: `${w}px` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.14 }}
                  />
                ))}
              </div>
            </div>
          ) : null}
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
});

const AgentFeedbackPreview = React.memo(function AgentFeedbackPreview() {
  const reduced = useReducedMotion();
  const [expanded, setExpanded] = React.useState(false);

  React.useEffect(() => {
    if (reduced) return;
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
  }, [reduced]);

  return (
    <div className="w-full max-w-[260px] rounded-xl border border-gray-4 bg-background overflow-hidden">
      <div className="p-3 space-y-2">
        <StreamingCommentSkeleton />
      </div>
      <div className="h-px w-full bg-gray-3" />
      <motion.div
        layout
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="relative p-3 overflow-hidden"
      >
        <motion.div
          className="grid"
          animate={{ opacity: expanded ? 0 : 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{
            gridTemplateRows: expanded ? "0fr" : "1fr",
            transition: "grid-template-rows 0.3s ease-in-out",
          }}
        >
          <div className="overflow-hidden [grid-row:1] [grid-column:1]">
            <div className="flex items-center gap-2">
              <div className="relative flex size-4 items-center justify-center overflow-hidden rounded-full p-[1px]">
                <motion.div
                  className="absolute top-[-50%] left-[-50%] h-[200%] w-[200%]"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0%, var(--color-primary) 10%, var(--color-primary) 25%, transparent 35%)",
                  }}
                  animate={reduced ? {} : { transform: ["rotate(0deg)", "rotate(360deg)"] }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 0.475, repeat: Infinity, ease: "linear" }
                  }
                />
                <div className="relative z-10 flex size-full items-center justify-center rounded-full bg-background">
                  <div className="size-2.5 rounded-full bg-gray-5" />
                </div>
              </div>
              <motion.div
                className="h-3 w-28 rounded bg-gray-3"
                {...SKELETON_PULSE}
                transition={{ ...SKELETON_PULSE.transition, delay: 0.1 }}
              />
              <motion.div
                className="ml-1 size-2 rounded-full bg-gray-7"
                animate={reduced ? {} : { opacity: [0.2, 1, 0.2] }}
                transition={
                  reduced ? { duration: 0 } : { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
                }
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid"
          animate={{ opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          style={{
            gridTemplateRows: expanded ? "1fr" : "0fr",
            transition: "grid-template-rows 0.35s ease-in-out",
          }}
        >
          <div className="overflow-hidden [grid-row:1] [grid-column:1]">
            <StreamingCommentSkeleton />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
});

function StreamingCommentSkeleton() {
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="size-4 rounded-full bg-gray-4" />
        <div className="h-3 w-20 rounded bg-accent/20 dark:bg-accent/50" />
      </div>
      <div className="h-3 rounded bg-accent/20 dark:bg-accent/50" style={{ width: "100%" }} />
      <div className="h-3 rounded bg-accent/20 dark:bg-accent/50" style={{ width: "94%" }} />
    </>
  );
}

const GalleryPreview = React.memo(function GalleryPreview() {
  const reduced = useReducedMotion();
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const lastExpandedRef = React.useRef(0);

  React.useEffect(() => {
    if (reduced) return;
    let currentIndex = 0;
    const intervalId = window.setInterval(() => {
      setExpandedIndex(currentIndex);
      lastExpandedRef.current = currentIndex;
      const closeId = window.setTimeout(() => setExpandedIndex(null), 2200);
      currentIndex = (currentIndex + 1) % 4;
      return () => window.clearTimeout(closeId);
    }, 4400);

    // Start first cycle shortly after mount.
    const startId = window.setTimeout(() => {
      lastExpandedRef.current = 0;
      setExpandedIndex(0);
    }, 500);
    const closeStartId = window.setTimeout(() => setExpandedIndex(null), 2700);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(startId);
      window.clearTimeout(closeStartId);
    };
  }, [reduced]);

  const collapsedOrigin = GALLERY_ORIGIN_OFFSET[lastExpandedRef.current];

  return (
    <div className="relative w-full max-w-[220px] rounded-xl border border-gray-4 bg-background p-2 overflow-hidden">
      <div className="relative z-0 grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map(index => (
          <motion.div
            key={`gallery-${index}`}
            className="aspect-square rounded-lg bg-gray-3"
            animate={{ opacity: expandedIndex === index ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>

      <motion.div
        className="pointer-events-none absolute inset-0 z-10 bg-background/55 backdrop-blur-md"
        animate={{ opacity: expandedIndex === null ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />

      <motion.div
        className="pointer-events-none absolute inset-0 z-20 grid place-items-center"
        animate={{ opacity: expandedIndex === null ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="size-[170px] rounded-2xl border border-gray-4 bg-accent/20 dark:bg-accent/50 shadow-lg"
          initial={false}
          animate={{
            scale: expandedIndex === null ? 0.65 : 1,
            x: expandedIndex === null ? collapsedOrigin.x : 0,
            y: expandedIndex === null ? collapsedOrigin.y : 0,
            opacity: expandedIndex === null ? 0 : 1,
          }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.12 }}
        />
      </motion.div>
    </div>
  );
});

const MarkdownEditorPreview = React.memo(function MarkdownEditorPreview() {
  const reduced = useReducedMotion();
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    if (reduced) return;
    const runCycle = () => {
      setStep(0);
      const typeId = window.setInterval(() => {
        setStep(prev => {
          if (prev >= MARKDOWN_LINES.length) {
            window.clearInterval(typeId);
            return MARKDOWN_LINES.length;
          }
          return prev + 1;
        });
      }, 420);
      return () => window.clearInterval(typeId);
    };

    let cleanup = runCycle();
    const cycleId = window.setInterval(() => {
      cleanup();
      cleanup = runCycle();
    }, 4300);

    return () => {
      cleanup();
      window.clearInterval(cycleId);
    };
  }, [reduced]);

  return (
    <div className="w-full max-w-[260px] rounded-xl border border-gray-4 bg-background overflow-hidden">
      <div className="h-9 border-b border-gray-4 bg-gray-1 px-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {["bold", "italic", "h2", "list", "quote"].map(tool => (
            <div
              key={`tool-${tool}`}
              className="h-4 rounded bg-gray-3"
              style={{ width: tool === "h2" || tool === "quote" ? "18px" : "14px" }}
            />
          ))}
        </div>
        <div className="h-4 w-10 rounded bg-gray-3" />
      </div>
      <div className="p-3 space-y-2">
        <div className="h-3 w-24 rounded bg-gray-4" />
        {MARKDOWN_LINES.map((row, rowIndex) => {
          // oxlint-disable-next-line react/no-array-index-key
          if (step <= rowIndex) return <div key={`md-empty-${rowIndex}`} className="h-3" />;
          return (
            <div key={`md-${row.join("-")}`} className="flex flex-wrap gap-1.5">
              {row.map(w => (
                <motion.div
                  key={`md-${row.join("-")}-${w}`}
                  className="h-3 rounded bg-accent/20 dark:bg-accent/50"
                  style={{ width: `${w}px` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.14 }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
});

const DEMOS_WITH_PREVIEWS: DemoItem[] = [
  {
    id: "cmdk",
    name: "Command K",
    description:
      "⌘\u00A0K menu used in cushion.so. Full workspace search with pagination and shortcuts",
    href: "/posts/command-k-cushion",
    preview: <CmdkPreview />,
  },
  {
    id: "thinking",
    name: "Agent Feedback",
    description:
      "Cushion agent giving status feedback, showing how the model is processing the request and what tools it's using, then replying with the model response to the query.",
    href: "/posts/comment-ux-cushion",
    preview: <AgentFeedbackPreview />,
  },
  {
    id: "ai-stream",
    name: "Designing Agents",
    description:
      "Prompt and streamdown of text, typical in AI chatbots. Parses markdown and animates in each chunk to simulate a SSE stream from API.",
    href: "/posts/designing-agent-chat-interfaces",
    preview: <StreamingPreview />,
  },
  {
    id: "n8n-markdown-editor",
    name: "n8n Markdown Editor",
    description:
      "Markdown editor concept for n8n with a formatting toolbar and streaming preview text for fast workflow documentation.",
    href: "/posts/n8n-markdown-editor",
    preview: <MarkdownEditorPreview />,
  },
];

type DemoGridCardProps = {
  cardId: string;
  href: string;
  name: string;
  children: React.ReactNode;
};

const DemoGridCard = React.memo(function DemoGridCard({
  cardId,
  href,
  name,
  children,
}: DemoGridCardProps) {
  return (
    <a
      href={href}
      data-card-id={cardId}
      aria-label={name}
      className="group relative block overflow-hidden rounded-lg border bg-gray-2 p-5 hover:bg-gray-3 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div aria-hidden="true" className="pointer-events-none grid place-items-center aspect-[4/3]">
        {children}
      </div>
      <span className="sr-only">{name}</span>
    </a>
  );
});

function HomeWorkGridHoverLayer({ children }: { children: React.ReactNode }) {
  const [activeCardId, setActiveCardId] = React.useState<string | null>(null);
  const activeCardIdRef = React.useRef<string | null>(null);
  const lastPointerRef = React.useRef({ x: 0, y: 0 });

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    const target = event.target as HTMLElement | null;
    const card = target?.closest<HTMLAnchorElement>("[data-card-id]");
    const nextCardId = card?.dataset.cardId ?? null;
    if (!nextCardId) return;

    setActiveCardId(nextCardId);
    activeCardIdRef.current = nextCardId;
  }

  function handlePointerLeave() {
    setActiveCardId(null);
    activeCardIdRef.current = null;
  }

  // When the user scrolls without moving the pointer, pointerleave won't fire
  // even though the card has moved out from under the pointer. Update on scroll.
  React.useEffect(() => {
    function handleScroll() {
      const { x, y } = lastPointerRef.current;
      const el = document.elementFromPoint(x, y);
      const card = el?.closest<HTMLAnchorElement>("[data-card-id]");
      const nextCardId = card?.dataset.cardId ?? null;
      if (nextCardId !== activeCardIdRef.current) {
        setActiveCardId(nextCardId);
        activeCardIdRef.current = nextCardId;
      }
    }
    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    return () => window.removeEventListener("scroll", handleScroll, { capture: true });
  }, []);

  const activeItem = React.useMemo(
    () => (activeCardId ? DEMOS_WITH_PREVIEWS.find(item => item.id === activeCardId) : undefined),
    [activeCardId]
  );

  const content = activeItem ? (
    <>
      <p className="text-sm font-medium leading-tight">{activeItem.name}</p>
      {/*<p className="mt-1 text-xs leading-relaxed text-secondary">{activeItem.description}</p>*/}
    </>
  ) : undefined;

  return (
    <CustomHoverCard
      content={content}
      contentClass="bg-black p-1 px-1.5 w-fit flex-row gap-2 text-white"
    >
      <div
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="touch-manipulation"
      >
        {children}
      </div>
    </CustomHoverCard>
  );
}

export function HomeWorkGrid() {
  return (
    <section className="w-full" data-home-work-grid>
      <HomeWorkGridHoverLayer>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DEMOS_WITH_PREVIEWS.map(item => (
            <DemoGridCard key={item.id} cardId={item.id} href={item.href} name={item.name}>
              {item.preview}
            </DemoGridCard>
          ))}
        </div>
      </HomeWorkGridHoverLayer>
    </section>
  );
}
