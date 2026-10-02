import { useEffect, useRef, useState } from "react";

import landMaskUrl from "@/assets/earth-land-mask.png?url";

const SIZE = 400;
const RADIUS = 170;
const CELL_WIDTH = 5;
const CELL_HEIGHT = 7;
const MAP_WIDTH = 720;
const MAP_HEIGHT = 360;
const BASE_OPACITY = 0.5;
const ROTATION_SPEED = (2 * Math.PI) / 45000;
const TILT = (15 * Math.PI) / 180;
const PULSE_DURATION = 420;
const WAVE_SPEED = 0.32;
const LAND_CHARACTERS = ["naeshk", "HKNRAE", "MWBDOQ▓"];

interface Cell {
  x: number;
  y: number;
  longitude: number;
  mapRow: number;
  landCharacter: string;
  oceanCharacter: string;
  opacity: number;
}

interface Ripple {
  startedAt: number;
  delays: number[];
  duration: number;
}

/** Project each grid cell onto the front of a sphere once, not every frame. */
function createCells(): Cell[] {
  const cells: Cell[] = [];
  const cosTilt = Math.cos(TILT);
  const sinTilt = Math.sin(TILT);

  for (let row = 0; row < Math.floor(SIZE / CELL_HEIGHT); row++) {
    for (let column = 0; column < SIZE / CELL_WIDTH; column++) {
      const x = (column + 0.5) * CELL_WIDTH;
      const y = (row + 0.5) * CELL_HEIGHT;
      const normalX = (x - SIZE / 2) / RADIUS;
      const normalY = (SIZE / 2 - y) / RADIUS;
      const squaredDistance = normalX ** 2 + normalY ** 2;
      if (squaredDistance > 1) continue;

      const normalZ = Math.sqrt(1 - squaredDistance);
      const latitude = Math.asin(Math.max(-1, Math.min(1, normalY * cosTilt + normalZ * sinTilt)));
      const longitude = Math.atan2(normalX, normalZ * cosTilt - normalY * sinTilt);
      const light = Math.max(0, Math.min(1, -0.3 * normalX + 0.3 * normalY + 0.9 * normalZ));
      const palette = LAND_CHARACTERS[Math.min(2, Math.floor(light * 3))];
      const texture = column * 17 + row * 31 + column * row;

      cells.push({
        x,
        y,
        longitude,
        mapRow: Math.min(MAP_HEIGHT - 1, Math.floor((0.5 - latitude / Math.PI) * MAP_HEIGHT)),
        landCharacter: palette[texture % palette.length],
        oceanCharacter: squaredDistance > 0.94 ? "·" : ".",
        opacity: BASE_OPACITY,
      });
    }
  }

  return cells;
}

