import * as React from "react";
import { useInView } from "motion/react";

import { AsciiGlobe } from "@/components/demos/AsciiGlobe";
import { AsciiGrid } from "@/components/demos/AsciiGrid";
import { AsciiSmiley } from "@/components/demos/AsciiSmiley";
import { cn } from "@/lib/utils";

const VIEW_MARGIN = "100px 0px";

export function AsciiGridDemo() {
  return (
    <PostDemo initialOptions={null} className="h-auto aspect-4/3 p-0">
      {renderAsciiGrid}
    </PostDemo>
  );
}

function renderAsciiGrid() {
  return <AsciiGrid />;
}

export function AsciiGlobeDemo() {
  return (
    <PostDemo initialOptions={null} className="p-0">
      {renderAsciiGlobe}
    </PostDemo>
  );
}

function renderAsciiGlobe() {
  return <AsciiGlobe />;
}

export function AsciiSmileyDemo() {
  return (
    <PostDemo initialOptions={null} className="p-0">
      {renderAsciiSmiley}
    </PostDemo>
  );
}

function renderAsciiSmiley() {
  return <AsciiSmiley />;
}

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
