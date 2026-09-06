import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/Button";
import { PostDemo } from "@/components/post/PostDemo";
import { useLoadOnIntent } from "@/lib/hooks/useLoadOnIntent";

const BASE_RADIUS = 40;
const MAXIMUM_RADIUS = 130;
const TARGET_DIAMETER = 100;
const OPERATION_TIME = 4_000;

type LoadingStatus = "idle" | "loading" | "loaded";

interface LoadOnIntentOptions {
  status: LoadingStatus;
}

interface LoadOnIntentRenderProps {
  options: LoadOnIntentOptions;
  setOptions: React.Dispatch<React.SetStateAction<LoadOnIntentOptions>>;
}

const INITIAL_OPTIONS: LoadOnIntentOptions = {
  status: "idle",
};

function Spinner() {
  return (
    <Loader2Icon aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
  );
}

function ButtonStatus({ status }: { status: LoadingStatus }) {
  const shouldReduceMotion = useReducedMotion();
  const blur = shouldReduceMotion ? "blur(0px)" : "blur(2px)";

  return (
    <span className="grid">
      <AnimatePresence initial={false}>
        <motion.span
          key={status}
          initial={{ opacity: 0, filter: blur }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: blur }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.15, ease: "easeOut" }}
          className="col-start-1 row-start-1 inline-flex items-center justify-center gap-2"
        >
          {status === "loading" ? <Spinner /> : null}
          {status === "idle" ? "Load data" : null}
          {status === "loading" ? "Loading…" : null}
          {status === "loaded" ? "Data loaded" : null}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function LoadOnIntentExample({ options, setOptions }: LoadOnIntentRenderProps) {
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const radiusRef = React.useRef<HTMLDivElement>(null);
  const operationRef = React.useRef<Promise<void> | null>(null);
  const displayedRadiusRef = React.useRef(BASE_RADIUS);
  const shrinkTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const shouldReduceMotion = useReducedMotion();

  /** Runs one fake request so overlapping intent signals cannot start more work. */
  async function runFakeOperation() {
    if (operationRef.current) {
      return operationRef.current;
    }

    setOptions({ status: "loading" });

    const operation = new Promise<void>(function waitForFakeResponse(resolve) {
      setTimeout(resolve, OPERATION_TIME);
    });

    operationRef.current = operation;
    await operation;
    setOptions({ status: "loaded" });
  }

  /** Starts the operation as soon as the hook confirms intent. */
  function handleIntent() {
    void runFakeOperation();
  }

  function cancelShrinkTimer() {
    if (shrinkTimerRef.current === undefined) {
      return;
    }

    clearTimeout(shrinkTimerRef.current);
    shrinkTimerRef.current = undefined;
  }

  /** Updates the circle without causing a React render for each pointer sample. */
  function displayRadius(radius: number) {
    const radiusElement = radiusRef.current;

    if (!radiusElement) {
      return;
    }

    const maximumDiameter = TARGET_DIAMETER + MAXIMUM_RADIUS * 2;
    const currentDiameter = TARGET_DIAMETER + radius * 2;

    displayedRadiusRef.current = radius;
    radiusElement.style.transform = `scale(${currentDiameter / maximumDiameter})`;
  }

  /** Expands immediately but briefly holds the circle before it shrinks. */
  function handleRadiusChange(radius: number) {
    if (shouldReduceMotion) {
      cancelShrinkTimer();
      displayRadius(BASE_RADIUS);
      return;
    }

    if (radius >= displayedRadiusRef.current) {
      cancelShrinkTimer();
      displayRadius(radius);
      return;
    }

    cancelShrinkTimer();
    shrinkTimerRef.current = setTimeout(function delayRadiusShrink() {
      shrinkTimerRef.current = undefined;
      displayRadius(radius);
    }, 150);
  }

  React.useEffect(function manageShrinkTimer() {
    return function cleanupShrinkTimer() {
      if (shrinkTimerRef.current !== undefined) {
        clearTimeout(shrinkTimerRef.current);
      }
    };
  }, []);

  useLoadOnIntent({
    ref: buttonRef,
    cb: handleIntent,
    options: {
      minRadius: BASE_RADIUS,
      maxRadius: MAXIMUM_RADIUS,
      keepObserving: true,
      onRadiusChange: handleRadiusChange,
    },
  });

  return (
    <div className="relative grid place-items-center">
      <div
        ref={radiusRef}
        aria-hidden="true"
        className="pointer-events-none absolute size-[360px] rounded-full bg-orange-500/20 border-orange-400 border-2 inset-shadow-2xs transition-transform duration-150 ease-out will-change-transform motion-reduce:transition-none"
      />
      <Button
        ref={buttonRef}
        type="button"
        variant="accent"
        className="relative z-1"
        aria-live="polite"
      >
        <ButtonStatus status={options.status} />
      </Button>
    </div>
  );
}

function renderLoadOnIntentExample(props: LoadOnIntentRenderProps) {
  return <LoadOnIntentExample {...props} />;
}

export function LoadOnIntentDemo() {
  return (
    <PostDemo
      initialOptions={INITIAL_OPTIONS}
      caption="Move towards the button at different speeds to see the intent radius respond."
    >
      {renderLoadOnIntentExample}
    </PostDemo>
  );
}
