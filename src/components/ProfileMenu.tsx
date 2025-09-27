import { BackArrow } from "@/components/BackArrow";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/primitives/DropdownMenu";
import { AVAILABLE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SquareArrowOutUpRightIcon } from "lucide-react";

export function ProfileMenu() {
  const isNotHomePage =
    typeof window !== undefined && window.location.pathname !== "/";

  return (
    <DropdownMenu>
      <div className="flex items-center gap-2">
        <DropdownMenuTrigger className="size-8 rounded-full focus">
          <div className="size-8 rounded-full bg-gray-3 ring-2 ring-offset-2 ring-gray-9 ring-offset-background overflow-hidden">
            <img
              src="https://ucarecdn.com/75709875-783d-47e9-a60a-6d43e1d5d344/-/preview/100x100/"
              loading="lazy"
              alt="Rob Hough"
              className="object-fit w-full h-full"
            />
          </div>
        </DropdownMenuTrigger>
        {isNotHomePage && <BackArrow />}
      </div>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
            <a
              href="https://calendar.notion.so/meet/robhough180/7xa14o4j"
              className="flex items-center gap-2 justify-between font-medium"
            >
              Book me
              <div className="size-3.5 grid place-items-center">
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    AVAILABLE ? "bg-green-500" : "bg-gray-6",
                  )}
                />
              </div>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
            <a href="/posts" className="flex items-center gap-2 font-medium">
              Blog
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
            <a href="/now" className="flex items-center gap-2 font-medium">
              Now
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-gray-9 px-1">
            Links
          </DropdownMenuLabel>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
            <a
              href="https://github.com/heymynameisrob"
              className="flex items-center justify-between gap-2 font-medium"
            >
              Github
              <SquareArrowOutUpRightIcon className="size-3.5 opacity-40" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
            <a
              href="https://www.linkedin.com/in/heymynameisrob/"
              className="flex items-center justify-between gap-2 font-medium"
            >
              LinkedIn
              <SquareArrowOutUpRightIcon className="size-3.5 opacity-40" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()} asChild>
            <a
              href="/"
              className="flex items-center justify-between gap-2 font-medium"
            >
              CV
              <SquareArrowOutUpRightIcon className="size-3.5 opacity-40" />
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
