import type { SessionData } from "./types";

export const GRID_CONFIG = {
  ROW_HEIGHT: 90,
  HEADER_WIDTH: 100,
  TOTAL_CELLS: 28,
  GRID_COLUMNS: 7,
  TOAST_DURATION: 4000,
} as const;

export const SESSIONS: SessionData[] = [
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

export const ROW_HEADERS = [
  { name: "J.C. Reilly", role: "FY1" },
  { name: "W.Ferrel", role: "FY1" },
  { name: "V.Vaughn", role: "FY2" },
  { name: "O.Wilson", role: "SHO" },
] as const;
