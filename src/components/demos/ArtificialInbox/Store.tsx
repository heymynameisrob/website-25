import { getEmptyTipTapContent } from "@/lib/utils";
import type { JSONContent } from "@tiptap/react";
import { addDays } from "date-fns";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ArtificialInboxGroupBy = "status" | "client" | "product";
export type ArtificialInboxSortBy = "last_edited" | "alphabetically";
export type ArtificialInboxLayout = "board" | "list" | "table";
export type ArtificialInboxView = "default" | "columns";
export type ArtificialTask = {
  title: string;
  assignee: string;
  status: string;
  policyId: string;
  dueDate: Date;
  content: JSONContent | string;
};

interface ArtificialInboxState {
  isOpen: boolean;
  view: ArtificialInboxView;
  setView: (view: ArtificialInboxView) => void;
  name: string | undefined;
  emoji: string | undefined;
  columns: Array<{ id: string; label: string; value: boolean }>;
  groupBy: ArtificialInboxGroupBy;
  sortBy: ArtificialInboxSortBy;
  layout: ArtificialInboxLayout;
  task: ArtificialTask;
  setIsOpen: (isOpen: boolean) => void;
  setName: (name: string | undefined) => void;
  setEmoji: (emoji: string | undefined) => void;
  setColumns: (
    columns: Array<{ id: string; label: string; value: boolean }>,
  ) => void;
  setGroupBy: (groupBy: ArtificialInboxGroupBy) => void;
  setSortBy: (sortBy: ArtificialInboxSortBy) => void;
  setLayout: (layout: ArtificialInboxLayout) => void;
  setTask: (task: ArtificialTask) => void;
  setTaskTitle: (title: string) => void;
  setTaskDate: (date: Date) => void;
  setTaskStatus: (status: string) => void;
  setTaskAssignee: (assignee: string) => void;
  reset: () => void;
}

const initialState = {
  isOpen: true,
  view: "default" as ArtificialInboxView,
  name: "New View",
  emoji: "💫",
  groupBy: "status" as ArtificialInboxGroupBy,
  sortBy: "last_edited" as ArtificialInboxSortBy,
  layout: "list" as ArtificialInboxLayout,
  columns: [
    { id: "id", label: "ID", value: true },
    { id: "insured", label: "Insured", value: true },
    { id: "product", label: "Product", value: true },
    { id: "inception", label: "Inception", value: true },
    { id: "expiry", label: "Expiry", value: true },
    { id: "last_edited", label: "Last edited", value: true },
    { id: "assigned", label: "Assigned", value: true },
    { id: "created_by", label: "Created by", value: true },
  ],
  task: {
    title: "Send to compliance for check",
    assignee: "rob_hough",
    status: "todo",
    policyId: "001",
    dueDate: addDays(new Date(), 3),
    content:
      "We need to get compliance to check this before it goes through to quoting. Make sure they go through all the documents and sign them off.",
  },
};

const checkHasChanges = (state: ArtificialInboxState) => {
  /** Only check filters changes */
  return (
    state.view !== initialState.view ||
    state.name !== initialState.name ||
    state.emoji !== initialState.emoji ||
    state.groupBy !== initialState.groupBy ||
    state.sortBy !== initialState.sortBy ||
    state.layout !== initialState.layout ||
    JSON.stringify(state.columns) !== JSON.stringify(initialState.columns)
  );
};

export const useArtificialInboxStore = create<ArtificialInboxState>()(
  persist(
    (set) => ({
      ...initialState,
      setView: (view) => set({ view }),
      setIsOpen: (isOpen) => set({ isOpen }),
      setName: (name) => set({ name }),
      setEmoji: (emoji) => set({ emoji }),
      setColumns: (columns) => set({ columns }),
      setGroupBy: (groupBy) => set({ groupBy }),
      setSortBy: (sortBy) => set({ sortBy }),
      setLayout: (layout) => set({ layout }),
      setTask: (task) => set({ task }),
      setTaskTitle: (title) =>
        set((state) => ({ task: { ...state.task, title } })),
      setTaskDate: (dueDate) =>
        set((state) => ({ task: { ...state.task, dueDate } })),
      setTaskStatus: (status) =>
        set((state) => ({ task: { ...state.task, status } })),
      setTaskAssignee: (assignee) =>
        set((state) => ({ task: { ...state.task, assignee } })),
      reset: () => set(initialState),
    }),
    {
      name: "artificial-inbox-task",
      partialize: (state) => ({ task: state.task }),
    },
  ),
);

export const selectHasChanges = (state: ArtificialInboxState) =>
  checkHasChanges(state);
