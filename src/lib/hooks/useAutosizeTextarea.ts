import * as React from "react";

import { clamp } from "@/lib/utils";

type UseAutosizeTextareaOptions = {
  minHeight?: number;
  maxHeight?: number;
};

export function useAutosizeTextarea(
  ref: React.RefObject<HTMLTextAreaElement | null>,
  value: string,
  options: UseAutosizeTextareaOptions
) {
  React.useLayoutEffect(() => {
    const textarea = ref.current;
    const { minHeight = 48, maxHeight = 120 } = options;

    if (!textarea) return;

    // Reset to minHeight so scrollHeight measures content, not the previous
    // height. Without this, the textarea only ever grows — it can't shrink
    // when the user deletes text.
    textarea.style.height = `${minHeight}px`;

    const height = clamp(textarea.scrollHeight, [minHeight, maxHeight]);
    const isOverflowing = textarea.scrollHeight > maxHeight;

    textarea.style.height = `${height}px`;
    textarea.style.overflowY = isOverflowing ? "auto" : "hidden";
  }, [ref, value, options]);
}
