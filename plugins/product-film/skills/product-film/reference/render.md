# Final render, verification and delivery

The render pipeline supports **finite ads** and **seamless loops** as separate delivery modes. Audio is optional from start to finish.

## 0. Configure the film

Start from `templates/render-config.example.json` and set the real composition, duration and delivery mode.

```json
{
  "composition": "MyFilm",
  "name": "my-film",
  "duration": 120,
  "mode": "finite",
  "silent": true,
  "profile": "production",
  "fps": 60,
  "scale": 1,
  "motionBlurSamples": 1,
  "poster": 116
}
```

Generate package scripts from the actual config instead of copying starter identifiers:

```bash
node scripts/configure-render.mjs render.config.json
```

Generated commands use `node --import tsx`, which avoids the tsx CLI IPC pipe used in some restricted Linux/sandbox environments.

## 1. Preflight before a long render

```bash
node scripts/preflight.mjs --composition MyFilm
node scripts/preflight.mjs --composition MyFilm --ensure-browser
```

The preflight checks:

- Node and required Remotion packages;
- `tsc --noEmit`;
- composition listing;
- literal `staticFile()` assets under `public/`;
- suspicious root public URLs;
- restricted `os.networkInterfaces()`;
- expensive `backdrop-filter` usage;
- Headless Chrome acquisition when `--ensure-browser` is requested.

If `os.networkInterfaces()` throws `EPERM` or `EACCES`, retry only in that restricted environment with:

```bash
NODE_OPTIONS="-r ./scripts/network-compat.cjs" node --import tsx scripts/preflight.mjs --composition MyFilm --ensure-browser
```

The shim is opt-in and exposes loopback only. Do not use it on normal machines.

## 2. Fast preview profile

Never begin iteration with a full 1080p/60 long render.

```bash
node --import tsx scripts/render.ts --config render.config.json --profile preview
```

Default preview profile:

- 15 fps;
- quarter scale;
- H.264 CRF 26;
- no motion-blur supersampling unless explicitly requested.

Use it for pacing and scene continuity, not pixel-level signoff.

## 3. Production profile

```bash
node --import tsx scripts/render.ts --config render.config.json --profile production
```

Production defaults are intentionally safe for long films:

- 60 fps;
- full scale;
- no supersampling by default;
- H.264 delivery;
- a poster;
- audio only when requested.

High-cost motion blur is explicit:

```bash
node --import tsx scripts/render.ts --config render.config.json \
  --profile production --motion-blur-samples 4 --master-fps 240
```

When supersampling is enabled, the master is rendered at `fps × samples`, averaged with ffmpeg `tmix`, then converted once to BT.709.

### Delivery modes

Finite ad:

```bash
node --import tsx scripts/render.ts --config render.config.json --finite
```

Loop:

```bash
node --import tsx scripts/render.ts --config render.config.json --loop
```

Loop mode adds WebM and a loop-seam contact sheet. Finite mode does **not** require the last frame to equal frame 0.

### Silent vs audio

Silent is first-class:

```bash
node --import tsx scripts/render.ts --config render.config.json --silent
```

Only request audio when licensed/approved audio is actually present:

```bash
node --import tsx scripts/render.ts --config render.config.json --with-audio
```

The audio render and mux stages are skipped entirely for silent films.

## 4. Observability and failure behavior

Every run writes:

- `progress.json` — current phase, rendered frame when Remotion exposes it, percent, elapsed time and ETA;
- `render-manifest.json` — config, phases, outputs, success/failure and diagnostics.

Outputs are versioned automatically:

```text
out/<film>/v1/
out/<film>/v2/
out/<film>/v3/
```

On failure, intermediates and both JSON diagnostics are preserved. Intermediates are only cleaned after a successful render unless `--keep-intermediates` is used.

Quiet/error-only logs are not appropriate for long renders; the script streams renderer output while writing machine-readable progress.

## 5. Verify before sending

Finite silent ad:

```bash
uv run --with numpy --with imageio-ffmpeg python3 scripts/verify.py out/<film>/vN \
  --duration 120 --fps 60 --size 1920x1080 --mode finite --audio none
```

Loop:

```bash
uv run --with numpy --with imageio-ffmpeg python3 scripts/verify.py out/<film>/vN \
  --duration 20 --fps 60 --size 1920x1080 --mode loop --audio any
```

Verification checks:

- decode succeeds;
- dimensions;
- fps;
- duration;
- expected audio presence/absence;
- first/last adjacent-frame stability;
- optional pixel probes;
- optional frame-0 background color;
- first/last seam **only in loop mode**.

The result is also written to `verify.json`.

If dark colors decode too light, fix the color-range conversion; never compensate by changing product tokens.

## 6. Render-cost rules

For long films:

- `backdrop-filter` is opt-in, not a default glass technique;
- prefer translucent fills, borders and controlled shadows;
- use full-resolution/high-sample motion blur only where the quality gain is visible;
- keep WebGL/Canvas deterministic and intentionally resolution-limited;
- run the fast preview and smoke stills before production.

## 7. Deliver

Report:

- delivery mode: finite or loop;
- audio mode: silent or audio;
- dimensions / fps / duration;
- output sizes;
- preflight status;
- smoke-still/contact-sheet review;
- verify result.

Do not commit, publish or upload the film unless asked.
