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
    <div className="flex min-h-11 items-center gap-1.5 -mx-4 rounded-lg bg-transparent px-4 ">
      <div className="min-w-0 w-full inline-flex items-center gap-2 text-lg lg:text-xl">
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="shrink-0 size-6 relative rounded-md overflow-hidden bg-gray-4">
              <img src={albumArt} loading="lazy" className="absolute inset-0 object-cover" />
            </div>
          </HoverCardTrigger>
          {albumArt && (
            <HoverCardContent className="w-48 overflow-hidden p-0 bg-transparent overflow-visible">
              <div className="relative grid aspect-square place-items-center">
                <img
                  src={albumArt}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 size-full object-cover z-10"
                />
                <motion.div
                  className="absolute inset-0 aspect-square w-full rounded-full bg-gray-12 shadow-[inset_0_0_18px_rgba(255,255,255,0.08),inset_0_0_36px_rgba(0,0,0,0.55),0_10px_24px_rgba(0,0,0,0.25)] [background-image:repeating-radial-gradient(circle,rgba(255,255,255,0.12)_0_1px,transparent_1px_10px)]"
                  initial={{ x: 0 }}
                  animate={{ x: 80, rotate: 360 }}
                  transition={{
                    x: { duration: 0.45, type: "spring", bounce: 0 },
                    rotate: { duration: 3, ease: "linear", repeat: Infinity },
                  }}
                >
                  <img
                    src={albumArt}
                    alt={`${item.track.album} album art`}
                    className="absolute left-1/2 top-1/2 aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover"
                  />
                  <div className="absolute left-1/2 top-1/2 size-[5%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-1" />
                </motion.div>
              </div>
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
    <div className="flex min-h-11 items-center gap-1.5 -mx-4 rounded-lg bg-transparent px-4 ">
      <div className="min-w-0 w-full inline-flex items-baseline gap-1.5 text-lg lg:text-xl">
        <HoverCard>
          <HoverCardTrigger>
            <PullRequestIcon status={item.pullRequest.status} />
          </HoverCardTrigger>
          <a
            href={item.pullRequest.url}
            target="_blank"
            rel="nofollow noopener"
            className="min-w-0 truncate text-primary font-medium hover:underline decoration-2 decoration-primary underline-offset-2 focus rounded-sm"
          >
            {item.pullRequest.title}
          </a>
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

function Diff({ additions, deletions }: { additions: number | null; deletions: number | null }) {
  if (additions === null || deletions === null) return null;

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
