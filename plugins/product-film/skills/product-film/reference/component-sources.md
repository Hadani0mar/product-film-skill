# Component arsenal

## Purpose

Before inventing a button, card, form, background, loader, icon, animated text treatment or micro-interaction, search the approved component arsenal.

The sourced component is **raw design material**, not the final film. Preserve its visual identity, then direct it like a motion-graphics designer.

## Mandatory search order

1. Search the product's own components first.
2. Search any reusable film components already created in the project.
3. Read \`sources/registry.json\`.
4. Query by category with \`node scripts/source-manager.mjs list <category>\`.
5. Fetch only the relevant approved source with \`node scripts/source-manager.mjs sync <id>\`.
6. Search fetched code with \`node scripts/source-manager.mjs find "<term>"\`.
7. Choose the closest high-quality component and preserve its recognizable design.
8. Build a new component only if the arsenal genuinely has no suitable candidate.

Do not browse random component sites before checking the registry.

## Preserve the component

When reusing a component, keep as much of this as possible:

- geometry and layout proportions;
- spacing rhythm;
- border/radius treatment;
- typography character;
- SVG paths and icon language;
- texture, shadow and depth treatment;
- signature animation idea;
- interaction character.

Change only what the story needs:

- text and labels;
- product data;
- image/media content;
- dimensions needed for framing;
- theme tokens/accent color when necessary to match the product;
- deterministic animation driver for Remotion.

Do not take a beautiful source component and rebuild a generic imitation of it.

## Add creativity at scene level

Creativity should come from directing the component:

- object lineage into the next scene;
- camera pushes, pull-backs and reframes;
- masks and clipping geometry;
- cursor choreography;
- beat-synced state changes;
- typography handoffs;
- shape conservation;
- morphs between selected states;
- using one component's edge, knob, icon, card or image as the seed for the next scene.

The goal is **motion-graphics direction**, not a moving web page.

## Coherence rule

For one scene, prefer:

- one expressive source;
- one structural/primitives source if needed;
- one icon family.

Do not mix five UI libraries on one screen. Across a film, unify sources through the product's palette, typography, spacing and camera language.

## Source guide

### GoToDev Backgrounds
Primary ready-made background source when the product does not already define a suitable background language. MIT. Use it for geometric patterns, grids, decorative backgrounds, gradients and subtle effects. Search/select an existing pattern first, then adapt only product color, opacity, scale, crop and deterministic motion. See [backgrounds.md](backgrounds.md).


### React Bits
Best for expressive backgrounds, creative text, cursor effects, galleries, micro-interactions and hero moments.

**License restriction:** current upstream license is MIT + Commons Clause. Use it in applications/products, but do not redistribute its component collection as a library or mirror. Keep React Bits as a local fetched source under \`.motion-sources/react-bits\`; never bulk-copy it into this skill.

### Magic UI
Best for polished hero effects, animated borders, text treatments, backgrounds and modern launch-film surfaces. MIT.

### Motion Primitives
Best for tasteful motion building blocks, animated text, disclosure, layout motion and interaction patterns. MIT.

### Animate UI
Best for animated shadcn-style primitives, buttons, forms, navigation and animated icons. MIT.

### beUI
Agent-friendly motion component source. Check it before inventing toast stacks, animated cards or micro-interaction patterns. MIT.

### shadcn/ui
Default structural source for forms, cards, buttons, inputs, dialogs, tabs, tables and clean product UI. MIT.

### Radix Primitives
Use when the component needs strong accessible behavior for dialogs, popovers, sliders, tabs, toasts and forms. MIT.

### Kokonut UI
Use for stronger creative cards, buttons and modern visual surfaces when plain structural UI is too generic. MIT.

### Flowbite React
Useful for conventional dashboards, tables, navigation, forms and broad product UI. MIT.

### SVG Spinners
Use only when a standalone loader is semantically right. Prefer morphing existing scene geometry into a loading state when continuity matters. MIT.

### Phosphor Icons
Primary motion-graphics icon system when the product has no established icon family. MIT. It provides searchable catalog metadata, raw SVG assets, React components, and thin/light/regular/bold/fill/duotone weights. Search with `scripts/icon-search.mjs` instead of guessing icon names. See [icons.md](icons.md).

### Lucide
Preferred restrained UI icon family when the product already uses Lucide-like thin stroke icons. Keep stroke width coherent. ISC, with MIT terms for Feather-derived icons.

### Heroicons
Alternate coherent icon family when its filled/outline language matches the chosen UI better. MIT.

### Recharts
Use for chart structure and React/SVG composition. For cinematic reveals, replace live transitions with frame-driven drawing/clip progress. MIT.

### React Flow / xyflow
Primary source for node-based diagrams, mind maps, workflows, process maps, decision trees and node-to-node explainer scenes. Core package `@xyflow/react` is MIT. Use React Flow for graph structure, custom nodes, edges and layout geometry; drive all visible animation from Remotion time. Read [diagrams.md](diagrams.md). Do not assume React Flow Pro examples/assets are open-source.

## Quick commands

\`\`\`bash
node scripts/source-manager.mjs list
node scripts/source-manager.mjs list background
node scripts/source-manager.mjs info react-bits
node scripts/source-manager.mjs sync react-bits magic-ui motion-primitives
node scripts/source-manager.mjs find "button"
node scripts/source-manager.mjs find "background"
node scripts/source-manager.mjs find "login"
\`\`\`

Fetched repositories live in the current product repo's \`.motion-sources/\` directory and should stay gitignored.

## Selection shortcuts

- "background" → product background first; otherwise GoToDev Backgrounds. Use React Bits/Magic UI only when the background itself must be an expressive animated component.\n- "Dribbble / expressive / hero" → React Bits, Magic UI, Kokonut UI.
- "premium motion UI / micro interaction" → Motion Primitives, Animate UI, beUI.
- "login / signup / settings / form" → shadcn/ui + Radix; add only one expressive source if needed.
- "dashboard / admin / tables" → shadcn/ui or Flowbite React; Recharts for data.\n- "workflow / mind map / process diagram" → React Flow / xyflow for graph structure + product components for nodes + Remotion for motion.
- "loader / processing" → morph current geometry first; SVG Spinners second.
- "icons / SVG / diagram" → product icon family first; otherwise Phosphor for motion/expressive scenes, Lucide for restrained UI, Heroicons only as a coherent alternate.

## When building new is correct

Build an original component when:

- no approved source fits;
- the needed interaction is unique to the story;
- the component is a morph bridge between unrelated states;
- adapting upstream would take more code than a clean original;
- deterministic video constraints make upstream architecture impractical.

Reusable original components should be kept for later films.
