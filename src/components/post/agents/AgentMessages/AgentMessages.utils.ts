import * as React from "react";
import type {
  Message,
  MessagePart,
  ToolCall,
} from "@/components/post/agents/AgentMessages/AgentMessages.types";

const TEXT_CHUNK_DELAY_MS = 80;
const PART_TRANSITION_DELAY_MS = 650;
const MESSAGE_TRANSITION_DELAY_MS = 300;
const TOOL_MIN_DELAY_MS = 2_000;
const TOOL_MAX_DELAY_MS = 5_000;

export const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export function getNextTextChunk(text: string, currentLength: number) {
  const nextLength = Math.min(text.length, currentLength + randomBetween(3, 10));
  const nextWhitespaceIndex = text.indexOf(" ", nextLength);

  if (nextWhitespaceIndex === -1 || nextWhitespaceIndex - currentLength > 18) {
    return text.slice(0, nextLength);
  }

  return text.slice(0, nextWhitespaceIndex + 1);
}

export function appendPartToMessage(message: Message, part: MessagePart): Message {
  return { ...message, parts: [...message.parts, part] } as Message;
}

export function updateLastMessage(
  messages: Array<Message>,
  updater: (message: Message) => Message
) {
  return messages.map((message, index) =>
    index === messages.length - 1 ? updater(message) : message
  );
}

export function useSimulatedMessages(sourceMessages: ReadonlyArray<Message>): Array<Message> {
  const [messages, setMessages] = React.useState<Array<Message>>([]);
  const [cursor, setCursor] = React.useState({ messageIndex: 0, partIndex: 0 });

  React.useEffect(() => {
    const sourceMessage = sourceMessages[cursor.messageIndex];
    if (!sourceMessage) return;

    if (messages.length <= cursor.messageIndex) {
      setMessages(currentMessages => [
        ...currentMessages,
        { ...sourceMessage, parts: [] } as Message,
      ]);
      return;
    }

    const sourcePart = sourceMessage.parts[cursor.partIndex];
    if (!sourcePart) {
      const timeoutId = window.setTimeout(() => {
        setCursor(currentCursor => ({
          messageIndex: currentCursor.messageIndex + 1,
          partIndex: 0,
        }));
      }, MESSAGE_TRANSITION_DELAY_MS);
      return () => window.clearTimeout(timeoutId);
    }

    if (sourcePart.type === "text") {
      if (sourceMessage.type === "user") {
        setMessages(currentMessages =>
          updateLastMessage(currentMessages, message => appendPartToMessage(message, sourcePart))
        );
        setCursor(currentCursor => ({ ...currentCursor, partIndex: currentCursor.partIndex + 1 }));
        return;
      }

      const visibleMessage = messages[cursor.messageIndex];
      const visiblePart = visibleMessage.parts.find(part => part.id === sourcePart.id);
      const visibleText = visiblePart?.type === "text" ? visiblePart.text : "";

      if (visibleText === sourcePart.text) {
        const timeoutId = window.setTimeout(() => {
          setCursor(currentCursor => ({
            ...currentCursor,
            partIndex: currentCursor.partIndex + 1,
          }));
        }, PART_TRANSITION_DELAY_MS);
        return () => window.clearTimeout(timeoutId);
      }

      const timeoutId = window.setTimeout(() => {
        const nextText = getNextTextChunk(sourcePart.text, visibleText.length);

        setMessages(currentMessages =>
          updateLastMessage(currentMessages, message => {
            const hasPart = message.parts.some(part => part.id === sourcePart.id);
            if (!hasPart) return appendPartToMessage(message, { ...sourcePart, text: nextText });

            return {
              ...message,
              parts: message.parts.map(part =>
                part.id === sourcePart.id && part.type === "text"
                  ? { ...part, text: nextText }
                  : part
              ),
            } as Message;
          })
        );
      }, TEXT_CHUNK_DELAY_MS);

      return () => window.clearTimeout(timeoutId);
    }

    if (sourcePart.type === "tool") {
      const visibleMessage = messages[cursor.messageIndex];
      const visiblePart = visibleMessage.parts.find(part => part.id === sourcePart.id);

      if (!visiblePart) {
        const loadingPart = { ...sourcePart, state: "loading", output: undefined } as ToolCall;

        setMessages(currentMessages =>
          updateLastMessage(currentMessages, message => appendPartToMessage(message, loadingPart))
        );
        return;
      }

      if (visiblePart.type === "tool" && visiblePart.state === "loading") {
        const toolTimeoutId = window.setTimeout(
          () => {
            if (sourcePart.state === "loading") {
              setCursor(currentCursor => ({
                ...currentCursor,
                partIndex: currentCursor.partIndex + 1,
              }));
              return;
            }

            setMessages(currentMessages =>
              updateLastMessage(
                currentMessages,
                message =>
                  ({
                    ...message,
                    parts: message.parts.map(part =>
                      part.id === sourcePart.id ? sourcePart : part
                    ),
                  }) as Message
              )
            );
          },
          randomBetween(TOOL_MIN_DELAY_MS, TOOL_MAX_DELAY_MS)
        );

        return () => window.clearTimeout(toolTimeoutId);
      }

      const timeoutId = window.setTimeout(() => {
        setCursor(currentCursor => ({
          ...currentCursor,
          partIndex: currentCursor.partIndex + 1,
        }));
      }, PART_TRANSITION_DELAY_MS);
      return () => window.clearTimeout(timeoutId);
    }

    const visibleMessage = messages[cursor.messageIndex];
    const visiblePart = visibleMessage.parts.find(part => part.id === sourcePart.id);

    if (!visiblePart) {
      setMessages(currentMessages =>
        updateLastMessage(currentMessages, message => appendPartToMessage(message, sourcePart))
      );
    }

    const timeoutId = window.setTimeout(() => {
      setCursor(currentCursor => ({ ...currentCursor, partIndex: currentCursor.partIndex + 1 }));
    }, PART_TRANSITION_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [cursor, messages, sourceMessages]);

  return messages;
}
