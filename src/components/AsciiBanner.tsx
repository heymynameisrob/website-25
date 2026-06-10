import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const ASCII_LINES = [
  " ██░ ██ ▓█████▓██   ██▓ ███▄ ▄███▓▓██   ██▓ ███▄    █  ▄▄▄       ███▄ ▄███▓▓█████  ██▓  ██████  ██▀███   ▒█████   ▄▄▄▄   ",
  "▓██░ ██▒▓█   ▀ ▒██  ██▒▓██▒▀█▀ ██▒ ▒██  ██▒ ██ ▀█   █ ▒████▄    ▓██▒▀█▀ ██▒▓█   ▀ ▓██▒▒██    ▒ ▓██ ▒ ██▒▒██▒  ██▒▓█████▄ ",
  "▒██▀▀██░▒███    ▒██ ██░▓██    ▓██░  ▒██ ██░▓██  ▀█ ██▒▒██  ▀█▄  ▓██    ▓██░▒███   ▒██▒░ ▓██▄   ▓██ ░▄█ ▒▒██░  ██▒▒██▒ ▄██",
  "░▓█ ░██ ▒▓█  ▄  ░ ▐██▓░▒██    ▒██   ░ ▐██▓░▓██▒  ▐▌██▒░██▄▄▄▄██ ▒██    ▒██ ▒▓█  ▄ ░██░  ▒   ██▒▒██▀▀█▄  ▒██   ██░▒██░█▀  ",
  "░▓█▒░██▓░▒████▒ ░ ██▒▓░▒██▒   ░██▒  ░ ██▒▓░▒██░   ▓██░ ▓█   ▓██▒▒██▒   ░██▒░▒████▒░██░▒██████▒▒░██▓ ▒██▒░ ████▓▒░░▓█  ▀█▓",
  " ▒ ░░▒░▒░░ ▒░ ░  ██▒▒▒ ░ ▒░   ░  ░   ██▒▒▒ ░ ▒░   ▒ ▒  ▒▒   ▓▒█░░ ▒░   ░  ░░░ ▒░ ░░▓  ▒ ▒▓▒ ▒ ░░ ▒▓ ░▒▓░░ ▒░▒░▒░ ░▒▓███▀▒",
  " ▒ ░▒░ ░ ░ ░  ░▓██ ░▒░ ░  ░      ░ ▓██ ░▒░ ░ ░░   ░ ▒░  ▒   ▒▒ ░░  ░      ░ ░ ░  ░ ▒ ░░ ░▒  ░ ░  ░▒ ░ ▒░  ░ ▒ ▒░ ▒░▒   ░ ",
  " ░  ░░ ░   ░   ▒ ▒ ░░  ░      ░    ▒ ▒ ░░     ░   ░ ░   ░   ▒   ░      ░      ░    ▒ ░░  ░  ░    ░░   ░ ░ ░ ░ ▒   ░    ░ ",
  " ░  ░  ░   ░  ░░ ░            ░    ░ ░              ░       ░  ░       ░      ░  ░ ░        ░     ░         ░ ░   ░      ",
  "               ░ ░                 ░ ░                                                                                 ░",
];

const EXTENDED_DRIP =
  "                                                                  ░                                              ";

const BODY_LINES = ASCII_LINES.slice(0, 7);
const DRIP_LINES = [...ASCII_LINES.slice(7), EXTENDED_DRIP];

const BODY = BODY_LINES.join("\n");
const DRIPS = DRIP_LINES.join("\n");

const GIB_CHUNKS = 44;

type GibPiece = {
  id: number;
  text: string;
  left: number;
  top: number;
  dx: number;
  apexX: number;
  apexY: number;
  fallY: number;
  apexRotate: number;
  rotate: number;
  delay: number;
};

