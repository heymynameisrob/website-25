import { useEffect, useRef, useState } from "react";

import zeusBustUrl from "@/assets/zeus-bust.png?url";

const SIZE = 400;
const CELL_WIDTH = 3;
const CELL_HEIGHT = 4;
const BASE_OPACITY = 0.85;
const PULSE_DURATION = 420;
const WAVE_SPEED = 0.32;
const SCRAMBLE_THRESHOLD = 0.9;
const SCRAMBLE_INTERVAL = 55;
const CHARACTERS = ".,:;-~=+!*ox%&#@";

interface Cell {
  x: number;
  y: number;
  character: string;
  opacity: number;
}

interface Ripple {
  startedAt: number;
  delays: number[];
  duration: number;
}

/** Sample the drawing once so animation frames only draw characters. */
function createCells(pixels: Uint8ClampedArray): Cell[] {
  const cells: Cell[] = [];
  for (let y = CELL_HEIGHT / 2; y < SIZE - 1; y += CELL_HEIGHT) {
    for (let x = Math.floor(CELL_WIDTH / 2); x < SIZE - 1; x += CELL_WIDTH) {
      let luminance = 0;
      let alpha = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const index = ((y + dy) * SIZE + x + dx) * 4;
          const coverage = pixels[index + 3] / 255;
          luminance += pixels[index] * coverage;
          alpha += coverage;
        }
      }
      if (alpha < 3) continue;
      let brightness = luminance / (alpha * 255);
      const leftEyeDistance = ((x - 150) / 30) ** 2 + ((y - 148) / 18) ** 2;
      const rightEyeDistance = ((x - 224) / 30) ** 2 + ((y - 148) / 18) ** 2;
      const eyeDetail = Math.max(0, 1 - Math.min(leftEyeDistance, rightEyeDistance));
      if (eyeDetail > 0) {
        const centerBrightness = pixels[(y * SIZE + x) * 4] / 255;
        let nearbyBrightness = 0;
        for (let dy = -4; dy <= 4; dy += 2) {
          for (let dx = -4; dx <= 4; dx += 2) {
            nearbyBrightness += pixels[((y + dy) * SIZE + x + dx) * 4] / 255;
          }
        }
        const sharpenedBrightness = centerBrightness + (centerBrightness - nearbyBrightness / 25) * 2;
        brightness += (sharpenedBrightness - brightness) * eyeDetail;
      }
      const shadow = Math.max(0, Math.min(1, (0.82 - brightness) / 0.6));
      cells.push({
        x,
        y,
        character: CHARACTERS[Math.min(CHARACTERS.length - 1, Math.floor(shadow * CHARACTERS.length))],
        opacity: 0.25 + 0.75 * shadow,
      });
    }
  }
  return cells;
}

export function AsciiZeus() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(function setupZeus() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const image = new Image();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cells: Cell[] = [];
    let ripples: Ripple[] = [];
    let frameId: number | null = null;
    let isVisible = true;
    let disposed = false;

    function draw(now = performance.now()) {
      if (!canvas || !context) return;
      context.clearRect(0, 0, SIZE, SIZE);
      context.fillStyle = getComputedStyle(canvas).color;
      context.font = "5px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
      context.textAlign = "center";
      context.textBaseline = "middle";

      for (let index = 0; index < cells.length; index++) {
        let intensity = 0;
        for (const ripple of ripples) {
          const progress = (now - ripple.startedAt - ripple.delays[index]) / PULSE_DURATION;
          if (progress >= 0 && progress <= 1) {
            intensity = Math.max(intensity, Math.sin(progress * Math.PI) ** 2);
          }
        }
        const cell = cells[index];
        const restingOpacity = BASE_OPACITY * cell.opacity;
        context.globalAlpha = restingOpacity + (1 - restingOpacity) * intensity;
        let character = cell.character;
        if (!reducedMotion.matches && intensity >= SCRAMBLE_THRESHOLD) {
          const tick = Math.floor(now / SCRAMBLE_INTERVAL);
          const offset = ((index * 17 + tick * 13) % 7) - 3;
          const characterIndex = Math.max(0, Math.min(
            CHARACTERS.length - 1,
            CHARACTERS.indexOf(cell.character) + offset
          ));
          character = CHARACTERS[characterIndex];
        }
        context.fillText(character, cell.x, cell.y);
      }
      context.globalAlpha = 1;
    }

    function updateAnimation() {
      const shouldAnimate = !disposed && isVisible && !document.hidden &&
        !reducedMotion.matches && ripples.length > 0;
      if (shouldAnimate && frameId === null) {
        frameId = requestAnimationFrame(animate);
      } else if (!shouldAnimate && frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    }

    function animate(now: number) {
      frameId = null;
      ripples = ripples.filter(function keepActiveRipple(ripple) {
        return now - ripple.startedAt < ripple.duration;
      });
      draw(now);
      updateAnimation();
    }

    function addRipple(x: number, y: number) {
      if (reducedMotion.matches || cells.length === 0) return;
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

    function handleClick(event: MouseEvent) {
      if (!canvas) return;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      addRipple(
        ((event.clientX - bounds.left) / bounds.width) * SIZE,
        ((event.clientY - bounds.top) / bounds.height) * SIZE
      );
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (!event.repeat) addRipple(SIZE / 2, SIZE / 2);
    }

    function resizeCanvas() {
      if (!canvas || !context) return;
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(SIZE * pixelRatio);
      canvas.height = Math.round(SIZE * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw();
    }

    function handleMotionChange() {
      if (reducedMotion.matches) ripples = [];
      draw();
      updateAnimation();
    }

    function handleImageLoad() {
      if (disposed) return;
      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = SIZE;
      sampleCanvas.height = SIZE;
      const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
      if (!sampleContext) {
        setHasImageError(true);
        return;
      }
      sampleContext.drawImage(image, 0, 0, SIZE, SIZE);
      cells = createCells(sampleContext.getImageData(0, 0, SIZE, SIZE).data);
      draw();
    }

    function handleImageError() {
      if (!disposed) setHasImageError(true);
    }

    function handleIntersection(entries: IntersectionObserverEntry[]) {
      isVisible = entries[0]?.isIntersecting ?? false;
      updateAnimation();
    }

    function handleThemeChange() {
      draw();
    }

    const visibilityObserver = new IntersectionObserver(handleIntersection);
    visibilityObserver.observe(canvas);
    const themeObserver = new MutationObserver(handleThemeChange);
    themeObserver.observe(document.documentElement, { attributes: true });
    resizeCanvas();
    image.onload = handleImageLoad;
    image.onerror = handleImageError;
    image.src = zeusBustUrl;
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("visibilitychange", updateAnimation);
    reducedMotion.addEventListener("change", handleMotionChange);

    return function cleanupZeus() {
      disposed = true;
      if (frameId !== null) cancelAnimationFrame(frameId);
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

  return (
    <div className="relative w-[400px] max-w-full">
      <canvas
        ref={canvasRef}
        width={SIZE}
        height={SIZE}
        role="button"
        tabIndex={0}
        aria-label="ASCII bust of Zeus. Click to create a ripple that brightens and scrambles characters, or press Enter or Space for a centered ripple."
        className="block h-auto w-full aspect-square cursor-pointer text-white rounded focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        A bust of Zeus with curled hair, a full beard, and draped shoulders, made from characters.
      </canvas>
      {hasImageError ? (
        <p role="status" className="absolute inset-x-0 bottom-1 text-center text-xs text-gray-11">
          The Zeus drawing could not load.
        </p>
      ) : null}
    </div>
  );
}
