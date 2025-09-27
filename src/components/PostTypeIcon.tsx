import { cn } from "@/lib/utils";
import {
  BoltIcon,
  DocumentTextIcon,
  LinkIcon,
  PhotoIcon,
  SquaresPlusIcon,
} from "@heroicons/react/16/solid";

const iconMap = {
  post: DocumentTextIcon,
  "case-study": SquaresPlusIcon,
  demo: BoltIcon,
  photos: PhotoIcon,
  project: LinkIcon,
};

interface Props {
  type: keyof typeof iconMap;
  className?: string;
}

export default function PostTypeIcon({ type, className }: Props) {
  const IconComponent = iconMap[type];
  return <IconComponent className={cn("size-4 opacity-50", className)} />;
}
