type ToolSchema = {
  type: "object";
  properties: Record<string, unknown>;
  required?: Array<string>;
};

type WebSearchInput = {
  query: string;
};

type WebSearchOutput = {
  results: Array<{ title: string; url: string; snippet: string }>;
};

type ReadUrlInput = {
  url: string;
};

type ReadUrlOutput = {
  title: string;
  content: string;
};

type LoadSkillInput = {
  skill: string;
};

type LoadSkillOutput = {
  skill: string;
};

type ToolDefinition<Input, Output> = {
  label: string;
  schema: ToolSchema;
  _input?: Input;
  _output?: Output;
};

type ToolRegistry = {
  webSearch: ToolDefinition<WebSearchInput, WebSearchOutput>;
  readUrl: ToolDefinition<ReadUrlInput, ReadUrlOutput>;
  loadSkill: ToolDefinition<LoadSkillInput, LoadSkillOutput>;
};

export type ToolKey = keyof ToolRegistry;
type ToolInput<K extends ToolKey> = NonNullable<ToolRegistry[K]["_input"]>;
type ToolOutput<K extends ToolKey> = NonNullable<ToolRegistry[K]["_output"]>;
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

type TextPart = {
  id: string;
  type: "text";
  text: string;
};

type AttachmentPart = {
  id: string;
  type: "attachment";
  name: string;
};

type UserMessagePart = TextPart | AttachmentPart;
type AgentMessagePart = TextPart | AttachmentPart | ToolCall;
export type MessagePart = UserMessagePart | ToolCall;

type UserMessage = {
  id: string;
  type: "user";
  parts: Array<UserMessagePart>;
  createdAt: Date;
};

type AgentMessage = {
  id: string;
  type: "agent";
  parts: Array<AgentMessagePart>;
  createdAt: Date;
};

export type Message = UserMessage | AgentMessage;
