import type { RowHeaderProps } from "./types";
import { GRID_CONFIG } from "./constants";

export const RowHeader = ({ name, role }: RowHeaderProps) => {
  return (
    <div
      className="p-2 bg-gray-3 text-xs flex flex-col"
      style={{
        height: `${GRID_CONFIG.ROW_HEIGHT}px`,
        width: `${GRID_CONFIG.HEADER_WIDTH}px`,
      }}
    >
      <small className="text-xs! font-medium">{name}</small>
      <span className="text-xs text-secondary">{role}</span>
    </div>
  );
};
