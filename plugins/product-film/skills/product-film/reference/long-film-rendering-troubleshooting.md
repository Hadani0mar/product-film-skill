# Long-film rendering troubleshooting and delivery modes

This note started as a postmortem from a 120-second, 1920×1080, 60 fps product-film render in a restricted Linux environment.

The original run exposed repeatable failures around sandbox permissions, public assets, late scene errors, long-render cost, missing progress, loop-only assumptions and source provenance.

**Status:** the actionable recommendations from that postmortem are implemented in the product-film skill as of **v1.6.0**. This page remains the troubleshooting reference and explains which tool now owns each failure mode.

## Implementation map

| Finding | Implemented fix |
|---|---|
| `os.networkInterfaces()` can throw `EPERM` | `scripts/preflight.mjs` detects it; `scripts/network-compat.cjs` is an explicit loopback-only fallback |
| tsx CLI IPC pipe can fail in restricted sandboxes | generated/documented commands use `node --import tsx` |
| Headless Chrome can fail only when a long render starts | preflight supports `--ensure-browser` before production |
| public assets referenced as root URLs can 404/decode-fail | preflight checks literal `staticFile()` assets; Source Adaptation requires `staticFile() + <Img>` |
| scene/import errors appeared only during still rendering | preflight runs `tsc --noEmit`; `smoke-stills.ts` executes first/middle/last + boundary frames |
| starter IDs/output names/audio/240fps/loop assumptions leaked into new films | `render-config.example.json`, `configure-render.mjs`, and generic `render.ts` derive behavior from the real film |
| 1080p/60 iteration was too expensive | named preview profile defaults to 15 fps / 0.25 scale |
| `backdrop-filter` greatly increased Headless Chrome cost | preflight warns; engine/render docs make it opt-in for long production |
| error-only logs made slow vs hung ambiguous | renderer streams logs and writes `progress.json` with frame/%/elapsed/ETA when available |
| failed renders discarded context | `render-manifest.json` and intermediates are preserved on failure |
| handoff frame could be transparent | `safeActWindow()` pre-rolls scene mounting; smoke stills sample pre/at/post boundary |
| finite ads were incorrectly subjected to loop seam rules | `verify.py --mode finite|loop`; seam test is loop-only |
| silent films still ran audio pipeline | `--silent` skips audio render/mux; verification checks expected audio state |
| source-first rules had no evidence trail | `source-manifest.mjs` creates/validates `videos/SOURCES.json` |
| handoff sheets were manual | `smoke-stills.ts` derives coverage from `scene-map.json` and creates a contact sheet when ffmpeg is available |

## Restricted Linux / sandbox startup

### Network-interface permission

Symptom:

```text
uv_interface_addresses / os.networkInterfaces -> EPERM
```

Run preflight first:

```bash
node scripts/preflight.mjs --composition MyFilm
```

If it reports the sandbox restriction, retry only in that environment with:

```bash
NODE_OPTIONS="-r ./scripts/network-compat.cjs" \
  node scripts/preflight.mjs --composition MyFilm --ensure-browser
```

The compatibility shim returns loopback interfaces only when the native call throws `EPERM`/`EACCES`. It is not a general networking replacement.

### tsx IPC pipe

Symptom:

```text
Error: listen EPERM: operation not permitted /tmp/tsx-*/...pipe
```

Use Node's import hook:

```bash
node --import tsx scripts/stills.ts ...
node --import tsx scripts/smoke-stills.ts ...
node --import tsx scripts/render.ts ...
```

Do not use the tsx CLI in generated scripts for restricted environments.

### Headless Chrome

Before a long final:

```bash
node scripts/preflight.mjs --composition MyFilm --ensure-browser
```

A browser acquisition/proxy failure is now surfaced before the expensive render.

## Assets and scene execution

### Public assets

Render-critical public files use:

```tsx
import {Img, staticFile} from "remotion";

<Img src={staticFile("brand/logo.png")} />
```

