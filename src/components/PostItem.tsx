import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { format } from "date-fns";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/HoverCard";

import type { Post } from "@/content.config";

export function PostItem({ post }: { post: Post }) {
  if (!post.data.video_url && !post.data.image_url)
    return <PostLink post={post} />;

  return (
    <HoverCard openDelay={0}>
      <HoverCardTrigger>
        <PostLink post={post} />
      </HoverCardTrigger>
      <HoverCardContent>
        {post.data.video_url ? (
          <AspectRatio.Root ratio={1 / 1} className="absolute inset-0">
            <video
              playsInline
              loop
              autoPlay
              muted
              src={post.data.video_url}
              className="object-fit object-cover rounded-lg"
            ></video>
          </AspectRatio.Root>
        ) : (
          <AspectRatio.Root ratio={4 / 3} className="absolute inset-0">
            <img
              src={post.data.image_url}
              alt={post.data.title}
              loading="lazy"
              className="w-full h-full object-cover rounded-xl"
            />
          </AspectRatio.Root>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}

function PostLink({ post }: { post: Post }) {
  return (
    <a
      className="flex items-baseline gap-2 p-4 hover:bg-gray-2 rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={`/posts/${post.id}`}
    >
      <div className="shrink-0 flex items-baseline gap-1">
        <p className="text-primary text-sm">
          <strong>{post.data.title}</strong>
        </p>
        <span className="max-w-[160px] truncate text-sm">
          {post.data.description}
        </span>
      </div>
      <div className="h-px w-full border-b border-dotted" />
      <time className="shrink-0 text-xs font-mono uppercase tabular-nums font-medium text-gray-8">
        {format(post.data.date, "MMM yy")}
      </time>
    </a>
  );
}
