import { useState } from "react";
import ky from "ky";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/primitives/Popover";
import { Button } from "@/components/primitives/Button";

type EmojiPickerProps = {
  emoji?: string | undefined;
  onEmojiSelect: (emoji: string) => void;
  fallback?: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

export const EmojiPicker = ({
  emoji,
  fallback = "✨",
  onEmojiSelect,
  disabled,
  className,
}: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-7 w-7 rounded-md bg-gray-1 hover:bg-gray-2 p-px !text-base focus",
            disabled && "pointer-events-none",
            className,
          )}
        >
          {emoji || fallback}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        side="bottom"
        avoidCollisions={true}
        className="w-[350px] overflow-hidden border-0 p-0"
      >
        <Picker
          data={data}
          autoFocus={true}
          onEmojiSelect={(emoji: { native: string }) => {
            onEmojiSelect(emoji.native);
            setIsOpen(false);
          }}
          previewEmoji={emoji}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
};
