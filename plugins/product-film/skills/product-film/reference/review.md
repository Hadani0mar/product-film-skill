# Review loop: cheap checks before expensive renders

Stills and smoke tests are cheap; long renders are not. Review in this order.

## 0. Preflight

Before visual review:

```bash
node scripts/preflight.mjs --composition MyFilm
```

Fix TypeScript, missing assets and composition errors before rendering anything expensive.

## 1. Scene map and automatic smoke stills

Create `scene-map.json` from `templates/scene-map.example.json`. Use editorial start/end times for every act.

```json
{
  "composition": "MyFilm",
  "fps": 60,
  "scenes": [
    {"id":"hook","start":0,"end":5},
    {"id":"feature","start":5,"end":20},
    {"id":"close","start":20,"end":30}
  ]
}
```

Then:

```bash
node --import tsx scripts/smoke-stills.ts --map scene-map.json --out out/review/smoke
```

It bundles once and renders:

- first / middle / last frame of every scene;
- two frames before each handoff;
- the handoff frame;
- two frames after each handoff;
- `smoke-manifest.json`;
- a contact sheet when system ffmpeg is available.

This is the default guard against late scene import failures, transparent boundary frames, clipping and single-frame pops.

## 2. Targeted stills

For extra inspection:

```bash
node --import tsx scripts/stills.ts out/review/vN 250 700 962 1130 --composition MyFilm
node --import tsx scripts/stills.ts out/review/vN-debug 1812 1860 --composition MyFilm --debug
```

Use `node --import tsx` rather than the tsx CLI in generated commands; the latter may try to open a restricted IPC pipe in sandboxes.

`--debug` passes `debug:true`, so `TargetLog` can print measured `[data-target]` boxes into the frame.

## 3. Fast motion draft

Use the render profile instead of a hand-written Remotion command:

```bash
node --import tsx scripts/render.ts --config render.config.json --profile preview
```

Default preview is quarter-scale / 15 fps. Watch it for rhythm and continuity; inspect full-resolution stills for typography and fine UI.

## 4. Checklist every round

- **Product truth:** real labels, real behavior, no invented claims.
- **Source provenance:** `videos/SOURCES.json` records every sourced/adapted/bespoke component.
- **Background:** product palette only.
- **Borders/surfaces:** only where product language supports them.
- **Text:** readable, never clipped, covered or crossing other text.
- **Loading states:** controls keep intentional geometry.
- **Textures:** calm behind UI; no expensive effect by default.
- **Pacing:** no dead beat; no unreadably fast beat.
- **Cursor:** arrives, rests, then presses/drags. It never wanders decoratively.
- **Handoffs:** inspect pre/at/post frames from the generated smoke sheet.
- **Object lineage:** traveler lands exactly on its measured destination.
- **Final act:** finite ads hold a stable close; loops return cleanly to frame 0.
- **Audio:** only present when requested/licensed.

## 5. Finite and loop review are different

For a **finite ad**, do not force last frame = first frame. Check a stable opening/closing frame and run verification with `--mode finite`.

For a **landing loop**, the seam is part of the design. Check the generated seam sheet and verify with `--mode loop`.

## 6. Show the product owner

Send representative frames or the fast draft as soon as a round is coherent. Fold durable feedback into `BRAND.md`, the film prompt or the reusable kit so the next film starts better.
