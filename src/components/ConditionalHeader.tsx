import { BallpointHandwritten } from "@/components/Handwritten";
import { AsciiBanner } from "@/components/AsciiBanner";
import { useUserVariant } from "@/lib/hooks/useUserVariant";

export function ConditionalHeader() {
  const variant = useUserVariant();

  if (variant.header === "ascii") {
    return <AsciiBanner />;
  }

  return <BallpointHandwritten />;
}
