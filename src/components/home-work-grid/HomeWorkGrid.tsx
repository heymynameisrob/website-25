import { DemoGridCard } from "./DemoGridCard";
import { HomeWorkGridHoverLayer, type DemoItem } from "./HomeWorkGridHoverLayer";
import { Button } from "@/components/Button";
import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Portal } from "@radix-ui/react-portal";
import { useHotkeys } from "react-hotkeys-hook";

export const DEMOS: DemoItem[] = [
  {
    id: "cmdk",
    name: "Command K",
    description:
      "⌘\u00A0K menu used in cushion.so. Full workspace search with pagination and shortcuts",
    href: "/posts/command-k-cushion",
  },
  {
    id: "thinking",
    name: "Agent Feedback",
    description:
      "Cushion agent giving status feedback, showing how the model is processing the request and what tools it's using, then replying with the model response to the query.",
    href: "/posts/comment-ux-cushion",
  },
  {
    id: "ai-stream",
    name: "Agent Chat",
    description:
      "Prompt and streamdown of text, typical in AI chatbots. Parses markdown and animates in each chunk to simulate a SSE stream from API.",
    href: "/posts/designing-agent-chat-interfaces",
  },
  {
    id: "n8n-markdown-editor",
    name: "n8n Markdown Editor",
    description:
      "Markdown editor concept for n8n with a formatting toolbar and streaming preview text for fast workflow documentation.",
    href: "/posts/n8n-markdown-editor",
  },
];

export function HomeWorkGrid() {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="xs"
        onClick={() => setOpen(true)}
        className="text-sm w-fit -mx-1.5 px-1.5 font-medium text-gray-10 tracking-tight"
      >
        Work ({DEMOS.length})
      </Button>
      <section className="w-full" data-home-work-grid inert={open}>
        <HomeWorkGridHoverLayer items={DEMOS}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DEMOS.map((item, index) => (
              <DemoGridCard
                key={item.id}
                cardId={item.id}
                href={item.href}
                name={item.name}
                description={item.description}
                delay={index * 0.1 * -1}
              />
            ))}
          </div>
        </HomeWorkGridHoverLayer>
      </section>
      <HomeWorkGridOverlay open={open} onOpenChange={setOpen} triggerRef={triggerRef} />
    </>
  );
}

export function HomeWorkGridOverlay({
  open,
  onOpenChange,
  triggerRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const prevOverflow = React.useRef<string>("");
  const wasOpen = React.useRef(open);

  useHotkeys("esc", () => onOpenChange(false), {
    enabled: open,
    preventDefault: true,
  });

  // Lock body scroll and inert the <main> while open. The overlay is portaled
  // to <body>, so it lives outside the inert region and stays focusable.
  // Everything else in the page (header, footer, home grid, etc.) becomes
  // unreachable, which traps focus to the overlay.
  React.useEffect(() => {
    if (!open) return;
    prevOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const main = document.querySelector("main");
    if (main) main.inert = true;
    return () => {
      document.body.style.overflow = prevOverflow.current;
      if (main) main.inert = false;
    };
  }, [open]);

  // Move focus into the overlay on open, restore to the trigger on close.
  // Skips the initial render so we don't steal focus on first mount.
  React.useEffect(() => {
    if (wasOpen.current === open) return;
    wasOpen.current = open;
    if (open) {
      const firstFocusable = overlayRef.current?.querySelector<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [open, triggerRef]);

  return (
    <Portal>
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            className="isolate fixed grid place-items-center inset-0 w-full h-full z-max bg-background/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={() => onOpenChange(false)}
          />
        )}
        {open && (
          <motion.div
            key="cards"
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Work"
            className="fixed inset-0 z-max max-w-prose mx-auto py-8 pointer-events-none"
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pointer-events-auto">
              {DEMOS.map((item, index) => (
                <DemoGridCard
                  key={item.id}
                  cardId={item.id}
                  href={item.href}
                  name={item.name}
                  description={item.description}
                  delay={index * 0.05}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
