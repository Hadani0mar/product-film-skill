# Production Pipeline: design gates before expensive rendering

Treat the film as a production system with explicit gates. Do not jump from prompt to polish.

## Gate 0 — Product truth
Pass only when:
- product purpose is understood;
- real features/claims are identified;
- sensitive or private data is excluded;
- source material is known.

Output: concise product brief.

## Gate 1 — Direction
Pass only when:
- one-sentence concept exists;
- audience/platform/objective are explicit;
- brand tokens are captured;
- motion grammar and camera grammar are chosen;
- energy curve is sketched.

Output: BRAND.md + creative direction.

## Gate 2 — Shot architecture
Pass only when every major shot has:
- narrative job;
- hero;
- shot recipe;
- duration or beat range;
- transition carrier;
- required asset/source;
- audio event if relevant;
- energy level.

Output: shot-plan.json using templates/shot-plan.example.json.

## Gate 3 — Style proof
Render 3 representative style frames:
- hook;
- dense/product feature;
- payoff/close.

Reject the direction if hierarchy, product recognition, typography, or brand fidelity fail here.

## Gate 4 — Motion proof
Build the hardest 1–2 shots first. Render short previews around their full motion arcs.
Validate:
- deterministic timing;
- camera readability;
- transition continuity;
- browser/WebGL reliability;
- acceptable render cost.

Do not build the whole film around an unproven effect.

## Gate 5 — Assembly
Build all scenes using the same grammar. Maintain:
- scene-map.json;
- SOURCES.json;
- shot-plan.json;
- deterministic frame-driven animation;
- named cue/beat data.

## Gate 6 — Technical QA
Run:
- TypeScript/syntax checks;
- preflight;
- smoke stills first/middle/last per scene;
- handoff-window stills;
- fast preview render;
- missing asset checks.

## Gate 7 — Independent creative QA
Review the full piece as if you did not build it.
Check:
- concept coherence;
- product truth;
- focal hierarchy;
- repeated/redundant tricks;
- pacing and breathing room;
- recipe appropriateness;
- transition continuity;
- typography legibility;
- audio-motion sync;
- effect restraint;
- CTA/logo hold.

When possible, use a separate agent/subagent/context for the final critique to reduce maker bias.

## Gate 8 — Delivery QA
Verify:
- exact duration;
- expected fps;
- decode succeeds;
- audio contract;
- finite vs loop contract;
- final frame behavior;
- color/range sanity;
- all requested deliverables exist.

Only then deliver.

## Failure policy

If a gate fails, go back to the nearest design decision that caused it. Do not cover structural problems with more FX.
