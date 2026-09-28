import {critical, step} from "./spring";

export type FlowReveal = {
  opacity: number;
  scale: number;
  y: number;
};

export type EdgeTraveler = {
  progress: number;
  visible: boolean;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/**
 * Deterministic node entrance for diagram / workflow scenes.
 * Uses the same closed-form spring system as the rest of the product-film kit.
 */
export function nodeReveal(
  t: number,
  start: number,
  {
    response = 13,
    offsetY = 14,
    fromScale = 0.96,
  }: {
    response?: number;
    offsetY?: number;
    fromScale?: number;
  } = {},
): FlowReveal {
  const p = clamp01(step(t - start, {...critical(response), clamp: true}));

  return {
    opacity: p,
    scale: fromScale + (1 - fromScale) * p,
    y: offsetY * (1 - p),
  };
}

/**
 * Edge draw progress in the [0, 1] range.
 * Use with pathLength={1}, strokeDasharray={1}, strokeDashoffset={1 - progress}.
 */
export function edgeProgress(
  t: number,
  start: number,
  duration: number,
): number {
  if (duration <= 0) return t >= start ? 1 : 0;
  return clamp01((t - start) / duration);
}

/**
 * A spring-ended edge draw. Useful when the connector should arrive with
 * a tiny amount of authored overshoot rather than linear mechanical motion.
 */
export function springEdgeProgress(
  t: number,
  start: number,
  response = 11,
): number {
  return clamp01(step(t - start, {...critical(response), clamp: true}));
}

/**
 * Stagger helper for decision branches or sequential child nodes.
 */
export function branchStart(
  parentArrival: number,
  branchIndex: number,
  stagger = 0.12,
): number {
  return parentArrival + Math.max(0, branchIndex) * stagger;
}

/**
 * Progress for a visible semantic traveler moving along an edge.
 * The traveler is only visible while the edge event is active.
 */
export function edgeTraveler(
  t: number,
  start: number,
  duration: number,
): EdgeTraveler {
  const progress = edgeProgress(t, start, duration);
  return {
    progress,
    visible: t >= start && t <= start + duration,
  };
}

/**
 * Returns a point on a cubic Bezier path. Useful for a semantic traveler
 * following the same connector geometry as the graph edge.
 */
export function cubicPoint(
  p: number,
  start: {x: number; y: number},
  control1: {x: number; y: number},
  control2: {x: number; y: number},
  end: {x: number; y: number},
) {
  const t = clamp01(p);
  const mt = 1 - t;

  return {
    x:
      mt * mt * mt * start.x +
      3 * mt * mt * t * control1.x +
      3 * mt * t * t * control2.x +
      t * t * t * end.x,
    y:
      mt * mt * mt * start.y +
      3 * mt * mt * t * control1.y +
      3 * mt * t * t * control2.y +
      t * t * t * end.y,
  };
}

/**
 * Dim inactive graph elements without inventing a separate visual language.
 */
export function graphEmphasis(
  active: boolean,
  {
    activeOpacity = 1,
    inactiveOpacity = 0.28,
  }: {
    activeOpacity?: number;
    inactiveOpacity?: number;
  } = {},
) {
  return active ? activeOpacity : inactiveOpacity;
}