function seededRandom(seed: number) {
  let value = seed % 2147483647;

  if (value <= 0) {
    value += 2147483646;
  }

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function createGibStyle(piece: GibPiece): CSSProperties {
  return {
    "--left": piece.left,
    "--top": piece.top,
    "--dx": `${piece.dx}px`,
    "--apex-x": `${piece.apexX}px`,
    "--apex-y": `${piece.apexY}px`,
    "--fall-y": `${piece.fallY}px`,
    "--apex-rotate": `${piece.apexRotate}deg`,
    "--rotate": `${piece.rotate}deg`,
    "--delay": `${piece.delay}ms`,
    filter: "url(#bevel-emboss)",
  } as CSSProperties;
}

function createGibs(seed: number): GibPiece[] {
  const random = seededRandom(seed);
  const cells = BODY_LINES.flatMap((line, y) =>
    [...line].flatMap((char, x) => (char.trim() ? [{ char, x, y }] : []))
  );
  const seeds = Array.from({ length: GIB_CHUNKS }, () => cells[Math.floor(random() * cells.length)]);
  const chunks = seeds.map(() => [] as typeof cells);

  for (const cell of cells) {
    let chunkIndex = 0;
    let chunkDistance = Infinity;

    seeds.forEach((chunkSeed, index) => {
      const distance = (cell.x - chunkSeed.x) ** 2 + (cell.y - chunkSeed.y) ** 2;

      if (distance < chunkDistance) {
        chunkDistance = distance;
        chunkIndex = index;
      }
    });

    chunks[chunkIndex].push(cell);
  }

  return chunks
    .filter((chunk) => chunk.length > 0)
    .map((chunk, id) => {
      const minX = Math.min(...chunk.map(({ x }) => x));
      const maxX = Math.max(...chunk.map(({ x }) => x));
      const minY = Math.min(...chunk.map(({ y }) => y));
      const maxY = Math.max(...chunk.map(({ y }) => y));
      const width = maxX - minX + 1;
      const height = maxY - minY + 1;
      const rows = Array.from({ length: height }, () => Array.from({ length: width }, () => " "));

      for (const { char, x, y } of chunk) {
        rows[y - minY][x - minX] = char;
      }

      const centerX = minX + width / 2;
      const centerY = minY + height / 2;
      const angle = Math.atan2(centerY - BODY_LINES.length / 2, centerX - BODY_LINES[0].length / 2);
      const force = 34 + random() * 76;
      const dx = Math.cos(angle) * force + (random() - 0.5) * 55;
      const launchY = Math.sin(angle) * 18 - 30 - random() * 48;
      const rotate = (random() - 0.5) * 520;

      return {
        id,
        text: rows.map((row) => row.join("").trimEnd()).join("\n"),
        left: minX,
        top: minY,
        dx,
        apexX: dx * (0.35 + random() * 0.18),
        apexY: launchY,
        fallY: 112 + random() * 58,
        apexRotate: rotate * 0.4,
        rotate,
        delay: random() * 80,
      };
    });
}

export function AsciiBanner({ className }: { className?: string }) {
  const [gibSeed, setGibSeed] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const gibs = useMemo(() => (gibSeed ? createGibs(gibSeed) : []), [gibSeed]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!gibSeed) {
      return;
    }

    const reset = window.setTimeout(() => {
      setGibSeed(0);
      setIsResetting(true);
    }, 1050);
    const finishReset = window.setTimeout(() => setIsResetting(false), 1450);

    return () => {
      window.clearTimeout(reset);
      window.clearTimeout(finishReset);
    };
  }, [gibSeed]);

  const handleExplode = useCallback(() => {
    if (prefersReducedMotion) {
      return;
    }

    setIsResetting(false);
    setGibSeed(Date.now());
  }, [prefersReducedMotion]);

  return (
    <>
      <svg className="absolute size-0" aria-hidden="true">
        <defs>
          <filter
            id="bevel-emboss"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.3" result="blur" />
            <feSpecularLighting
              in="blur"
              surfaceScale="0"
              specularConstant="0.85"
              specularExponent="7"
              lighting-color="#ad0000"
              result="specular"
            >
              <feDistantLight azimuth="184" elevation="62" />
            </feSpecularLighting>
            <feComposite in="specular" in2="SourceAlpha" operator="in" result="specular-masked" />
            <feDiffuseLighting
              in="blur"
              surfaceScale="11.5"
              diffuseConstant="1"
              lighting-color="#ff0000"
              result="diffuse"
            >
              <feDistantLight azimuth="184" elevation="62" />
            </feDiffuseLighting>
            <feComposite in="diffuse" in2="SourceAlpha" operator="in" result="diffuse-masked" />

            {/* Stroke: dilate alpha, isolate border edge, fill with dark red */}
            <feMorphology in="SourceAlpha" operator="dilate" radius="0.5" result="dilated" />
            <feComposite in="dilated" in2="SourceAlpha" operator="out" result="stroke-border" />
            <feFlood flood-color="#6b0000" result="stroke-color" />
            <feComposite in="stroke-color" in2="stroke-border" operator="in" result="stroke" />

            <feMerge>
              <feMergeNode in="stroke" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="diffuse-masked" />
              <feMergeNode in="specular-masked" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div
        className={cn(
          "relative block select-none overflow-hidden mask-b-from-80% mask-b-to-100% max-h-[100px] text-left",
          className
        )}
      >
        <button
          type="button"
          className="absolute inset-0 z-10 cursor-crosshair appearance-none border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          onClick={handleExplode}
          aria-label="Explode the Heymynameisrob banner"
        />
        <pre
          className={cn(
            "font-mono text-[8.5px] leading-[1.15] text-accent transition-opacity duration-400",
            gibSeed && "opacity-0",
            isResetting && "animate-in fade-in duration-400"
          )}
          style={{ filter: "url(#bevel-emboss)" }}
          aria-label="Heymynameisrob"
          aria-hidden={gibSeed ? "true" : undefined}
        >
          {BODY}
        </pre>
        {gibs.length > 0 && (
          <div className="pointer-events-none absolute inset-0 font-mono text-[8.5px] leading-[1.15] text-accent" aria-hidden="true">
            {gibs.map((piece) => {
              const pieceStyle = createGibStyle(piece);

              return (
                <pre
                  key={`${gibSeed}-${piece.id}`}
                  className="ascii-gib-piece absolute m-0 whitespace-pre will-change-[opacity,transform]"
                  style={pieceStyle}
                >
                  {piece.text}
                </pre>
              );
            })}
          </div>
        )}
        <div
          className={cn(
            "h-[calc(1lh*var(--drip-lines))] overflow-hidden font-mono text-[8.5px] leading-[1.15] text-accent transition-opacity duration-300",
            gibSeed && "opacity-0",
            isResetting && "animate-in fade-in duration-400"
          )}
          style={{ "--drip-lines": DRIP_LINES.length } as CSSProperties}
        >
          <div
            className="flex animate-[drip-step_3s_steps(8)_infinite] flex-col will-change-transform"
            aria-hidden="true"
          >
            <pre>{DRIPS}</pre>
            <pre>{DRIPS}</pre>
          </div>
        </div>

      </div>
    </>
  );
}
