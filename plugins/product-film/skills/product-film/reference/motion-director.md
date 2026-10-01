# Motion Director: think before animating

This skill should behave like a senior motion-graphics designer and art director who can also implement.

## The order of decisions

Never start with “which effect should I use?”

Start with:

```text
communication goal
→ audience
→ product truth
→ one visual concept
→ hierarchy
→ editorial rhythm
→ motion grammar
→ camera grammar
→ transition logic
→ look development
→ effects
→ implementation
```

## Build one concept, not a demo reel

Every strong film needs a sentence that explains why the motion behaves the way it does.

Examples of concept structures:

- “The product turns scattered work into one controlled flow.”
- “Every action collapses distance between the user and the result.”
- “One object evolves through every feature, so the product feels like one system.”
- “The interface behaves like a living operations map.”

Do not copy those literally. Derive the concept from the actual product and objective.

A scene that cannot support the concept should be cut.

## Visual hierarchy

At every moment, identify:

- **hero** — the one thing viewers should look at first
- **support** — information that explains the hero
- **atmosphere** — texture, depth, lighting, background
- **transition carrier** — the object, mask, cursor, camera move or light event that gets us to the next shot

Do not let atmosphere compete with the hero.

## Motion grammar

Choose 2–4 recurring motion behaviors and reuse them across the film. Examples:

- one visible element travels between scenes
- surfaces expand into the next screen
- UI cards snap into a spatial grid
- text hands off to product UI
- camera follows the user's task path
- masks originate from product geometry
- cursor is used only for causal interactions

Consistency makes the film feel designed rather than assembled. Every major scene must also receive a shot recipe from `shot-recipes.md`; the recipe defines staging logic, while the grammar keeps the entire film coherent.

## Editorial rhythm

Design a pacing curve, not constant speed. Assign an explicit energy level 1–5 to each major shot and avoid sustaining level 4–5:

1. **Hook:** immediate visual question or transformation.
2. **Orientation:** viewer understands the product category.
3. **Acceleration:** strongest interactions/features.
4. **Proof:** result, workflow completion, metric or before/after.
5. **Payoff:** one memorable visual climax.
6. **Close:** clean brand/CTA state with enough hold time to read.

At 60 fps, animation can still feel slow. Timing is about distance, easing, staging and overlap, not fps alone.

## Camera

Camera motion must express meaning.

- push in = importance / discovery
- pull out = reveal system / scale
- pan/track = follow workflow
- orbit = dimensional product/object reveal
- macro = material/detail/precision
- whip = editorial energy; use sparingly
- parallax = depth/context
- rack-focus style treatment = shift attention

Do not move the camera and every object independently without a clear focal hierarchy.

## Transitions

Prefer continuity over wipes.

Strong transition carriers:

- the same card/button/icon moves into the next scene
- mask grows from a product element
- camera passes through a surface
- typography becomes UI
- color field becomes a new environment
- cursor drag becomes camera travel
- light/blur/distortion peaks exactly at a structural handoff

A transition should make the next scene feel inevitable.

## Typography

Typography is a motion actor.

- animate by semantic phrase, not arbitrary characters
- preserve line stability
- use scale/weight/position changes to express hierarchy
- sync emphasis to beats or product actions
- avoid kinetic type that obscures the product
- big copy should say less

## Product truth

Never fake capabilities, metrics, user counts, AI behavior or integrations.

If a real screen is visually weak, direct it better with framing, crop, focus, layering and movement before redesigning it.

## Premium-quality test

Before rendering, ask:

- Can I explain the film's concept in one sentence?
- Is there one clear focal point in every shot?
- Does each scene reveal new information?
- Do transitions connect ideas, not just images?
- Are the strongest effects reserved for the strongest moments?
- Does the product remain recognizable?
- Would the piece still feel designed with effects temporarily disabled?
- Is the CTA readable and held long enough?

If not, revise direction before adding more polish.


## Shot architecture before polish

Before implementation, create `videos/shot-plan.json` from the provided template. For each major shot record the narrative job, hero subject, recipe, energy level, camera behavior, transition carrier and hold. Build the hardest one or two shots first as a motion proof; if the concept fails there, revise direction before building the rest.
