# FX Arsenal: cinematic tools with discipline

Effects are a layer of direction, not the direction itself.

## Preferred stack

### Remotion-native / deterministic first
Use Remotion-native effects and transitions whenever they satisfy the shot. They are easier to keep frame-accurate, previewable and reproducible.

Good families:
- blur / zoom blur / progressive blur
- chromatic aberration
- pixel dissolve / pixelation
- noise displacement
- light trails / light leaks / shine
- glow
- halftone / scanlines / roughen edges
- fisheye / barrel distortion / wave
- TV/analog signal treatments

### Paper Shaders
Use for premium procedural backgrounds, mesh gradients, fluid surfaces and shader-driven fields when the product/campaign benefits from a synthetic visual environment.

Drive time/uniforms from Remotion frame time. Never depend on wall-clock animation.

### GL Transitions
Use as a transition library when continuity cannot be achieved with a product object, camera, mask or typography handoff.

Treat them as raw transition techniques, not styles to copy blindly.

### React Three Fiber + React Postprocessing
Use for real 3D/2.5D shots: device/product reveals, dimensional UI stacks, spatial camera work, lighting, depth of field, bloom, god rays and lens treatments.

Do not introduce 3D for a film that is conceptually stronger in flat product UI.

### PixiJS Filters
Useful for raster/video/image treatments such as RGB split, CRT, old-film, shockwave, twist, bulge/pinch, motion blur and zoom blur.

## Effect families and jobs

| Family | Use it for |
|---|---|
| Blur | speed, focus shifts, depth, transition masking |
| Motion/echo/light trails | velocity, continuity, luminous travel |
| Distortion/displacement | transformation, energy, state change |
| Chromatic/RGB split | short digital impact, never constant decoration |
| Glow/bloom | luminous hierarchy, emissive surfaces, payoff moments |
| Grain/noise/dither | material cohesion and texture |
| Halftone/paper/roughen | editorial/print art direction |
| CRT/scanline/VHS | intentional retro/technical language |
| Liquid/metaball/fluid | merging states, soft continuity, organic transitions |
| Lens/fisheye/barrel | optical emphasis or camera language |
| Pixel dissolve | digital construction/destruction, scene handoff |
| Light leak/flare | photographic atmosphere or reveal |
| 3D post FX | depth, focus, spatial hierarchy |

## Intensity budget

Use an intensity hierarchy:

- **Level 0:** no visible effect; pure product
- **Level 1:** subtle texture/depth
- **Level 2:** visible treatment supporting action
- **Level 3:** hero transition or payoff
- **Level 4:** rare climax only

Most of the film should live at 0–2. If every scene is level 3, nothing feels special.

## Determinism contract

For every visual effect:

- visible state must be a pure function of `frame`, `fps`, props and static assets
- seed all noise/randomness
- no `Date.now()`
- no uncontrolled `requestAnimationFrame`
- no CSS keyframes that run independently
- no library-internal timer deciding the final image
- if necessary, build a frame-driven twin/wrapper

## Performance contract

Before production render:

- smoke-test the effect at first/middle/last frames
- test handoff frames around transitions
- profile expensive WebGL/canvas/backdrop-filter scenes
- use lower-cost preview settings
- reserve expensive effects for shots that earn them
- verify final output for color-range changes and dropped/blank frames

## Selection rule

Choose effects by sentence:

> “This effect helps the viewer understand/feel ___ because ___.”

If that sentence is weak, do not use the effect.
