import * as React from "react";
import { Dropzone } from "./dropzone";
import { Draggable } from "./draggable";
import { GRID_SIZE, FY1_THRESHOLD, ROLES } from "./constants";
import type { DraggableGridProps } from "./types";

export const DraggableGrid = React.forwardRef<
  HTMLDivElement,
  DraggableGridProps
>(({ parent, saving, isDragging }, ref) => {
  return (
    <div
      ref={ref}
      className="w-full grid justify-end grid-cols-7 gap-y-px bg-(--border)"
    >
      {[...Array(GRID_SIZE)].map((_, id) => {
        return (
          <Dropzone
            id={id}
            key={id}
            data={id < FY1_THRESHOLD ? ROLES.FY1 : ROLES.SHO}
          >
            {parent === id ? (
              <Draggable
                id={"draggable"}
                data={[ROLES.FY1]}
                isDragging={isDragging}
                disabled={saving}
                className="aria-disabled:opacity-50"
              >
                <span className="text-xs font-medium">FY Long</span>
                <span className="text-xs opacity-80">Ward A</span>
              </Draggable>
            ) : null}
          </Dropzone>
        );
      })}
    </div>
  );
});

DraggableGrid.displayName = "DraggableGrid";
