import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/primitives/HoverCard";

export function ReactAvatar() {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger className="w-fit">
        <h1 className="text-[22px] leading-tight tracking-tighter font-serif cursor-default">
          Rob Hough
        </h1>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        className="aspect-square p-0 rounded-lg overflow-clip data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200"
        sideOffset={5}
      >
        <img
          src="https://ucarecdn.com/75709875-783d-47e9-a60a-6d43e1d5d344/"
          loading="lazy"
          alt="Rob Hough"
          className="object-fit w-full h-full"
        />
      </HoverCardContent>
    </HoverCard>
  );
}
