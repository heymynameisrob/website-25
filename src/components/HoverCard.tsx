import { cn } from "@/lib/utils";
import * as React from "react";

interface HoverCardProps {
  children: React.ReactNode;
  content: React.ReactNode;
  contentClass?: string;
  className?: string;
}

export function HoverCard({ children, content, className, contentClass }: HoverCardProps) {
  const areaRef = React.useRef<HTMLDivElement | null>(null);
  const [showHoverCard, setShowHoverCard] = React.useState(false);
  const [isHoverCardVisible, setIsHoverCardVisible] = React.useState(false);
  const hoverCardRef = React.useRef<HTMLDivElement | null>(null);
  const cursorRef = React.useRef({ clientX: 0, clientY: 0 });
  const rafRef = React.useRef<number | null>(null);
  const showTimeoutRef = React.useRef<number | null>(null);
  const [, startTransition] = React.useTransition();

  function repositionHoverCard() {
    const area = areaRef.current;
    if (!area) return;
    const hoverCard = hoverCardRef.current;
    if (!hoverCard) return;

    const rect = area.getBoundingClientRect();
    const { clientX, clientY } = cursorRef.current;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    hoverCard.style.transform = `translate3d(${x + 12}px, ${y + 12}px, 0)`;
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const area = areaRef.current;
    if (!area) return;

    cursorRef.current = { clientX: event.clientX, clientY: event.clientY };

    if (rafRef.current !== null) return;
    rafRef.current = window.requestAnimationFrame(() => {
      repositionHoverCard();
      rafRef.current = null;
    });

    if (!showHoverCard) {
      setShowHoverCard(true);
    }
    if (showTimeoutRef.current === null && !isHoverCardVisible) {
      showTimeoutRef.current = window.setTimeout(() => {
        startTransition(() => {
          setIsHoverCardVisible(true);
        });
        showTimeoutRef.current = null;
      }, 400);
    }
  }

  function handlePointerLeave() {
    setIsHoverCardVisible(false);
    setShowHoverCard(false);
    if (showTimeoutRef.current !== null) {
      window.clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  React.useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
      if (showTimeoutRef.current !== null) {
        window.clearTimeout(showTimeoutRef.current);
      }
    };
  }, []);

  // Reposition the hover card on scroll since the container's bounding rect
  // changes but the stored client coordinates stay the same.
  React.useEffect(() => {
    if (!showHoverCard) return;
    function handleScroll() {
      repositionHoverCard();
    }
    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    return () => window.removeEventListener("scroll", handleScroll, { capture: true });
  }, [showHoverCard]);

  return (
    <div
      ref={areaRef}
      className={cn("relative", className)}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
      {showHoverCard && content && (
        <div
          ref={hoverCardRef}
          className={cn(
            "pointer-events-none absolute left-0 top-0 z-50 w-64 overflow-hidden rounded-md border p-2 text-primary shadow-lg will-change-transform dark:bg-gray-3",
            contentClass
          )}
          style={{ transform: "translate3d(0px, 0px, 0)", opacity: isHoverCardVisible ? 1 : 0 }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
