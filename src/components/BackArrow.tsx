import { Tooltip } from "@/components/Tooltip";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import * as RadixTooltip from "@radix-ui/react-tooltip";

export function BackArrow() {
  return (
    <Tooltip content="Go back" side="bottom">
      <a
        href="/"
        className="absolute top-[76px]  -left-8 w-8 h-8 flex items-center justify-center rounded-full text-sm text-gray-7 hover:text-secondary hover:bg-gray-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="opacity-70"
        >
          <polyline points="9 10 4 15 9 20" />
          <path d="M20 4v7a4 4 0 0 1-4 4H4" />
        </svg>
      </a>
    </Tooltip>
  );
}
