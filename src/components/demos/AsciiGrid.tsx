import { useEffect, useRef, useState } from "react";

const WIDTH = 800;
const HEIGHT = 600;
const CELL_WIDTH = 10;
const CELL_HEIGHT = 15;
const COLUMNS = WIDTH / CELL_WIDTH;
const ROWS = HEIGHT / CELL_HEIGHT;
const MIN_CHANGE_DURATION = 300;
const MAX_CHANGE_DURATION = 900;
const MIN_BLOCK_HOLD = 60000;
const MAX_BLOCK_HOLD = 180000;
const BLOCK_OPACITY = 0.1;
const FILL_PROBABILITY = 0.2;
const TRAIL_LENGTH = 600;
const IDLE_FADE_DURATION = 1200;
const RIPPLE_RADIUS = 280;
const RIPPLE_SPEED = 0.8;
const HIGHLIGHT_COLOR = "#FF8DA1";
const RIPPLE_FADE_DURATION = 700;
const MAX_RIPPLES = 4;

interface Cell {
  character: string;
  filled: boolean;
  opacity: number;
  fromOpacity: number;
  changeStartedAt: number;
  changeDuration: number;
  nextChangeAt: number;
}

interface TrailCell {
  character: string;
  distance: number;
}

interface Ripple {
  startedAt: number;
  distances: number[];
}

interface Point {
  x: number;
  y: number;
}

