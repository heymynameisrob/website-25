import type { GibPiece, ShotImpact } from "./ascii-banner.types";

export const GIB_CHUNKS = 44;
export const GIB_ANIMATION_MS = 900;
export const RESET_FADE_MS = 400;
export const IMPACT_RADIUS = 18;
export const RESET_DAMAGE_RATIO = 0.82;

export function isVisibleCell(char: string) {
  return char.trim().length > 0;
}

export function countVisibleCells(lines: string[]) {
  return lines.reduce(
    (count, line) => count + [...line].filter(isVisibleCell).length,
    0
  );
}

export function seededRandom(seed: number) {
  // Park-Miller PRNG constants: 2147483647 is 2^31 - 1, a prime modulus.
  // This gives each click a deterministic Math.random()-like sequence from its seed.
  let value = seed % 2147483647;

  if (value <= 0) {
    value += 2147483646;
  }

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function isInsideImpactRadius(x: number, y: number, impactX: number, impactY: number) {
  return Math.hypot(x - impactX, y - impactY) <= IMPACT_RADIUS;
}

export function isDamagedCell(x: number, y: number, impacts: ShotImpact[]) {
  return impacts.some(impact => isInsideImpactRadius(x, y, impact.x, impact.y));
}

export function createDamagedBody(bodyLines: string[], impacts: ShotImpact[]) {
  return bodyLines
    .map((line, y) =>
      [...line].map((char, x) => (isDamagedCell(x, y, impacts) ? " " : char)).join("")
    )
    .join("\n");
}

export function countDamagedCells(bodyLines: string[], impacts: ShotImpact[]) {
  return bodyLines.reduce(
    (count, line, y) =>
      count +
      [...line].filter((char, x) => isVisibleCell(char) && isDamagedCell(x, y, impacts)).length,
    0
  );
}

export function createGibs(
  bodyLines: string[],
  seed: number,
  impactX: number,
  impactY: number,
  existingImpacts: ShotImpact[]
): GibPiece[] {
  const random = seededRandom(seed);
  const cells = bodyLines.flatMap((line, y) =>
    [...line].flatMap((char, x) =>
      isVisibleCell(char) &&
      !isDamagedCell(x, y, existingImpacts) &&
      isInsideImpactRadius(x, y, impactX, impactY)
        ? [{ char, x, y }]
        : []
    )
  );

  if (cells.length === 0) {
    return [];
  }

  // Voronoi decomposition: pick random visible cells as seeds, then assign each
  // character to its nearest seed so the banner breaks into organic chunks.
  const seeds = Array.from(
    { length: GIB_CHUNKS },
    () => cells[Math.floor(random() * cells.length)]
  );
  const chunks = seeds.map(() => [] as typeof cells);

  for (const cell of cells) {
    let chunkIndex = 0;
    let chunkDistance = Infinity;

    seeds.forEach((chunkSeed, index) => {
      const distance = (cell.x - chunkSeed.x) ** 2 + (cell.y - chunkSeed.y) ** 2;

      if (distance < chunkDistance) {
        chunkDistance = distance;
        chunkIndex = index;
      }
    });

    chunks[chunkIndex].push(cell);
  }

  return chunks
    .filter(chunk => chunk.length > 0)
    .map((chunk, id) => {
      const minX = Math.min(...chunk.map(({ x }) => x));
      const maxX = Math.max(...chunk.map(({ x }) => x));
      const minY = Math.min(...chunk.map(({ y }) => y));
      const maxY = Math.max(...chunk.map(({ y }) => y));
      const width = maxX - minX + 1;
      const height = maxY - minY + 1;
      const rows = Array.from({ length: height }, () => Array.from({ length: width }, () => " "));

      for (const { char, x, y } of chunk) {
        rows[y - minY][x - minX] = char;
      }

      const centerX = minX + width / 2;
      const centerY = minY + height / 2;
      const angle = Math.atan2(centerY - impactY, centerX - impactX);
      const force = 34 + random() * 76;
      const dx = Math.cos(angle) * force + (random() - 0.5) * 55;
      const launchY = Math.sin(angle) * 18 - 30 - random() * 48;
      const rotate = (random() - 0.5) * 520;

      return {
        id,
        text: rows.map(row => row.join("").trimEnd()).join("\n"),
        left: minX,
        top: minY,
        dx,
        apexX: dx * (0.35 + random() * 0.18),
        apexY: launchY,
        fallY: 112 + random() * 58,
        apexRotate: rotate * 0.4,
        rotate,
        delay: random() * 80,
      };
    });
}