/** Draw real coastlines as characters on a continuously rotating globe. */
export function AsciiGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationControlRef = useRef<((paused: boolean) => void) | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasMapError, setHasMapError] = useState(false);

  useEffect(function setupGlobe() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const cells = createCells();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const image = new Image();
    let landMask: Uint8Array | null = null;
    let ripples: Ripple[] = [];
    let frameId: number | null = null;
    let previousTime: number | null = null;
    let rotation = 0;
    let paused = false;
    let isVisible = true;
    let disposed = false;

    /** Sample a cached land map; keep ocean marks lighter than land letters. */
    function draw() {
      if (!canvas || !context) return;
      context.clearRect(0, 0, SIZE, SIZE);
      context.fillStyle = getComputedStyle(canvas).color;
      context.font = "7px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      context.textAlign = "center";
      context.textBaseline = "middle";

      for (const cell of cells) {
        const mapX = Math.floor(((cell.longitude + rotation) / (2 * Math.PI) + 0.5) * MAP_WIDTH);
        const wrappedX = ((mapX % MAP_WIDTH) + MAP_WIDTH) % MAP_WIDTH;
        const isLand = landMask !== null && landMask[cell.mapRow * MAP_WIDTH + wrappedX] > 127;
        context.globalAlpha = cell.opacity;
        context.fillText(isLand ? cell.landCharacter : cell.oceanCharacter, cell.x, cell.y);
      }
      context.globalAlpha = 1;
    }

    /** Adjust the backing image without changing the 400 by 400 drawing space. */
    function resizeCanvas() {
      if (!canvas || !context) return;
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(SIZE * pixelRatio);
      canvas.height = Math.round(SIZE * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw();
    }

    /** Schedule work only while the globe or a ripple needs to move. */
    function updateAnimation() {
      const shouldAnimate = !disposed && landMask !== null && isVisible && !document.hidden &&
        !reducedMotion.matches && (!paused || ripples.length > 0);

      if (shouldAnimate && frameId === null) {
        frameId = requestAnimationFrame(animate);
      } else if (!shouldAnimate) {
        if (frameId !== null) cancelAnimationFrame(frameId);
        frameId = null;
        previousTime = null;
      }
    }

    /** Use elapsed time for a steady spin without React renders per frame. */
    function animate(now: number) {
      frameId = null;
      const elapsed = previousTime === null ? 0 : Math.min(50, now - previousTime);
      previousTime = now;
      if (!paused) rotation = (rotation + elapsed * ROTATION_SPEED) % (2 * Math.PI);

      if (ripples.length > 0) {
        ripples = ripples.filter(function keepActiveRipple(ripple) {
          return now - ripple.startedAt < ripple.duration;
        });
        for (let index = 0; index < cells.length; index++) {
          let intensity = 0;
          for (const ripple of ripples) {
            const progress = (now - ripple.startedAt - ripple.delays[index]) / PULSE_DURATION;
            if (progress >= 0 && progress <= 1) {
              intensity = Math.max(intensity, Math.sin(progress * Math.PI) ** 2);
            }
          }
          cells[index].opacity = BASE_OPACITY + (1 - BASE_OPACITY) * intensity;
        }
      }

      draw();
      updateAnimation();
    }

    /** Create a distance-delayed wave without changing the rotation. */
    function addRipple(x: number, y: number) {
      if (reducedMotion.matches || !landMask) return;
      let maxDelay = 0;
      const delays = cells.map(function getDelay(cell) {
        const delay = Math.hypot(cell.x - x, cell.y - y) / WAVE_SPEED;
        maxDelay = Math.max(maxDelay, delay);
        return delay;
      });
      ripples.push({ startedAt: performance.now(), delays, duration: maxDelay + PULSE_DURATION });
      if (ripples.length > 8) ripples.shift();
      updateAnimation();
    }

    /** Map clicks correctly when the canvas scales to a narrow screen. */
    function handleClick(event: MouseEvent) {
      if (!canvas) return;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      addRipple(
        ((event.clientX - bounds.left) / bounds.width) * SIZE,
        ((event.clientY - bounds.top) / bounds.height) * SIZE
      );
    }

    /** Allow keyboard users to send a wave from the center. */
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (!event.repeat) addRipple(SIZE / 2, SIZE / 2);
    }

    /** Stop both rotation and ripples when reduced motion is enabled. */
    function handleMotionChange() {
      if (reducedMotion.matches) {
        ripples = [];
        for (const cell of cells) cell.opacity = BASE_OPACITY;
      }
      draw();
      updateAnimation();
    }

    /** Decode the bundled public-domain map once into fast pixel lookups. */
    function handleMapLoad() {
      if (disposed) return;
      const mapCanvas = document.createElement("canvas");
      mapCanvas.width = MAP_WIDTH;
      mapCanvas.height = MAP_HEIGHT;
      const mapContext = mapCanvas.getContext("2d", { willReadFrequently: true });
      if (!mapContext) {
        setHasMapError(true);
        return;
      }
      mapContext.drawImage(image, 0, 0, MAP_WIDTH, MAP_HEIGHT);
      const pixels = mapContext.getImageData(0, 0, MAP_WIDTH, MAP_HEIGHT).data;
      landMask = new Uint8Array(MAP_WIDTH * MAP_HEIGHT);
      for (let index = 0; index < landMask.length; index++) landMask[index] = pixels[index * 4];
      draw();
      updateAnimation();
    }

    /** Show a clear message if the bundled map cannot load. */
    function handleMapError() {
      if (!disposed) setHasMapError(true);
    }

    /** Pause offscreen work and resume without a rotation jump. */
    function handleIntersection(entries: IntersectionObserverEntry[]) {
      isVisible = entries[0]?.isIntersecting ?? false;
      updateAnimation();
    }

    /** Keep the pause control separate from frame-by-frame rendering. */
    function setPaused(nextPaused: boolean) {
      paused = nextPaused;
      previousTime = null;
      updateAnimation();
    }

    animationControlRef.current = setPaused;
    const visibilityObserver = new IntersectionObserver(handleIntersection);
    visibilityObserver.observe(canvas);
    const themeObserver = new MutationObserver(draw);
    themeObserver.observe(document.documentElement, { attributes: true });
    resizeCanvas();
    image.onload = handleMapLoad;
    image.onerror = handleMapError;
    image.src = landMaskUrl;
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("visibilitychange", updateAnimation);
    reducedMotion.addEventListener("change", handleMotionChange);

    return function cleanupGlobe() {
      disposed = true;
      if (frameId !== null) cancelAnimationFrame(frameId);
      animationControlRef.current = null;
      image.onload = null;
      image.onerror = null;
      visibilityObserver.disconnect();
      themeObserver.disconnect();
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", updateAnimation);
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  /** Let users stop the continuous spin while keeping click ripples available. */
  function handleToggleSpin() {
    const nextPaused = !isPaused;
    animationControlRef.current?.(nextPaused);
    setIsPaused(nextPaused);
  }

  return (
    <div className="relative w-[400px] max-w-full">
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        role="button"
        tabIndex={0}
        aria-label="Spinning ASCII world globe. Click to create a ripple, or press Enter or Space for a centered ripple."
        className="block h-auto w-full aspect-square cursor-pointer text-gray-12 rounded focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        A spinning world globe with recognizable continents made from letters.
      </canvas>
      <div className="absolute inset-x-0 bottom-1 flex justify-center">
        {hasMapError ? (
          <p role="status" className="text-xs text-gray-11">The world map could not load.</p>
        ) : (
          <button
            type="button"
            onClick={handleToggleSpin}
            aria-label={isPaused ? "Resume globe rotation" : "Pause globe rotation"}
            className="rounded border bg-gray-2 px-3 py-1 text-xs text-gray-11 hover:text-gray-12 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {isPaused ? "Resume rotation" : "Pause rotation"}
          </button>
        )}
      </div>
    </div>
  );
}
