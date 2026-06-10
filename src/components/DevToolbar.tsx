import { useEffect, useRef, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/Popover";
import { Portal } from "@radix-ui/react-portal";
import { FlaskConical } from "lucide-react";

type FpsStats = {
  fps: number;
  frameMs: number;
  jank: number;
};

function useFpsMonitor(updateEveryMs = 500): FpsStats {
  const [stats, setStats] = useState<FpsStats>({
    fps: 0,
    frameMs: 0,
    jank: 0,
  });

  const animationFrameId = useRef<number | null>(null);
  const lastFrameTime = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const frameCount = useRef(0);
  const totalFrameMs = useRef(0);
  const droppedFrames = useRef(0);

  useEffect(() => {
    const targetFrameMs = 1000 / 60;
    let isRunning = true;

    lastUpdateTime.current = performance.now();

    function tick(now: number) {
      if (!isRunning) {
        return;
      }

      const previousFrameTime = lastFrameTime.current;

      if (previousFrameTime !== null) {
        const frameMs = now - previousFrameTime;

        frameCount.current += 1;
        totalFrameMs.current += frameMs;

        if (frameMs > targetFrameMs * 1.5) {
          droppedFrames.current += Math.max(0, Math.floor(frameMs / targetFrameMs) - 1);
        }
      }

      lastFrameTime.current = now;

      if (now - lastUpdateTime.current >= updateEveryMs && frameCount.current > 0) {
        const averageFrameMs = totalFrameMs.current / frameCount.current;

        const expectedFrames = Math.max(1, frameCount.current + droppedFrames.current);
        const jank = (droppedFrames.current / expectedFrames) * 100;

        setStats({
          fps: Math.round(1000 / averageFrameMs),
          frameMs: Number(averageFrameMs.toFixed(2)),
          jank: Number(jank.toFixed(1)),
        });

        frameCount.current = 0;
        totalFrameMs.current = 0;
        droppedFrames.current = 0;
        lastUpdateTime.current = now;
      }

      animationFrameId.current = requestAnimationFrame(tick);
    }

    animationFrameId.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;

      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [updateEveryMs]);

  return stats;
}

function blockMainThread(durationMs: number) {
  const start = performance.now();

  while (performance.now() - start < durationMs) {
    Math.sqrt(Math.random() * Number.MAX_SAFE_INTEGER);
  }
}

const dots = Array.from({ length: 64 }, (_, index) => index);

function JankTester() {
  const [isJanky, setIsJanky] = useState(false);
  const [workMs, setWorkMs] = useState(28);
  const [visualTick, setVisualTick] = useState(0);
  const frameId = useRef<number | null>(null);

  useEffect(() => {
    if (!isJanky) {
      return;
    }

    let isRunning = true;

    function tick() {
      if (!isRunning) {
        return;
      }

      blockMainThread(workMs);
      setVisualTick(current => current + 1);
      frameId.current = requestAnimationFrame(tick);
    }

    frameId.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;

      if (frameId.current !== null) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [isJanky, workMs]);

  return (
    <section className="flex flex-col gap-3 text-sm text-gray-12">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-medium tracking-tight">Jank tester</h2>
          <p className="text-xs text-gray-10">Intentionally blocks the main thread.</p>
        </div>
        <button
          className="rounded-md border border-gray-6 bg-gray-2 px-2 py-1 text-xs font-medium text-gray-12 transition-colors hover:bg-gray-3"
          type="button"
          onClick={() => setIsJanky(current => !current)}
        >
          {isJanky ? "Stop" : "Start"}
        </button>
      </div>

      <label className="flex flex-col gap-1 text-xs text-gray-10">
        Work per frame: {workMs}ms
        <input
          aria-label="Work per frame in milliseconds"
          className="accent-gray-12"
          max="60"
          min="0"
          type="range"
          value={workMs}
          onChange={event => setWorkMs(Number(event.currentTarget.value))}
        />
      </label>

      <div className="relative h-28 overflow-hidden rounded-lg border border-gray-5 bg-gray-2">
        <div
          className="absolute inset-y-0 w-10 rounded-full bg-amber-9/80 blur-sm"
          style={{
            transform: `translateX(${(visualTick * 7) % 300}px)`,
            transition: "transform 80ms linear",
          }}
        />
        <div className="grid grid-cols-8 gap-1 p-2">
          {dots.map(dot => (
            <div
              className="aspect-square rounded-sm bg-gray-6"
              key={dot}
              style={{
                opacity: ((visualTick + dot) % 8) / 8 + 0.15,
                transform: `scale(${0.75 + ((visualTick + dot) % 5) * 0.08})`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FpsReadout({ fps, frameMs, jank }: FpsStats) {
  const isJanky = jank > 10;

  return (
    <dl className="flex items-center gap-2 font-mono text-[11px] leading-none">
      <div className="flex items-baseline gap-1.5 px-0.5">
        <dt className="text-gray-10">FPS</dt>
        <dd>
          {fps} <span className="opacity-70">{frameMs.toFixed(2)}ms</span>
        </dd>
      </div>
      <div className="shrink-0 h-10 w-px bg-white/10" />
      <div className="flex items-baseline gap-1.5 px-0.5">
        <dt className={isJanky ? "text-red-500" : "text-gray-10"}>Jank</dt>
        <dd className={isJanky ? "text-red-500" : undefined}>{jank.toFixed(0)}%</dd>
      </div>
      <div className="shrink-0 h-10 w-px bg-white/10" />
    </dl>
  );
}

export function DevToolbar() {
  const stats = useFpsMonitor();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.altKey && event.key === ".") {
        event.preventDefault();
        setIsVisible(current => !current);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <Portal asChild>
      <div
        aria-label="Developer toolbar"
        aria-hidden="true"
        className="dark fixed bottom-0 right-0 z-max flex items-center pl-1.5 rounded-tl-sm bg-black px-px h-8 text-white shadow-xs z-[9999999] overflow-hidden border border-white/10"
      >
        <FpsReadout {...stats} />
        <Popover>
          <PopoverTrigger asChild>
            <button
              className="size-8 h-full flex items-center justify-center text-center hover:bg-white/10 outline-none text-xs"
              type="button"
            >
              <FlaskConical className="size-3" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-72 p-3" side="top">
            <JankTester />
          </PopoverContent>
        </Popover>
      </div>
    </Portal>
  );
}
