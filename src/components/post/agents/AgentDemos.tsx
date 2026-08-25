import { AgentChatInputDemo as AgentChatInput } from "@/components/post/agents/AgentChatInput";
import { AgentMessages } from "@/components/post/agents/AgentMessages/AgentMessages";
import { PostDemo } from "@/components/post/PostDemo";

function renderChatInput() {
  return <AgentChatInput />;
}

function renderMessages() {
  return <AgentMessages />;
}

export function AgentChatInputDemo() {
  return (
    <PostDemo initialOptions={null} caption="The entry point to every app nowadays">
      {renderChatInput}
    </PostDemo>
  );
}

export function AgentMessagesDemo() {
  return (
    <PostDemo
      initialOptions={null}
      caption="Chat conversations should flow naturally mixing together tools, artefacts, and messages"
    >
      {renderMessages}
    </PostDemo>
  );
}
