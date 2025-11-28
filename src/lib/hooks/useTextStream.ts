import { useState, useEffect } from "react";
import dedent from "dedent";

interface UseTextStreamOptions {
  delayBeforeStart?: number;
  delayBetweenWords?: number;
}

type StreamStatus = "idle" | "thinking" | "streaming" | "complete";

export function useTextStream({
  delayBeforeStart = 3000,
  delayBetweenWords = 20,
}: UseTextStreamOptions = {}) {
  const message = dedent`
    Give me some British artists I might like
  `;

  const response = dedent`
    Here are some widely admired British artists across different periods and styles.

    - J.M.W. Turner – Master of light and atmosphere; dramatic seascapes and landscapes.
    - William Blake – Visionary poet-artist known for mystical illustrations.
    - David Hockney – Vibrant colors, swimming pools, iPad drawings.

    I can suggest more if you tell me what styles you like!
  `;

  const [displayedText, setDisplayedText] = useState("");
  const [status, setStatus] = useState<StreamStatus>("idle");

  useEffect(() => {
    // Split response into words (tokens) while preserving whitespace
    const words = response.split(/(\s+)/);

    // Start thinking phase immediately
    setStatus("thinking");

    // Transition to streaming after thinking delay (3s)
    const thinkingDelay = setTimeout(() => {
      setStatus("streaming");
      let currentWordIndex = 0;

      const intervalId = setInterval(() => {
        if (currentWordIndex < words.length) {
          // Add one word at a time
          setDisplayedText(words.slice(0, currentWordIndex + 1).join(""));
          currentWordIndex++;
        } else {
          setStatus("complete");
          clearInterval(intervalId);
        }
      }, delayBetweenWords);

      return () => clearInterval(intervalId);
    }, 6_000);

    return () => clearTimeout(thinkingDelay);
  }, [response, delayBetweenWords]);

  return { message, displayedText, status };
}
