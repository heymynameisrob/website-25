import type { Message, ToolCall, ToolKey, ToolState } from "./AgentMessages.types";

const baseDate = new Date();
const minutes = (n: number) => new Date(baseDate.getTime() + n * 60_000);

const toolStateLabels = {
  webSearch: {
    loading: "Searching the web",
    success: "Searched the web",
    error: "Search failed",
    "awaiting-input": "Waiting to search",
  },
  readUrl: {
    loading: "Reading the page",
    success: "Read the page",
    error: "Couldn't read the page",
    "awaiting-input": "Waiting for page access",
  },
  loadSkill: {
    loading: "Loading the skill",
    success: "Loaded the skill",
    error: "Couldn't load the skill",
    "awaiting-input": "Waiting to load the skill",
  },
} satisfies Record<ToolKey, Record<ToolState, string>>;

const makeToolCall = <K extends ToolKey>(
  call: Omit<ToolCall<K>, "stateLabels"> & { stateLabels?: Record<ToolState, string> }
): ToolCall<K> => ({
  ...call,
  stateLabels: call.stateLabels ?? toolStateLabels[call.key],
});

export const agentConversation: Array<Message> = [
  {
    id: "msg-user-1",
    type: "user",
    createdAt: minutes(0),
    parts: [
      {
        id: "part-user-1-text",
        type: "text",
        text: "Catch me up on the latest news headlines this morning.",
      },
    ],
  },
  {
    id: "msg-agent-1",
    type: "agent",
    createdAt: minutes(1),
    parts: [
      {
        id: "part-agent-1-text",
        type: "text",
        text: "I'll scan the top headlines and group the biggest stories by topic.",
      },
      makeToolCall({
        id: "tool-web-1",
        type: "tool",
        key: "webSearch",
        description: "Search the web for today's top news headlines",
        state: "success",
        stateLabels: {
          ...toolStateLabels.webSearch,
          success: "Found today's top headlines",
        },
        output: {
          results: [
            {
              title: "Global markets open higher after central bank comments",
              url: "https://example.com/business/markets-open-higher",
              snippet:
                "Stocks rose in early trading as investors responded to signals that rate cuts could remain on the table later this year.",
            },
            {
              title: "Leaders gather for emergency climate funding talks",
              url: "https://example.com/world/climate-funding-talks",
              snippet:
                "Diplomats are negotiating a new funding package aimed at helping countries recover from extreme weather events.",
            },
            {
              title: "New battery breakthrough promises faster EV charging",
              url: "https://example.com/technology/ev-battery-breakthrough",
              snippet:
                "Researchers say a redesigned battery cell could cut charging times while improving long-term durability.",
            },
          ],
        },
      }),
      {
        id: "part-agent-1-summary",
        type: "text",
        text: "Here are the big themes: markets are reacting to central bank signals, climate funding talks are underway, and a new EV battery claim is drawing attention in tech.",
      },
    ],
  },
  {
    id: "msg-user-2",
    type: "user",
    createdAt: minutes(4),
    parts: [
      {
        id: "part-user-2-text",
        type: "text",
        text: "Which of those matters most for regular people?",
      },
    ],
  },
  {
    id: "msg-agent-2",
    type: "agent",
    createdAt: minutes(5),
    parts: [
      {
        id: "part-agent-2-text",
        type: "text",
        text: "The market story has the most immediate day-to-day impact because interest-rate expectations can affect mortgage rates, savings yields, and borrowing costs.",
      },
      {
        id: "part-agent-2-context",
        type: "text",
        text: "The climate funding story matters over a longer horizon, especially for insurance costs, disaster recovery, and public infrastructure spending.",
      },
    ],
  },
  {
    id: "msg-user-3",
    type: "user",
    createdAt: minutes(8),
    parts: [
      {
        id: "part-user-3-text",
        type: "text",
        text: "Read the climate story and give me the important details.",
      },
    ],
  },
  {
    id: "msg-agent-3",
    type: "agent",
    createdAt: minutes(9),
    parts: [
      {
        id: "part-agent-3-text",
        type: "text",
        text: "Opening the climate funding report now.",
      },
      makeToolCall({
        id: "tool-read-1",
        type: "tool",
        key: "readUrl",
        description: "Read https://example.com/world/climate-funding-talks",
        state: "success",
        stateLabels: {
          ...toolStateLabels.readUrl,
          success: "Read the climate funding report",
        },
        output: {
          title: "Leaders gather for emergency climate funding talks",
          content:
            "Government leaders are debating a multi-year package for climate adaptation and disaster recovery. The proposal focuses on flood defenses, grid resilience, drought relief, and faster aid after storms. Negotiators remain divided over which countries should contribute most and how quickly the money should be distributed.",
        },
      }),
      {
        id: "part-agent-3-summary",
        type: "text",
        text: "The key issue is funding: countries broadly agree more support is needed, but they disagree on who pays, who receives aid first, and how strict the oversight should be.",
      },
    ],
  },
  {
    id: "msg-user-4",
    type: "user",
    createdAt: minutes(12),
    parts: [
      {
        id: "part-user-4-text",
        type: "text",
        text: "Can you verify that with another source?",
      },
    ],
  },
  {
    id: "msg-agent-4",
    type: "agent",
    createdAt: minutes(13),
    parts: [
      {
        id: "part-agent-4-text",
        type: "text",
        text: "I'll look for a second source covering the same talks.",
      },
      makeToolCall({
        id: "tool-web-2",
        type: "tool",
        key: "webSearch",
        description: "Search for additional reporting on climate funding talks",
        state: "success",
        stateLabels: {
          ...toolStateLabels.webSearch,
          success: "Found additional climate reporting",
        },
        output: {
          results: [
            {
              title: "Climate finance negotiations stall over contribution rules",
              url: "https://example.com/politics/climate-finance-rules",
              snippet:
                "Talks have centered on contribution formulas, accountability rules, and faster deployment of disaster relief funds.",
            },
            {
              title: "Island nations press for faster disaster aid",
              url: "https://example.com/world/island-nations-disaster-aid",
              snippet:
                "Representatives from vulnerable coastal and island nations say existing aid programs move too slowly after major storms.",
            },
          ],
        },
      }),
      {
        id: "part-agent-4-summary",
        type: "text",
        text: "Yes — the second source lines up with the first: the sticking points are contribution rules, oversight, and the speed of disaster relief.",
      },
    ],
  },
  {
    id: "msg-user-5",
    type: "user",
    createdAt: minutes(15),
    parts: [
      {
        id: "part-user-5-text",
        type: "text",
        text: "Keep watching for updates and tell me if the talks reach a deal.",
      },
    ],
  },
  {
    id: "msg-agent-5",
    type: "agent",
    createdAt: minutes(16),
    parts: [
      makeToolCall({
        id: "tool-web-3",
        type: "tool",
        key: "webSearch",
        description: "Search for breaking updates on climate funding deal",
        state: "loading",
        stateLabels: {
          ...toolStateLabels.webSearch,
          success: "Found climate deal updates",
        },
      }),
      {
        id: "part-agent-5-text",
        type: "text",
        text: "I'm checking for breaking updates. So far, the latest reports still describe negotiations as ongoing rather than finalized.",
      },
    ],
  },
];
