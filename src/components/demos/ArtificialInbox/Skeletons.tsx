import { Skeleton } from "@/components/primitives/Skeleton";

import type { ArtificialInboxTypes } from "@/components/demos/ArtificialInbox/Tabs";
import {
  List,
  ListItem,
  ListItemChevron,
  ListItemContainer,
  ListItemIcon,
} from "@/components/primitives/List";

export type ArtificialTableOptionsProps = {
  draft: number;
  quoted: number;
  bound: number;
  activeTab?: ArtificialInboxTypes;
};

export function getDeterministicWidth(index: number) {
  const ranges = [
    { min: 200, max: 350 },
    { min: 150, max: 280 },
    { min: 180, max: 320 },
  ];

  // Use modulo to pick which range based on the index
  const rangeIndex = index % 3;
  const { min, max } = ranges[rangeIndex];

  // Simple hash function for deterministic randomness
  const seed = index * 2654435761; // Use a prime multiplier for better distribution
  const pseudo = Math.sin(seed) * 10000;
  const random = pseudo - Math.floor(pseudo);

  return Math.floor(random * (max - min + 1)) + min;
}

export function ArtificialSkeletonTopBar() {
  return (
    <div className="flex items-center justify-between gap-1 px-3 h-12 border-b">
      <div className="flex items-center gap-2">
        <Skeleton className="w-24 h-4 rounded-full" />
        <Skeleton className="w-20 h-3 opacity-60 rounded-full" />
      </div>
      <div className="flex items-center justify-end gap-1">
        <Skeleton className="size-5 rounded-lg" />
        <Skeleton className="w-36 h-5 rounded-lg" />
        <Skeleton className="w-16 h-5 rounded-lg" />
      </div>
    </div>
  );
}

export function ArtificialSkeletonTable({
  options,
}: {
  options: ArtificialTableOptionsProps;
}) {
  const shouldShow = (count: number) => count > 0;

  return (
    <div className="flex flex-col divide-y">
      {shouldShow(options.draft) && (
        <>
          <header className="flex-items-center gap-4 px-4 py-0.5 bg-gray-2">
            <span className="text-sm font-medium text-primary">
              Draft ({options.draft})
            </span>
          </header>
          {Array.from({ length: options.draft }).map((_, i) => (
            <ArtificialTableRow key={i} width={getDeterministicWidth(i)} />
          ))}
        </>
      )}
      {shouldShow(options.quoted) && (
        <>
          <header className="flex-items-center gap-4 px-4 py-0.5 bg-gray-2">
            <span className="text-sm font-medium text-primary">
              Quoted ({options.quoted})
            </span>
          </header>
          {Array.from({ length: options.quoted }).map((_, i) => (
            <ArtificialTableRow key={i} width={getDeterministicWidth(i)} />
          ))}
        </>
      )}
      {shouldShow(options.bound) && (
        <>
          <header className="flex-items-center gap-4 px-4 py-0.5 bg-gray-2">
            <span className="text-sm font-medium text-primary">
              Bound ({options.bound})
            </span>
          </header>
          {Array.from({ length: options.bound }).map((_, i) => (
            <ArtificialTableRow key={i} width={getDeterministicWidth(i)} />
          ))}
        </>
      )}
    </div>
  );
}

function ArtificialTableRow({ width }: { width: number }) {
  return (
    <div className="flex items-center gap-4 px-4 h-14">
      <div className="flex items-center gap-4 flex-1">
        <Skeleton className="w-12 h-4 opacity-50 rounded-full" />
        <Skeleton className="w-36 h-4 rounded-full" style={{ width }} />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="w-16 h-5 rounded-full" />
      <Skeleton className="w-16 h-4 rounded-full" />
      <Skeleton className="w-16 h-4 rounded-full" />
      <Skeleton className="size-5 rounded-full" />
    </div>
  );
}

export function ArtificialSkeletonList({ count }: { count: number }) {
  return (
    <>
      <List>
        {Array.from({ length: count }).map((_, i) => {
          const width = getDeterministicWidth(i);
          return (
            <ListItem className="hover:bg-transparent">
              <ListItemContainer>
                <ListItemIcon>
                  <Skeleton className="size-4 rounded-sm opacity-70" />
                </ListItemIcon>
                <Skeleton
                  className="h-4 max-w-48"
                  style={{ width: width / 2 }}
                />
              </ListItemContainer>
              <ListItemChevron />
            </ListItem>
          );
        })}
      </List>
    </>
  );
}

export function ArtificialSkeletonActivity() {
  return (
    <div className="relative">
      <div className="absolute top-2.5 left-2.5 w-px h-full bg-gray-4 z-0" />
      <div className="relative z-10 flex flex-col gap-1.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="flex items-center gap-2 h-9">
            <Skeleton className="size-5 rounded-full ring-2 ring-background" />
            <Skeleton className="w-24 h-3.5" />
            <Skeleton className="w-8 h-3.5" />
            <Skeleton className="w-16 h-3.5" />
            <Skeleton className="w-12 h-3.5" />
          </div>
        ))}
      </div>
    </div>
  );
}
