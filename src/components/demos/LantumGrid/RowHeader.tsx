import type { RowHeaderProps } from "./types";

export function RowHeader({ name, role }: RowHeaderProps) {
  return (
    <div className="h-[90px] w-[100px] p-2 bg-gray-3 text-xs flex flex-col">
      <small className="text-xs! font-medium">{name}</small>
      <span className="text-xs text-secondary">{role}</span>
    </div>
  );
}
