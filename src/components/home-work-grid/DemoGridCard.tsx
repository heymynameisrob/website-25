import * as React from "react";

type DemoGridCardProps = {
  cardId: string;
  href: string;
  name: string;
  description: string;
  children: React.ReactNode;
};

export const DemoGridCard = React.memo(function DemoGridCard({
  cardId,
  href,
  name,
  description,
  children,
}: DemoGridCardProps) {
  return (
    <a
      href={href}
      data-card-id={cardId}
      aria-describedby={`${cardId}-description`}
      className="group relative block overflow-hidden rounded-lg border bg-gray-2 p-5 hover:bg-gray-3 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div aria-hidden="true" className="pointer-events-none grid place-items-center aspect-[4/3]">
        {children}
      </div>
      <div className="mt-3 flex flex-col gap-0.5 sr-only">
        <span className="text-sm font-medium text-primary">{name}</span>
        <span id={`${cardId}-description`} className="text-xs text-gray-10 line-clamp-2">
          {description}
        </span>
      </div>
    </a>
  );
});
