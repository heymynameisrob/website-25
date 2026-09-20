import * as React from "react";
import type { Post } from "@/content.config";
import { HOME_POST_LIMIT } from "@/lib/constants";
import { ArrowDownIcon } from "lucide-react";
import { AnimateInUp } from "@/components/Motion";

type PostLink = {
  href: string;
  label: Post["data"]["title"];
  description: Post["data"]["description"];
  external?: boolean;
};

export function PostItems({ items }: { items: PostLink[] }) {
  const [itemCount, setItemCount] = React.useState(HOME_POST_LIMIT);
  return (
    <ul className="flex flex-col gap-px">
      {items.slice(0, itemCount).map((item, index) => (
        <AnimateInUp as="li" delay={(index % HOME_POST_LIMIT) * 0.1} key={item.href}>
          <PostItem item={item} />
        </AnimateInUp>
      ))}
      {items.length > itemCount && (
        <li className="group flex items-center gap-1.5 -mx-4 bg-transparent px-4 min-h-11 py-1.5">
          <button
            className="inline-flex gap-2 items-center text-lg lg:text-xl font-medium text-gray-10 hover:underline decoration-2 decoration-gray-10 underline-offset-2 focus rounded-lg"
            onClick={() => setItemCount(prev => prev + HOME_POST_LIMIT)}
          >
            Load more
            <ArrowDownIcon className="inline-block size-4 color-inherit" />
          </button>
        </li>
      )}
    </ul>
  );
}

function PostItem({ item }: { item: PostLink }) {
  const { href, external, label, description } = item;
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "nofollow noopener" : undefined}
      className="group flex items-center gap-1.5 -mx-4 bg-transparent px-4 min-h-11 py-1.5 rounded-lg focus"
    >
      <div className="min-w-0 w-full inline-flex items-baseline gap-1.5 text-lg lg:text-xl">
        <h3 className="shrink-0 text-primary font-medium group-hover:underline decoration-2 decoration-primary underline-offset-2">
          {label}
        </h3>
        <p className="min-w-0 truncate text-secondary leading-normal">{description}</p>
      </div>
    </a>
  );
}
