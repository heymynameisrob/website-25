import type { Modifier } from "@dnd-kit/core";
import * as React from "react";

export function createRestrictToGridModifier(
  gridRef: React.RefObject<HTMLDivElement | null>,
): Modifier {
  return (args) => {
    const { transform, draggingNodeRect } = args;

    if (!draggingNodeRect || !gridRef.current) {
      return transform;
    }

    const containerRect = gridRef.current.getBoundingClientRect();

    // Calculate the constrained position
    const newX = Math.max(
      containerRect.left - draggingNodeRect.left,
      Math.min(containerRect.right - draggingNodeRect.right, transform.x),
    );

    const newY = Math.max(
      containerRect.top - draggingNodeRect.top,
      Math.min(containerRect.bottom - draggingNodeRect.bottom, transform.y),
    );

    return {
      ...transform,
      x: newX,
      y: newY,
    };
  };
}
