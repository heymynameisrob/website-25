export type ToolSchema = {
  type: "object";
  properties: Record<string, unknown>;
  required?: Array<string>;
};

export type WebSearchInput = {
  query: string;
};

export type WebSearchOutput = {
  results: Array<{ title: string; url: string; snippet: string }>;
};

export type ReadUrlInput = {
  url: string;
};

export type ReadUrlOutput = {
  title: string;
  content: string;
};

export type LoadSkillInput = {
  skill: string;
};

export type LoadSkillOutput = {
  skill: string;
};

export type ToolDefinition<Input, Output> = {
  label: string;
  schema: ToolSchema;
  _input?: Input;
  _output?: Output;
};

export type ToolRegistry = {
  webSearch: ToolDefinition<WebSearchInput, WebSearchOutput>;
  readUrl: ToolDefinition<ReadUrlInput, ReadUrlOutput>;
  loadSkill: ToolDefinition<LoadSkillInput, LoadSkillOutput>;
};

export type ToolKey = keyof ToolRegistry;
export type ToolInput<K extends ToolKey> = NonNullable<ToolRegistry[K]["_input"]>;
export type ToolOutput<K extends ToolKey> = NonNullable<ToolRegistry[K]["_output"]>;
export type ToolState = "loading" | "success" | "error" | "awaiting-input";

export type ToolCall<K extends ToolKey = ToolKey> = {
  id: string;
  type: "tool";
  key: K;
  description: string;
  state: ToolState;
  stateLabels: Record<ToolState, string>;
  output?: ToolOutput<K>;
};

export type TextPart = {
  id: string;
  type: "text";
  text: string;
};

export type AttachmentPart = {
  id: string;
  type: "attachment";
  name: string;
};

export type UserMessagePart = TextPart | AttachmentPart;
export type AgentMessagePart = TextPart | AttachmentPart | ToolCall;
export type MessagePart = UserMessagePart | ToolCall;

export type UserMessage = {
  id: string;
  type: "user";
  parts: Array<UserMessagePart>;
  createdAt: Date;
};

export type AgentMessage = {
  id: string;
  type: "agent";
  parts: Array<AgentMessagePart>;
  createdAt: Date;
};

export type Message = UserMessage | AgentMessage;
