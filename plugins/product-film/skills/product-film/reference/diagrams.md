# Diagram and node-flow system

## Purpose

Use this system when the film needs to explain relationships rather than merely show UI.

Typical requests:

- mind maps;
- workflows;
- process diagrams;
- decision trees;
- approval flows;
- system architecture;
- data pipelines;
- feature maps;
- dependency graphs;
- node-to-node explainers.

The preferred structural source is **React Flow / xyflow**.

Website:

- https://reactflow.dev/

Repository:

- https://github.com/xyflow/xyflow

Package:

- `@xyflow/react`

License:

- MIT for the core open-source library.

React Flow Pro exists separately. Do not use Pro-only templates, assets or examples unless the user has access and the individual terms permit it.

## Architecture

React Flow answers:

> What are the nodes, edges, handles, groups and positions?

Remotion answers:

> When does each node appear, when does each edge draw, where does the camera move, and how does the viewer travel through the graph?

Use this split:

```text
story / process
      ↓
nodes + edges
      ↓
React Flow geometry / layout
      ↓
deterministic Remotion choreography
      ↓
node reveal → edge draw → camera follow → branch → focus → resolve
```

Do not depend on React Flow's interactive runtime state as the final playback clock.

## Source-first workflow

1. Check whether the product already has a process diagram or node system.
2. If not, install/sync React Flow:

```bash
node scripts/source-manager.mjs info react-flow
node scripts/source-manager.mjs sync react-flow
```

3. Define the semantic graph as data.
4. Use product components for custom nodes whenever possible.
5. Use React Flow geometry/helpers for node placement and edges.
6. Drive all visible animation from Remotion time.
7. Review first/middle/last frames plus every node-to-node handoff.

## Graph data

Keep the information model separate from rendering:

```ts
const nodes = [
  {id: "close", position: {x: 0, y: 0}, data: {label: "إغلاق الوردية"}},
  {id: "summary", position: {x: 420, y: 0}, data: {label: "ملخص الوردية"}},
  {id: "owner", position: {x: 840, y: 0}, data: {label: "إشعار صاحب النشاط"}},
];

const edges = [
  {id: "close-summary", source: "close", target: "summary"},
  {id: "summary-owner", source: "summary", target: "owner"},
];
```

The graph is the source of truth. Motion state must not rewrite the graph.

## Node design

Prefer custom nodes built from:

1. the product's real card/button/status components;
2. Component Arsenal sources;
3. an original deterministic node only if necessary.

A node should have one semantic job.

Examples:

- action;
- process;
- decision;
- document;
- database;
- actor;
- status;
- result;
- metric.

Do not make every node a generic rounded rectangle.

Use shape semantics intentionally:

- rounded card → normal process;
- diamond / split node → decision;
- pill → status;
- document surface → record/report;
- circle → compact event;
- database cylinder only when the story genuinely represents stored data.

## Edge motion

Edges should communicate causality.

Good sequence:

```text
Node A becomes active
       ↓
source handle pulses/presses once
       ↓
edge draws toward B
       ↓
camera follows the traveling front
       ↓
edge reaches B
       ↓
Node B opens / morphs / gains emphasis
```

Do not animate every edge at the same time unless the story explicitly shows broadcasting.

For SVG edges, use frame-driven path drawing:

```tsx
const progress = edgeProgress(t, start, duration);

<path
  d={path}
  pathLength={1}
  strokeDasharray={1}
  strokeDashoffset={1 - progress}
/>
```

If an edge carries a visible traveler, use a dot/icon/card fragment only when it represents something real: data, approval, message, payment, document, notification.

## Branches

For a decision:

```text
        Decision
        /      \
      yes      no
      /          \
 success       review
```

Animate:

1. decision node lands;
2. decision state changes;
3. leading branch draws;
4. second branch follows with a measured stagger;
5. camera reframes to show the result.

Do not make a branch split decorative. It must correspond to a real choice or state.

## Camera

Node-flow films benefit from a camera that travels through the graph.

Use:

- focus node bounds;
- edge midpoint;
- branch bounding box;
- active subgraph bounds.

Avoid a camera that continuously wanders.

A good node-flow camera alternates:

```text
overview
→ node focus
→ edge travel
→ destination focus
→ branch overview
→ final system overview
```

## Mind maps

For mind maps, use hierarchy rather than arbitrary graph motion.

Recommended sequence:

```text
central idea
   ↓
first major branch
   ↓
its child nodes
   ↓
return/reframe
   ↓
next major branch
   ↓
final overview
```

Do not reveal the entire map at once.

For dense maps, animate only the current branch at full contrast and keep inactive branches subdued.

## Workflow videos

For process/workflow videos, the edge itself can become the transition language.

Examples:

- line enters next node and becomes its divider;
- edge arrow becomes a progress indicator;
- node border stretches into the outgoing edge;
- status dot leaves one node and becomes the icon of the next;
- chart line exits a data node and becomes a connector.

This preserves object lineage and avoids slideshow-like cuts.

## Deterministic adaptation

React Flow is an interactive library; a product film is deterministic.

Do not rely on:

- user drag state;
- hover state from the browser;
- live pan/zoom interaction;
- runtime layout changes driven by effects;
- CSS transition timing;
- animation clocks outside Remotion.

Instead:

- lock node positions after layout;
- pass explicit active/focus states;
- derive edge progress from `t`;
- derive node reveal from `t`;
- derive camera from timed graph focus keys;
- script cursor interactions explicitly when needed.

## Layout

For small explanatory films, manually measured layout is often best.

For larger graphs, use a deterministic layout pass, then freeze the result before rendering.

Do not recompute layout differently on arbitrary frames.

The final frame at time `t` must be reproducible without rendering earlier frames.

## Motion vocabulary

Preferred node-flow motion:

- node reveal;
- edge draw;
- edge traveler;
- branch split;
- node morph;
- state change;
- focus ring/outline only if product language supports it;
- camera reframe;
- subgraph collapse;
- graph overview.

Avoid:

- random node floating;
- bouncing nodes;
- decorative orbiting;
- glowing neon connections by default;
- particles traveling on every edge;
- every node animating independently without story logic.

## Film brief

Before coding, write:

```text
Graph purpose:
What relationship/process is being explained?

Node types:
Which nodes are actions, decisions, statuses, actors, data, outputs?

Primary path:
A → B → C

Branches:
B → D if condition X

Traveler:
What visibly moves from one node to another?

Camera plan:
overview → A → edge AB → B → branch → final overview

Source components:
Which product/arsenal components form each node?

React Flow role:
structure / edge geometry / layout

Remotion role:
all timing and animation
```

## Provenance

Record React Flow when used:

```bash
node scripts/source-manifest.mjs add \
  --id process-map \
  --source xyflow/xyflow \
  --path packages/react \
  --license MIT \
  --adaptation "React Flow graph structure and edge geometry; animation driven by Remotion time" \
  --twin
```

## Quality bar

A strong node-flow scene should make the viewer understand:

- where the process begins;
- what travels or changes;
- which node is active;
- why the next node appears;
- where branches come from;
- where the process ends.

If the viewer needs to read every label before understanding the direction, the motion hierarchy is weak.
