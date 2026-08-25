import * as React from "react";

import { PostDemo } from "@/components/post/PostDemo";
import { useAutosizeTextarea } from "@/lib/hooks/useAutosizeTextarea";

const AUTOSIZE_OPTIONS = { minHeight: 48, maxHeight: 144 };
const INITIAL_OPTIONS = {};

function AutosizeTextarea() {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  useAutosizeTextarea(textareaRef, value, AUTOSIZE_OPTIONS);

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(event.target.value);
  }

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      value={value}
      aria-label="Message"
      placeholder="Write a short message, then add a few more lines…"
      className="block w-full max-w-md resize-none overflow-hidden rounded-xl border bg-gray-1 px-3 py-3 text-primary shadow-xs placeholder:text-gray-9 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
      onChange={handleChange}
    />
  );
}

function renderAutosizeTextarea() {
  return <AutosizeTextarea />;
}

export function AutosizeTextareaDemo() {
  return (
    <PostDemo
      initialOptions={INITIAL_OPTIONS}
      caption="Type several lines to see the textarea grow until it reaches its maximum height."
    >
      {renderAutosizeTextarea}
    </PostDemo>
  );
}
