# Background source system

## Purpose

Backgrounds should be **selected before they are invented**.

The goal is to stop the agent from improvising generic AI gradients or decorative surfaces when a strong ready-made background already exists.

## Priority

1. **Product background language**
   - existing app/site backgrounds;
   - real product textures;
   - brand grids, paper, patterns or surfaces;
   - previously approved film backgrounds.

2. **GoToDev Backgrounds**
   - primary fallback when the product does not define a suitable background;
   - browse/search the existing library first;
   - adapt the selected background instead of redrawing it.

3. **Bespoke background**
   - only when neither the product nor GoToDev has a suitable option;
   - record the reason in `videos/SOURCES.json`.

## GoToDev Backgrounds

Website:

- https://background.gotodev.ma/

Repository:

- https://github.com/ELMACHHOUNE/background-gotodev

License:

- MIT

The current library provides ready-made CSS/Tailwind backgrounds across categories such as gradients, geometric patterns, decorative patterns and effects.

### Fetch

```bash
node scripts/source-manager.mjs sync gotodev-backgrounds
```

### Search

```bash
node scripts/source-manager.mjs find "grid"
node scripts/source-manager.mjs find "paper"
node scripts/source-manager.mjs find "lines"
node scripts/source-manager.mjs find "geometric"
node scripts/source-manager.mjs find "gradient"
```

The upstream project stores pattern definitions in source data files, so inspect the actual implementation rather than recreating a screenshot.

## Allowed adaptation

Prefer changing only:

- product/brand colors;
- opacity;
- background scale;
- crop/position;
- pattern density;
- contrast behind foreground UI;
- deterministic, subtle frame-driven motion where the scene needs it.

Preserve the recognizable geometry of the selected pattern.

## Motion adaptation

A web background may be static upstream. That is fine.

If the film needs motion, animate the **presentation**, not the design:

- slow camera drift across the pattern;
- measured scale shift;
- deterministic mask reveal;
- line/path reveal if the source geometry supports it;
- parallax between existing layers;
- color-state transition within product tokens.

Do not add random particles, glows, floating blobs or unrelated gradients merely to make a static source "more cinematic".

## Selection discipline

Before choosing a background, identify the semantic role:

- neutral product canvas;
- ruled/paper/grid;
- technical grid;
- data/diagram field;
- subtle geometric texture;
- hero background;
- section transition;
- dark minimal;
- decorative accent.

Choose the closest existing pattern.

Do not choose a background only because it is visually impressive.

## Foreground readability

The background is subordinate to:

- product UI;
- Arabic/Latin text;
- numbers;
- cursor interactions;
- diagrams and charts.

If the background competes with foreground information:

1. reduce contrast;
2. reduce opacity;
3. increase pattern scale;
4. simplify/crop;
5. choose another pattern.

Do not blur the foreground to compensate for a noisy background.

## Anti-AI-default rule

Never default to:

- purple → blue → cyan gradients;
- neon radial glows;
- random mesh gradients;
- decorative blobs unrelated to product identity.

If a gradient is selected from GoToDev, it must support the scene and be recolored into the product/approved palette when necessary.

## Provenance

Record the selected background:

```bash
node scripts/source-manifest.mjs add \
  --id film-background \
  --source ELMACHHOUNE/background-gotodev \
  --path src/data/patterns.ts \
  --license MIT \
  --adaptation "selected existing pattern; recolored and driven deterministically in Remotion"
```

If no existing background fits and a bespoke one is necessary:

```bash
node scripts/source-manifest.mjs add \
  --id film-background \
  --bespoke \
  --reason "No product or GoToDev background matches the required visual/story role"
```
