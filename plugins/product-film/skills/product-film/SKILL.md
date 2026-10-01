---
name: product-film
description: Direct and make a showreel-grade product film (landing-page loop, launch video, promo, demo reel, social cut) in code with Remotion, built on the product's own design system, components and voice. Use when someone asks for a product video, landing video, promo, launch film, explainer or "motion design video" for their app, SaaS or codebase. It asks what to include, then covers design discovery, story, music sync, transitions, review loops and a verified final render.
---

# Product film

A film that looks like the product made it: its colors, type, components, logo and voice, cut to music. Built in Remotion inside (or beside) the product's codebase, so it reuses real components and stays editable.

## Non-negotiables

- **Their design wins.** Every rule comes from the product: its tokens, components, rules files, landing page and copy. Never carry another product's taste in, including anything in this skill that their design contradicts.
- **Ask, don't assume.** What the film shows and how it is made are the user's call. Interview them before writing the story ([reference/interview.md](reference/interview.md)). Offer options drawn from what you found in their code, never generic ones.
- **Every frame is a pure function of time.** No CSS transitions or keyframes, no timers, no `Date.now()`, no state carried between frames. A component that runs its own clock gets a frame-driven twin.
- **Source before inventing.** Before creating buttons, cards, forms, backgrounds, loaders, icons or animated UI, search the approved component arsenal in [reference/component-sources.md](reference/component-sources.md). Preserve the chosen component's visual identity; adapt only content, fit, product tokens and the animation driver needed for deterministic Remotion rendering. Read [reference/source-adaptation.md](reference/source-adaptation.md) before adapting runtime-animated components.
- **Select backgrounds before inventing them.** Preserve the product's own background language first. If none fits, read [reference/backgrounds.md](reference/backgrounds.md), search GoToDev Backgrounds through the source registry, and adapt an existing pattern before creating a bespoke background.
- **Search icons, do not guess them.** Preserve the product's own icon family when it has one. Otherwise read [reference/icons.md](reference/icons.md) and search the Phosphor catalog with `scripts/icon-search.mjs`. Use one coherent icon family per scene and animate icons as semantic travelers, not decoration.
- **Search real brands, do not redraw them from memory.** When a shot explicitly mentions or visually represents an external company, app, platform, integration, provider, partner or competitor, read [reference/brand-logos.md](reference/brand-logos.md) and search DBLogo with `scripts/brand-logo-search.mjs`. Product/user-supplied assets win first. Prefer SVG, select the correct logo/icon/wordmark and light/dark variant, record the source, preserve the mark, and follow the brand owner's official usage rules.
- **Use a graph system for graph stories.** For mind maps, workflows, process diagrams, decision trees, architectures and node-to-node explainers, read [reference/diagrams.md](reference/diagrams.md) and use React Flow / xyflow for graph structure instead of manually improvising unrelated boxes and lines. Animation remains deterministic in Remotion.
- **Reference before improvising a major scene.** Read [reference/example-library.md](reference/example-library.md) and search `sources/example-registry.json` with `scripts/example-search.mjs`. Use 1 primary example and at most 1–2 secondary references. Extract techniques, not house styles. Code reuse is allowed only when the registry marks a verified permissive license; gallery examples remain reference-only until their reuse terms are verified.
- **Search Motion Intelligence before inventing a major animation.** Read [reference/motion-intelligence.md](reference/motion-intelligence.md), [reference/animation-sources.md](reference/animation-sources.md) and [reference/popularity-ranking.md](reference/popularity-ranking.md). Query `scripts/motion-search.mjs` using the shot's actual job (for example `debt notification phone`, `kinetic typography launch`, or `3d hero orbit`). Treat popularity as evidence, not an instruction: product truth, narrative clarity, licensing, Remotion fit and implementation cost still decide.
- **Think like a motion-graphics director, not a template assembler.** Read [reference/motion-director.md](reference/motion-director.md) before story work. Start from communication intent, audience, platform and product truth; build a visual concept, hierarchy, shot language, pacing and continuity before choosing effects. A sourced component is an actor, not a finished scene.
- **Effects must have a job.** Read [reference/fx-arsenal.md](reference/fx-arsenal.md). Use shaders, blur, distortion, trails, glow, analog texture and 3D only when they improve hierarchy, continuity, impact, atmosphere, materiality or transition logic. Never add an effect merely because it looks impressive.
- **Plan major shots from recipes, not vibes.** Read [reference/shot-recipes.md](reference/shot-recipes.md). Assign every major scene a narrative job, hero, recipe family, energy level, camera behavior, transition carrier and hold. Recipes are motion logic—not house styles to clone.
- **Use production gates.** Read [reference/production-pipeline.md](reference/production-pipeline.md). Do not build the whole film until product truth, direction, shot architecture and representative style/motion proofs pass.
- **Choose a motion grammar deliberately.** Read [reference/motion-grammar.md](reference/motion-grammar.md) and [reference/one-shape-motion.md](reference/one-shape-motion.md). Use 2–4 recurring behaviors across the film, then choose per scene: real component, one-shape, or hybrid. Prefer the React/Remotion `MorphSurface` kit over a second browser clock.
- **Measure, never guess.** Beats come from the audio, positions from the DOM (debug overlay), colors from decoded pixels of the final files.
- **Preflight before expensive work.** A long render never starts until TypeScript, composition discovery, public assets, browser availability and scene smoke stills pass. Use `scripts/preflight.mjs` and `scripts/smoke-stills.ts`.
- **Finite and loop are different contracts.** Decide the delivery mode before rendering. A finite ad may end on a distinct closing frame; only a loop must match its last frame to frame 0. Silent delivery is first-class.
- **Honest claims.** Show only what the product really does. Find its claims rules and approved lines before writing a word.
- **Ask first** before committing, pushing or publishing. Keep every rendered version (`out/<film>/v1`, `v2`, ...).

