# Story: scenes, punchlines and the beat plan

## Shape that works for a product film (30 to 60 s)

1. **Hello (2 bars).**
   - The mascot or logo draws itself, awake and happy.
   - The user's cursor comes in and loops around it while the mascot follows (eyes and head, hops on the beat).
   - The click lands on a quiet or silent bar.
2. **Punchline: who we are (1 bar).** "Meet X."
3. **For each feature (3 to 6):**
   - an optional one-line punchline that frames it
   - a scene of 2 to 4 bars with the product's real UI moving
   - consecutive scenes hand off with a magic move
4. **The drop:** the strongest product moment (the automation turning on, the result appearing) lands on the song's drop.
5. **Proof:** the outcome as the viewer knows it (a search result, an AI answer, a dashboard number), each in its own scene, each followed by its punchline.
6. **Headline:** the product's own tagline, word by word, with partner logos flying into their slots.
7. **Home:** everything folds back into the mascot, which un-draws into the empty first frame, so it loops.

## Punchlines (Apple style)

- Only the mascot on screen: no UI, no cards.
- At most 6 words, 2 lines at most. One word or word group per beat, eighth notes at the fastest.
- Each word blurs in from about 16 px, rises about 36 px, and lands in 0.3 s on `cubic-bezier(0.22, 1, 0.36, 1)`. Exit is a quick blur.
- Every word keeps its slot before it lands, so lines never re-center.
- Key words in the accent color. A partner or product name brings its logo, inline, at about 0.82 of the font size.
- Size: 120 to 160 px at 1080p. Shrink per card rather than wrapping to 3 lines.
- The mascot looks up at each word and hops as it lands, higher on the accent words.
- Over a busy texture (a flood, a pattern), thin the texture in a band behind the words. Never add a panel.

## Scenes

- Show, don't tell: no captions. The only text is the product's own UI text.
- Readable at 1080p: body text 24 px and up, titles 34 px and up. Fewer words beat smaller words.
- Real components where they are pure; frame-driven twins where they run a clock (see engine.md).
- Demo data from the landing page, so the film and the site agree. Placeholders like `(your keyword)` in the accent color.
- Each scene has one idea. If it needs a legend, cut it down.

## Magic moves (handoffs)

Pick the element that exists in both scenes, or make one.

| From | To | Why it reads |
|---|---|---|
| Avatars in a diagram | Rows in a list | Same faces, new job |
| List cells (progress squares) | Cells of a chart or glyph | Same pixels, new shape |
| A clicked row's avatar and title | The detail view's header | You opened it |
| A button | A toggle's active half | Approving becomes automating |
| A thread or page title | A search result title | Your work, now ranking |
| Logos in answer cards | Slots in the headline | The proof becomes the promise |
| Anything | Into the mascot, or out of it | The mascot is the thread across punchlines |

Rules:
- The traveler and its destination share a line-height ratio, so the move only scales.
- Measure both ends (`--debug` stills), never compute from guesses.
- Travel on a spring (stiffness about 150, damping about 20). Arrive, then swap to the real element at the exact same spot, or stay as it.
- Text never flies across text.

## The beat plan (cues.ts)

- Measure the song first (music.md). Plan in bars and beats; at 150 BPM a beat is 0.4 s and a bar 1.6 s.
- Every moment is `b(bar, beat, fraction)` on the measured grid. Scene code never holds a literal frame number.
- Budget: hello 2 bars, each punchline 1 to 1.5, each feature scene 2 to 4, the proof 1.5 to 2.5 each, headline 2, home 2.
- Something on every beat: clicks on beats, words on beats, days ticking on eighths or sixteenths, blips and pings on beats.
- Generate a beat sheet table from `cues.ts` (a small script) and keep it current. It is the doc the product owner reads.

## Checkpoint before building everything

Show the user:
- the beat sheet
- a pose sheet of the mascot
- 3 style frames: a punchline, the drop moment, one feature scene

Product owners react fastest to pictures. Expect notes on pacing, words, shades and borders.
