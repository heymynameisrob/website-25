import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

const MARKDOWN_LINES = [
  { id: "heading", widths: [30, 46, 24, 38, 20] },
  { id: "intro", widths: [22, 18, 34, 28, 24, 16] },
  { id: "body", widths: [40, 26, 20, 30, 18] },
  { id: "details", widths: [18, 32, 24, 28, 22, 14] },
  { id: "summary", widths: [36, 24, 18, 20, 28] },
];

export const MarkdownEditorPreview = React.memo(function MarkdownEditorPreview() {
  const reduced = useReducedMotion();
  const [step, setStep] = React.useState(0);

  React.useEffect(() => {
    if (reduced) return;
    const runCycle = () => {
      setStep(0);
      const typeId = window.setInterval(() => {
        setStep(prev => {
          if (prev >= MARKDOWN_LINES.length) {
            window.clearInterval(typeId);
            return MARKDOWN_LINES.length;
          }
          return prev + 1;
        });
      }, 420);
      return () => window.clearInterval(typeId);
    };

    let cleanup = runCycle();
    const cycleId = window.setInterval(() => {
      cleanup();
      cleanup = runCycle();
    }, 4300);

    return () => {
      cleanup();
      window.clearInterval(cycleId);
    };
  }, [reduced]);

  return (
    <div className="w-full max-w-[260px] rounded-xl border border-gray-4 bg-background overflow-hidden">
      <div className="h-9 border-b border-gray-4 bg-gray-1 px-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {["bold", "italic", "h2", "list", "quote"].map(tool => (
            <div
              key={`tool-${tool}`}
              className="h-4 rounded bg-gray-3"
              style={{ width: tool === "h2" || tool === "quote" ? "18px" : "14px" }}
            />
          ))}
        </div>
        <div className="h-4 w-10 rounded bg-gray-3" />
      </div>
      <div className="p-3 space-y-2">
        <div className="h-3 w-24 rounded bg-gray-4" />
        {MARKDOWN_LINES.map((row, rowIndex) => {
          if (step <= rowIndex) return <div key={`md-empty-${row.id}`} className="h-3" />;
          return (
            <div key={`md-${row.id}`} className="flex flex-wrap gap-1.5">
              {row.widths.map(w => (
                <motion.div
                  key={`md-${row.id}-${w}`}
                  className="h-3 rounded bg-accent/20 dark:bg-accent/50"
                  style={{ width: `${w}px` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.14 }}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
});
