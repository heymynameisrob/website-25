import { useEffect, useState } from "react";
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

export function AsciiBanner({ className }: { className?: string }) {
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
      <div className={cn("select-none overflow-hidden mask-b-from-80% mask-b-to-100%", className)}>
        <pre
          className="font-mono text-[8.5px] leading-[1.15] text-accent"
          style={{ filter: "url(#bevel-emboss)" }}
          aria-label="Heymynameisrob"
        >
          {BODY}
        </pre>
        <div className="drip-container font-mono text-[8.5px] leading-[1.15] text-accent overflow-hidden">
          <div className="drip-track" aria-hidden="true">
            <pre>{DRIPS}</pre>
            <pre>{DRIPS}</pre>
          </div>
        </div>

        <style>{`
        .drip-container {
          --drip-lines: ${DRIP_LINES.length};
          line-height: 1.15;
          height: calc(1lh * var(--drip-lines));
        }

        .drip-track {
          display: flex;
          flex-direction: column;
          animation: drip-step 3s steps(8) infinite;
          will-change: transform;
        }

        @keyframes drip-step {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0%);
          }
        }
      `}</style>
      </div>
    </>
  );
}
