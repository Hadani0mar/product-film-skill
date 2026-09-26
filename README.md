# product-film

A Claude Code skill that makes a showreel-grade product film in code: a landing-page loop, a launch video, a promo or a demo reel. It uses [Remotion](https://www.remotion.dev), your product's real components, its design tokens, its logo or mascot and its voice.

The film looks like your product made it. Claude first learns your design system: rules files, tokens, components, the live site, and what you can and cannot claim. It writes that down as `videos/BRAND.md`, and that file wins over any default in the skill. Then it writes the story, cuts music on the beat, builds the scenes, reviews frames with you, and renders a verified final film.

## Install

In Claude Code:

```
/plugin marketplace add Rieranthony/product-film-skill
/plugin install product-film@product-film-skill
```

Or copy the skill folder by hand:

```bash
git clone https://github.com/Rieranthony/product-film-skill
mkdir -p ~/.claude/skills
cp -R product-film-skill/plugins/product-film/skills/product-film ~/.claude/skills/
```

To share it with a team instead, commit that folder to your repo at `.claude/skills/product-film/`.

## Use

In your product's repo, ask Claude Code for the film:

> Make a 45 second landing-page video for this product, with this song.

The skill takes it from there:

1. **Discovery.** Your design rules, tokens, components and claims become `videos/BRAND.md`.
2. **Story.** A beat sheet: scenes that show the product (no captions) take turns with big word-by-word punchlines. It checks in with you before building.
3. **Music.** It measures the beat grid, cuts the song on bars and places sound effects on their peaks.
4. **Build.** One Remotion composition, every frame a pure function of time. Scenes hand off with "magic moves": one element travels into the next scene.
5. **Review.** Stills at every handoff, contact sheets and a half-res draft. It fixes, then shows you.
6. **Final render.** A 240 fps master with motion blur. You get a muted loop for your page, a version with music, a WebM and a poster, all decoded and checked for colors, duration and a seamless loop.

## What's inside

```
plugins/product-film/skills/product-film/
├── SKILL.md              the workflow, craft defaults and traps
├── reference/            discovery, story, engine, music, review, render
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

## Requirements

- [Claude Code](https://claude.com/claude-code). The skill runs your local toolchain, so it does not work in the Claude chat apps.
- Node.js and [Bun](https://bun.sh).
- [uv](https://docs.astral.sh/uv/) for Python. The scripts pull numpy and a full ffmpeg (imageio-ffmpeg) on demand; nothing is installed system-wide.
- Remotion, added to your project by the skill. **Remotion has its own license:** it is free for individuals and small teams, and larger companies need a company license. See [remotion.dev/license](https://www.remotion.dev/license).
- Music you have the rights to use.

## License

MIT, for the skill's own text and code. See [LICENSE](LICENSE).
