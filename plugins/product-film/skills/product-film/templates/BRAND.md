# <Product> video kit

The look, rules, assets and code for every <Product> film. Each film prompt points here and only adds its story.
Sources: <landing URL>, <design system path>, <rules files>, product owner notes. When this file and the repo's rules files disagree, the repo wins.

## Hard rules
<!-- Every rule with its source. Examples of what to capture, not defaults to copy: -->
- Casing: <e.g. never full uppercase; sentence case everywhere> (source)
- Type: <one type style? mono only for code/keys?> (source)
- Corners: <radius token> (source)
- Background: one color, `<token>`. Surfaces only where the product has them: <which>. (source)
- Borders: <what the product does>; in films, no borders around floating things unless the product insists. (default)
- Copy: <dashes? reading level? banned words?> (source)
- Brand names come with their logos: <product>, <partners> (default)
- Claims: see "Claims".

## Frame (1920x1080, 60 fps, <dark|light>)
- Full bleed, nothing frames the film. (default)
- Punchlines: <font> <weight> at 120-160 px, centered, 1-2 lines, one word per beat, key words in `<accent>`, only the mascot on screen.
- Scenes: no captions; UI text only; read content 100 px from the sides.

## Color
| Token | Value | Use |
|---|---|---|
| background | | the film's only background |
| foreground | | text |
| muted foreground | | secondary text |
| surface | | only where the product shows a surface (app window) |
| border | | inner dividers only |
| accent | | the only fill; key words; CTAs |
| status tones | | pass / warn / fail from the product |

Hex only for anything that animates.

## Type
- Fonts and where they load from (local files, never the network at render time):
- Sizes at 1080p: punchline __ px, headline __ px, UI 24+ px.

## Signature elements
| Element | Look | Source | In films |
|---|---|---|---|
| CTA button | | | pressed state, loading state (keeps width) |
| Status markers / badges | | | |
| Stamps / labels | | | |
| Loader / spinner | | | frame-driven: frames every __ ms |
| Brand icons | | | inline with names |
| Texture (dither, pattern) | | | calm behind UI |

## Mascot / logo
- Asset or model: (path). Pure functions to drive: (list), or SVG transforms.
- Looks: filled / outline (construction) / on dark / on accent.
- Poses the films use: hello (draws itself), follow cursor, happy hop, working, thinking, watch (big outline), home.
- Never: sad, hurt, sleepy at the start; never on a shape the product owner rejected.

## Cursors
- User: the OS arrow. Product: <its own cursor, if it automates> (source).
- A click = a short squash, then the target reacts. No rings.

## Components
| Need | Component (path) | In films: import / twin / redraw, and why |
|---|---|---|
| | | |

## Motion
- Springs from the product: (values). Easing: (curves).
- Named moves: magic move, drop, pop, blur swap, stamp, tick, type, punchline, peek, hop, push (camera).

## Claims
- What the product does (film may show):
- What it never does (film must not show):
- Approved lines:
- Words to avoid:

## Workspace
- Folder, versions, webpack override (Tailwind, aliases), fonts copy script, scripts (beats, audio-edit, stills, render, verify, beat-sheet).
