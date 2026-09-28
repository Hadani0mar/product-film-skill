# Icon system — Phosphor + Lucide

## Policy

1. Use the product's own icon family first.
2. If the product has no established icon family, use **Phosphor Icons** as the primary motion-graphics icon library.
3. Use **Lucide** when the surrounding product already uses a restrained thin-stroke UI language.
4. Use one coherent icon family per scene. Do not mix icon sets casually.

## Why Phosphor

Phosphor is MIT licensed and provides React components, raw SVG assets, searchable catalog metadata, tags, categories and multiple visual weights:

- thin
- light
- regular
- bold
- fill
- duotone

Upstream repositories:

- https://github.com/phosphor-icons/core
- https://github.com/phosphor-icons/react

Packages:

- `@phosphor-icons/core`
- `@phosphor-icons/react`

## Install

Use the film workspace package manager, or run:

```bash
node scripts/icon-search.mjs ensure
```

Manual examples:

```bash
npm install @phosphor-icons/react @phosphor-icons/core
pnpm add @phosphor-icons/react @phosphor-icons/core
bun add @phosphor-icons/react @phosphor-icons/core
```

## Search before choosing

Do not guess icon names. Search the Phosphor catalog:

```bash
node scripts/icon-search.mjs search database
node scripts/icon-search.mjs search "debt notification"
node scripts/icon-search.mjs search delivery
node scripts/icon-search.mjs search security --limit 8
```

The search scores icon name, tags and categories and prints a direct React import suggestion.

## React usage

Prefer direct per-icon imports in video projects so the bundler does not need to process the whole export surface.

```tsx
import {BellSimpleIcon} from "@phosphor-icons/react/dist/csr/BellSimple";

<BellSimpleIcon size={56} color="#0B0B0B" weight="regular" />
```

## Weight guidance

- `thin` / `light`: editorial, elegant, large-scale compositions.
- `regular`: default product UI.
- `bold`: emphasis, CTA, success/failure states.
- `fill`: selected/active/confirmed states.
- `duotone`: hero moments and explanatory motion graphics; use sparingly.

Do not randomly mix weights on adjacent icons. Weight changes should have semantic meaning.

## Motion rules

Icons are semantic actors, not stickers.

Good patterns:

- stroke draw-on;
- masked reveal;
- scale settle on state entry;
- regular → fill for selected/confirmed state;
- icon container morphing into the next UI surface;
- icon becoming a chart marker, button glyph, badge or status dot;
- duotone secondary layer appearing as a progress/reveal cue.

Avoid:

- random spinning;
- generic bounce;
- every icon animating at once;
- mixing Phosphor, Lucide and Heroicons in one control group;
- assuming unrelated SVG paths can be interpolated directly.

## Deterministic Remotion usage

Drive all icon animation from time/frame.

```tsx
const p = step(t - cue.iconIn, SOFT);

<BellSimpleIcon
  size={64}
  weight="regular"
  style={{
    opacity: p,
    transform: `scale(${0.88 + p * 0.12})`,
  }}
/>
```

For weight changes where SVG geometry differs, use independent layers rather than assuming path compatibility:

```tsx
<div style={{position: "relative"}}>
  <BellSimpleIcon weight="regular" style={{position: "absolute", opacity: 1 - selected}} />
  <BellSimpleIcon weight="fill" style={{position: "absolute", opacity: selected}} />
</div>
```

## Icons as travelers

For premium motion, the icon often lives inside a persistent surface:

```text
Bell
 ↓
notification badge
 ↓
toast
 ↓
debt card
 ↓
dashboard panel
```

or:

```text
Database icon
 ↓
icon container expands
 ↓
database card
 ↓
rows become chart bars
 ↓
chart collapses into insight chip
```

The icon should participate in object lineage rather than appear as isolated decoration.

## Raw SVG assets

`@phosphor-icons/core` exposes SVG assets by weight. Use raw SVGs when path-level stroke animation, clipping, custom masks or filters are required. For normal UI, prefer React components.

## QA

- product icon family wins when one exists;
- one icon family per scene;
- consistent size and weight;
- optical alignment, not only numeric centering;
- crisp rendering under camera scale;
- no clipping during draw-on;
- deterministic animation;
- icon choice comes from catalog search rather than guesswork.