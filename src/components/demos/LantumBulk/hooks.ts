import { useState, useEffect, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import type { SessionData } from "./types";
import { SESSIONS, GRID_CONFIG } from "./constants";

export function useSessionSelection() {
  const [sessions, setSessions] = useState<SessionData[]>(SESSIONS);
  const [selected, setSelected] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [toolbarIsToast, setToolbarIsToast] = useState(false);

  // Keyboard shortcuts
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

  // Cleanup timeout on unmount or when toast state changes
  useEffect(() => {
    if (toolbarIsToast) {
      const timeoutId = setTimeout(() => {
        setToolbarIsToast(false);
        setIsSelecting(false);
      }, GRID_CONFIG.TOAST_DURATION);

      return () => clearTimeout(timeoutId);
    }
  }, [toolbarIsToast]);

  const handleSelect = useCallback(
    (event: React.MouseEvent, id: number) => {
      if (event.shiftKey && !isSelecting) {
        setIsSelecting(true);
        setSelected([id]);
        return;
      }

      if (!event.shiftKey && !isSelecting) return;

      setSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    },
    [isSelecting],
  );

  const onRemove = useCallback(() => {
    setToolbarIsToast(true);
    const filtered = sessions.filter((item) => !selected.includes(item.id));
    setSessions(filtered);
    setSelected([]);
  }, [sessions, selected]);

  const onUndo = useCallback(() => {
    setSessions(SESSIONS);
    setSelected([]);
    setIsSelecting(false);
  }, []);

  const onClose = useCallback(() => {
    setSelected([]);
    setIsSelecting(false);
  }, []);

  return {
    sessions,
    selected,
    isSelecting,
    toolbarIsToast,
    handleSelect,
    onRemove,
    onUndo,
    onClose,
  };
}
