import * as React from "react";
import type {
  Message,
  MessagePart,
  ToolCall,
  ToolKey,
} from "@/components/post/agents/AgentMessages/AgentMessages.types";
import { agentConversation } from "./AgentMessages.mock";
import { useSimulatedMessages } from "./AgentMessages.utils";
import Markdown from "react-markdown";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, GraduationCap, Search, type LucideIcon } from "lucide-react";
import { TextShimmer } from "@/components/TextShimmer";
import { useStickToBottom } from "use-stick-to-bottom";

const toolIcons = {
  webSearch: Search,
  readUrl: BookOpen,
  loadSkill: GraduationCap,
} satisfies Record<ToolKey, LucideIcon>;

type MessageRenderBlock =
  | { type: "part"; part: MessagePart }
  | { type: "tool-group"; tools: Array<ToolCall> };

function groupAdjacentTools(parts: Array<MessagePart>): Array<MessageRenderBlock> {
  const blocks: Array<MessageRenderBlock> = [];
  let tools: Array<ToolCall> = [];

  for (const part of parts) {
    if (part.type === "tool") {
      tools.push(part);
      continue;
    }

    if (tools.length > 0) {
      blocks.push({ type: "tool-group", tools });
      tools = [];
    }

    blocks.push({ type: "part", part });
  }

  if (tools.length > 0) blocks.push({ type: "tool-group", tools });

  return blocks;
}

export function AgentMessages() {
  const { scrollRef, contentRef } = useStickToBottom();
  const messages = useSimulatedMessages(agentConversation);

  return (
    <div className="absolute inset-0 overflow-y-auto scrollbar-none" ref={scrollRef}>
      <ul
        className="flex flex-col justify-start space-y-8 w-full max-w-prose mx-auto px-4 py-4"
        ref={contentRef}
      >
        {messages.map(message => (
          <li key={message.id} className="flex flex-col gap-4 w-full">
            {groupAdjacentTools(message.parts).map(block => {
              if (block.type === "tool-group") {
                return (
                  <ToolMessages
                    key={block.tools.map(tool => tool.id).join("-")}
                    tools={block.tools}
                  />
                );
              }

              return (
                <MessagePart key={block.part.id} messageType={message.type} part={block.part} />
              );
            })}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MessagePart({ messageType, part }: { messageType: Message["type"]; part: MessagePart }) {
  if (part.type === "text") {
    if (messageType === "user") return <UserTextMessage text={part.text} />;
    return <TextMessage text={part.text} />;
  }

  if (part.type === "attachment") return <p>{part.name}</p>;
  return <ToolMessage part={part} />;
}

function TextMessage({ text }: { text: string }) {
  return (
    <div className="prose prose-sm mt-0 max-w-prose rounded-lg">
      <Markdown>{text}</Markdown>
      <span aria-label="sender" className="sr-only">
        Assistant
      </span>
    </div>
  );
}

function UserTextMessage({ text }: { text: string }) {
  const bubbleRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLParagraphElement>(null);

  React.useLayoutEffect(() => {
    // Inspired by https://alexwlchan.net/2026/css-chat/
    const bubble = bubbleRef.current;
    const content = contentRef.current;
    if (!bubble || !content) return;

    bubble.style.removeProperty("width");
    bubble.style.boxSizing = "border-box";

    const animationFrameId = window.requestAnimationFrame(() => {
      const range = document.createRange();
      range.selectNodeContents(content);

      const bbox = range.getBoundingClientRect();
      bubble.style.width = `${bbox.width}px`;
      bubble.style.boxSizing = "content-box";

      range.detach();
    });

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div
        ref={bubbleRef}
        className="prose prose-sm font-sans w-max max-w-[90%] box-border rounded-lg p-3 bg-gray-3 text-left ml-auto text-primary text-balance"
      >
        <p ref={contentRef}>{text}</p>
        <span aria-label="sender" className="sr-only">
          user
        </span>
      </div>
    </motion.div>
  );
}

function ToolMessages({ tools }: { tools: Array<ToolCall> }) {
  if (tools.length === 1)
    return (
      <div className="not-prose flex items-center gap-2">
        <ToolMessage part={tools[0]} />
      </div>
    );

  return (
    <div className="relative not-prose">
      <div aria-hidden="true" className="absolute top-2 left-2 w-px bottom-0 bg-border" />
      <ul className="space-y-2">
        {tools.map(tool => (
          <li key={tool.id} className="relative flex items-start gap-2">
            <ToolMessage part={tool} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ToolMessage({ part }: { part: ToolCall }) {
  const Icon = toolIcons[part.key];

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={part.state}
        initial={{ opacity: 0, filter: "blur(2px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, filter: "blur(2px)" }}
        transition={{ type: "spring", bounce: 0, duration: 0.2 }}
        className="flex items-center gap-2"
      >
        <Icon aria-hidden="true" className="size-4 shrink-0 text-gray-9" />
        <TextShimmer disabled={part.state !== "loading"} className="text-sm font-medium">
          {part.stateLabels[part.state]}
        </TextShimmer>
      </motion.div>
    </AnimatePresence>
  );
}
