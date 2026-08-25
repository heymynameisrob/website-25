import * as React from "react";
import { useInView } from "motion/react";

import { cn } from "@/lib/utils";

const VIEW_MARGIN = "200px 0px";

interface PostDemoRenderProps<TOptions> {
  options: TOptions;
  setOptions: React.Dispatch<React.SetStateAction<TOptions>>;
}

interface PostDemoProps<TOptions> {
  children: (props: PostDemoRenderProps<TOptions>) => React.ReactNode;
  caption?: string;
  className?: string;
  controls?: (props: PostDemoRenderProps<TOptions>) => React.ReactNode;
  initialOptions: TOptions;
}

export function PostDemo<TOptions>({
  children,
  caption,
  controls,
  initialOptions,
  className,
}: PostDemoProps<TOptions>) {
  const containerRef = React.useRef<HTMLElement>(null);
  const shouldMountDemo = useInView(containerRef, {
    amount: "some",
    margin: VIEW_MARGIN,
  });
  const [options, setOptions] = React.useState(initialOptions);
  const renderProps = { options, setOptions };

  return (
    <figure ref={containerRef} className="my-12 flex flex-col items-center justify-center gap-2">
      <div
        className={cn(
          "relative not-prose grid h-100 w-full place-items-center overflow-hidden rounded-lg border bg-gray-2 p-6 font-sans",
          className
        )}
      >
        {shouldMountDemo ? children(renderProps) : null}
        {shouldMountDemo && controls ? (
          <div className="absolute bottom-0 py-4 inset-x-0 flex justify-center gap-2">
            {controls(renderProps)}
          </div>
        ) : null}
      </div>
      {caption ? (
        <figcaption className="text-xs text-gray-10 font-sans">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