Avoid browser-root paths such as `src="/brand/logo.png"` for render-critical assets.

The preflight validates literal `staticFile("...")` references against `public/`.

### Scene smoke test

Maintain a scene map:

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
node --import tsx scripts/smoke-stills.ts --map scene-map.json
```

This executes representative frames from every scene and a ±2-frame window around every handoff.

## Render configuration instead of starter assumptions

Start from `templates/render-config.example.json`.

Generate package commands:

```bash
node scripts/configure-render.mjs render.config.json
```

The config carries the actual:

- composition id;
- film/output name;
- duration;
- finite/loop mode;
- silent/audio mode;
- preview/production profile;
- fps and scale;
- optional motion-blur sample count;
- poster time;
- scene map.

No OTP-specific ID or filename is part of the render pipeline.

## Performance profiles

Fast preview:

```bash
node --import tsx scripts/render.ts --config render.config.json --profile preview
```

Default: 15 fps, 0.25 scale, H.264, no supersampling.

Production:

```bash
node --import tsx scripts/render.ts --config render.config.json --profile production
```

Default: 60 fps, full scale, one sample per output frame.

High-cost supersampling/motion blur is explicit:

```bash
node --import tsx scripts/render.ts --config render.config.json \
  --motion-blur-samples 4 --master-fps 240
```

For long films, `backdrop-filter` is not a default glass treatment. Prefer translucent fills, borders and shadows unless the visual difference justifies the cost.

## Progress and diagnostics

Each render version is isolated:

```text
out/<film>/v1/
out/<film>/v2/
...
```

Each run writes:

- `progress.json`;
- `render-manifest.json`;
- render intermediates until success.

On failure, the intermediates and diagnostics remain in place.

## Safe scene boundaries

Use `safeActWindow()` from `templates/kit/act-window.ts`.

A default pre-roll of 0.32 s means the next scene is already visually alive when the editorial boundary arrives.

For a final act, `holdThroughEnd:true` keeps the closing state mounted through the end.

The generated smoke sheet remains the visual acceptance test.

## Finite vs loop verification

Finite ad:

```bash
uv run --with numpy --with imageio-ffmpeg python3 scripts/verify.py out/<film>/vN \
  --duration 120 --fps 60 --size 1920x1080 --mode finite --audio none
```

Loop:

```bash
uv run --with numpy --with imageio-ffmpeg python3 scripts/verify.py out/<film>/vN \
  --duration 20 --fps 60 --size 1920x1080 --mode loop --audio any
```

Finite verification checks decode, dimensions, fps, duration, audio expectation and adjacent edge-frame stability.

Loop verification adds the strict first/last seam test.

## Source provenance

Initialize:

```bash
node scripts/source-manifest.mjs init
```

Record a sourced deterministic twin:

```bash
node scripts/source-manifest.mjs add \
  --id alert-card \
  --source shadcn-ui/ui \
  --path path/to/card.tsx \
  --license MIT \
  --adaptation "runtime animation replaced by frame-driven props" \
  --twin
```

Record a bespoke bridge only with a reason:

```bash
node scripts/source-manifest.mjs add \
  --id morph-bridge \
  --bespoke \
  --reason "No approved source preserves the required object lineage"
```

Validate:

```bash
node scripts/source-manifest.mjs validate
```

## Acceptance criteria

A generated product-film project now has a documented path to:

1. preflight Node, Remotion, TypeScript, browser access and public assets;
2. configure scripts from the real composition/duration/delivery mode;
3. execute representative scene frames before a long render;
4. produce a fast preview profile;
5. use an opt-in restricted-Linux network fallback;
6. preserve progress/ETA diagnostics and failure intermediates;
7. verify finite ads and loops under separate contracts;
8. deliver silently without running the audio pipeline;
9. record source/license/adaptation provenance;
10. generate handoff review coverage directly from the scene map.
