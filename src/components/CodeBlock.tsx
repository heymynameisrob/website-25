import { useState, useEffect, useRef, type ReactNode } from "react";
import { DocumentDuplicateIcon, CheckIcon } from "@heroicons/react/16/solid";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/primitives/Button";
import { Tooltip } from "@/components/primitives/Tooltip";
import { cn } from "@/lib/utils";

const MAX_COLLAPSED_HEIGHT = 300;

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [showMore, setShowMore] = useState(false);
  const [hasMeasured, setHasMeasured] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Extract language from className (e.g., "language-tsx" -> "tsx")
  const language = className?.match(/language-(\w+)/)?.[1];

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
    <div className="not-prose group/codeblock block relative rounded-lg overflow-hidden">
      {language && (
        <div className="absolute top-0 right-0 px-2 py-0 h-7 text-sm text-secondary pointer-events-none">
          {language}
        </div>
      )}

      <motion.div
        style={{
          height: !hasMeasured
            ? "auto"
            : isCollapsible && !showMore
              ? MAX_COLLAPSED_HEIGHT
              : contentHeight,
        }}
        animate={{
          height:
            isCollapsible && !showMore ? MAX_COLLAPSED_HEIGHT : contentHeight,
        }}
        transition={
          hasMeasured
            ? { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
            : { duration: 0 }
        }
        className="overflow-hidden"
      >
        <div ref={contentRef}>
          <pre
            className={cn(
              "astro-code bg-gray-2 mt-0 mb-0 p-3 overflow-x-scroll",
              className,
            )}
          >
            {children}
          </pre>
        </div>
      </motion.div>

      {isCollapsible && (
        <>
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-gray-1 to-transparent pointer-events-none duration-300",
              showMore ? "opacity-0" : "opacity-100",
            )}
          />
          <div className="absolute bottom-0 inset-x-0 grid place-items-center p-2 opacity-0 group-hover/codeblock:opacity-100">
            <Button
              size="sm"
              className="w-fit"
              onClick={() => setShowMore((prev) => !prev)}
            >
              {showMore ? "Show less" : "Show more"}
            </Button>
          </div>
        </>
      )}

      <Tooltip content={copied ? "Copied!" : "Copy code"}>
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 opacity-0 group-hover/codeblock:opacity-100 transition-opacity shadow-popover size-6"
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
  );
}
