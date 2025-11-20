import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/primitives/DropdownMenu";
import {
  ArrowTurnUpRightIcon,
  GlobeAltIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/16/solid";

export function Easing() {
  return (
    <div className="w-full flex items-center justify-between max-w-sm mx-auto">
      <article className="flex-1 flex flex-col justify-center items-center gap-4">
        <DropdownCustomEasing className="duration-300 ease-in" />
        <span className="px-0.5 rounded bg-gray-3 border font-mono text-secondary text-sm font-medium">
          ease-in
        </span>
      </article>
      <article className="flex-1 flex flex-col justify-center items-center gap-4">
        <DropdownCustomEasing className="ease-[cubic-bezier(.19,1,.22,1)]" />
        <span className="px-0.5 rounded bg-gray-3 border font-mono text-secondary text-sm font-medium">
          ease-out
        </span>
      </article>
    </div>
  );
}

function DropdownCustomEasing({ className }: { className?: string }) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        <Button size="sm" className="data-[state=open]:bg-gra">
          Open
        </Button>
      </DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="center"
          side="top"
          onCloseAutoFocus={(e) => e.preventDefault()}
          className={cn(
            "z-50 min-w-32 overflow-hidden rounded-lg bg-gray-1 p-0.5 text-primary shadow-raised",
            "origin-[var(--radix-popper-transform-origin)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            // Important bit
            className,
          )}
        >
          <DropdownMenuItem className="gap-2 font-medium">
            <LinkIcon className="size-4 opacity-70" />
            <span>Copy link</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 font-medium">
            <GlobeAltIcon className="size-4 opacity-70" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 font-medium">
            <ArrowTurnUpRightIcon className="size-4 opacity-70" />
            <span>Move to...</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 font-medium">
            <PencilIcon className="size-4 opacity-70" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-2 font-medium text-red-500">
            <TrashIcon className="size-4 opacity-70" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
