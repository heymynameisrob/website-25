import { Tooltip } from "@/components/Tooltip";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import * as RadixTooltip from "@radix-ui/react-tooltip";

export function BackArrow() {
  return (
    <Tooltip content="Back home" side="bottom">
      <a
        href="/"
        className="absolute top-[76px]  -left-8 w-8 h-8 flex items-center justify-center rounded-full text-sm text-gray-7 hover:text-secondary hover:bg-gray-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={16}
          height={16}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path d="m9 10-5 5 5 5" />
          <path d="M20 4v7a4 4 0 0 1-4 4H4" />
        </svg>
      </a>
    </Tooltip>
  );
}
