import { useState, useEffect } from "react";
import dedent from "dedent";

interface UseTextStreamOptions {
  delayBeforeStart?: number;
  delayBetweenWords?: number;
}

type StreamStatus = "idle" | "streaming" | "complete";

export function useTextStream({
  delayBeforeStart = 3000,
  delayBetweenWords = 20,
}: UseTextStreamOptions = {}) {
  const message = dedent`
    Tell me some British artists I might like
  `;

  const response = dedent`
    Here are some widely admired British artists across different periods and styles. I’ve grouped them so you can explore depending on your taste:

    - J.M.W. Turner – Master of light and atmosphere; dramatic seascapes and landscapes.
    - John Constable – Famous for pastoral English countryside scenes.
    - William Blake – Visionary poet-artist known for mystical illustrations.
    - David Hockney – Vibrant colors, swimming pools, iPad drawings.


    If you tell me what kind of art you like—painting, surrealism, street art, photography—I can tailor a more specific list!
  `;

  const [displayedText, setDisplayedText] = useState("");
  const [status, setStatus] = useState<StreamStatus>("idle");

  useEffect(() => {
    // Split response into words (tokens) while preserving whitespace
    const words = response.split(/(\s+)/);

    // Start streaming after a delay
    const startDelay = setTimeout(() => {
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
    }, delayBeforeStart);

    return () => clearTimeout(startDelay);
  }, [response, delayBeforeStart, delayBetweenWords]);

  return { message, displayedText, status };
}
