<context>
<Product> <does what, for whom, in one or two sentences>.
This film plays <where: the landing page, muted, on loop | social, with sound>. It must read <with the sound off>.
Read `videos/BRAND.md` first. It holds the look, the mascot, the components, the product owner's rulings and what we may claim. This prompt only adds the story.
</context>

<inputs>
Decided: 1920x1080, 60 fps, <dark>, <N> bars at <BPM> BPM, <seconds> s. Song: <title, artist, license>, stems in `public/audio/<film>/music/` (gitignored). Edit: song bars <a-b>, <c-d>, <e-f> (`edit.json`).
</inputs>

<direction>
<The feel in 3 short lines: e.g. Dribbble-level UI motion with the pacing of an Apple product film. Fun, precise, confident.>
Words and scenes take turns: scenes show the product moving, with no captions; punchlines carry the story, big, one word per beat, with only the mascot on screen.
One background, the product's own. No cuts between scenes that follow each other: one element travels and becomes part of the next scene. Across a punchline, the mascot is the thread.
The mascot is the star and alive from the first frame: it draws itself awake and chases your cursor until you click.
Banned: <from BRAND.md: casing, dashes, shades, borders, glows, particle bursts, click rings, bouncy easing, shaders, busy backgrounds behind UI, a brand name without its logo, anything BRAND.md lists as a false claim>.
</direction>

<cast>
- The mascot: <look, where it lives in each act>.
- Your cursor: the OS arrow. Offscreen on the first and last frame.
- <The product's cursor, if it automates>.
- Demo world, from the landing: <names, communities, placeholders like (your product)>.
</cast>

<structure>
<BPM>, 4/4, <N> bars. One beat is <s> s. Something happens on every beat.

Bars 1 and 2, hello. 1.1 The mascot draws itself... · 1.3 your cursor comes in... · 2.4 click.
Bar 3, punchline. "Meet" · "<Product>."
Bars .., <feature 1>. ...
Bars .., the drop. ...
Bars .., proof. ... then its punchline.
Bars .., headline. "<tagline>", logos flying into their slots.
Bars .., home. Everything folds into the mascot; it un-draws into the first frame.
</structure>

<build>
1. Remotion in `videos/`, set up as BRAND.md "Workspace" says. Kit in `src/kit/`, this film in `src/videos/<film>/`. fps from props: 60 in Studio, 240 for the final render.
2. Every style is a pure function of the frame. Components on their own clock get frame-driven twins.
3. `cues.ts` is the beat sheet as data; scene code never holds a literal frame number. A script writes the beat sheet table from it.
4. Springs are closed form; values that retarget sum one spring per key.
5. Magic moves use `kit/move.ts`; measure both ends with `scripts/stills.ts --debug`.
6. Measure the song with `scripts/beats.py`; cut on bars with `scripts/audio-edit.py`; place SFX by measured peaks.
7. Final: `scripts/render.ts` (240 fps, tmix motion blur), then `scripts/verify.py` (durations, decoded colors, loop seam). Report file sizes.
</build>

<gotchas>
Never put will-change on anything the camera scales. Text never travels across text. Keep a slot for every word before it lands. A texture under words stays thin there; behind UI it stays sparse, dim and slow. The film loops: the last frame equals frame 0. Draw dashes as SVG strokes. Judge the encoded file, and decode its pixels.
<Product claims: what must be shown with human approval, what the product never does.>
</gotchas>

<start>
Read `videos/BRAND.md`. Before any scene code, show the beat sheet on the measured grid, the mascot pose sheet, and three style frames: a punchline, the drop, one feature scene. Wait for OK.
</start>
