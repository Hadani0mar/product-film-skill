/**
 * Deterministic one-shape motion helpers for Remotion.
 *
 * Architecture inspired by the MIT-licensed motion-broll engine:
 * https://github.com/Barty-Bart/motion-graphics
 *
 * This is a TypeScript/Remotion adaptation, not a copy of its HTML scene runner.
 * It keeps the useful grammar: one shape, retargetable closed-form springs,
 * independent content visibility, leading/trailing edge stretch, and direct manipulation.
 */
import {step, type SpringConfig} from "./spring";
import {clamp01} from "./time";

export type TimedKey = readonly [time: number, value: number, config?: SpringConfig];

export const MORPH: SpringConfig = {stiffness: 225, damping: 25.2, mass: 1};
export const FAST: SpringConfig = {stiffness: 729, damping: 46.44, mass: 1};
export const SLOW: SpringConfig = {stiffness: 156.25, damping: 22.5, mass: 1};
export const SOFT: SpringConfig = {stiffness: 100, damping: 19, mass: 1};
export const CAMERA: SpringConfig = {stiffness: 56.25, damping: 15, mass: 1};

export function retarget(
  t: number,
  initial: number,
  keys: readonly TimedKey[],
  fallback: SpringConfig = MORPH,
  loopPeriod = 0,
) {
  let previous = initial;
  const deltas = keys.map(([time, value, config]) => {
    const delta = value - previous;
    previous = value;
    return {time, delta, config: config ?? fallback};
  });

  const closed = loopPeriod > 0 && Math.abs(previous - initial) < 1e-9;
  let value = initial;

  for (const key of deltas) {
    if (key.delta === 0) continue;
    value += key.delta * step(t - key.time, key.config);

    // Residue from the previous cycle makes t=period meet t=0 without a seam.
    if (closed) {
      value += key.delta * (step(t + loopPeriod - key.time, key.config) - 1);
    }
  }

  return value;
}

export type Hex = `#${string}`;

const parseHex = (hex: Hex) => {
  const value = hex.replace("#", "");
  const v = value.length === 3
    ? value.split("").map((x) => x + x).join("")
    : value;
  return [
    Number.parseInt(v.slice(0, 2), 16),
    Number.parseInt(v.slice(2, 4), 16),
    Number.parseInt(v.slice(4, 6), 16),
  ] as const;
};

export function colorRetarget(
  t: number,
  initial: Hex,
  keys: readonly (readonly [time: number, value: Hex, config?: SpringConfig])[],
  fallback: SpringConfig = MORPH,
) {
  const from = parseHex(initial);
  const channels = [0, 1, 2].map((channel) =>
    retarget(
      t,
      from[channel],
      keys.map(([time, value, config]) => [time, parseHex(value)[channel], config] as const),
      fallback,
    ),
  );
  return `rgb(${channels.map((v) => Math.max(0, Math.min(255, Math.round(v)))).join(", ")})`;
}

export type VisibilityOptions = {
  enterDelay?: number;
  enterDuration?: number;
  exitDuration?: number;
  blur?: number;
};

const easeOut = (x: number) => 1 - Math.pow(1 - clamp01(x), 3);

export function layerVisibility(
  t: number,
  enterAt: number | null,
  exitAt: number | null,
  options: VisibilityOptions = {},
) {
  const {
    enterDelay = 0.07,
    enterDuration = 0.26,
    exitDuration = 0.12,
    blur = 12,
  } = options;

  const entering =
    enterAt == null ? 1 : easeOut((t - enterAt - enterDelay) / enterDuration);
  const exiting =
    exitAt == null ? 0 : easeOut((t - exitAt) / exitDuration);

  const opacity = entering * (1 - exiting);
  return {
    opacity,
    blur: (1 - entering) * blur + exiting * blur * 0.8,
    scale: (0.94 + 0.06 * entering) * (1 - 0.03 * exiting),
    visible: opacity > 0.002,
  };
}

export type EdgeKeys = {
  leading: readonly TimedKey[];
  trailing: readonly TimedKey[];
};

/**
 * A liquid indicator where the edge moving first uses FAST and the edge catching
 * up uses SLOW. Use for tabs, toggles, scrubbers, elastic selection bars.
 */
export function elasticEdges(
  t: number,
  initialLeading: number,
  initialTrailing: number,
  keys: EdgeKeys,
) {
  return {
    leading: retarget(t, initialLeading, keys.leading, FAST),
    trailing: retarget(t, initialTrailing, keys.trailing, SLOW),
  };
}

export function pressAmount(t: number, clicks: readonly number[], drags: readonly (readonly [number, number])[] = []) {
  const keys: TimedKey[] = [];
  const down: SpringConfig = {stiffness: 2025, damping: 90, mass: 1};
  const up: SpringConfig = {stiffness: 484, damping: 31.68, mass: 1};

  for (const click of clicks) {
    keys.push([click - 0.07, 1, down], [click + 0.035, 0, up]);
  }
  for (const [start, end] of drags) {
    keys.push([start - 0.04, 1, down], [end, 0, up]);
  }

  return retarget(t, 0, keys.sort((a, b) => a[0] - b[0]), MORPH);
}

export function crossTimes(
  fn: (t: number) => number,
  from: number,
  to: number,
  thresholds: readonly number[],
  precision = 0.001,
) {
  return thresholds.map((threshold) => {
    for (let time = from; time <= to; time += precision) {
      if (fn(time) >= threshold) return time;
    }
    return Number.POSITIVE_INFINITY;
  });
}

export function directDrag({
  t,
  start,
  end,
  cursorValue,
  releaseValue,
  restingValue,
  config = MORPH,
}: {
  t: number;
  start: number;
  end: number;
  cursorValue: (t: number) => number;
  releaseValue: number;
  restingValue: number;
  config?: SpringConfig;
}) {
  if (t < start) return restingValue;
  if (t <= end) return cursorValue(t);
  return releaseValue + (restingValue - releaseValue) * step(t - end, config);
}

export type MorphState = {
  w: number;
  h: number;
  r: number;
  bg: Hex;
  camera?: number;
};

export type MorphSequenceEntry = readonly [time: number, state: string, config?: SpringConfig];

export function morphGeometry({
  t,
  states,
  start,
  sequence,
  loopPeriod = 0,
}: {
  t: number;
  states: Record<string, MorphState>;
  start: string;
  sequence: readonly MorphSequenceEntry[];
  loopPeriod?: number;
}) {
  const initial = states[start];
  if (!initial) throw new Error(`Unknown morph start state: ${start}`);

  const numberKeys = (field: "w" | "h" | "r" | "camera") =>
    sequence.map(([time, name, config]) => {
      const state = states[name];
      if (!state) throw new Error(`Unknown morph state: ${name}`);
      const value = field === "camera" ? state.camera ?? 1 : state[field];
      return [time, value, config] as const;
    });

  const colors = sequence.map(([time, name, config]) => {
    const state = states[name];
    if (!state) throw new Error(`Unknown morph state: ${name}`);
    return [time, state.bg, config] as const;
  });

  return {
    width: retarget(t, initial.w, numberKeys("w"), MORPH, loopPeriod),
    height: retarget(t, initial.h, numberKeys("h"), MORPH, loopPeriod),
    radius: retarget(t, initial.r, numberKeys("r"), MORPH, loopPeriod),
    background: colorRetarget(t, initial.bg, colors, MORPH),
    camera: retarget(t, initial.camera ?? 1, numberKeys("camera"), CAMERA, loopPeriod),
  };
}
