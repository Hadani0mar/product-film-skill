# Source adaptation for deterministic film

## Principle

Preserve the **design**. Replace only implementation details that make frame-accurate rendering unreliable.

A beautiful web component may still be unsafe for Remotion if it depends on runtime clocks, RAF loops, CSS transitions, random values, pointer listeners, scroll position or browser lifecycle timing.

## Adapt, do not redraw

For a selected component:

1. record its upstream repository and path;
2. retain required copyright/license notices;
3. copy only the minimum source needed;
4. preserve DOM/SVG structure and visual classes where practical;
5. replace nondeterministic animation drivers with frame-driven props/helpers;
6. store reusable adaptations under a clearly attributed folder in the product's video code;
7. expose explicit current-state props suitable for a timeline.

Suggested header:

\`\`\`tsx
/**
 * Adapted for deterministic Remotion rendering.
 * Upstream: https://github.com/<owner>/<repo>/...
 * Source component: <path/name>
 * Upstream license: MIT
 * Visual structure retained; animation driver adapted to frame/progress control.
 */
\`\`\`

For React Bits, also respect its Commons Clause restriction: never publish a mirror or bundled copy of the component collection.

## Runtime animation → frame state

Do not rely on this for final render:

\`\`\`tsx
<motion.div animate={{scale: 1}} transition={{duration: 0.4}} />
\`\`\`

Drive the visual from Remotion time:

\`\`\`tsx
const frame = useCurrentFrame();
const progress = interpolate(frame, [start, end], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
});

<div style={{transform: \`scale(\${mix(0.92, 1, progress)})\`}} />
\`\`\`

Use Remotion \`spring()\` or a closed-form spring when spring behavior is part of the source design.

## Usually preserve

- markup hierarchy;
- SVG paths;
- radii;
- type choices;
- shadows;
- gradients that are part of the source visual;
- CSS variables/tokens;
- texture layers;
- layout proportions;
- signature effects.

## Usually adapt

- Motion/Framer Motion \`animate\` clocks;
- RAF loops;
- \`setTimeout\` / \`setInterval\`;
- CSS transitions/keyframes used as playback engines;
- \`Date.now()\` / \`performance.now()\`;
- unseeded randomness;
- pointer state when the film uses a scripted cursor;
- scroll/intersection observers;
- live resize-driven animation;
- browser-only playback state.

## Scripted interaction interface

Expose film state instead of waiting for real input:

\`\`\`tsx
type FilmControlProps = {
  hover: number;
  press: number;
  focus: number;
  label: string;
};
\`\`\`

For drags:

\`\`\`text
while pointerDown:
  value = map(cursorPosition)

after release:
  value = deterministic spring from the exact release value
\`\`\`

## WebGL / Canvas backgrounds

If an expressive source uses WebGL or Canvas:

- seed randomness;
- drive time from \`frame / fps\`;
- test arbitrary single-frame seeking;
- avoid internal RAF clocks;
- render at a deliberate internal resolution;
- use only one expensive expressive background per view;
- provide a deterministic fallback if the renderer cannot reproduce the effect.

## Wrapper pattern

\`\`\`text
sourced/adapted component
        ↓
FilmAdapter (frame-driven props)
        ↓
Scene composition
        ↓
camera / masks / cursor / morph / beat choreography
\`\`\`

Keep upstream styling intact; put cinematic invention around it.

## QA

Before approving a sourced component:

- seeking directly to any frame is stable;
- no motion depends on previously rendered frames;
- upstream/source attribution is recorded;
- license permits the chosen use;
- no hidden CSS transition causes timing drift;
- imported fonts/assets resolve;
- layout survives the film aspect ratio;
- text does not collide during morphs;
- the result is still recognizably the chosen source design;
- multiple libraries have not created a visually incoherent screen.