## Workflow

1. **Quick discovery.** If a product repo/site is available, inspect enough to ask intelligent questions: rules files, tokens, components, logo, landing page, strongest features and actual product claims. If there is no codebase, request one or more of: product website URL, screenshots/images, screen recording, logo/brand files, or a concise product description. See [reference/discovery.md](reference/discovery.md).
2. **Creative brief interview.** Gather the minimum needed to direct the film: source material (website/screenshots/description), what the product does, the campaign objective, target audience, platform/format, duration, mandatory features/claims and audio preference. Do not interrogate the user when the answers are already present. See [reference/interview.md](reference/interview.md).
3. **Brand kit → `videos/BRAND.md`.** Finish discovery on what they chose and fill [templates/BRAND.md](templates/BRAND.md).
4. **Creative direction + story → `videos/<film>-prompt.md`.** Read [reference/motion-director.md](reference/motion-director.md), [reference/motion-grammar.md](reference/motion-grammar.md), [reference/story.md](reference/story.md) and [reference/ingredients.md](reference/ingredients.md). Define the one-sentence concept, visual metaphor, motion grammar, camera grammar, typography behavior, transition logic, pacing curve and closing payoff before coding. Then fill [templates/film-prompt.md](templates/film-prompt.md). Checkpoint with the user: beat sheet and 3 style frames.
5. **Music.** Skip if the film is silent. See [reference/music.md](reference/music.md): `scripts/beats.py`, the per-bar stem map, `scripts/audio-edit.py`, SFX on measured peaks.
6. **Shot architecture + examples + component arsenal + FX + engine.** First read [reference/shot-recipes.md](reference/shot-recipes.md) and create `videos/shot-plan.json` from [templates/shot-plan.example.json](templates/shot-plan.example.json). Then read [reference/motion-intelligence.md](reference/motion-intelligence.md), [reference/animation-sources.md](reference/animation-sources.md), [reference/popularity-ranking.md](reference/popularity-ranking.md), [reference/example-library.md](reference/example-library.md), [reference/component-sources.md](reference/component-sources.md), [reference/backgrounds.md](reference/backgrounds.md), [reference/diagrams.md](reference/diagrams.md), [reference/icons.md](reference/icons.md), [reference/brand-logos.md](reference/brand-logos.md), [reference/source-adaptation.md](reference/source-adaptation.md), [reference/motion-grammar.md](reference/motion-grammar.md), [reference/one-shape-motion.md](reference/one-shape-motion.md), [reference/fx-arsenal.md](reference/fx-arsenal.md), [reference/production-pipeline.md](reference/production-pipeline.md) and [reference/engine.md](reference/engine.md).
   - For every major scene, record narrative job, hero, recipe, energy level, camera, transition-in/out and hold in `shot-plan.json`; then run `node scripts/motion-search.mjs search "<shot job>"`, inspect the strongest 2–4 candidates, search the Example Library, and record the chosen technique/reference before coding.
   - Search the product's real components first.\n   - Search product backgrounds before selecting GoToDev; if no suitable background exists, use `source-manager.mjs sync gotodev-backgrounds` and search its patterns before creating a bespoke one.\n   - If a needed UI/motion element is missing, query `sources/registry.json` and fetch only the relevant approved source with `scripts/source-manager.mjs`.
   - Preserve sourced visual identity; convert only nondeterministic runtime motion to frame-driven state.
   - Start `videos/SOURCES.json` with `scripts/source-manifest.mjs` and record every sourced/adapted/bespoke component, license, upstream path and deterministic twin.
   - Choose per scene: component, one-shape, or hybrid. For one-shape/hybrid sequences, use `templates/kit/morph.ts` + `MorphSurface.tsx`; pick a visible traveler from the sourced component and carry it into the next state.
   - Combine references instead of cloning one: `motion-intelligence candidate + example technique + sourced component + product truth + product brand + motion grammar = original scene`.
   - If a popular external pattern loses to a simpler internal recipe because it is clearer, cheaper, safer, or more faithful to the product, choose the internal recipe.
   - Copy [templates/kit/](templates/kit/) into `videos/src/kit/`.
   - One folder per film: `cues.ts` (the beat sheet as data), `layout.ts`, `acts/`, the composition.
