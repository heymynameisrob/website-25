import type { ToolbarMenuProps } from "./types";
import {
  CloseIcon,
  TrashIcon,
  UserIcon,
  SwapIcon,
  UnpublishIcon,
} from "./icons";

export const ToolbarMenu = ({ onRemove, onClose }: ToolbarMenuProps) => {
  return (
    <>
      <button
        title="Cancel"
        aria-label="Cancel"
        data-microtip-position="top"
        role="tooltip"
        onClick={onClose}
        className="shrink-0 flex p-2 h-9 items-center gap-1 rounded-lg bg-transparent pb-1 pt-[6px] text-xs font-medium text-white hover:bg-ui-mid"
      >
        <CloseIcon />
      </button>
      <button
        onClick={onRemove}
        className="shrink-0 flex p-2 h-9 items-center gap-1 rounded-lg bg-ui pb-1 pt-[6px] text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10"
      >
        <TrashIcon />
        Remove
      </button>
      <button className="shrink-0 flex p-2 h-9 items-center gap-1 rounded-lg bg-transparent pb-1 pt-[6px] text-xs font-medium text-white hover:bg-ui-mid">
        <UserIcon />
        Assign to...
      </button>
      <button className="shrink-0 flex p-2 h-9 items-center gap-1 rounded-lg bg-transparent pb-1 pt-[6px] text-xs font-medium text-white hover:bg-ui-mid">
        <SwapIcon />
        Swap with...
      </button>
      <button
        disabled
        className="shrink-0 flex p-2 h-9 items-center gap-1 rounded-lg bg-transparent pb-1 pt-[6px] text-xs font-medium text-white hover:bg-ui-mid disabled:opacity-60 "
      >
        <UnpublishIcon />
        Unpublish
      </button>
    </>
  );
};
