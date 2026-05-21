import { CustomHoverCard } from "./CustomHoverCard";
import { BallpointHandwritten } from "./Handwritten";

export function BallpointWithHoverCard() {
  return (
    <CustomHoverCard
      contentClass="p-2"
      className="w-fit"
      content={
        <img
          src="https://ucarecdn.com/75709875-783d-47e9-a60a-6d43e1d5d344/"
          alt="Profile"
          className="w-full h-auto rounded-sm inset-ring ring-white/10 rounded-lg"
        />
      }
    >
      <BallpointHandwritten />
    </CustomHoverCard>
  );
}
