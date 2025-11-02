import { useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useSessionSelection } from "./hooks";
import { RowHeader } from "./RowHeader";
import { Session } from "./session";
import { Toolbar } from "./toolbar";
import { GRID_CONFIG, ROW_HEADERS } from "./constants";

export const LantumBulk = () => {
  const {
    sessions,
    selected,
    isSelecting,
    toolbarIsToast,
    handleSelect,
    onRemove,
    onUndo,
    onClose,
  } = useSessionSelection();

  // Optimize session lookups with a Map - O(1) instead of O(n)
  const sessionMap = useMemo(
    () => new Map(sessions.map((s) => [s.id, s])),
    [sessions],
  );

  // Memoize click handler creator to prevent recreating functions on every render
  const createClickHandler = useCallback(
    (id: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      handleSelect(event, id);
    },
    [handleSelect],
  );

  return (
    <div className="relative rounded-md overflow-hidden bg-background w-full max-w-3xl shadow-floating">
      <div className="flex flex-row h-full">
        <div className="shrink-0 flex flex-col bg-(--border) gap-y-px border-r h-full">
          {ROW_HEADERS.map((header) => (
            <RowHeader
              key={header.name}
              name={header.name}
              role={header.role}
            />
          ))}
        </div>
        <div className="w-full grid justify-end grid-cols-7 gap-y-px gap-x-px bg-(--border)">
          {[...Array(GRID_CONFIG.TOTAL_CELLS)].map((_, id) => {
            const session = sessionMap.get(id);

            return (
              <div
                key={id}
                className={cn("bg-background p-2")}
                style={{ height: `${GRID_CONFIG.ROW_HEIGHT}px` }}
              >
                {session ? (
                  <Session
                    onClick={createClickHandler(id)}
                    selected={selected.includes(id)}
                  >
                    <small className="text-xs! font-medium">
                      {session.name}
                    </small>
                    <span className="text-xs opacity-80">
                      {session.location}
                    </span>
                  </Session>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
      <Toolbar
        isToast={toolbarIsToast}
        onClose={onClose}
        onUndo={onUndo}
        onRemove={onRemove}
        isSelecting={isSelecting}
      />
    </div>
  );
};
