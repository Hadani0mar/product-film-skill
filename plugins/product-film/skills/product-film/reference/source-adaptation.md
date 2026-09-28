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


## Public assets in Remotion

Files under `public/` must be referenced explicitly with Remotion `staticFile()` and rendered with Remotion-aware media components when appropriate.

Prefer:

```tsx
import {Img, staticFile} from "remotion";

<Img src={staticFile("product/logo.png")} />
```

Do not rely on a browser-root path such as `src="/product/logo.png"` for render-critical assets. It may work in an app dev server and fail in the renderer with a 404 or decode error.

`scripts/preflight.mjs` validates literal `staticFile("...")` references against `public/` and warns about root-path image sources.

## Source provenance is required

Create the film's manifest during discovery:

```bash
node scripts/source-manifest.mjs init
```

Record sourced/adapted components:

```bash
node scripts/source-manifest.mjs add \
  --id notification-card \
  --source shadcn-ui/ui \
  --path apps/v4/registry/new-york-v4/ui/card.tsx \
  --license MIT \
  --adaptation "animation clock replaced by frame-driven props" \
  --twin
```

If no approved source fits and a bespoke component is necessary:

```bash
node scripts/source-manifest.mjs add \
  --id debt-morph-bridge \
  --bespoke \
  --reason "No arsenal component preserves the required card→status-island lineage"
```

Validate before final review:

```bash
node scripts/source-manifest.mjs validate
```

A generic bespoke component without a recorded reason is a review warning.
