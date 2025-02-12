import { Tooltip } from "@/components/primitives/Tooltip";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import * as RadixTooltip from "@radix-ui/react-tooltip";

export function BackArrow() {
  return (
    <Tooltip content="Back home" side="bottom">
      <a
        href="/"
        aria-label="Go back home"
        className=" mb-4 flex items-center justify-start gap-2 p-2 rounded-full text-sm text-secondary hover:text-secondary hover:bg-gray-2 md:text-gray-7 md:size-8 md:absolute md:-left-8 md:top-[76px]"
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
          className="shrink-0"
        >
          <path d="m9 10-5 5 5 5" />
          <path d="M20 4v7a4 4 0 0 1-4 4H4" />
        </svg>
        <span className="block font-medium md:hidden">Go back</span>
      </a>
    </Tooltip>
  );
}
