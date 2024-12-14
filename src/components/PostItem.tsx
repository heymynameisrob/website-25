import { format } from "date-fns";

import type { Post } from "@/content.config";

export function PostItem({ post }: { post: Post }) {
  return <PostLink post={post} />;
}

function PostLink({ post }: { post: Post }) {
  return (
    <a
      className="flex items-baseline gap-2 p-4 hover:bg-gray-3 rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-ring"
      href={post.data.isExternal ? post.data.externalLink : `/posts/${post.id}`}
      rel={post.data.isExternal ? "nofollow noopener" : undefined}
      target={post.data.isExternal ? "_blank" : undefined}
    >
      <div className="shrink-0 flex items-center gap-1">
        <p className="text-primary text-sm">
          <strong>{post.data.title}</strong>
        </p>
        <span className="max-w-[300px] truncate text-sm">
          {post.data.description}
        </span>
      </div>
      <div className="h-px w-full border-b border-dotted" />
      <time className="shrink-0 text-xs font-mono uppercase tabular-nums font-medium text-gray-9">
        {format(post.data.date, "MMM yy")}
      </time>
    </a>
  );
}
