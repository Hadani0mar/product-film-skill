# Motion Intelligence: choose motion with evidence, not taste alone

This layer helps the agent decide **which motion pattern is appropriate for the current shot** using context, community interest, implementation quality, Remotion compatibility, licensing, and cost.

It does not replace art direction. Product truth and the film's concept always win.

## Required order

For every major shot:

1. Identify the narrative job and hero.
2. Check the product's own motion language.
3. Check `shot-recipes.md`.
4. Search Motion Intelligence:
   ```bash
   node scripts/motion-search.mjs search "notification phone alert"
   ```
5. Inspect the top 2–4 results.
6. Choose the simplest pattern that communicates the job.
7. Record the chosen pattern/reference in `shot-plan.json` and `SOURCES.json` when external material is actually adapted.

Do not mechanically choose rank #1. The score is decision support, not an automatic creative verdict.

## What the score means

The registry combines:

- **relevance** — how closely the pattern matches the shot;
- **popularity** — community interest or source-specific ranking;
- **quality** — curated implementation/design quality;
- **Remotion fit** — how cleanly it can become frame-driven;
- **product-film fit** — suitability for launch/demo/explainer work;
- **freshness** — whether the signal is still current;
- **license safety** — confidence that adaptation is legally straightforward;
- **implementation cost** — complexity penalty.

Current formula:

```text
relevance × 0.45
+
(popularity × .25
 quality × .20
 RemotionFit × .20
 ProductFilmFit × .15
 freshness × .10
 licenseSafety × .10) × 0.55
-
implementationCost × .08
```

## Source-specific popularity signals

Different communities expose different useful signals:

- **Remotion Prompt Showcase:** community engagement counts.
- **Motion examples:** MotionScore (S/A/B/...) and curated example library.
- **video-shotcraft / HyperFrames:** repository adoption plus maintained galleries/skills.
- **Codrops:** editorial curation + recency, not raw popularity.
- **Three.js:** official technical examples; authority matters more than trend.
- **LottieFiles:** Popular / Featured / Recent plus item-level community signals.
- **Rive Community:** likes / remixes / comments.
- **CodePen:** featured/community trend; inspiration signal only unless author licensing is verified.

Never compare unlike signals as if they were identical. They are normalized heuristics.

## Context routing

### Notifications / alerts
Prefer:
1. product-native notification UI;
2. internal Signal Pulse / Button-to-Outcome;
3. Motion notification/card-stack patterns;
4. Remotion product-demo references;
5. Rive/Lottie for small supporting micro-animation;
6. bespoke frame-driven animation.

### Kinetic typography
Prefer:
1. product typography;
2. internal motion grammar;
3. Motion text examples;
4. HyperFrames grammar;
5. Codrops editorial typography;
6. bespoke Remotion type choreography.

### 3D / spatial hero
Prefer:
1. internal Orbit Hero / Depth Tunnel recipe;
2. Remotion-native Three integration;
3. Three.js / R3F official examples;
4. video-shotcraft 2.5D language;
5. Codrops WebGL reference.

### Transitions
Prefer continuity first:
1. product object lineage;
2. internal Match Cut / Shape Carry / Button-to-Outcome;
3. Motion page-transition/clip examples;
4. Remotion effects;
5. Codrops/GL transition references;
6. hard cut if that is clearer.

### Micro-interactions
Prefer:
1. real product behavior;
2. Motion examples;
3. Motion Primitives / Magic UI;
4. Rive/Lottie reference;
5. bespoke.

## Trend discipline

Popular does not mean appropriate.

Reject a high-ranked effect if:
- it weakens product recognition;
- it adds a second visual language;
- it requires a huge runtime for a minor beat;
- it makes Arabic/UI text harder to read;
- its licensing is unclear and a safer equivalent exists;
- it repeats an effect already used as a hero moment.

Reserve expensive or fashionable effects for moments that earn them.

## Refresh policy

`motion-registry.json` contains dated popularity snapshots. When web access is available and the task depends heavily on trend/popularity:
- verify the source page is still active;
- refresh community counts/tiers when material;
- prefer source-native signals over guessed social popularity;
- do not change registry values during a user's video project unless maintaining the skill itself.
