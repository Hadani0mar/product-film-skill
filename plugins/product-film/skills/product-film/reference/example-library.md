# Motion Example Library

## Purpose

The example library gives the agent **visual memory**.

The Component Arsenal answers:

> What component should I use?

The Motion Grammar answers:

> How should objects move?

The Example Library answers:

> What does a strong scene of this type look like, and which proven technique can I adapt?

Do not use examples as templates to copy wholesale. Use them to avoid inventing every scene from a blank canvas.

## Mandatory workflow

Before designing a major scene:

1. Understand the story beat and product truth.
2. Search the product's own video/motion assets.
3. Search reusable components already in the project.
4. Search the Component Arsenal.
5. Search the Example Library:
   ```bash
   node scripts/example-search.mjs search "integration logos"
   node scripts/example-search.mjs search "dashboard stats"
   node scripts/example-search.mjs search "cursor product demo"
   ```
6. Inspect the top 1–3 relevant examples.
7. Record:
   - what problem the example solves;
   - its motion grammar;
   - its strongest compositional idea;
   - what must NOT be copied because it belongs to that source's aesthetic.
8. Build a new scene using the product's brand, content and components.

## Two trust levels

### Reusable open-source references

Examples with verified permissive licenses such as MIT can be inspected and adapted at code level.

Rules:

- copy only the minimum useful technique;
- retain required copyright/license notices for substantial code reuse;
- rewrite it to use the product-film timing model;
- preserve the product's design system;
- do not import another project's house style.

### Gallery references

Remotion Prompt Showcase and Remotion Lab entries are valuable visual references, but each item's code/license must be treated independently.

Until an item license is verified:

- use it for inspiration and analysis;
- reproduce the technique from first principles;
- do not copy its source code verbatim.

The registry marks these as `reference-only-until-license-verified`.

## Search model

Examples are indexed by:

- category;
- technique;
- intended use;
- repository/source;
- reuse policy.

Search semantically with multiple terms:

```bash
node scripts/example-search.mjs search "otp verify success"
node scripts/example-search.mjs search "six integrations logos grid"
node scripts/example-search.mjs search "notification debt alert"
node scripts/example-search.mjs search "chart dashboard metrics"
node scripts/example-search.mjs search "product demo cursor"
node scripts/example-search.mjs search "cinematic launch camera"
```

## Build an example brief before coding

For every major scene, create a tiny internal brief:

```text
Story beat:
Show instant debt notifications.

Product truth:
A debt alert arrives immediately.

Source component:
Notification card from product/shadcn.

Example references:
- lab-notification-center → stacking rhythm
- agentic-product-demo → cursor timing + beat sheet
- barty-motion-graphics → card-to-island morph

Adaptation:
Use FlashDB palette, real debt text, Phosphor Bell icon, one card as traveler.
Do NOT copy the social-network styling from the gallery example.
```

This is the desired behavior: combine **techniques**, not visual identities.

## Recommended reference roles

### EveryInc/product-launch-video
Use for storyboard discipline, short-launch pacing, brand consistency, real UI copy and structured review.

### Alexwtlf/agentic-product-demo
Use for product demo mechanics: beat sheets, cursor choreography, contact sheets and frame gates.

### lifeprompt-team/remotion-scenes
Use as a broad scene vocabulary. Search one category at a time; do not assemble a film from unrelated showcase scenes.

### iart-ai/motion-skills
Use as craft references for specialist motion domains: kinetic typography, explainers, data, ads, maps and WebGL.

### AbubakrChan/product-launch-motion
Use for creative-direction discipline, camera, sound and trap awareness. Port ideas into Remotion rather than introducing an extra timeline engine.

### Barty-Bart/motion-graphics
Use for one-shape continuity, direct manipulation and short deterministic morphs.

### Remotion Prompt Showcase
Use as a quality bar and community inspiration surface.

### Remotion Lab
Use to identify concrete scene patterns such as:
- tool grid → fullscreen focus;
- notification stack;
- stats wall;
- Gantt timeline;
- typewriter title.

Code from a Remotion Lab page remains reference-only until its reuse terms are verified.

## Originality rule

Never make:

```text
example scene
+ changed text
+ changed colors
= final scene
```

Instead:

```text
example technique A
+ component source B
+ product truth C
+ motion grammar D
+ product brand E
= original scene
```

A strong result should not be visually traceable to one source example.

## Reference budget

For a single scene:

- 1 primary example;
- optionally 1 secondary motion reference;
- optionally 1 QA/workflow reference.

More than three references usually adds noise.

For the whole film, recurring motion language should reduce the need to keep introducing new examples.

## Promotion into reusable knowledge

After building a successful original scene:

1. identify the reusable technique;
2. extract it into the local motion kit if generic;
3. add a short project-specific note;
4. do not automatically add the whole finished branded scene to the global skill.

The skill should learn **methods**, not accumulate visual clutter.
