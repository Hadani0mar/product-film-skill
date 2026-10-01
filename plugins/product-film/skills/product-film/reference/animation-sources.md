# Animation Sources: authority, community, and licensing roles

Use sources according to what they are good at. A large community does not automatically make a source safe to copy.

| Tier | Source | Best role | Agent behavior |
|---|---|---|---|
| S | Product's own UI/motion | truth + brand | always inspect first |
| S | Product Film shot recipes | narrative motion logic | native, preferred |
| S | Remotion official / Prompt Showcase | implementation + community product-film signal | use as primary Remotion reference |
| S | Motion examples | UI animation patterns + MotionScore | high-value reference, port to frame-driven Remotion |
| A | video-shotcraft | cinematic shot vocabulary + 2.5D/product film | technique/reference, license-aware |
| A | HyperFrames | kinetic type + fast motion-graphics grammar | technique/reference, Remotion remains master clock |
| A | Codrops | cutting-edge creative techniques | inspiration/reference; verify each demo before code reuse |
| A | Three.js examples | 3D/WebGL implementation | official technical reference |
| B | Motion Primitives / Magic UI / component registry | reusable UI motion/components | adapt only needed component |
| B | Rive Community | state-machine interaction ideas | reference or verified item reuse |
| B | LottieFiles | micro-animation/icon/status | verify individual license |
| C | CodePen | trend/community inspiration | reference-only by default |

## Why this order exists

The skill is a **product-film system**, not an animation sampler. Source priority therefore rewards:
- product fidelity;
- deterministic Remotion compatibility;
- strong curation;
- known licensing;
- evidence of real-world interest;
- implementation cost proportional to the shot.

## Community signal is not code permission

Keep these questions separate:
1. Is this pattern popular or admired?
2. Is the technique appropriate?
3. Is its code/asset reusable?
4. Can it be made deterministic in Remotion?

A "yes" to #1 does not imply #3.

## Search examples

```bash
node scripts/motion-search.mjs search "debt notification phone"
node scripts/motion-search.mjs search "card stack mobile alert"
node scripts/motion-search.mjs search "kinetic typography number"
node scripts/motion-search.mjs search "dashboard 2.5d camera"
node scripts/motion-search.mjs search "rgb lens transition"
```
