# product-film

> Fork maintained by **Hadani0mar**, based on the original [Rieranthony/product-film-skill](https://github.com/Rieranthony/product-film-skill). This fork adds the source-first Component Arsenal and deterministic adaptation workflow.

A Claude Code skill that makes a showreel-grade product film in code: a landing-page loop, a launch video, a promo or a demo reel. It uses [Remotion](https://www.remotion.dev), your product's real components, its design tokens, its logo and its voice.

The film looks like your product made it. Claude first learns your design system: rules files, tokens, components, the live site, and what you can and cannot claim. Then it asks you what the film should include, with options named after your real features and components. It writes all of that down as `videos/BRAND.md`, which wins over any default in the skill. Then it writes the story, cuts music on the beat, builds the scenes, reviews frames with you, and renders a verified final film.

## Install

In Claude Code:

```
/plugin marketplace add Hadani0mar/product-film-skill
/plugin install product-film@product-film-skill
```

Or copy the skill folder by hand:

```bash
git clone https://github.com/Hadani0mar/product-film-skill
mkdir -p ~/.claude/skills
cp -R product-film-skill/plugins/product-film/skills/product-film ~/.claude/skills/
```

To share it with a team instead, commit that folder to your repo at `.claude/skills/product-film/`.

## Use

In your product's repo, ask Claude Code for the film:

> Make a 45 second landing-page video for this product, with this song.

The skill takes it from there:

1. **Discovery.** A quick pass over your design rules, tokens, components, logo and claims.
2. **Interview.** It asks where the film plays, how long it runs, the music and the features to show. Then it asks which ingredients to use, all optional:
   - a logo animation, or your mascot if you have one
   - big word-by-word punchlines, captions, or no words at all
   - transitions: magic moves, camera moves, or cuts on the beat
   - extras: cursor interactions, partner logos, proof moments, your brand texture
3. **Brand kit and story.** Your answers and your design become `videos/BRAND.md` and a beat sheet. It checks in with 3 style frames before building.
4. **Music.** It measures the beat grid, cuts the song on bars and places sound effects on their peaks.
5. **Build.** One Remotion composition, every frame a pure function of time, scenes connected the way you chose.
6. **Review.** Stills at every handoff, contact sheets and a half-res draft. It fixes, then shows you.
7. **Final render.** A 240 fps master with motion blur. You get a muted loop for your page, a version with music, a WebM and a poster, all decoded and checked for colors, duration and a seamless loop.

## What's inside

```
plugins/product-film/skills/product-film/
├── SKILL.md              the workflow, craft defaults and traps
├── reference/            discovery, interview, ingredients, story, engine, music, review, render
├── templates/
│   ├── BRAND.md          fill-in design kit for your product
│   ├── film-prompt.md    fill-in film brief
│   └── kit/              time grid, springs, camera, cursors, magic moves, punchlines, dither, debug overlay
└── scripts/
    ├── beats.py          beat grid from the song (numpy)
    ├── audio-edit.py     cut the song on bars
    ├── stills.ts         review stills, bundled once
    ├── render.ts         final render and deliverables
    └── verify.py         decode the files and check them
```


## Component arsenal

This fork adds a **source-first motion component workflow**. Before Claude invents generic UI, it checks an approved registry covering expressive motion, backgrounds, buttons, cards, forms, SVG/icons, loaders and charts.

Approved sources include React Bits, Magic UI, Motion Primitives, Animate UI, beUI, shadcn/ui, Radix Primitives, Kokonut UI, Flowbite React, SVG Spinners, Lucide, Heroicons and Recharts.

The agent preserves the chosen component's recognizable design, then adapts only what the film needs. Runtime animation is converted to deterministic Remotion state when necessary; creativity is added at the scene level with object lineage, camera, masks, cursor choreography, beat sync and morphing.

\`\`\`bash
# from the product repo where the film is being built
node <skill-path>/scripts/source-manager.mjs list background
node <skill-path>/scripts/source-manager.mjs sync react-bits magic-ui motion-primitives
node <skill-path>/scripts/source-manager.mjs find "button"
\`\`\`

Fetched upstream repositories live in the product repo's \`.motion-sources/\` cache rather than being bundled into this skill.

**React Bits is intentionally not mirrored here.** Its current MIT + Commons Clause terms permit use inside products but restrict redistribution of the component collection itself. The source manager fetches it locally on demand instead.

## Background source system

This fork uses **GoToDev Backgrounds** as the primary ready-made background fallback when the product does not already define a suitable background language.

- Website: https://background.gotodev.ma/
- Source: https://github.com/ELMACHHOUNE/background-gotodev
- License: MIT

The order is:

```text
product background
        ↓
GoToDev Backgrounds
        ↓
bespoke background only if nothing fits
```

Search/fetch it through the existing source manager:

```bash
node <skill-path>/scripts/source-manager.mjs sync gotodev-backgrounds
node <skill-path>/scripts/source-manager.mjs find "grid"
node <skill-path>/scripts/source-manager.mjs find "lines"
node <skill-path>/scripts/source-manager.mjs find "geometric"
```

The selected pattern may be recolored, scaled, cropped, softened or given subtle deterministic motion, but the agent should not replace it with a freshly improvised AI gradient.

See `reference/backgrounds.md`.

## Diagram / node-flow system

For **mind maps, workflows, decision trees, architecture maps and node-to-node explainer films**, this fork uses [React Flow / xyflow](https://reactflow.dev/) as the primary open-source graph structure.

- Repository: https://github.com/xyflow/xyflow
- Package: `@xyflow/react`
- License: MIT

The split is deliberate:

```text
React Flow
= nodes + edges + handles + graph geometry

Remotion
= reveal + edge drawing + branch timing + camera + traveler motion
```

The skill includes `templates/kit/flow-motion.ts` with deterministic helpers for node reveals, connector drawing, branch staggering, semantic edge travelers and cubic path positions.

Example motion language:

```text
Node A
  ↓
edge draws
  ↓
camera follows
  ↓
Node B opens
  ↓
decision splits
 ↙       ↘
C         D
  ↓
final graph overview
```

See `reference/diagrams.md`.

React Flow Pro is not assumed to be open-source; Pro-only examples/assets are excluded unless separately authorized.

## One-shape motion engine

This fork also integrates the motion grammar from [Barty-Bart/motion-graphics](https://github.com/Barty-Bart/motion-graphics) without replacing Remotion. The upstream project is MIT licensed and provides an excellent deterministic one-shape model.

The integration is native React/TypeScript:

```text
real/sourced React component
        ↓
choose a traveler (card, button, knob, image tile, icon container)
        ↓
MorphSurface
        ↓
button → loader → card → chart → toast
        ↓
real/sourced React component
```

Use **component scenes** for accurate product UI, **one-shape scenes** for continuous transformations, and **hybrid scenes** for launch-film quality. The entire film still has one time source: Remotion frames.

See:
- `reference/one-shape-motion.md`
- `templates/kit/morph.ts`
- `templates/kit/MorphSurface.tsx`
- `THIRD_PARTY_NOTICES.md`


- [Claude Code](https://claude.com/claude-code). The skill runs your local toolchain, so it does not work in the Claude chat apps.
- Node.js and [Bun](https://bun.sh).
- [uv](https://docs.astral.sh/uv/) for Python. The scripts pull numpy and a full ffmpeg (imageio-ffmpeg) on demand; nothing is installed system-wide.
- Remotion, added to your project by the skill. **Remotion has its own license:** it is free for individuals and small teams, and larger companies need a company license. See [remotion.dev/license](https://www.remotion.dev/license).
- Music you have the rights to use.

## License

MIT, for the skill's own text and code. See [LICENSE](LICENSE).
