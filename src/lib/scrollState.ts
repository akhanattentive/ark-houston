// A tiny mutable singleton shared between the DOM (Lenis/GSAP) and the
// react-three-fiber render loop. The 3D scene reads `progress` every frame
// without triggering React re-renders.

export interface ScrollState {
  /** Overall page scroll progress, 0 → 1. */
  progress: number;
  /** Smoothed scroll velocity (signed). Drives water turbulence. */
  velocity: number;
  /** Storm intensity 0 → 1, peaks during the flood act. */
  storm: number;
}

export const scroll: ScrollState = {
  progress: 0,
  velocity: 0,
  storm: 0,
};

/**
 * Maps overall progress to a storm curve: calm at the start, building to a
 * peak through the flood, then clearing into golden light toward the end.
 */
export function stormCurve(p: number): number {
  // Calm dawn → storm peaks through the Flood & Lineage acts (~0.3) → clears
  // into golden light by the Mission so the hopeful half reads in calm.
  const rise = smoothstep(0.05, 0.26, p);
  const fall = 1 - smoothstep(0.36, 0.56, p);
  return Math.min(rise, fall);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function clamp(x: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, x));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
