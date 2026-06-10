import type { CSSProperties, MouseEvent } from "react";
import * as React from "react";
import useSound from "use-sound";
import dpistolSound from "@/assets/dpistol.wav";
import dsitmbkSound from "@/assets/dsitmbk.wav";
import { cn } from "@/lib/utils";
import type { GibBurst, GibPiece, ShotImpact } from "./ascii-banner/ascii-banner.types";
import {
  GIB_ANIMATION_MS,
  RESET_DAMAGE_RATIO,
  RESET_FADE_MS,
  countDamagedCells,
  countVisibleCells,
  createDamagedBody,
  createGibs,
} from "./ascii-banner/ascii-banner.utils";
import { useReducedMotion } from "framer-motion";
import { useHotkeys } from "react-hotkeys-hook";

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

const VISIBLE_CELL_COUNT = countVisibleCells(BODY_LINES);

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
    boxShadow: "0px 8px 8px rgba(0,0,0,0.8)",
    color: "#ad0000",
  } as CSSProperties;
}

export function AsciiBanner({ className }: { className?: string }) {
  const bodyRef = React.useRef<HTMLPreElement>(null);
  const [impacts, setImpacts] = React.useState<ShotImpact[]>([]);
  const [bursts, setBursts] = React.useState<GibBurst[]>([]);
  const [isResetting, setIsResetting] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [playDpistol] = useSound(dpistolSound);
  const [playDsitmbk] = useSound(dsitmbkSound);

  useHotkeys(
    "r",
    () => {
      setImpacts([]);
      setBursts([]);
      setIsResetting(true);

      const finishReset = window.setTimeout(() => setIsResetting(false), RESET_FADE_MS);

      return () => clearTimeout(finishReset);
    },
    {
      enabled: impacts.length === 0 || bursts.length === 0,
      enableOnContentEditable: false,
      enableOnFormTags: false,
    }
  );

  const body = React.useMemo(
    () => (impacts.length > 0 ? createDamagedBody(BODY_LINES, impacts) : BODY),
    [impacts]
  );
  const damagedRatio = React.useMemo(
    () => countDamagedCells(BODY_LINES, impacts) / VISIBLE_CELL_COUNT,
    [impacts]
  );

  React.useEffect(() => {
    if (bursts.length === 0) {
      return;
    }

    const now = Date.now();
    const nextExpiry = Math.min(...bursts.map(burst => burst.expiresAt));
    const cleanup = window.setTimeout(
      () => setBursts(currentBursts => currentBursts.filter(burst => burst.expiresAt > Date.now())),
      Math.max(0, nextExpiry - now)
    );

    return () => window.clearTimeout(cleanup);
  }, [bursts]);

  React.useEffect(() => {
    if (damagedRatio < RESET_DAMAGE_RATIO || bursts.length > 0) {
      return;
    }

    playDsitmbk();
    setImpacts([]);
    setIsResetting(true);
    const finishReset = window.setTimeout(() => setIsResetting(false), RESET_FADE_MS);

    return () => window.clearTimeout(finishReset);
  }, [bursts.length, damagedRatio, playDsitmbk]);

  const handleExplode = React.useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (prefersReducedMotion || !bodyRef.current) {
        return;
      }

      const rect = bodyRef.current.getBoundingClientRect();
      const charWidth = bodyRef.current.scrollWidth / BODY_LINES[0].length;
      const lineHeight = rect.height / BODY_LINES.length;

      const seed = Date.now();
      const impact = {
        x: (event.clientX - rect.left) / charWidth,
        y: (event.clientY - rect.top) / lineHeight,
      };
      const pieces = createGibs(BODY_LINES, seed, impact.x, impact.y, impacts);
      const maxDelay = pieces.reduce((maxDelay, piece) => Math.max(maxDelay, piece.delay), 0);

      if (pieces.length === 0) {
        return;
      }

      playDpistol();
      setIsResetting(false);
      setImpacts(currentImpacts => [...currentImpacts, impact]);
      setBursts(currentBursts => [
        ...currentBursts,
        {
          id: seed,
          pieces,
          expiresAt: Date.now() + GIB_ANIMATION_MS + maxDelay,
        },
      ]);
    },
    [impacts, playDpistol, prefersReducedMotion]
  );

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
          "relative block select-none overflow-hidden mask-b-from-80% mask-b-to-100% max-h-[100px] text-left -mb-4",
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
          ref={bodyRef}
          className={cn(
            "font-mono text-[6.5px] md:text-[8.5px] leading-[1.15] text-accent transition-opacity duration-400",
            isResetting && "animate-in fade-in duration-400"
          )}
          style={{ filter: "url(#bevel-emboss)" }}
          aria-label="Heymynameisrob"
        >
          {body}
        </pre>
        {bursts.length > 0 && (
          <div
            className="pointer-events-none absolute inset-0 font-mono text-[6.5px] md:text-[8.5px] leading-[1.15] text-accent"
            aria-hidden="true"
          >
            {bursts.flatMap(burst =>
              burst.pieces.map(piece => {
                const pieceStyle = createGibStyle(piece);

                return (
                  <pre
                    key={`${burst.id}-${piece.id}`}
                    className="ascii-gib-piece absolute m-0 whitespace-pre will-change-[opacity,transform]"
                    style={pieceStyle}
                  >
                    {piece.text}
                  </pre>
                );
              })
            )}
          </div>
        )}
        <div
          className={cn(
            "h-[calc(1lh*var(--drip-lines))] overflow-hidden font-mono text-[7px] md:text-[8.5px] leading-[1.15] text-accent transition-opacity duration-300",
            impacts.length > 0 && "opacity-0",
            isResetting && "animate-in fade-in duration-200"
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
