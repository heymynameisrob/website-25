import * as React from "react";
import { DndContext, MouseSensor, useSensor } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { DraggableGrid } from "./grid";
import { RowHeader } from "./RowHeader";
import { SaveToast } from "./SaveToast";
import { createRestrictToGridModifier } from "./utils";
import { ROLES, ACTIVATION_CONSTRAINT, ANIMATION_DURATION } from "./constants";
import type { LantumDragEndEvent } from "./types";

export const LantumGrid = () => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [parent, setParent] = React.useState<number>(8);
  const [showToast, setShowToast] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const gridRef = React.useRef<HTMLDivElement>(null);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: ACTIVATION_CONSTRAINT,
  });

  // gridRef is stable across renders, so the modifier function only needs to be created once
  const restrictToGrid = React.useMemo(() => {
    return createRestrictToGridModifier(gridRef);
  }, []);

  const handleSave = React.useCallback(() => {
    setShowToast(true);
    setSaving(true);

    setTimeout(() => setSaving(false), ANIMATION_DURATION.SAVING);
    setTimeout(() => setShowToast(false), ANIMATION_DURATION.TOAST_DISPLAY);
  }, []);

  return (
    <div
      className={cn(
        "relative left-10 origin-top rounded-md overflow-hidden bg-background w-full shadow-floating",
      )}
    >
      <div className="flex flex-row h-full">
        <div className="shrink-0 flex flex-col bg-(--border) gap-y-px h-full">
          <RowHeader name="J.C. Reilly" role={ROLES.FY1}></RowHeader>
          <RowHeader name="W.Ferrel" role={ROLES.FY1}></RowHeader>
          <RowHeader name="V.Vaughn" role={ROLES.FY2}></RowHeader>
          <RowHeader name="O.Wilson" role={ROLES.SHO}></RowHeader>
        </div>
        <DndContext
          sensors={[mouseSensor]}
          modifiers={[snapCenterToCursor, restrictToGrid]}
          onDragStart={() => {
            setIsDragging(true);
          }}
          onDragEnd={({ over, active }: LantumDragEndEvent) => {
            if (!over) return;
            if (!active.data.current.supports.includes(over.data.current.type))
              return;
            setParent(over.id);
            setIsDragging(false);
            handleSave();
          }}
          onDragCancel={() => setIsDragging(false)}
        >
          <DraggableGrid
            ref={gridRef}
            isDragging={isDragging}
            parent={parent}
            saving={saving}
          />
        </DndContext>
      </div>
      <SaveToast saving={saving} showToast={showToast} />
    </div>
  );
};
