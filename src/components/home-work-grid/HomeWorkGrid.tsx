import { CmdkPreview } from "./previews/CmdkPreview";
import { StreamingPreview } from "./previews/StreamingPreview";
import { AgentFeedbackPreview } from "./previews/AgentFeedbackPreview";
import { MarkdownEditorPreview } from "./previews/MarkdownEditorPreview";
import { DemoGridCard } from "./DemoGridCard";
import { HomeWorkGridHoverLayer, type DemoItem } from "./HomeWorkGridHoverLayer";

const DEMOS_WITH_PREVIEWS: DemoItem[] = [
  {
    id: "cmdk",
    name: "Command K",
    description:
      "⌘\u00A0K menu used in cushion.so. Full workspace search with pagination and shortcuts",
    href: "/posts/command-k-cushion",
    preview: <CmdkPreview />,
  },
  {
    id: "thinking",
    name: "Agent Feedback",
    description:
      "Cushion agent giving status feedback, showing how the model is processing the request and what tools it's using, then replying with the model response to the query.",
    href: "/posts/comment-ux-cushion",
    preview: <AgentFeedbackPreview />,
  },
  {
    id: "ai-stream",
    name: "Agent Chat",
    description:
      "Prompt and streamdown of text, typical in AI chatbots. Parses markdown and animates in each chunk to simulate a SSE stream from API.",
    href: "/posts/designing-agent-chat-interfaces",
    preview: <StreamingPreview />,
  },
  {
    id: "n8n-markdown-editor",
    name: "n8n Markdown Editor",
    description:
      "Markdown editor concept for n8n with a formatting toolbar and streaming preview text for fast workflow documentation.",
    href: "/posts/n8n-markdown-editor",
    preview: <MarkdownEditorPreview />,
  },
];

export function HomeWorkGrid() {
  return (
    <section className="w-full" data-home-work-grid>
      <HomeWorkGridHoverLayer items={DEMOS_WITH_PREVIEWS}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DEMOS_WITH_PREVIEWS.map(item => (
            <DemoGridCard
              key={item.id}
              cardId={item.id}
              href={item.href}
              name={item.name}
              description={item.description}
            >
              {item.preview}
            </DemoGridCard>
          ))}
        </div>
      </HomeWorkGridHoverLayer>
    </section>
  );
}
