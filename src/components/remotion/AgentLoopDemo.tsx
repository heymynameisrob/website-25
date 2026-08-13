import { Player } from "@remotion/player";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";

const FPS = 30;
const DURATION_IN_FRAMES = 300;

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const enter = (frame: number, from: number, duration = 18) => {
  return interpolate(frame, [from, from + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};

const draw = (frame: number, from: number, duration = 24) => {
  return interpolate(frame, [from, from + duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};

function FadeIn({
  children,
  delay,
  x = -10,
}: {
  children: React.ReactNode;
  delay: number;
  x?: number;
}) {
  const frame = useCurrentFrame();
  const opacity = enter(frame, delay);
  const translateX = interpolate(opacity, [0, 1], [x, 0]);

  return (
    <g opacity={opacity} transform={`translate(${translateX} 0)`}>
      {children}
    </g>
  );
}

function DrawPath({ d, delay, duration = 24 }: { d: string; delay: number; duration?: number }) {
  const frame = useCurrentFrame();
  const opacity = enter(frame, delay, 10);
  const dashOffset = draw(frame, delay, duration);

  return (
    <path
      d={d}
      className="fill-none stroke-border"
      markerEnd="url(#arrow-head)"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={dashOffset}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      style={{ opacity }}
    />
  );
}

function Card({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <g filter="url(#card-shadow)">
      <rect
        x={x}
        y={y}
        width="207"
        height="61"
        rx="12"
        className="fill-background dark:fill-gray-2"
      />
      <rect
        x={x + 0.25}
        y={y + 0.25}
        width="206.5"
        height="60.5"
        rx="11.75"
        className="stroke-border"
        fill="none"
        strokeWidth="0.5"
      />
      <text
        x={x + 103.5}
        y={y + 32}
        className="fill-primary font-sans text-sm font-medium"
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {children}
      </text>
    </g>
  );
}

function AgentLoopComposition() {
  const frame = useCurrentFrame();
  const blueOpacity = enter(frame, 104, 22);
  const blueScale = interpolate(blueOpacity, [0, 1], [0.96, 1]);

  return (
    <AbsoluteFill className="font-sans">
      <div className="absolute inset-0 grid place-items-center">
        <svg
          viewBox="0 0 910 302"
          className="h-auto w-full max-h-full overflow-visible"
          role="img"
          aria-label="Input flows to an LLM, through the loop, and then to output"
        >
          <defs>
            <filter
              id="card-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
              colorInterpolationFilters="sRGB"
            >
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.08" />
            </filter>
            <marker
              id="arrow-head"
              markerWidth="10"
              markerHeight="10"
              refX="7"
              refY="5"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path
                d="M1 1 L8 5 L1 9"
                className="fill-none stroke-border"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </marker>
          </defs>

          <g
            opacity={blueOpacity}
            transform={`translate(454.5 150.5) scale(${blueScale}) translate(-454.5 -150.5)`}
          >
            <rect
              x="234.5"
              y="0.5"
              width="440"
              height="301"
              rx="19.5"
              className="fill-sky-500/10 stroke-sky-500"
            />
            <rect x="388" y="110" width="127" height="81" rx="40.5" className="fill-sky-500" />
            <text
              x="451.5"
              y="151"
              className="fill-white font-sans text-sm font-medium"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              The Loop
            </text>
          </g>

          <FadeIn delay={0}>
            <Card x={2} y={12}>
              Input
            </Card>
          </FadeIn>
          <DrawPath d="M221 43H339" delay={18} duration={18} />

          <FadeIn delay={34}>
            <Card x={351.5} y={12}>
              LLM
            </Card>
          </FadeIn>
          <DrawPath d="M570.5 43H689" delay={52} duration={18} />

          <FadeIn delay={68}>
            <Card x={701} y={12}>
              Output
            </Card>
          </FadeIn>

          <DrawPath
            d="M564 72.5C579.8 94.6 589 121.5 589 150.5C589 179.5 579.8 206.4 564 228.5"
            delay={82}
            duration={30}
          />
          <DrawPath
            d="M339 228.5C323.2 206.4 314 179.5 314 150.5C314 121.5 323.2 94.6 339 72.5"
            delay={94}
            duration={30}
          />

          <FadeIn delay={96}>
            <Card x={348} y={229}>
              Tool
            </Card>
          </FadeIn>
        </svg>
      </div>
    </AbsoluteFill>
  );
}

export function AgentLoopDemo() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-8 m-auto aspect-[910/302] max-h-full max-w-full">
        <Player
          component={AgentLoopComposition}
          durationInFrames={DURATION_IN_FRAMES}
          compositionWidth={910}
          compositionHeight={302}
          fps={FPS}
          autoPlay
          loop
          controls={false}
          clickToPlay={false}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
