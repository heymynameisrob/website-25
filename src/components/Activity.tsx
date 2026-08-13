import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { GitMerge, GitPullRequest, GitPullRequestClosed, GitPullRequestDraft } from "lucide-react";
import useSWR from "swr";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/HoverCard";
import { fetcher } from "@/lib/fetch";
import type { ActivityItem, ActivityResponse } from "@/lib/types";

const ACTIVITY_INTERVAL = 5_000;

export function Activity() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { data, error, isLoading } = useSWR<ActivityResponse>("/api/activity", fetcher, {
    refreshInterval: 30_000,
  });

  const items = useMemo(
    () =>
      [data?.latestTrack, data?.latestPullRequest].filter(
        (item): item is ActivityItem => item !== null && item !== undefined
      ),
    [data?.latestTrack, data?.latestPullRequest]
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [items.length]);

  useEffect(() => {
    if (items.length < 2 || isPaused) return;

    const interval = window.setInterval(() => {
      setActiveIndex(index => (index + 1) % items.length);
    }, ACTIVITY_INTERVAL);

    return () => window.clearInterval(interval);
  }, [isPaused, items.length]);

  if (isLoading) return <p className="text-lg text-secondary lg:text-xl">Loading activity…</p>;
  if (error) return <p className="text-lg text-secondary lg:text-xl">Couldn’t load activity.</p>;
  if (!items.length)
    return <p className="text-lg text-secondary lg:text-xl">No recent activity.</p>;

  const activeItem = items[activeIndex] ?? items[0];

  return (
    <div
      className="relative min-h-11 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activityKey(activeItem)}
          className="absolute inset-x-0 top-0"
          initial={{ opacity: 0, y: 10, filter: "blur(3px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(3px)" }}
          transition={{ duration: 0.4, type: "spring", bounce: 0 }}
        >
          {activeItem.type === "track" ? (
            <TrackActivity item={activeItem} />
          ) : (
            <PullRequestActivity item={activeItem} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TrackActivity({ item }: { item: Extract<ActivityItem, { type: "track" }> }) {
  const albumArt = item.track.image.find(image => image.size === "extralarge")?.url;

  return (
    <div className="flex min-h-11 items-center gap-1.5 -mx-4 rounded-lg bg-transparent px-4 py-1.5">
      <div className="min-w-0 w-full inline-flex items-center gap-2 text-lg lg:text-xl">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="shrink-0 size-6 relative rounded-md overflow-hidden bg-gray-4">
              <img src={albumArt} loading="lazy" className="absolute inset-0 object-cover" />
            </div>
          </HoverCardTrigger>
          {albumArt && (
            <HoverCardContent className="w-48 p-2">
              <img
                src={albumArt}
                alt={`${item.track.album} album art`}
                className="aspect-square w-full rounded object-cover"
              />
            </HoverCardContent>
          )}
        </HoverCard>
        <a
          href={item.track.url}
          target="_blank"
          rel="nofollow noopener"
          className="min-w-0 truncate text-primary font-medium hover:underline decoration-2 decoration-primary underline-offset-2 focus rounded-sm"
        >
          {item.track.name}
        </a>
        <span className="min-w-0 truncate text-secondary">— {item.track.artist}</span>
      </div>
    </div>
  );
}

function PullRequestActivity({ item }: { item: Extract<ActivityItem, { type: "pullRequest" }> }) {
  return (
    <div className="flex min-h-11 items-center gap-1.5 -mx-4 rounded-lg bg-transparent px-4 py-1.5">
      <div className="min-w-0 w-full inline-flex items-baseline gap-1.5 text-lg lg:text-xl">
        <PullRequestIcon status={item.pullRequest.status} />
        <HoverCard>
          <HoverCardTrigger asChild>
            <a
              href={item.pullRequest.url}
              target="_blank"
              rel="nofollow noopener"
              className="min-w-0 truncate text-primary font-medium hover:underline decoration-2 decoration-primary underline-offset-2 focus rounded-sm"
            >
              #{item.pullRequest.number} {item.pullRequest.title}
            </a>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <PullRequestIcon status={item.pullRequest.status} />
                <div className="min-w-0">
                  <p className="font-medium leading-snug text-primary">
                    #{item.pullRequest.number} {item.pullRequest.title}
                  </p>
                  <p className="mt-1 text-sm text-secondary">{item.pullRequest.repo}</p>
                </div>
              </div>
              {item.pullRequest.description && (
                <p className="max-h-20 overflow-hidden text-sm leading-normal text-secondary">
                  {truncate(item.pullRequest.description, 160)}
                </p>
              )}
              <Diff additions={item.pullRequest.additions} deletions={item.pullRequest.deletions} />
            </div>
          </HoverCardContent>
        </HoverCard>
        <Diff additions={item.pullRequest.additions} deletions={item.pullRequest.deletions} />
      </div>
    </div>
  );
}

function Diff({ additions, deletions }: { additions: number; deletions: number }) {
  return (
    <span className="inline-flex shrink-0 items-baseline gap-1 font-mono text-sm">
      <span className="text-green-600 dark:text-green-400">+{additions}</span>
      <span className="text-red-600 dark:text-red-400">-{deletions}</span>
    </span>
  );
}

function activityKey(item: ActivityItem) {
  return item.type === "track" ? `track-${item.track.url}` : `pr-${item.pullRequest.url}`;
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength).trim()}…`;
}

function PullRequestIcon({ status }: { status: "open" | "closed" | "merged" | "draft" }) {
  const className = "relative top-0.5 size-5 shrink-0 text-secondary";

  if (status === "draft") return <GitPullRequestDraft className={className} />;
  if (status === "merged") return <GitMerge className={className} />;
  if (status === "closed") return <GitPullRequestClosed className={className} />;

  return <GitPullRequest className={className} />;
}
