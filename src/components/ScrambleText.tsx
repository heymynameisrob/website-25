import { useScramble } from "use-scramble";

export function ScrambleText({ textString }: { textString: string }) {
  const { ref } = useScramble({
    text: "robust code",
    speed: 0.6,
    tick: 1,
    step: 1,
    scramble: 4,
    seed: 1,
  });

  return (
    <span
      ref={ref}
      className="text-base font-mono uppercase tracking-wide text-primary font-medium"
    />
  );
}
