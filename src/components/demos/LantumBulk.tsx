import { useEffect, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useMeasure } from "@uidotdev/usehooks";
import { Button } from "@/components/primitives/Button";

const SESSIONS = [
  {
    id: 22,
    name: "FY Short",
    location: "Ward A",
  },
  {
    id: 16,
    name: "FY Long",
    location: "Ward A",
  },
  {
    id: 19,
    name: "FY Short",
    location: "Ward B",
  },
  {
    id: 10,
    name: "FY Long",
    location: "Ward B",
  },
];

export const LantumBulk = () => {
  const [sessions, setSessions] = useState<Array<any>>(SESSIONS);
  const [selected, setSelected] = useState<Array<number>>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [toolbarIsToast, setToolbarIsToast] = useState(false);

  useHotkeys(
    "esc",
    () => {
      setSelected([]);
      setIsSelecting(false);
    },
    {
      enabled: isSelecting,
      preventDefault: true,
    },
  );

  useHotkeys(
    "Mod+Z",
    () => {
      onUndo();
    },
    {
      enabled: isSelecting && toolbarIsToast,
      preventDefault: true,
    },
  );

  const handleSelect = (event: any, id: number) => {
    if (event.shiftKey && !isSelecting) {
      setIsSelecting(true);
      setSelected([id]);
    }

    if (!event.shiftKey && !isSelecting) return true;

    const isSelected = selected.includes(id);

    if (isSelected) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const onRemove = () => {
    setToolbarIsToast(true);
    const filtered = sessions.filter((item) => !selected.includes(item.id));
    setSessions(filtered);
    setSelected([]);
  };

  const onUndo = () => {
    setSessions(SESSIONS);
    setSelected([]);
    setIsSelecting(false);
  };

  const onClose = () => {
    setSelected([]);
    setIsSelecting(false);
  };

  useEffect(() => {
    if (toolbarIsToast) {
      setTimeout(() => {
        setToolbarIsToast(false);
        setIsSelecting(false);
      }, 4000);
    }
  }, [toolbarIsToast]);

  return (
    <div className="relative rounded-md overflow-clip w-full max-w-3xl [box-shadow:var(--shadow-raised)]">
      <div className="grid justify-end grid-cols-7 gap-0">
        {[...Array(28)].map((_, id) => {
          return (
            <div
              key={id}
              className={cn(
                "h-[90px] border-l border-b border-r-0 bg-background p-2",
                id % 7 === 0 && "!border-l-0",
                id >= 21 && "!border-b-0",
              )}
            >
              {sessions.some((i) => i.id === id) ? (
                <Session
                  onClick={(e: any) => handleSelect(e, id)}
                  selected={selected.includes(id)}
                >
                  <small className="!text-xs font-medium">
                    {sessions.find((i) => i.id === id).name}
                  </small>
                  <span className="text-xs opacity-80">
                    {sessions.find((i) => i.id === id).location}
                  </span>
                </Session>
              ) : null}
            </div>
          );
        })}
      </div>
      <Toolbar
        isToast={toolbarIsToast}
        onClose={onClose}
        onUndo={onUndo}
        onRemove={onRemove}
        selected={selected}
        isSelecting={isSelecting}
      />
    </div>
  );
};

const Session = ({ onClick, selected, children }: any) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col p-1 rounded bg-teal-400 text-teal-950 h-10 w-full text-sm outline-none",
        selected && "ring-2 ring-offset-2 ring-offset-background ring-cyan-500",
      )}
    >
      {children}
    </button>
  );
};

const Toolbar = ({ isSelecting, isToast, onRemove, onUndo, onClose }: any) => {
  const [ref, bounds] = useMeasure();

  return (
    <AnimatePresence>
      {isSelecting ? (
        <motion.div
          key="toolbar"
          initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
          animate={{
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
          }}
          exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.2, bounce: 0, type: "spring" }}
          className="dark absolute left-0 right-0 bottom-4 grid place-items-center"
        >
          <div
            className={cn(
              "bg-gray-1 rounded-xl border shadow-xl max-w-[420px]",
            )}
          >
            <motion.div
              animate={{
                width: isToast ? 240 : 420,
                height: bounds.height as number,
              }}
            >
              <div
                ref={ref}
                className="p-1 flex justify-between items-stretch gap-px w-full"
              >
                {isToast ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                    }}
                    className="flex items-center justify-between gap-2 w-full p-1"
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="size-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <small className="shrink-0 font-medium text-primary">
                        Sessions removed
                      </small>
                    </div>
                    <Button
                      onClick={onUndo}
                      size="sm"
                      className="h-6 !text-xs rounded bg-black/5 dark:bg-white/10"
                      variant="secondary"
                    >
                      Undo
                    </Button>
                  </motion.div>
                ) : (
                  <ToolbarMenu onClose={onClose} onRemove={onRemove} />
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

const ToolbarMenu = ({ onRemove, onClose }: any) => {
  return (
    <>
      <button
        title="Cancel"
        aria-label="Cancel"
        data-microtip-position="top"
        role="tooltip"
        onClick={onClose}
        className="flex p-2 h-9 items-center gap-1 rounded-lg bg-transparent pb-1 pt-[6px] text-xs font-medium text-primary hover:bg-ui-mid"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-4"
        >
          <path d="M5.28 4.22a.75.75 0 0 0-1.06 1.06L6.94 8l-2.72 2.72a.75.75 0 1 0 1.06 1.06L8 9.06l2.72 2.72a.75.75 0 1 0 1.06-1.06L9.06 8l2.72-2.72a.75.75 0 0 0-1.06-1.06L8 6.94 5.28 4.22Z" />
        </svg>
      </button>
      <button
        onClick={onRemove}
        className="flex p-2 h-9 items-center gap-1 rounded-lg bg-ui pb-1 pt-[6px] text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-500/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-4"
        >
          <path
            fillRule="evenodd"
            d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
            clipRule="evenodd"
          />
        </svg>
        Remove
      </button>
      <button className="flex p-2 h-9 items-center gap-1 rounded-lg bg-transparent pb-1 pt-[6px] text-xs font-medium text-primary hover:bg-ui-mid">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-4"
        >
          <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
        </svg>
        Assign to...
      </button>
      <button className="flex p-2 h-9 items-center gap-1 rounded-lg bg-transparent pb-1 pt-[6px] text-xs font-medium text-primary hover:bg-ui-mid">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-4"
        >
          <path
            fillRule="evenodd"
            d="M12.78 7.595a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06l2.72-2.72-2.72-2.72a.75.75 0 0 1 1.06-1.06l3.25 3.25Zm-8.25-3.25 3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06l2.72-2.72-2.72-2.72a.75.75 0 0 1 1.06-1.06Z"
            clipRule="evenodd"
          />
        </svg>
        Swap with...
      </button>
      <button
        disabled
        className="flex p-2 h-9 items-center gap-1 rounded-lg bg-transparent pb-1 pt-[6px] text-xs font-medium text-primary hover:bg-ui-mid disabled:opacity-60 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="size-4"
        >
          <path
            fillRule="evenodd"
            d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm4 3.5a.75.75 0 0 1 .75.75v2.69l.72-.72a.75.75 0 1 1 1.06 1.06l-2 2a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 0 1 1.06-1.06l.72.72V6.25A.75.75 0 0 1 8 5.5Z"
            clipRule="evenodd"
          />
        </svg>
        Unpublish
      </button>
    </>
  );
};
