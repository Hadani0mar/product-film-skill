# Popularity Ranking: how to interpret community interest

Popularity is a **confidence signal**, never the creative brief.

## Normalization

The registry stores normalized 0–100 values because sources expose incompatible metrics.

Examples:
- Remotion exposes engagement counts in its Prompt Showcase.
- Motion exposes MotionScore grades.
- GitHub projects expose stars/forks/activity.
- LottieFiles exposes Popular/Featured/Recent and item signals.
- Rive exposes likes/remixes/comments.
- Codrops uses editorial curation and publication recency.
- CodePen uses featured/community discovery.

The normalized number means "stronger signal within its source ecosystem", not "82% of all designers prefer this animation."

## MotionScore mapping

Default mapping when a specific Motion example exposes a grade:

```text
S = 98
A = 92
B = 82
C = 70
D = 55
F = 35
```

The registry may lower or raise the final popularity value if the pattern is especially niche or broadly reusable.

## Engagement mapping

For community engagement counts, normalize relative to the currently observed showcase distribution rather than assuming a permanent absolute scale.

The 2026-10-01 Remotion Prompt Showcase snapshot included:
- Travel Route with 3D landmarks — 349
- News article headline highlight — 347
- Product Demo for Presscut — 242
- Launch Video on X — 198
- Cinematic Tech Intro — 192
- Transparent CTA overlay — 172

These are snapshots, not permanent scores.

## GitHub adoption

Stars are useful for ecosystem adoption, but should be combined with:
- recent commits;
- maintained documentation;
- active examples;
- license clarity;
- actual relevance to the shot.

Do not let a 50k-star general animation framework beat a highly relevant product-film recipe solely on star count.

## Freshness

A trend signal should slowly lose influence if it is not refreshed. Technical/official references decay less because correctness and authority remain useful.

## Recommendation labels

The agent may interpret final search scores approximately as:

```text
90–100  exceptional fit — inspect first
80–89   strong candidate
70–79   useful alternative
60–69   niche / situational
<60     usually skip unless uniquely relevant
```

Always read the notes and implementation cost before choosing.
