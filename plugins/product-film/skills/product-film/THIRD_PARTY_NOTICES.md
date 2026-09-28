# Third-party notices

This repository contains original work plus adaptations and references to permissively licensed open-source projects.

## Barty-Bart/motion-graphics

- Repository: https://github.com/Barty-Bart/motion-graphics
- License: MIT
- Copyright: Copyright (c) 2026 Bart

The deterministic one-shape motion grammar, including the idea of retargetable closed-form spring tracks, independent content visibility timing, leading/trailing edge springs, and direct manipulation helpers, is informed by the upstream `motion-broll` engine.

Our implementation in `templates/kit/morph.ts` and `templates/kit/MorphSurface.tsx` is a TypeScript/React/Remotion adaptation designed to interoperate with this skill's existing kit and component-source workflow.

The upstream project also contains Geist/Geist Mono fonts under the SIL Open Font License and icon paths adapted from Lucide under ISC. We do not vendor those font files here.

## Component sources

See `sources/registry.json` and `reference/component-sources.md` for the current source list and license notes. Always preserve required notices when copying substantial portions of third-party source into a product film project.

## Phosphor Icons

- Core: https://github.com/phosphor-icons/core
- React: https://github.com/phosphor-icons/react
- License: MIT

Used as the preferred searchable icon system for motion-graphics scenes when the product does not already define an icon family. The skill does not vendor the entire icon pack; target projects install the official packages and retain their upstream license terms.


## Motion Example Library references

The Motion Example Library indexes external projects for technique discovery. Indexed code is not vendored into this repository.

Verified permissive references currently include:

- EveryInc/product-launch-video — MIT
- Alexwtlf/agentic-product-demo — MIT
- specstoryai/zero-to-product-video-hero — MIT
- lifeprompt-team/remotion-scenes — MIT
- iart-ai/motion-skills — MIT
- AbubakrChan/product-launch-motion — MIT
- Barty-Bart/motion-graphics — MIT

When substantial code is adapted into a downstream film project, preserve the applicable upstream copyright and license notice.

Remotion Prompt Showcase and Remotion Lab entries are indexed as visual/reference material only until the reuse terms for the specific item are verified. Their presence in the registry does not grant code-reuse rights.
