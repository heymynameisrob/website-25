import { Smile } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";

import type { IconOrEmoji } from "@/components/demos/IconPicker/IconPickerContent";

export type IconPickerValueProps = {
  value?: IconOrEmoji;
};

export default function IconPickerValue({ value }: IconPickerValueProps) {
  if (value?.type === "emoji") return <span className="text-xl">{value.value}</span>;
  if (value?.type !== "icon") return <Smile aria-hidden="true" size={20} />;
  const iconName = value.value as keyof typeof dynamicIconImports;
  if (!dynamicIconImports[iconName]) return <Smile aria-hidden="true" size={20} />;
  return (
    <DynamicIcon aria-hidden="true" name={iconName} size={20} style={{ color: value.color }} />
  );
}
