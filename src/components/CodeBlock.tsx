import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  DocumentDuplicateIcon,
  CheckIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/16/solid";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/Button";
import { LanguageIcon } from "@/components/LanguageIcon";
import { Tooltip } from "@/components/Tooltip";
import { cn } from "@/lib/utils";

const MAX_COLLAPSED_HEIGHT = 300;

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
  fileName?: string;
  // Surfaces from the shiki transformer in astro.config.mjs (e.g. `title="Foo.tsx"`)
  // and from Astro's built-in shiki transformer.
  "data-file-name"?: string;
  "data-language"?: string;
}

export function CodeBlock({
  children,
  className,
  fileName,
  "data-file-name": dataFileName,
  "data-language": dataLanguage,
}: CodeBlockProps) {
  const [showMore, setShowMore] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Prefer an explicit fileName prop, then the data-file-name attr that the
  // shiki `title="..."` transformer writes, then fall back to language only.
  const resolvedFileName = fileName ?? dataFileName;

  // Extract language from className (e.g., "language-tsx" -> "tsx"), or fall
  // back to the data-language attr that Astro's shiki transformer sets.
  const language = className?.match(/language-(\w+)/)?.[1] ?? dataLanguage;

  const isCollapsible = contentHeight > MAX_COLLAPSED_HEIGHT;

  // Measure content height
  useEffect(() => {
    if (contentRef.current) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
      if (height > 0 && !hasMeasured) {
        setHasMeasured(true);
      }
    }
  }, [children, hasMeasured]);

  // Copy to clipboard function
  const copyToClipboard = async () => {
    if (contentRef.current) {
      const codeText = contentRef.current.innerText;
      try {
        await navigator.clipboard.writeText(codeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <div className="not-prose group/codeblock flex flex-col relative rounded-lg overflow-hidden border-[0.5px] shadow-xs focus-within">
      <div className="flex items-center gap-2 justify-between h-10 bg-gray-2 border-b border-[0.5px] p-2">
        <div className="flex items-center gap-2">
          {language && <LanguageIcon language={language} />}
          <span className="text-sm font-mono font-medium text-secondary">{resolvedFileName}</span>
        </div>
        <Tooltip content={copied ? "Copied!" : "Copy code"}>
          <Button
            size="icon"
            variant="ghost"
            aria-label={copied ? "Copied code" : "Copy code"}
            className="absolute top-2 right-2 opacity-0 group-hover/codeblock:opacity-100 transition-opacity size-6"
            onClick={copyToClipboard}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={copied ? "check" : "copy"}
                initial={{ opacity: 0, scale: 0.8, filter: "blur(2px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.8, filter: "blur(2px)" }}
                transition={{
                  type: "spring",
                  duration: 0.3,
                  bounce: 0,
                }}
              >
                {copied ? (
                  <CheckIcon className="size-3.5" />
                ) : (
                  <DocumentDuplicateIcon className="size-3.5" />
                )}
              </motion.div>
            </AnimatePresence>
          </Button>
        </Tooltip>
      </div>

      <motion.div
        style={{
          height: !hasMeasured
            ? "auto"
            : isCollapsible && !showMore
              ? MAX_COLLAPSED_HEIGHT
              : contentHeight,
        }}
        animate={{
          height: isCollapsible && !showMore ? MAX_COLLAPSED_HEIGHT : contentHeight,
        }}
        transition={hasMeasured ? { duration: 0.3, ease: [0.4, 0, 0.2, 1] } : { duration: 0 }}
        className="overflow-hidden bg-gray-1"
      >
        <div ref={contentRef}>
          <pre className={cn("astro-code mt-0 mb-0 p-3 overflow-x-scroll", className)}>
            {children}
          </pre>
        </div>
      </motion.div>

      {isCollapsible && (
        <>
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-gray-1 to-transparent pointer-events-none duration-300",
              showMore ? "opacity-0" : "opacity-100"
            )}
          />
          <div className="absolute bottom-0 inset-x-0 grid place-items-center p-2 opacity-0 group-hover/codeblock:opacity-100 group-focus-within/codeblock:opacity-100">
            <Button
              size="icon"
              aria-label={showMore ? "Collapse code" : "Expand code"}
              className="size-6 bg-gray-12 hover:bg-gray-12/80 rounded-full"
              onClick={() => setShowMore(prev => !prev)}
            >
              {showMore ? (
                <ArrowUpIcon className="size-3.5 text-gray-1" />
              ) : (
                <ArrowDownIcon className="size-3.5 text-gray-1" />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
