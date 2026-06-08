import * as React from "react";
import { CustomHoverCard } from "@/components/CustomHoverCard";

export interface DemoItem {
  id: string;
  name: string;
  description: string;
  href: string;
}

type HomeWorkGridHoverLayerProps = {
  children: React.ReactNode;
  items: DemoItem[];
};

const CARD_SELECTOR = "[data-card-id]";

export function HomeWorkGridHoverLayer({ children, items }: HomeWorkGridHoverLayerProps) {
  const [activeCardId, setActiveCardId] = React.useState<string | null>(null);
  const activeCardIdRef = React.useRef<string | null>(null);
  const lastPointerRef = React.useRef({ x: 0, y: 0 });
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    // Scope the lookup to the current hover layer's subtree so we never
    // match a card in a different grid that happens to share `data-card-id`.
    const target = event.target as HTMLElement | null;
    const card = target?.closest<HTMLAnchorElement>(CARD_SELECTOR);
    if (!card || !event.currentTarget.contains(card)) {
      return;
    }
    const nextCardId = card.dataset.cardId ?? null;
    if (!nextCardId) return;

    setActiveCardId(nextCardId);
    activeCardIdRef.current = nextCardId;
  }

  function handlePointerLeave() {
    setActiveCardId(null);
    activeCardIdRef.current = null;
  }

  React.useEffect(() => {
    let rafId: number | null = null;

    function handleScroll() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const { x, y } = lastPointerRef.current;
        const container = containerRef.current;
        if (!container) return;
        const el = container.contains(document.elementFromPoint(x, y))
          ? document.elementFromPoint(x, y)
          : null;
        const card = el?.closest<HTMLAnchorElement>(CARD_SELECTOR);
        const nextCardId = card?.dataset.cardId ?? null;
        if (nextCardId !== activeCardIdRef.current) {
          setActiveCardId(nextCardId);
          activeCardIdRef.current = nextCardId;
        }
      });
    }

    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll, { capture: true });
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const activeItem = React.useMemo(
    () => (activeCardId ? items.find(item => item.id === activeCardId) : undefined),
    [activeCardId, items]
  );

  const content = activeItem ? (
    <p className="text-sm font-medium leading-tight">{activeItem.name}</p>
  ) : undefined;

  return (
    <CustomHoverCard
      content={content}
      contentClass="bg-black p-1 px-1.5 w-fit flex-row gap-2 text-white"
    >
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="touch-manipulation"
      >
        {children}
      </div>
    </CustomHoverCard>
  );
}
