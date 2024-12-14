import React from "react";
import { PostItem } from "@/components/PostItem";
import type { Post } from "@/content.config";
import { Motion, useMotionVariants } from "@/components/Motion";

export function PostList({ allPosts }: { allPosts: Array<Post> }) {
  const { initial, animate, transition } = useMotionVariants("fadeInUp");
  return (
    <ul className="flex flex-col gap-2">
      {allPosts.map((post, index) => (
        <li className="-mx-4" key={post.id}>
          <Motion
            initial={initial}
            animate={animate}
            transition={{ ...transition, delay: 0.6 + 0.2 * index }}
          >
            <PostItem post={post} />
          </Motion>
        </li>
      ))}
    </ul>
  );
}
