import React from "react";
import {
  layerVisibility,
  morphGeometry,
  pressAmount,
  type MorphSequenceEntry,
  type MorphState,
  type VisibilityOptions,
} from "./morph";

export type MorphLayer = {
  id: string;
  enterAt: number | null;
  exitAt: number | null;
  options?: VisibilityOptions;
  render: React.ReactNode;
};

export function MorphSurface({
  t,
  states,
  start,
  sequence,
  layers = [],
  clicks = [],
  drags = [],
  loopPeriod = 0,
  className,
  style,
}: {
  t: number;
  states: Record<string, MorphState>;
  start: string;
  sequence: readonly MorphSequenceEntry[];
  layers?: readonly MorphLayer[];
  clicks?: readonly number[];
  drags?: readonly (readonly [number, number])[];
  loopPeriod?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const geometry = morphGeometry({t, states, start, sequence, loopPeriod});
  const press = pressAmount(t, clicks, drags);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: geometry.width,
        height: geometry.height,
        borderRadius: Math.min(geometry.radius, geometry.width / 2, geometry.height / 2),
        background: geometry.background,
        overflow: "hidden",
        transform: `scale(${1 - press * 0.035})`,
        transformOrigin: "50% 50%",
        ...style,
      }}
    >
      {layers.map((layer) => {
        const v = layerVisibility(t, layer.enterAt, layer.exitAt, layer.options);
        if (!v.visible) return null;
        return (
          <div
            key={layer.id}
            style={{
              position: "absolute",
              inset: 0,
              opacity: v.opacity,
              filter: v.blur > 0.05 ? `blur(${v.blur}px)` : undefined,
              transform: `scale(${v.scale})`,
              transformOrigin: "50% 50%",
            }}
          >
            {layer.render}
          </div>
        );
      })}
    </div>
  );
}
