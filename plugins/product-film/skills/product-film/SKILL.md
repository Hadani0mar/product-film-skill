---
name: product-film
description: Make a showreel-grade product film (landing-page loop, launch video, promo, demo reel, social cut) in code with Remotion, built on the product's own design system, components, mascot and voice. Use when someone asks for a product video, landing video, promo, launch film, explainer or "motion design video" for their app, SaaS or codebase. Covers design discovery, story and punchlines, music sync, magic-move transitions, mascot and cursor animation, review loops, and a verified final render.
---

# Product film

A film that looks like the product made it: its colors, type, components, logo and voice, cut to music, where every scene hands off to the next. Built in Remotion inside (or beside) the product's codebase, so it reuses real components and stays editable.

## Non-negotiables

- **Their design wins.** Every rule comes from the product: its tokens, components, rules files, landing page and copy. The craft defaults below give way to anything the product says. Never carry another brand's taste in, including the examples in this skill.
- **Every frame is a pure function of time.** No CSS transitions or keyframes, no timers, no `Date.now()`, no state carried between frames. A component that runs its own clock gets a frame-driven twin.
- **Measure, never guess.** Beats come from the audio, positions from the DOM (debug overlay), colors from decoded pixels of the final files.
- **Honest claims.** Show only what the product really does. Find its claims rules and approved lines before writing a word.
- **Ask first** before committing, pushing or publishing. Keep every rendered version (`out/<film>/v1`, `v2`, ...).

## Workflow

1. **Intake.** If unclear, ask with AskUserQuestion:
   - where it plays (landing loop, muted? social, with sound?)
   - length (30 to 60 s)
   - aspect ratio (16:9 default, 9:16 for social)
   - music (their licensed track or stems, or royalty-free)
   - the 3 to 6 things it must show
   - the line it ends on
2. **Discovery → `videos/BRAND.md`.** Read [reference/discovery.md](reference/discovery.md), fill [templates/BRAND.md](templates/BRAND.md). Run parallel read-only sweeps. Tour the live site in a browser.
3. **Story → `videos/<film>-prompt.md`.** Read [reference/story.md](reference/story.md), fill [templates/film-prompt.md](templates/film-prompt.md). Checkpoint with the user before building everything: beat sheet, mascot pose sheet, 3 style frames.
4. **Music.** Follow [reference/music.md](reference/music.md): `scripts/beats.py`, the per-bar stem map, `scripts/audio-edit.py`, SFX placed by measured peaks.
5. **Engine and scenes.** Read [reference/engine.md](reference/engine.md):
   - copy [templates/kit/](templates/kit/) into `videos/src/kit/`
   - one folder per film: `cues.ts` (beat sheet as data), `layout.ts`, `acts/`, the mascot's path, the composition
6. **Review loop.** Follow [reference/review.md](reference/review.md):
   - stills at every handoff (`scripts/stills.ts`, `--debug` to measure)
   - contact and handoff sheets, a half-res draft
   - fix, repeat
   - show the user frames as you go
7. **Final render, verify, deliver.** Follow [reference/render.md](reference/render.md): `scripts/render.ts`, then `scripts/verify.py`, then send the files.

## Craft defaults (earned in real review rounds; the product's rules override)

- **Full bleed.** No frame, rails or container around the film.
- **One background:** the product's own page color. Never invent card shades. A surface appears only where the product itself has one (an app window).
- **No borders around floating things.** Lines only where they mean something: links in a diagram, dividers inside an app window.
- **Words and scenes take turns.** Scenes carry no captions. The story lives in punchlines:
  - big (120 to 160 px at 1080p), one word per beat, with only the mascot on screen
  - at most 6 words, key words in the accent color
  - fewer words everywhere: cut subtitles, descriptions and labels that restate the picture
- **Brand names come with their logos,** inline, every time (the product's, and any partner's: Google, ChatGPT, Reddit, Slack...).
- **Open fast and alive.** The mascot draws itself awake and follows the cursor with eyes and head until the click. Never open on a sleeping or idle character.
- **Handoffs are magic moves.** One element of a scene travels (position, size, color) and becomes part of the next one; the rest blur-swaps. Examples: avatar to row, cell to chart, title to search result, button to toggle, logo to headline. No hard cuts, no morphing cards.
- **Text never travels across text.** Move images and marks; blur words out and back in.
- **Every word keeps its slot before it lands** (opacity, never unmount), so centered lines never shift.
- **Textures never compete with UI or words.** Behind UI keep them sparse, dim and slow. Behind words, thin them out (dither density), never a panel.
- **A desktop app reads as a desktop app:** window chrome, inner dividers, a dock, a slightly lifted surface.
- **Two cursors when the product automates:**
  - the user's cursor sets things up and approves; the product's own cursor does the work
  - no cursor ever covers words being typed: click fields on their far side, rest just under the next button
- **Loading buttons keep their width.** Use the product's own loading pattern (its spinner, its submit button).
- **No click rings, particle bursts, glows, blurred shadows or bouncy easing,** unless the product's language uses them.
- **Something happens on every beat.** If a scene idles for a bar, give it beat-synced life (blips, punches, pings) or cut the bar.
- **Scene boundaries land on bars.** The last frame equals the first frame (loop). A landing loop must read muted.

## Traps that cost real time

- Remotion stills do not forward console logs. Print measurements into the frame (`templates/kit/debug.tsx`).
- `npx remotion still` re-bundles on every call. Use `scripts/stills.ts`: bundle once, many frames.
- Remotion's bundled ffmpeg has no `tmix`, `select` or `tile`. Use a full ffmpeg (`uv run --with imageio-ffmpeg`).
- **Color range:** the Remotion master is limited range, BT.601, untagged. Blending it as full range lifts `#0a0a0a` to `#171717`, a gray box on a dark landing page. Decode frame 0 of every deliverable and check the numbers.
- `interpolateColors` cannot parse `color-mix()`. Any color that animates is a hex token.
- Async image components (Radix or base-ui avatars) can render empty in a frame. Twin them with Remotion `<Img>`.
- Springs that retarget: sum one closed-form step per key, with keys sorted by time.
- CSS dashed borders crawl while a box resizes. Draw dashes as SVG strokes at a fixed pitch.
- WebGL or paper shaders on their own clock paint a different picture each run, and reviewers found them "weird". Prefer ordered-dither textures painted per frame.
- In a monorepo:
  - pin every `remotion` and `@remotion/*` to one exact version
  - never let the video workspace re-resolve the app's Tailwind
  - alias the app's `@/` imports in the webpack override
- Stop only the processes you started; other sessions may be waiting on the machine.
