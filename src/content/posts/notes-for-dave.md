---
title: Notes for Dave
description: Blerg
date: 2030-12-12
type: "post"
---

## Why
Remote teams are drowning in communication tools. Each platform promises to solve collaboration, but instead creates more complexity. Slack bombards with interruptions. Notion requires endless formatting. GitHub buries context in technical threads. The result? A communication ecosystem that feels more like a battlefield than a workspace.

**Core problems:**
- Information fragmentation - struggle to know what's going on with scattered conversations across Slack, Confluence, Github etc
- Interruptions - Slacks chat features produce a high noise/signal ratio where team members are constantly interrupted by red dot pings and @channel or @here tags
- Documentation fatigue - async teams often need to over document to make sure everything is though about. This documentation is often split and duplicated across different tools. E.g. Conversation about a new PR in slack, the PRD in Notion, the PR description in Github are all saying the same thing
- Accountability - It's hard to know exactly what work was done when on the project with async teams. This requires a huge degree of trust.

https://www.perplexity.ai/search/what-do-software-teams-who-wor-9gYSH9NZTWK1b.UHq4kIxw

## What?

What if we could create a communication platform that feels like it truly understands how async teams work? A tool that doesn't just move information, but transforms how teams collaborate?

Probably needs to be Electron app but start with web for now.

**Slack-Style Chat Reimagined**
Needs to feel familiar like Slack but without all the annoying interruptions.
Chat experience is critical to get right otherwise you can't replace Slack.

 - Familiar Yet Refined Interface
 - Instant message threading that feels natural
 - Presence indicators showing team availability
 - Emoji reactions and quick interactions
 - NO: Disruptive @here and @channel notifications
 - NO: Constant ping culture
 - NO: Notification overload

**Goal:** Create a chat experience that respects focus while maintaining team connectivity. Think of it as a "quiet mode" for team communication.

**Move from Chat to Post**
Enable teams to let ideas come from anywhere. If a discussion starts as a basic chat but something is becoming concrete - you shouldn't need to re-document that. LLM can do a post/summary for you.

``` 
Chat Thread → AI Analysis → Structured Post

 ├── Capture key discussion points

 ├── Summarize decisions

 └── Create actionable documentation
```


A design discussion in chat → AI generates a clean, structured post → Automatically links to original conversation → Adds context and resolution

**Announcements**
To remove the need for company-wide channels, how about we use 'Announcements'.
These are shared posts that goto everyone in the team.

- Company-wide communication without noise
- Granular notification controls
- Contextual and targeted messaging
- Opt-in/opt-out announcement streams
- Priority levels for communications
- Personal notification thresholds
- Context-aware delivery

**Goal:** Ensure critical information reaches everyone without interrupting deep work

**Posts**
Notion-like writing capabilities. Use knowledge from Pilcrow.

- Markdown-like formatting
- Inline media embedding
- Figma designs
- Screenshots
- Video clips
- Interactive prototypes

**Daily Recap**
One typical cadence for async teams is check-in/check-out. However these are tedious to do.
If we had good integrations with Github and Linear we could use LLM's to summarise what work has been done that day:

e.g
```
- Fixed critical bug in authentication flow (DES-234)

- Submitted PR #11049 for design system updates

- Completed 3/5 planned Linear tasks
```

**Customization Options**

- Configurable summary styles
- Different reporting formats
- Integration with team's existing workflow tools

**AI-Powered Contextual Search**

- Natural language queries
- Cross-document understanding
- Contextual result retrieval

**Query Examples:**

• "What color did we decide on for the button?"

• "Summarize our last discussion about the onboarding flow"

• "Find all conversations related to the mobile redesign"

**Integrations**
Connect to other tools to help manage work that happens elsewhere.

▪ GitHub: Full PR details

▪ Linear: Complete issue context

▪ Figma: Design preview

▪ Notion: Document linking

## Approach

1. Create a solid-quality Slack with core feature parity + Posts
2. Integrate with Github and Linear first
3. Add in AI automation for complex workflows
4. Share with other teams for free in private beta