7. **Production gates + preflight + review loop.** Follow [reference/production-pipeline.md](reference/production-pipeline.md), then [reference/review.md](reference/review.md). Prove the hardest 1–2 shots before assembling the entire film.
   - Run `node scripts/preflight.mjs --composition <Id>`; add `--ensure-browser` before the final long render.
   - Maintain `scene-map.json` and run `node --import tsx scripts/smoke-stills.ts --map scene-map.json` for first/middle/last + every handoff window.
   - Use `node --import tsx scripts/stills.ts` for targeted/debug frames.
   - Render the fast preview profile before production. Fix, repeat, and show the user frames as you go.
8. **Final render, verify, deliver.** See [reference/render.md](reference/render.md). Configure the real composition/duration/mode, generate package scripts with `scripts/configure-render.mjs`, render with `scripts/render.ts`, then verify with `scripts/verify.py --mode finite|loop --audio none|required|any`.

## Quality floor (always, whatever the ingredients)

- **Only the product's own surfaces, colors, borders and shades.** Never invent card backgrounds, outlines or tints it does not use.
- **Readable at the delivery size.** Fewer words beat smaller words. Cut labels that restate the picture.
- **Text is never covered** by a cursor, a chip or a texture. It never crosses other text in a move. A line never re-centers while it builds: keep every word's slot.
- **Loading states keep their width.** Use the product's own loading pattern.
- **Rhythm has contrast.** Do not force motion on every beat. Primary beats carry structural events, secondary beats carry support motion, and deliberate holds/rests are required for comprehension.
- **Scene boundaries land on bars.** Pre-roll scene mounting with `safeActWindow()` and smoke-test pre/at/post handoff frames. Only a loop's last frame must equal its first; a finite ad holds a stable close.
- **No gratuitous effects.** Decorative shaders, glows, particles, RGB split, glitch, lens effects and distortion are opt-in tools, not defaults. They are allowed when the concept, product language or transition logic earns them; keep intensity subordinate to readability and brand truth.
- **Sourced-component fidelity.** If a component was selected because its design is strong, do not redraw it as a generic substitute. Keep its signature geometry/effect and change only what the film/product needs.
- **One hero event at a time.** At most two supporting motions may compete with it; if three focal animations run independently, simplify.
- **Energy must breathe.** Level 4–5 motion is reserved for structural transitions and payoff moments; most of the film should live at levels 1–3.

## Traps that cost real time

- Remotion stills do not forward console logs. Print measurements into the frame (`templates/kit/debug.tsx`).
- `npx remotion still` re-bundles on every call. Use `node --import tsx scripts/stills.ts`: bundle once, render many frames. Prefer `node --import tsx` over the tsx CLI in restricted sandboxes.
- Remotion's bundled ffmpeg has no `tmix`, `select` or `tile`. Use a full ffmpeg (`uv run --with imageio-ffmpeg`).
- **Color range:** the Remotion master is limited range, BT.601, untagged. Blending it as full range lifts `#0a0a0a` to `#171717`, a gray box on a dark page. Decode frame 0 of every deliverable and check the numbers.
- `interpolateColors` cannot parse `color-mix()`. Any color that animates is a hex token.
- Async image components (Radix or base-ui avatars) can render empty in a frame. Twin them with Remotion `<Img>`. Public assets use `staticFile("...")`; do not rely on root URLs for render-critical media.
- Springs that retarget: sum one closed-form step per key, with keys sorted by time.
- CSS dashed borders crawl while a box resizes. Draw dashes as SVG strokes at a fixed pitch.
- WebGL/shader effects must be deterministic. Prefer libraries or wrappers whose uniforms can be driven from `frame/fps`; never allow an internal real-time clock to decide rendered pixels.
- `backdrop-filter` can multiply long-render cost in Headless Chrome. Treat it as opt-in; prefer translucent fills, borders and shadows when visually equivalent.
- Production renders write `progress.json` and `render-manifest.json`; preserve them and intermediates on failure.
- In a monorepo:
  - pin every `remotion` and `@remotion/*` to one exact version
  - never let the video workspace re-resolve the app's Tailwind
  - alias the app's path imports in the webpack override
- Stop only the processes you started; other sessions may be waiting on the machine.
