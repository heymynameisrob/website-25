export interface SessionData {
  id: number;
  name: string;
  location: string;
}

export interface SessionProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  selected: boolean;
  children: React.ReactNode;
}

export interface RowHeaderProps {
  name: string;
  role: string;
}

export interface ToolbarProps {
  isSelecting: boolean;
  isToast: boolean;
  onRemove: () => void;
  onUndo: () => void;
  onClose: () => void;
}

export interface ToolbarMenuProps {
  onRemove: () => void;
  onClose: () => void;
}

export type ToolbarStatus = 'idle' | 'selecting' | 'toast';
