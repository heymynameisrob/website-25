import type { DragEndEvent } from "@dnd-kit/core";

export interface DropzoneProps {
  id: number;
  data: string;
  children?: React.ReactNode;
}

export interface DraggableProps {
  id: string;
  data: string[];
  isDragging: boolean;
  disabled: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface DraggableGridProps {
  parent: number;
  saving: boolean;
  isDragging: boolean;
}

export interface SaveToastProps {
  showToast: boolean;
  saving: boolean;
}

export interface RowHeaderProps {
  name: string;
  role: string;
}

export interface DragData {
  supports: string[];
}

export interface DropData {
  type: string;
}

export type LantumDragEndEvent = DragEndEvent & {
  over: {
    id: number;
    data: {
      current: DropData;
    };
  } | null;
  active: {
    data: {
      current: DragData;
    };
  };
};
