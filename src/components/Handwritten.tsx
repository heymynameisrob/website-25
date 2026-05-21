import { useReducedMotion } from "motion/react";
import { TegakiRenderer } from "tegaki/react";
import bundle from "tegaki/fonts/caveat";

const InkDistressFilter = (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <filter id="ink-distress" x="-20%" y="-20%" width="140%" height="140%">
        {/* Roughen stroke edges like paper fibers */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.03"
          numOctaves={3}
          result="roughness"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="roughness"
          scale="1.5"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />

        {/* Faded spots — random opacity variation */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.06"
          numOctaves={4}
          seed={2}
          result="fadingNoise"
        />
        <feColorMatrix
          in="fadingNoise"
          type="matrix"
          values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0.5"
          result="fadingMask"
        />

        {/* Mask displaced graphic with fadingMask */}
        <feComposite
          in="displaced"
          in2="fadingMask"
          operator="in"
          result="distressed"
        />

        {/* Very subtle ink bleed */}
        <feGaussianBlur in="distressed" stdDeviation="0.2" result="final" />
      </filter>
    </defs>
  </svg>
);

export function Handwritten() {
  return (
    <div style={{ filter: "url(#ink-distress)" }}>
      {InkDistressFilter}
      <TegakiRenderer
        font={bundle as any}
        time={{ mode: "uncontrolled", speed: 2.25, loop: false }}
        style={{
          fontSize: "48px",
          color: "#000",
          transform: "rotate(-3deg)",
        }}
      >
        Hey, my name is Rob :)
      </TegakiRenderer>
    </div>
  );
}

const BallpointInkFilter = (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <filter
        id="ballpoint-ink"
        x="-20%"
        y="-20%"
        width="1-00%"
        height="140%"
        colorInterpolationFilters="sRGB"
      >
        {/* ── 1. Isolate the outer rim of each stroke ── */}
        <feMorphology
          in="SourceGraphic"
          operator="erode"
          radius="0.5"
          result="core"
        />
        <feComposite
          in="SourceGraphic"
          in2="core"
          operator="out"
          result="rim"
        />

        {/* ── 2. Fine noise: tiny skipping spots everywhere ── */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.08"
          numOctaves={20}
          seed={10}
          result="fineNoise"
        />
        <feColorMatrix
          in="fineNoise"
          type="matrix"
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  1 1 1 0 0"
          result="fineLuma"
        />
        {/* Hard threshold: values below ~0.6 become fully transparent holes */}
        <feComponentTransfer in="fineLuma" result="fineMask">
          <feFuncA type="table" tableValues="0 1 1 1 1" />
        </feComponentTransfer>

        {/* ── 3. Coarse noise: bigger gaps, but only allowed on the rim ── */}
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.08"
          numOctaves={20}
          seed={10}
          result="coarseNoise"
        />
        <feColorMatrix
          in="coarseNoise"
          type="matrix"
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  1 1 1 0 0"
          result="coarseLuma"
        />
        {/* More aggressive curve: lots of fully-transparent values */}
        <feComponentTransfer in="coarseLuma" result="coarseMask">
          <feFuncA type="table" tableValues="0 1 1 1 1" />
        </feComponentTransfer>

        {/* Restrict coarse holes to the rim only */}
        <feComposite
          in="rim"
          in2="coarseMask"
          operator="in"
          result="rimHoles"
        />

        {/* Apply fine holes to the solid core */}
        <feComposite
          in="core"
          in2="fineMask"
          operator="in"
          result="coreHoles"
        />

        {/* ── 4. Stack rim holes over core holes ── */}
        <feComposite
          in="rimHoles"
          in2="coreHoles"
          operator="over"
        />
      </filter>
    </defs>
  </svg>
);

const DistortionMap = (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <filter id="distortionFilter">
        <feTurbulence
          type="turbulence"
          baseFrequency="0.02"
          numOctaves="2"
          seed="1"
          result="noise"
        >
          <animate
            attributeName="baseFrequency"
            values="0.018;0.021;0.019;0.022"
            keyTimes="0;0.25;0.5;0.75"
            dur="0.4s"
            repeatCount="indefinite"
            calcMode="discrete"
          />
        </feTurbulence>

        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="2"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </defs>
  </svg>
);

export function BallpointHandwritten() {
  const reduced = useReducedMotion();

  if (reduced) {
    return <h1>Hey, my name is Rob :)</h1>;
  }

  return (
    <h1 style={{ filter: "url(#distortionFilter)" }}>
      {DistortionMap}
      <TegakiRenderer
        font={bundle as any}
        time={{ mode: "uncontrolled", speed: 2.25, loop: false }}
        className="text-primary"
        style={{
          fontSize: "28px",
          opacity: 0.92,
          transform: "rotate(-3deg)",
        }}
      >
        Hey, my name is Rob :)
      </TegakiRenderer>
    </h1>
  );
}
