export type SafeActOptions = {
  preRoll?: number;
  postRoll?: number;
  holdThroughEnd?: boolean;
};

export type SafeActState = {
  active: boolean;
  animationTime: number;
  sceneTime: number;
  timelineTime: number;
};

/**
 * Mount an act before its editorial boundary so the handoff frame is not its
 * first transparent/half-entered frame. With the default pre-roll, an entrance
 * has already advanced 0.32 s when the editorial boundary arrives.
 */
export function safeActWindow(
  t: number,
  start: number,
  end: number,
  options: SafeActOptions = {},
): SafeActState {
  const preRoll = Math.max(0, options.preRoll ?? 0.32);
  const postRoll = Math.max(0, options.postRoll ?? 0.12);
  const renderStart = Math.max(0, start - preRoll);
  const renderEnd = options.holdThroughEnd ? Number.POSITIVE_INFINITY : end + postRoll;
  const active = t >= renderStart && t <= renderEnd;
  const duration = Math.max(0, end - start);

  return {
    active,
    animationTime: Math.max(0, t - renderStart),
    sceneTime: Math.max(0, Math.min(duration, t - start)),
    timelineTime: t,
  };
}
