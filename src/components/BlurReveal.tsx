import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

const CHARACTER_TRANSITION = {
  type: "spring" as const,
  duration: 0.7,
  bounce: 0,
};

const DISTORTION_TRANSITION = {
  type: "spring" as const,
  duration: 0.9,
  bounce: 0,
};

const DISPLACEMENT_SCALE = 80;
const NOISE_FREQUENCY_FROM = 1;
const NOISE_FREQUENCY_TO = 0.01;

function splitCharacters(value: string) {
  return Array.from(value, (character, index) => ({
    character,
    key: `char-${index}`,
  }));
}

interface BlurRevealProps {
  text?: string;
  children?: React.ReactNode;
  blurPx?: number;
  staggerMs?: number;
  className?: string;
  contentClassName?: string;
}

interface CharacterRevealProps {
  blurPx: number;
  character: string;
  contentClassName?: string;
  delayMs: number;
  filterId: string;
  shouldReduceMotion: boolean;
}

function CharacterReveal({
  blurPx,
  character,
  contentClassName,
  delayMs,
  filterId,
  shouldReduceMotion,
}: CharacterRevealProps) {
  const distortion = useMotionValue(shouldReduceMotion || character === " " ? 0 : 1);
  const noiseFrequency = useTransform(
    distortion,
    [0, 1],
    [NOISE_FREQUENCY_TO, NOISE_FREQUENCY_FROM]
  );
  const displacementScale = useTransform(distortion, [0, 1], [0, DISPLACEMENT_SCALE]);
  const [noiseFrequencyValue, setNoiseFrequencyValue] = React.useState(
    shouldReduceMotion || character === " " ? NOISE_FREQUENCY_TO : NOISE_FREQUENCY_FROM
  );
  const [displacementScaleValue, setDisplacementScaleValue] = React.useState(
    shouldReduceMotion || character === " " ? 0 : DISPLACEMENT_SCALE
  );

  useMotionValueEvent(noiseFrequency, "change", latest => {
    setNoiseFrequencyValue(latest);
  });

  useMotionValueEvent(displacementScale, "change", latest => {
    setDisplacementScaleValue(latest);
  });

  React.useEffect(() => {
    if (shouldReduceMotion || character === " ") return;

    const controls = animate(distortion, 0, {
      ...DISTORTION_TRANSITION,
      delay: delayMs / 1000,
    });

    return () => controls.stop();
  }, [character, delayMs, distortion, shouldReduceMotion]);

  if (character === " ") {
    return <span className={cn("inline-block max-w-[6px] overflow-hidden", contentClassName)}>&nbsp;</span>;
  }

  return (
    <>
      {!shouldReduceMotion && (
        <svg aria-hidden className="absolute h-0 w-0 overflow-hidden">
          <defs>
            <filter
              id={filterId}
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
              colorInterpolationFilters="sRGB"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency={noiseFrequencyValue}
                numOctaves="2"
                seed="1"
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={displacementScaleValue}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      <motion.span
        className={cn("inline-block will-change-transform", contentClassName)}
        initial={
          shouldReduceMotion
            ? false
            : {
                opacity: 0,
                filter: `url(#${filterId}) blur(${blurPx}px)`,
              }
        }
        animate={{
          opacity: 1,
          filter: shouldReduceMotion ? "none" : `url(#${filterId}) blur(0px)`,
        }}
        transition={
          shouldReduceMotion
            ? undefined
            : {
                ...CHARACTER_TRANSITION,
                delay: delayMs / 1000,
              }
        }
      >
        {character}
      </motion.span>
    </>
  );
}

export function BlurReveal({
  text,
  children,
  blurPx = 64,
  staggerMs = 42,
  className,
  contentClassName,
}: BlurRevealProps) {
  const filterIdBase = React.useId().replace(/:/g, "");
  const shouldReduceMotion = useReducedMotion() ?? false;
  const content = children ?? text;

  if (typeof content !== "string" || content.length === 0) {
    return content ? <span className={cn("font-serif text-2xl", className)}>{content}</span> : null;
  }

  const characters = splitCharacters(content);

  return (
    <span className={cn("inline-block whitespace-pre-wrap font-serif font-medium text-3xl", className)}>
      {characters.map(({ character, key }, index) => (
        <CharacterReveal
          key={key}
          blurPx={blurPx}
          character={character}
          contentClassName={contentClassName}
          delayMs={index * staggerMs}
          filterId={`${filterIdBase}-${key}`}
          shouldReduceMotion={shouldReduceMotion}
        />
      ))}
    </span>
  );
}
