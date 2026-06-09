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
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  if (!isDark) return null;

  return (
    <div className={cn("select-none overflow-hidden mask-b-from-80% mask-b-to-100%", className)}>
      <pre
        className="font-mono text-[8.5px] leading-[1.15] text-accent"
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
  );
}