/** Draw a changing block grid with a pink trail that follows pointer travel. */
export function AsciiGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pauseRef = useRef<((paused: boolean) => void) | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(function setupGrid() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const cells: Cell[] = [];
    const trail = new Map<number, TrailCell>();
    let ripples: Ripple[] = [];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let previousPoint: Point | null = null;
    let distance = 0;
    let lastPointerTime = 0;
    let frameId: number | null = null;
    let isVisible = true;
    let paused = false;
    let animationTime = 0;
    let previousFrameTime: number | null = null;

    /** Keep empty cells idle longer so the grid stays sparse. */
    function getHoldDuration(filled: boolean) {
      const duration = MIN_BLOCK_HOLD + Math.random() * (MAX_BLOCK_HOLD - MIN_BLOCK_HOLD);
      return filled ? duration : (duration * (1 - FILL_PROBABILITY)) / FILL_PROBABILITY;
    }

    /** Start every cell at a different point in its own life cycle. */
    function createCells() {
      for (let index = 0; index < COLUMNS * ROWS; index++) {
        const filled = Math.random() < FILL_PROBABILITY;
        const opacity = filled ? BLOCK_OPACITY : 0;
        cells.push({
          character: Math.random() < 0.5 ? "█" : "▯",
          filled,
          opacity,
          fromOpacity: opacity,
          changeStartedAt: -MAX_CHANGE_DURATION,
          changeDuration: MAX_CHANGE_DURATION,
          nextChangeAt: Math.random() * getHoldDuration(filled),
        });
      }
    }

    /** Draw solid and outline blocks at the same size for every color layer. */
    function drawCharacter(
      character: string,
      x: number,
      y: number,
      color: string,
      opacity: number,
      metrics: TextMetrics
    ) {
      if (!context || opacity <= 0) return;
      context.globalAlpha = opacity;
      if (character === "█") {
        context.fillStyle = color;
        context.fillText("█", x, y);
      } else {
        context.strokeStyle = color;
        context.lineWidth = 1;
        context.strokeRect(
          x - metrics.actualBoundingBoxLeft + 0.5,
          y - metrics.actualBoundingBoxAscent + 0.5,
          Math.max(0, metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight - 1),
          Math.max(0, metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent - 1)
        );
      }
    }

    /** Fade by distance along the path, not straight-line distance to the pointer. */
    function draw(now = performance.now()) {
      if (!canvas || !context) return;
      context.clearRect(0, 0, WIDTH, HEIGHT);
      context.font = "14px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      context.textAlign = "center";
      context.textBaseline = "middle";
      const blockMetrics = context.measureText("█");
      const idleOpacity = reducedMotion.matches
        ? 1
        : Math.max(0, 1 - (now - lastPointerTime) / IDLE_FADE_DURATION);
      const baseColor = getComputedStyle(canvas).color;
      for (let index = 0; index < cells.length; index++) {
        const cell = cells[index];
        if (animationTime >= cell.nextChangeAt) {
          cell.fromOpacity = cell.opacity;
          cell.filled = !cell.filled;
          if (cell.filled) cell.character = Math.random() < 0.5 ? "█" : "▯";
          cell.changeStartedAt = animationTime;
          cell.changeDuration =
            MIN_CHANGE_DURATION + Math.random() * (MAX_CHANGE_DURATION - MIN_CHANGE_DURATION);
          cell.nextChangeAt = animationTime + cell.changeDuration + getHoldDuration(cell.filled);
        }
        const targetOpacity = cell.filled ? BLOCK_OPACITY : 0;
        const progress = Math.min(
          1,
          Math.max(0, (animationTime - cell.changeStartedAt) / cell.changeDuration)
        );
        const easedProgress = progress * progress * (3 - 2 * progress);
        cell.opacity = cell.fromOpacity + (targetOpacity - cell.fromOpacity) * easedProgress;
        const x = ((index % COLUMNS) + 0.5) * CELL_WIDTH;
        const y = (Math.floor(index / COLUMNS) + 0.5) * CELL_HEIGHT;
        let rippleOpacity = 0;
        for (const ripple of ripples) {
          const cellDistance = ripple.distances[index];
          if (cellDistance >= RIPPLE_RADIUS) continue;
          const rippleProgress =
            (animationTime - ripple.startedAt - cellDistance / RIPPLE_SPEED) / RIPPLE_FADE_DURATION;
          if (rippleProgress < 0 || rippleProgress > 1) continue;
          const distanceOpacity = 1 - cellDistance / RIPPLE_RADIUS;
          rippleOpacity = Math.max(rippleOpacity, distanceOpacity * (1 - rippleProgress) ** 2);
        }
        const mark = trail.get(index);
        const opacity = mark
          ? Math.max(0, 1 - (distance - mark.distance) / TRAIL_LENGTH) * idleOpacity
          : 0;

        if (mark && opacity > 0) {
          drawCharacter(
            mark.character,
            x,
            y,
            HIGHLIGHT_COLOR,
            Math.max(opacity, rippleOpacity),
            blockMetrics
          );
        } else {
          if (mark) trail.delete(index);
          drawCharacter(cell.character, x, y, baseColor, cell.opacity, blockMetrics);
          drawCharacter(
            cell.character,
            x,
            y,
            HIGHLIGHT_COLOR,
            rippleOpacity * (cell.opacity / BLOCK_OPACITY),
            blockMetrics
          );
        }
      }
      context.globalAlpha = 1;
    }

    /** Advance independent cell life cycles without a shared pattern reset. */
    function animate(now: number) {
      frameId = null;
      if (paused || reducedMotion.matches || !isVisible || document.hidden) return;
      if (previousFrameTime !== null) animationTime += Math.min(100, now - previousFrameTime);
      previousFrameTime = now;
      ripples = ripples.filter(function keepActiveRipple(ripple) {
        return (
          animationTime - ripple.startedAt < RIPPLE_RADIUS / RIPPLE_SPEED + RIPPLE_FADE_DURATION
        );
      });
      draw(now);
      frameId = requestAnimationFrame(animate);
    }

    /** Freeze the animation clock when paused, hidden, or in reduced-motion mode. */
    function updateAnimation() {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
      previousFrameTime = null;
      if (paused || reducedMotion.matches || !isVisible || document.hidden) return;
      frameId = requestAnimationFrame(animate);
    }

    /** Record a visited cell even when its background is empty. */
    function stampPoint(point: Point, pathDistance: number) {
      if (point.x < 0 || point.x >= WIDTH || point.y < 0 || point.y >= HEIGHT) return;
      const index = Math.floor(point.y / CELL_HEIGHT) * COLUMNS + Math.floor(point.x / CELL_WIDTH);
      trail.set(index, {
        character: "█",
        distance: pathDistance,
      });
    }

    /** Fill gaps between pointer events so fast movement leaves a continuous path. */
    function handlePointerMove(event: PointerEvent) {
      if (!canvas || paused) return;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const point = {
        x: ((event.clientX - bounds.left) * WIDTH) / bounds.width,
        y: ((event.clientY - bounds.top) * HEIGHT) / bounds.height,
      };
      if (previousPoint) {
        const segmentLength = Math.hypot(point.x - previousPoint.x, point.y - previousPoint.y);
        const steps = Math.max(1, Math.ceil(segmentLength / (CELL_WIDTH / 2)));
        for (let step = 1; step <= steps; step++) {
          const progress = step / steps;
          stampPoint(
            {
              x: previousPoint.x + (point.x - previousPoint.x) * progress,
              y: previousPoint.y + (point.y - previousPoint.y) * progress,
            },
            distance + segmentLength * progress
          );
        }
        distance += segmentLength;
      } else {
        stampPoint(point, distance);
      }
      previousPoint = point;
      lastPointerTime = performance.now();
      draw(lastPointerTime);
      if (frameId === null && !reducedMotion.matches && isVisible && !document.hidden) {
        frameId = requestAnimationFrame(animate);
      }
    }

    /** Cache distances once so each character fades as the wave reaches it. */
    function addRipple(x: number, y: number) {
      if (paused || reducedMotion.matches) return;
      const distances: number[] = [];
      const originColumn = Math.min(COLUMNS - 1, Math.max(0, Math.floor(x / CELL_WIDTH)));
      const originRow = Math.min(ROWS - 1, Math.max(0, Math.floor(y / CELL_HEIGHT)));
      for (let index = 0; index < cells.length; index++) {
        const cellX = ((index % COLUMNS) + 0.5) * CELL_WIDTH;
        const cellY = (Math.floor(index / COLUMNS) + 0.5) * CELL_HEIGHT;
        const cellDistance =
          index === originRow * COLUMNS + originColumn ? 0 : Math.hypot(cellX - x, cellY - y);
        distances.push(cellDistance);
      }
      ripples.push({ startedAt: animationTime, distances });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
      draw();
    }

    /** Map the click to the canvas drawing space on every screen size. */
    function handleClick(event: MouseEvent) {
      if (!canvas) return;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      addRipple(
        ((event.clientX - bounds.left) * WIDTH) / bounds.width,
        ((event.clientY - bounds.top) * HEIGHT) / bounds.height
      );
    }

    /** Let keyboard users start a ripple from the center. */
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (!event.repeat) addRipple(WIDTH / 2, HEIGHT / 2);
    }

    /** Do not draw a line across the canvas when the pointer returns. */
    function handlePointerLeave() {
      previousPoint = null;
    }

    /** Keep the drawing space at 800 by 600 on high-density screens. */
    function resizeCanvas() {
      if (!canvas || !context) return;
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(WIDTH * pixelRatio);
      canvas.height = Math.round(HEIGHT * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw();
    }

    /** Remove moving trails when the motion preference changes. */
    function handleMotionChange() {
      ripples = [];
      trail.clear();
      previousPoint = null;
      draw();
      updateAnimation();
    }

    /** Suspend work outside the viewport. */
    function handleIntersection(entries: IntersectionObserverEntry[]) {
      isVisible = entries[0]?.isIntersecting ?? false;
      updateAnimation();
    }

    /** Pause the grid and clear the trail without React renders per frame. */
    function setPaused(nextPaused: boolean) {
      paused = nextPaused;
      trail.clear();
      previousPoint = null;
      draw();
      updateAnimation();
    }

    /** Redraw the grid when the site theme changes. */
    function handleThemeChange() {
      draw();
    }

    pauseRef.current = setPaused;
    createCells();
    resizeCanvas();
    updateAnimation();
    const visibilityObserver = new IntersectionObserver(handleIntersection);
    visibilityObserver.observe(canvas);
    const themeObserver = new MutationObserver(handleThemeChange);
    themeObserver.observe(document.documentElement, { attributes: true });
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("pointercancel", handlePointerLeave);
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("visibilitychange", updateAnimation);
    reducedMotion.addEventListener("change", handleMotionChange);

    return function cleanupGrid() {
      if (frameId !== null) cancelAnimationFrame(frameId);
      pauseRef.current = null;
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("pointercancel", handlePointerLeave);
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", updateAnimation);
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  /** Let users stop the continuous grid changes. */
  function handleTogglePause() {
    const nextPaused = !isPaused;
    pauseRef.current?.(nextPaused);
    setIsPaused(nextPaused);
  }

  return (
    <div className="relative w-[800px] max-w-full">
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        role="button"
        tabIndex={0}
        aria-label="A grid of block characters. Move your pointer to draw a pink trail. Click to create an opacity ripple, or press Enter or Space for a centered ripple."
        className="block h-auto w-full aspect-[4/3] cursor-pointer text-gray-12 focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        A changing grid of block characters with a pink pointer trail.
      </canvas>
      <button
        type="button"
        onClick={handleTogglePause}
        aria-pressed={isPaused}
        className="absolute bottom-3 right-3 rounded border bg-gray-2 px-3 py-1 text-xs text-gray-11 hover:text-gray-12 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {isPaused ? "Resume animation" : "Pause animation"}
      </button>
    </div>
  );
}
