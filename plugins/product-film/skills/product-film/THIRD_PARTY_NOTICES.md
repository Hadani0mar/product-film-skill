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
