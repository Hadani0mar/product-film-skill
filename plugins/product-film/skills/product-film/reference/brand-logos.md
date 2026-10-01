# Brand logos — DBLogo discovery and download

Use this system when a film explicitly mentions or visually represents a **real external company, product, app, platform, service, technology brand, integration, partner, competitor, or provider**.

Examples:
- OpenAI / ChatGPT / Codex
- Claude / Anthropic
- Gemini / Google
- Microsoft / Copilot
- GitHub
- Figma
- Slack
- WhatsApp
- Supabase
- Vercel
- AWS

This is separate from UI icons. Do not represent a named brand with a generic Phosphor/Lucide icon when its actual logo is visually required.

## Source order

1. Brand assets supplied by the user or already present in the product repository.
2. Official brand/press kit when the project already provides or explicitly requires it.
3. **DBLogo** for fast brand-logo discovery and production assets.
4. Official brand website if DBLogo is missing, stale, or ambiguous.
5. Never invent/redraw a famous brand mark from memory when a real asset is available.

DBLogo:
- search: https://dblogo.com/search
- brand pages: https://dblogo.com/logo/<slug>
- formats commonly include SVG and PNG
- common variants include logo, icon, wordmark, colored, black, white, light and dark.

## Search engine

Use the bundled zero-dependency search tool:

```bash
node scripts/brand-logo-search.mjs search "Claude" --sort popular
node scripts/brand-logo-search.mjs search "OpenAI"
node scripts/brand-logo-search.mjs search "Microsoft Copilot"
```

Inspect available variants:

```bash
node scripts/brand-logo-search.mjs files claude --match "logo colored light svg"
node scripts/brand-logo-search.mjs files openai --match "icon black light svg"
```

Download the preferred asset:

```bash
node scripts/brand-logo-search.mjs download claude --match "logo colored light svg"
node scripts/brand-logo-search.mjs download openai --match "icon black light svg"
```

Default download location:

```text
public/brand-logos/<brand>/<asset>.<svg|png>
```

A custom path can be supplied:

```bash
node scripts/brand-logo-search.mjs download gemini --match "icon colored light svg" --out public/brand-logos/gemini.svg
```

## Variant selection

Default preference:
1. SVG over PNG for scalable video work.
2. Correct semantic form:
   - **logo** for normal brand identification;
   - **icon** for compact integrations/app grids;
   - **wordmark** when the name must be readable.
3. Correct contrast for the scene:
   - colored/light assets for light neutral canvases when appropriate;
   - white/dark assets for dark backgrounds;
   - black/light assets for monochrome light backgrounds.
4. Preserve the brand's native appearance.

Do not choose a wordmark when the shot only has space for an icon, and do not use an icon when the audience may not recognize it.

## Motion rules for external brands

External logos are marks, not effect canvases.

Prefer:
- opacity reveal;
- masked reveal around the container;
- scale/settle of the whole mark;
- positional travel;
- logo grid orchestration;
- orbit/layout choreography;
- cards, chips, nodes or connectors carrying the mark.

Avoid unless official guidelines clearly allow it:
- recoloring;
- stretching/skewing;
- changing proportions;
- redrawing;
- morphing the internal mark geometry;
- exploding the mark into particles;
- adding gradients inside a flat official mark;
- implying endorsement or partnership that the product does not actually have.

Animate the **container, camera, mask, scene or relationship** before distorting the logo itself.

## Brand truth

A logo may only appear when the story has a legitimate reason to show that brand:
- real integration;
- comparison explicitly requested by the user;
- supported provider;
- source/provider attribution;
- factual ecosystem diagram;
- contextual mention.

Do not decorate a film with famous logos merely to create perceived credibility.

## Trademark and licensing

DBLogo is a catalog/discovery source, not a blanket trademark license.

Brand names, logos and trademarks remain property of their respective owners. For commercial/public work:
- preserve attribution/source records;
- follow the brand owner's official usage guidelines;
- verify sensitive or campaign-critical uses against the official brand site;
- if DBLogo appears outdated, use the official source instead.

Record external marks in `videos/SOURCES.json`, including:
- brand;
- DBLogo page;
- selected asset page;
- local path;
- official source if verified;
- any relevant usage restriction.

## QA

Before final render:
- correct company/app is represented;
- current logo variant is used;
- no accidental old/rebranded mark;
- SVG is preferred where available;
- light/dark contrast is correct;
- logo is not distorted;
- safe area/clear space remains visually credible;
- no unsupported partnership implication;
- source is recorded.
