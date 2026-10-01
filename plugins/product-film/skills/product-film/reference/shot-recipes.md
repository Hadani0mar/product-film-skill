# Shot Recipe System

Use shot recipes as **motion vocabulary**, not templates to clone. A recipe defines the narrative job, staging, camera behavior, timing shape, transition carrier, failure modes, and implementation notes. Product design tokens and real UI always override generic styling.

## Selection rule

For each major scene, write down:
- narrative job;
- hero subject;
- chosen recipe family;
- energy level 1–5;
- camera behavior;
- transition-in carrier;
- transition-out carrier;
- hold/rest frames;
- source/reference if any.

Do not pick a recipe because it looks impressive. Pick it because its physical logic explains the product action.

## Recipe card schema

```text
id
name
family
job
best_for
avoid_when
hero
support
camera
motion_arc
timing
transition_in
transition_out
audio_cue
fx_budget
implementation
failure_modes
```

## Core recipe library

### Product / UI reveal
1. **Macro Push Reveal** — start wide enough to orient, then push toward one decisive UI control. Best for feature discovery.
2. **Window Cascade** — related product surfaces enter with slight depth offsets, then resolve into one hero window. Best for suite/workspace products.
3. **Spatial Dashboard Flythrough** — use a shallow 2.5D field of panels and a controlled camera path. Best for dense dashboards; never make every panel move independently.
4. **Focus Corridor** — foreground and background surfaces separate to create a visual tunnel toward the target action.
5. **Screen-to-Detail Match** — full screen crops into the exact component that becomes the next shot hero.
6. **Device-to-UI Dive** — dimensional device reveal that transitions into flat UI; use only when the device context matters.

### Continuity / morph
7. **Card-to-World** — a real product card expands into the next scene environment.
8. **Button-to-Outcome** — a button/action becomes the result surface, preserving object lineage.
9. **Shape Carry** — one brand/product geometry persists through 2–4 states.
10. **Typography-to-UI** — a keyword, number, or phrase becomes a UI surface or chart.
11. **Cursor-to-Camera** — a causal drag/click hands motion to the camera.
12. **Mask-from-Product** — transition mask originates from real product geometry.

### Data / proof
13. **Metric Lockup** — one metric earns the screen; supporting chart/data arrives only after the number reads.
14. **Chart Build & Settle** — chart animates from semantic origin, then holds long enough to understand.
15. **Before/After Split Resolve** — comparison starts divided and resolves to the improved state.
16. **Workflow Compression** — multiple steps collapse into one outcome to communicate saved effort.
17. **Signal Pulse** — one event travels through a graph/map/workflow and proves causality.

### Kinetic typography
18. **Semantic Word Punch** — animate phrase groups, not random characters; one emphasized word carries the beat.
19. **Type Track Expansion** — tracking/scale changes express acceleration or confidence.
20. **Text-to-Scene Handoff** — final word or glyph becomes the next scene's visual anchor.
21. **Counter Roll Resolve** — deterministic numeric roll that finishes before the shot cuts.

### Spatial / cinematic
22. **Orbit Hero** — shallow orbit around one object or UI plane; reserve for hero moments.
23. **Parallax Reveal** — layered context separates by depth while the hero remains readable.
24. **Depth Tunnel** — camera travels through aligned surfaces; keep geometry sparse.
25. **Controlled Whip** — one fast editorial move with a readable landing; never chain multiple whips.
26. **Macro Material Detail** — extremely close crop for texture, precision, or a premium product moment.

### Editorial transitions
27. **Match Cut** — same position/shape/value bridges shots.
28. **Directional Carry** — scene exits and next enters with one shared vector.
29. **Impact Cut** — short blur/light/distortion peak exactly on a structural cut.
30. **Quiet Cut** — deliberate hard cut after a hold; useful after a dense sequence.
31. **Foreground Wipe** — a real object crosses camera and hides the cut.
32. **Scale Portal** — a product surface grows past frame and reveals the next scene.

### Systems / flows
33. **Node Traveler** — one semantic token moves node-to-node through a graph.
34. **Decision Split** — branch reveals only after the decision node is understood.
35. **Grid Assembly** — elements arrive into a purposeful system, not decorative tiles.
36. **Pipeline Pass** — input enters, transforms through stages, exits as result.

## Energy discipline

Use an energy curve across the film:
- 1 = still/read/hold
- 2 = subtle UI motion
- 3 = normal feature choreography
- 4 = strong transition or hero interaction
- 5 = payoff/climax only

Do not sustain level 4–5. A premium film needs contrast and breathing room.

## Recipe originality rule

A final shot should combine:
```text
recipe logic
+ product truth
+ product geometry
+ brand tokens
+ current narrative job
+ current music/tempo
= original shot
```

Never recreate another project's house style, exact timing, composition, or asset arrangement unless the user explicitly owns/authorizes that source and the license permits it.

## Reference influence

This recipe-oriented workflow is informed by current open motion/video-agent practice, including the public Apache-2.0 projects video-shotcraft and HyperFrames. The recipes above are original abstractions written for this skill; do not copy upstream implementation code unless separately fetched, license-checked, and recorded in SOURCES.json.
