import { cn } from "@/lib/utils";
import * as React from "react";

type KeyConfig = {
  label: string | [string, string];
  size?: "square" | "wide" | "wider" | "widest" | "space";
  className?: string;
};

const KEYBOARD_ROWS: KeyConfig[][] = [
  [
    {
      label: "esc",
      size: "widest",
      className: "to-[#f54e00] from-[#fc5c11] text-[10px]",
    },
    { label: ["F1", "☀︎"], className: "[&>span:last-child]:text-[9px]" },
    { label: ["F2", "☀"], className: "[&>span:last-child]:text-[9px]" },
    { label: ["F3", "⌐"], className: "[&>span:last-child]:text-[9px]" },
    { label: ["F4", "⌕"], className: "[&>span:last-child]:text-[9px]" },
    { label: ["F5", "🎤"], className: "[&>span:last-child]:text-[9px]" },
    { label: ["F6", "⏾"], className: "[&>span:last-child]:text-[9px]" },
    { label: ["F7", "⏮"], className: "[&>span:last-child]:text-[9px]" },
    { label: ["F8", "⏯"], className: "[&>span:last-child]:text-[9px]" },
    { label: ["F9", "⏭"], className: "[&>span:last-child]:text-[9px]" },
    { label: ["F10", "🔇"], className: "[&>span:last-child]:text-[9px]" },
    { label: ["F11", "🔉"], className: "[&>span:last-child]:text-[9px]" },
    { label: ["F12", "🔊"], className: "[&>span:last-child]:text-[9px]" },
    { label: "del" },
    { label: "◐", className: "w-14" },
  ],
  [
    { label: ["±", "§"] },
    { label: ["1", "!"] },
    { label: ["2", "@"] },
    { label: ["3", "#"] },
    { label: ["4", "$"] },
    { label: ["5", "%"] },
    { label: ["6", "^"] },
    { label: ["7", "&"] },
    { label: ["8", "*"] },
    { label: ["9", "("] },
    { label: ["0", ")"] },
    { label: ["-", "_"] },
    { label: ["=", "+"] },
    { label: "⌫", size: "widest", className: "items-end w-22" },
    { label: "pg up", className: "text-[10px]" },
  ],
  [
    { label: "⇥", size: "wider", className: "items-start justify-end" },
    { label: "Q" },
    { label: "W" },
    { label: "E" },
    { label: "R" },
    { label: "T" },
    { label: "Y" },
    { label: "U" },
    { label: "I" },
    { label: "O" },
    { label: "P" },
    { label: ["[", "{"] },
    { label: ["]", "}"] },
    { label: ["\\", "|"], size: "wider", className: "items-end" },
    { label: "pg down", className: "text-[10px]" },
  ],
  [
    { label: "⇪", size: "widest", className: "items-start justify-end" },
    { label: "A" },
    { label: "S" },
    { label: "D" },
    { label: "F" },
    { label: "G" },
    { label: "H" },
    { label: "J" },
    { label: "K" },
    { label: "L" },
    { label: [";", ":"] },
    { label: ["'", '"'] },
    { label: "⏎", size: "widest", className: "items-end w-[104px]" },
    { label: "home", className: "text-[10px]" },
  ],
  [
    { label: "⇧", size: "wide", className: "items-start justify-end" },
    { label: ["`", "~"] },
    { label: "Z" },
    { label: "X" },
    { label: "C" },
    { label: "V" },
    { label: "B" },
    { label: "N" },
    { label: "M" },
    { label: [",", "<"] },
    { label: [".", ">"] },
    { label: ["/", "?"] },
    { label: "⇧", size: "widest", className: "items-end" },
    { label: "↑" },
    { label: "end", className: "text-[10px]" },
  ],
  [
    { label: "fn", size: "square", className: "text-[10px]" },
    { label: "⌃" },
    { label: "⌥" },
    { label: "⌘", size: "wide" },
    { label: "", size: "space" },
    { label: "⌘", size: "wide" },
    { label: "⌥" },
    { label: "←" },
    { label: "↓" },
    { label: "→" },
  ],
];

export function Keyboard() {
  return (
    <div className="flex flex-col gap-1.5 p-1.5 rounded-2xl bg-gray-3 shadow-container relative ml-40 drop-shadow-2xl group-first/fullscreen:ml-0">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-1.5">
          {row.map((key) => {
            const keyLabel = Array.isArray(key.label)
              ? key.label.join("")
              : key.label;
            return (
              <Key
                key={keyLabel}
                size={key.size ?? "square"}
                className={key.className}
              >
                {Array.isArray(key.label) ? (
                  <>
                    <span>{key.label[1]}</span>
                    <span>{key.label[0]}</span>
                  </>
                ) : (
                  key.label
                )}
              </Key>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Key({
  children,
  size,
  className,
}: {
  children: React.ReactNode;
  size: KeyConfig["size"];
  className?: string;
}) {
  return (
    <button
      className={cn(
        "shrink-0 p-1 flex flex-col size-10 items-center justify-center rounded-lg shadow-key font-sans font-medium text-white text-[13px] leading-[1.4em] cursor-default",
        "bg-linear-to-b from-gray-12 to-gray-950 dark:to-gray-1 dark:from-gray-2",
        "hover:to-gray-12 active:from-gray-950 active:to-gray-12 dark:hover:to-gray-2 dark:active:from-gray-1 dark:active:to-gray-2",
        "outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-ring focus-visible:ring-offset-gray-3",
        "[&>span:first-child]:text-[11px] [&>span:first-child]:opacity-80",
        size === "wide" && "w-14 text-xs items-start justify-end",
        size === "wider" && "w-16 text-xs items-start justify-end",
        size === "widest" && "w-18 text-xs items-start justify-end",
        size === "space" && "w-72",
        className,
      )}
    >
      {children}
    </button>
  );
}
