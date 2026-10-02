import { useEffect, useRef } from "react";

const SIZE = 400;
const CELL_WIDTH = 8;
const CELL_HEIGHT = 10;
const RADIUS = 170;
const BASE_OPACITY = 0.5;
const WAVE_SPEED = 0.32;
const PULSE_DURATION = 420;
const MAX_RIPPLES = 8;
const SURFACE_CHARACTERS = [
  ["i", "l", "j", "t", "f", "r", "·"],
  ["c", "s", "v", "x", "z", "u", "░"],
  ["a", "e", "o", "n", "h", "k", "▒"],
  ["A", "E", "H", "K", "N", "R", "▓"],
  ["M", "W", "B", "D", "O", "Q", "█"],
];

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

/** Create a letter-filled smiley face with empty cells for its features. */
function createCells(): Cell[] {
  const cells: Cell[] = [];

  for (let row = 0; row < SIZE / CELL_HEIGHT; row++) {
    for (let column = 0; column < SIZE / CELL_WIDTH; column++) {
      const x = (column + 0.5) * CELL_WIDTH;
      const y = (row + 0.5) * CELL_HEIGHT;
      const faceX = x - SIZE / 2;
      const faceY = y - SIZE / 2;
      const distance = Math.hypot(faceX, faceY);
      const isEye = ((Math.abs(faceX) - 58) / 18) ** 2 + ((faceY + 48) / 26) ** 2 <= 1;
      const isSmile = faceY > 35 && Math.abs(Math.hypot(faceX, faceY - 5) - 90) < 10;
      let character = "";

      if (distance <= RADIUS && !isEye && !isSmile) {
        const normalX = faceX / RADIUS;
        const normalY = faceY / RADIUS;
        const normalZ = Math.sqrt(Math.max(0, 1 - normalX ** 2 - normalY ** 2));
        const light = Math.max(0, Math.min(1, -0.4 * normalX - 0.4 * normalY + 0.82 * normalZ));
        const shade = Math.min(
          SURFACE_CHARACTERS.length - 1,
          Math.floor(light * SURFACE_CHARACTERS.length)
        );
        const palette = SURFACE_CHARACTERS[shade];
        const texture = (column * 17 + row * 31 + column * row) % palette.length;
        character = palette[texture];
      }

      cells.push({ x, y, character, opacity: BASE_OPACITY });
    }
  }

  return cells;
}

/** Draw a smiley face with per-character opacity waves from each click. */
export function AsciiSmiley() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(function setupCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const cells = createCells();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ripples: Ripple[] = [];
    let frameId: number | null = null;

    /** Paint each occupied cell using its own opacity. */
    function draw() {
      if (!canvas || !context) return;

      context.clearRect(0, 0, SIZE, SIZE);
      context.fillStyle = getComputedStyle(canvas).color;
      context.font = '10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
      context.textAlign = "center";
      context.textBaseline = "middle";

      for (const cell of cells) {
        if (!cell.character) continue;
        context.globalAlpha = cell.opacity;
        context.fillText(cell.character, cell.x, cell.y);
      }

      context.globalAlpha = 1;
    }

    /** Keep the drawing sharp on screens with a high pixel density. */
    function resizeCanvas() {
      if (!canvas || !context) return;

      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(SIZE * pixelRatio);
      canvas.height = Math.round(SIZE * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      draw();
    }

    /** Raise and lower opacity only when the wave reaches each cell. */
    function animate(now: number) {
      frameId = null;
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

      draw();
      if (ripples.length > 0) frameId = requestAnimationFrame(animate);
    }

    /** Cache distance delays once per click and allow overlapping waves. */
    function addRipple(x: number, y: number) {
      if (reducedMotion.matches) return;

      let maxDelay = 0;
      const delays = cells.map(function getDelay(cell) {
        const delay = Math.hypot(cell.x - x, cell.y - y) / WAVE_SPEED;
        maxDelay = Math.max(maxDelay, delay);
        return delay;
      });

      ripples.push({ startedAt: performance.now(), delays, duration: maxDelay + PULSE_DURATION });
      if (ripples.length > MAX_RIPPLES) ripples.shift();
      if (frameId === null) frameId = requestAnimationFrame(animate);
    }

    /** Map clicks to canvas coordinates even when the canvas is scaled. */
    function handleClick(event: MouseEvent) {
      if (!canvas) return;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      addRipple(
        ((event.clientX - bounds.left) / bounds.width) * SIZE,
        ((event.clientY - bounds.top) / bounds.height) * SIZE
      );
    }

    /** Let keyboard users start a wave at the center of the face. */
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      if (!event.repeat) addRipple(SIZE / 2, SIZE / 2);
    }

    /** Stop active waves when reduced motion is enabled. */
    function handleMotionChange() {
      if (!reducedMotion.matches) return;
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
      ripples = [];
      for (const cell of cells) cell.opacity = BASE_OPACITY;
      draw();
    }

    const themeObserver = new MutationObserver(draw);
    themeObserver.observe(document.documentElement, { attributes: true });
    resizeCanvas();
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", resizeCanvas);
    reducedMotion.addEventListener("change", handleMotionChange);

    return function cleanupCanvas() {
      if (frameId !== null) cancelAnimationFrame(frameId);
      themeObserver.disconnect();
      canvas.removeEventListener("click", handleClick);
      canvas.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", resizeCanvas);
      reducedMotion.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={SIZE}
      height={SIZE}
      role="button"
      tabIndex={0}
      aria-label="ASCII smiley face. Click to create a ripple, or press Enter or Space for a centered ripple."
      className="block h-auto w-[400px] max-w-full aspect-square cursor-pointer text-gray-12 rounded focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      An ASCII smiley face with a click-controlled opacity ripple.
    </canvas>
  );
}
