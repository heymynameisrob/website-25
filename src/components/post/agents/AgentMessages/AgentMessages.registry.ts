import type { ToolRegistry } from "./AgentMessages.types";

export const toolRegistry = {
  webSearch: {
    label: "Web search",
    schema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The news search query to run on the web.",
        },
      },
      required: ["query"],
    },
  },
  readUrl: {
    label: "Read URL",
    schema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The article URL to read and summarize.",
        },
      },
      required: ["url"],
    },
  },
  loadSkill: {
    label: "Load skill",
    schema: {
      type: "object",
      properties: {
        skill: {
          type: "string",
          description: "The skill name to load for specialized guidance.",
        },
      },
      required: ["skill"],
    },
  },
} satisfies ToolRegistry;
