import { Code as CodeIcon, type LucideProps } from "lucide-react";
import type { ComponentType, FC, SVGProps } from "react";

import { cn } from "@/lib/utils";

type CustomSvgProps = SVGProps<SVGSVGElement>;

interface LanguageIconProps extends Omit<LucideProps, "ref"> {
  language?: string;
  className?: string;
}

const TsxIcon: FC<CustomSvgProps> = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-11.5 -10.23174 23 20.46348"
    className={className}
    {...props}
  >
    <title>React Logo</title>
    <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
    <g stroke="#61dafb" strokeWidth="1" fill="none">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const TsIcon: FC<CustomSvgProps> = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <rect fill="#3178c6" width="24" height="24" rx="3" />
    <path
      clipRule="evenodd"
      d="M14.8 19.1v2.3c.4.2.8.3 1.4.4.6.1 1.1.2 1.6.2.6 0 1.1-.1 1.6-.2.5-.1.9-.3 1.3-.5.4-.2.7-.6.9-1 .2-.4.3-.9.3-1.5 0-.4-.1-.8-.2-1.1-.1-.3-.3-.6-.6-.9-.2-.3-.5-.5-.9-.7-.3-.2-.7-.4-1.1-.6-.3-.1-.6-.3-.8-.4-.2-.1-.5-.3-.6-.4-.2-.1-.3-.3-.4-.4-.1-.1-.1-.3-.1-.5s0-.3.1-.4c.1-.1.2-.2.4-.3.2-.1.3-.2.6-.2.2 0 .5-.1.7-.1.2 0 .4 0 .6.1.2 0 .4.1.7.1.2.1.4.1.6.2.2.1.4.2.6.3v-2.2c-.4-.1-.7-.2-1.2-.3-.4-.1-.9-.1-1.5-.1-.6 0-1.1.1-1.6.2s-.9.3-1.3.6c-.4.3-.7.6-.9 1-.2.4-.3.9-.3 1.4 0 .7.2 1.3.6 1.8.4.5 1 .9 1.8 1.3.3.1.6.3.9.4.3.1.5.3.7.4.2.1.4.3.5.4.1.2.2.4.2.6 0 .2 0 .3-.1.4-.1.1-.2.2-.3.3-.1.1-.3.2-.6.2-.2.1-.5.1-.8.1-.5 0-1-.1-1.5-.3-.5-.2-.9-.4-1.4-.8Zm-3.9-5.8h3v-1.9h-8.3v1.9h3v8.6h2.4v-8.6Z"
      fill="#fff"
      fillRule="evenodd"
    />
  </svg>
);

const CssIcon: FC<CustomSvgProps> = ({ className, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    {...props}
  >
    <path
      fill="#264de4"
      d="M3.3 21.6 1.4 0h21.2l-1.9 21.6L12 24Z"
    />
    <path fill="#2965f1" d="M19 20.2 20.7 0H12v20.4Z" />
    <path
      fill="#ebebeb"
      d="M5.8 9.8 6 12.5h6V9.8ZM5.5 7.1H12V4.4H5.4Zm6.5 9.6V19l-3-.8-.2-2.1H6l.4 4.2 5.4 1.5.1-2.8Z"
    />
    <path
      fill="#fff"
      d="M12 9.8v2.7h3.2l-.3 3.4-2.9.8v2.8l5.4-1.5.6-7 .1-.7.5-5.3H12v2.7h3.7l-.2 2.5Z"
    />
  </svg>
);

const languageIcons: Record<string, ComponentType<CustomSvgProps>> = {
  tsx: TsxIcon,
  ts: TsIcon,
  typescript: TsIcon,
  css: CssIcon,
};

export function LanguageIcon({ language, className, ...props }: LanguageIconProps) {
  const Icon: ComponentType<CustomSvgProps | LucideProps> = language
    ? (languageIcons[language.toLowerCase()] ?? CodeIcon)
    : CodeIcon;
  return <Icon className={cn("size-5", className)} aria-hidden="true" {...props} />;
}
