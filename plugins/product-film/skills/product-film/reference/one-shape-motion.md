# One-shape motion grammar

This skill uses two compatible motion layers:

1. **Remotion composition layer** — long-form film, real React product components, audio, assets, timelines, render/verification.
2. **One-shape grammar** — a continuous surface that changes geometry and content instead of cutting between disconnected screens.

The one-shape grammar is inspired by the MIT-licensed `motion-broll` engine from [Barty-Bart/motion-graphics](https://github.com/Barty-Bart/motion-graphics). We keep our implementation native to React/TypeScript/Remotion.

## Why combine them

The Barty engine is excellent at short deterministic morphs:

```text
pill → card → terminal → chart → toast
```

Our product-film stack is better at:

```text
real app components
+ product design tokens
+ long scenes
+ media/audio
+ reusable React composition
+ final-film QA
```

Combined:

```text
SOURCE COMPONENT
    ↓
MorphSurface / component twin
    ↓
object lineage
    ↓
camera + cursor
    ↓
Remotion scene
    ↓
long-form composition
```

## Choose a scene mode

### A. Component scene

Use when the shot should show the product truthfully:

- real dashboard;
- real login form;
- real chart;
- real navigation;
- actual cards and tables;
- sourced React Bits / Magic UI / shadcn component.

Keep the component visually recognizable and animate its props from time.

### B. One-shape scene

Use when continuity is more important than literal UI structure:

- button → loader → success;
- toggle → tab indicator → chart marker;
- photo tile → glass toolbar;
- status island → order tracker;
- OTP cells → success card;
- cursor-controlled morph sequences.

Use `MorphSurface` and the helpers in `templates/kit/morph.ts`.

### C. Hybrid scene

This is the preferred mode for premium product films.

Example:

```text
React Bits hero card
   ↓ its rounded surface becomes MorphSurface
loader
   ↓
OTP
   ↓
success
   ↓ same surface grows
real application dashboard
```

The viewer should feel that the product UI itself is transforming, not that scenes are being swapped.

## Core rules

### One body, many identities

Maintain one dominant geometric surface whenever possible. Give it named states:

```ts
const states = {
  button: {w: 320, h: 88, r: 44, bg: "#0B0B0B"},
  card:   {w: 780, h: 520, r: 38, bg: "#FFFFFF"},
  island: {w: 430, h: 110, r: 55, bg: "#0B0B0B"},
};
```

Then sequence them:

```ts
const sequence = [
  [2.0, "card"],
  [5.0, "island"],
] as const;
```

### Content gets its own timing

Geometry and content do not share one opacity.

Old content exits first; new content arrives after a small delay.

Use `layerVisibility()` or `MorphSurface.layers`.

### Retargets are sums of spring steps

Never integrate velocity frame-to-frame. A property that receives multiple targets must remain a pure function of time.

Use `retarget()`.

### Liquid edges

For toggles, tabs, selection bars and scrubbers, animate leading and trailing edges separately.

Use:

- FAST for the leading edge;
- SLOW for the trailing edge.

This creates stretch without gooey cartoon bounce.

### Direct manipulation

During a drag, derive the controlled value directly from scripted cursor position. On release, spring from the exact released value.

Use `directDrag()`.

### Camera is not a transition preset

Camera motion should focus attention on the current state. A state can expose an intended camera scale, but the film's camera rig remains authoritative.

### Cursor stays screen-stable

The scene can zoom in world space while the cursor remains readable in screen space. Use the existing kit cursor/camera projection rather than nesting the cursor inside a scaled surface.

## Mapping sourced components into the grammar

Do not flatten every sourced component into a generic rounded rectangle.

Pick a **traveler**:

- the card shell;
- a button body;
- avatar circle;
- image tile;
- tab indicator;
- slider knob;
- toast pill;
- chart dot;
- icon container.

That traveler becomes the one-shape surface between scenes.

Example:

```text
Magic UI card border
  → compresses into button
  → button body becomes loader ring
  → ring splits into OTP cells
  → cells merge into check
  → check circle expands into real shadcn dashboard card
```

The sourced design remains visible before and after the morph.

## Barty engine as a reference source

The source registry includes `barty-motion-graphics` for examples and algorithms. Fetch locally when a one-shape sequence needs inspiration:

```bash
node scripts/source-manager.mjs sync barty-motion-graphics
node scripts/source-manager.mjs find "M.scene"
node scripts/source-manager.mjs find "Direct manipulation"
```

Do not import its browser `motion.js` directly into a Remotion React composition. Prefer our TypeScript kit so there is one timing model.

## B-roll mode

If the user gives a talking-head video + transcript and wants timed cutaways or transparent panels, the upstream `motion-broll` skill is itself a strong specialized workflow.

For product-film projects, borrow these ideas:

- inspect video layout before placing overlays;
- decide full-frame vs transparent panel per line;
- time changes to spoken words;
- render transparent ProRes 4444 panels;
- produce comparison/viewer pages for review.

Do not force product-film into B-roll mode unless the source footage actually needs it.

## Quality test

A successful hybrid scene should pass all:

- the main object has a traceable identity across states;
- no full-screen crossfade is doing the real transition;
- the original sourced component is still recognizable;
- scene motion can seek directly to arbitrary frames;
- no CSS/runtime animation clock controls final output;
- the cursor causes interactions rather than wandering decoratively;
- the camera has a reason for every move;
- one visual language dominates the scene.
