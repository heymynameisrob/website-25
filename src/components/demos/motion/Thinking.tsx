import * as React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import dedent from "dedent";
import { motion, AnimatePresence } from "motion/react";

import { Avatar } from "@/components/primitives/Avatar";
import { Badge } from "@/components/primitives/Badge";
import { cn } from "@/lib/utils";

interface CommentProps {
  author: {
    avatar?: string;
    name: string;
    fallback: string;
  };
  content: string;
  isAgent?: boolean;
}

const author = {
  avatar:
    "https://ucarecdn.com/75709875-783d-47e9-a60a-6d43e1d5d344/-/preview/100x100/",
  name: "Rob Hough",
  fallback: "RH",
};

const agent = {
  avatar: "/cushion-logo-256.png",
  name: "Cushion",
  fallback: "C",
};

function Comment({ author, content, isAgent }: CommentProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group z-10 flex flex-col justify-center gap-2 p-4 transition-colors duration-500 outline-none border-t first:border-t-0"
    >
      <div className="flex items-center gap-3">
        <Avatar
          src={author.avatar}
          fallback={author.fallback}
          className="size-5"
        />
        <span className="text-sm font-medium">{author.name}</span>
        {isAgent && (
          <Badge className="h-5 px-1 text-[11px] text-gray-11">Agent</Badge>
        )}
      </div>
      <div className="prose [--prose-color:var(--color-gray-12)] text-[15px]">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
      </div>
    </motion.article>
  );
}

const STATUSES = [
  "Thinking",
  "Searching workspace",
  "Analyzing results",
  "Writing response",
];

function ThinkingIndicator() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev === STATUSES.length ? prev : prev + 1));
    }, 2_000);

    return () => clearTimeout(timer);
  });

  return (
    <motion.article
      initial={{ opacity: 0, filter: "blur(2px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(2px)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col border-t px-3.5 py-2 h-11 bg-gray-1 w-full"
    >
      <div className="group flex items-center gap-3">
        <div className="relative size-6 grid place-items-center rounded-full shrink-0">
          <div className="absolute inset-0 rounded-full p-[2px] bg-[conic-gradient(from_0deg,transparent_0%,var(--color-accent)_10%,var(--color-accent)_25%,transparent_35%)] animate-spin" />
          <Avatar
            src="/cushion-logo-256.png"
            fallback="C"
            className="relative z-10 size-5 ring-1 ring-gray-1"
          />
        </div>
        <div className="relative h-5 w-56 overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.span
              key={index}
              className={cn(
                "absolute inset-0 text-sm font-medium text-gray-12 select-none",
              )}
              initial={{ y: 8, opacity: 0, filter: "blur(1px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -8, opacity: 0, filter: "blur(1px)" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {STATUSES[index]}...
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-4 rounded ${className}`} />;
}

export function Thinking() {
  const [showThinking, setShowThinking] = React.useState(true);
  const [showReply, setShowReply] = React.useState(false);

  const commentContent = dedent`
    <span class="px-1.5 rounded-md bg-gray-3 text-accent font-medium underline">@Cushion</span>
    Have we discussed this before? Are there other discussions around notifications bugs that are similar to this?
  `;

  const replyContent = dedent`
    <span class="px-1.5 rounded-md bg-gray-3 text-accent font-medium underline">@RobHough</span>
    Yes we have. There were several posts around notification sent to the bugs channel.
    All of these were posted by <span class="px-1.5 rounded-md bg-gray-3 text-accent font-medium underline">@DaveHawkins</span>

    - <span class="px-1.5 rounded-md bg-gray-3 font-medium">📥 Notifications not showing in inbox on mobile</span>
    - <span class="px-1.5 rounded-md bg-gray-3 font-medium">🤖 Notifications not working on Android</span>
    - <span class="px-1.5 rounded-md bg-gray-3 font-medium">👀 Can't see notifications in archived view</span>

    If you want to know more about notifications bugs, you should speak to <span class="px-1.5 rounded-md bg-gray-3 text-accent font-medium underline">@DaveHawkins</span>
  `;

  React.useEffect(() => {
    // Show thinking indicator, then hide and show reply after 8s
    const thinkingTimer = setTimeout(() => {
      setShowThinking(false);
      setShowReply(true);
    }, 8_000);

    // Reset animation after 10s from completion (18s total)
    const resetTimer = setTimeout(() => {
      setShowReply(false);
      setShowThinking(true);
    }, 18_000);

    return () => {
      clearTimeout(thinkingTimer);
      clearTimeout(resetTimer);
    };
  }, [showThinking, showReply]);

  return (
    <div className="relative z-10 flex flex-col bg-gray-1 my-2 border rounded-lg overflow-hidden max-w-xl mx-auto">
      <Comment author={author} content={commentContent} />
      <AnimatePresence mode="wait" initial={false}>
        {showThinking && <ThinkingIndicator key="thinking" />}
        {showReply && (
          <Comment key="reply" author={agent} content={replyContent} isAgent />
        )}
      </AnimatePresence>
    </div>
  );
}
