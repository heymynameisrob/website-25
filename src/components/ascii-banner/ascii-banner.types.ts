export type ShotImpact = {
  x: number;
  y: number;
};

export type GibPiece = {
  id: number;
  text: string;
  left: number;
  top: number;
  dx: number;
  apexX: number;
  apexY: number;
  fallY: number;
  apexRotate: number;
  rotate: number;
  delay: number;
};

export type GibBurst = {
  id: number;
  pieces: GibPiece[];
  expiresAt: number;
};
