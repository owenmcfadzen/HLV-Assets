---
name: hlv-asset-system
description: "Generate visual assets (diagrams, slides, frameworks) for HLV curriculum using a token-based design system. Renders SVG, PNG, and PPTX from declarative JSON layouts. Use when asked to create, update, or regenerate HLV visual materials."
---

# HLV Asset System

Programmatic design system for Hudson Lab Ventures educational materials. Separates **structure** (layout JSON) from **style** (tokens), enabling consistent brand application and bulk regeneration.

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  tokens.json    │────▶│  layouts/*.json  │────▶│   Renderer      │
│  (design specs) │     │  (diagram defs)  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        │                       │
   Style tokens             Structure only          SVG / PNG / PPTX
   (colors, type,           (nodes, edges,              outputs
    spacing, etc.)           positions)
```

**Key principle:** Layout files define *what* a diagram communicates. Tokens define *how* it looks. Change tokens → regenerate all assets automatically.

---

## Repository

| Resource | Location |
|----------|----------|
| GitHub Repo | `owenmcfadzen/HLV-Assets` |
| GitHub PAT | Stored in Claude memory (never commit to repo) |
| Design Tokens | `hlv-asset-system/tokens.json` |
| Layout Schema | `hlv-asset-system/layout-schema.json` |
| Layouts | `hlv-asset-system/layouts/*.json` |
| Renderer | `hlv-asset-system/renderer/` |
| Outputs | `outputs/svg/`, `outputs/png/`, `outputs/pptx/` |

---

## Quick Reference: Design Tokens

### Colors

| Role | Token Path | Hex | Usage |
|------|------------|-----|-------|
| Primary | `primary.navy` | #182D53 | Headlines, structure |
| Primary Light | `primary.navyLight` | #2E4A7D | Secondary structure |
| Accent | `accent.green` | #22C55E | HLV focus, highlights (use sparingly) |
| Tertiary | `tertiary.amber` | #F59E0B | Examples, tips, secondary info |
| Text Primary | `text.primary` | #1F2937 | Body text (readable charcoal) |
| Text Emphasis | `text.emphasis` | #111827 | Key terms, emphasis |
| Text Secondary | `text.secondary` | #4B5563 | Subheadings, secondary |
| Text Muted | `text.muted` | #6B7280 | Captions, annotations |

### Typography

| Style | Size | Weight | Color | Usage |
|-------|------|--------|-------|-------|
| `displayTitle` | 48px | semibold | Navy | Diagram titles |
| `displayHeadline` | 64px | bold | Navy | Hero headlines |
| `h1` | 40px | bold | Navy | Primary headings |
| `h2` | 32px | semibold | Navy | Section headings |
| `h3` | 24px | semibold | Slate | Subheadings |
| `body` | 16px | regular | Charcoal | Body text |
| `bodyMuted` | 16px | regular | Slate | Secondary content |
| `caption` | 12px | medium | Gray | Annotations |
| `tag` | 10px | semibold | White | Badges (on color) |

### Grid (Standard Canvas: 1920×1080)

| Property | Value |
|----------|-------|
| Columns | 12 |
| Rows | 6 |
| Margin | 80px |
| Gutter | 24px |

---

## Workflows

### Creating a New Diagram

1. **Design the layout** — Define what the diagram communicates
2. **Create layout JSON** — Structure as nodes, edges, annotations
3. **Generate outputs** — Run renderer to produce SVG/PNG/PPTX
4. **Commit to GitHub** — Version control all outputs
5. **Update manifest** — Track in manifest.json

#### Layout JSON Structure

```json
{
  "id": "diagram-name",
  "name": "Human Readable Name",
  "description": "What this diagram teaches",
  "canvas": "standard",
  
  "annotations": {
    "title": { "text": "Diagram Title" },
    "subtitle": { "text": "Supporting context" },
    "caption": { "text": "Footer note" }
  },
  
  "nodes": [
    {
      "id": "node-1",
      "type": "phase",
      "label": "DISCOVER",
      "grid": { "col": 2, "row": 3, "colSpan": 2 }
    }
  ],
  
  "edges": [
    {
      "from": "node-1",
      "to": "node-2",
      "type": "arrow"
    }
  ],
  
  "metadata": {
    "category": "framework",
    "tags": ["design-thinking"],
    "usage": "When to use this diagram"
  }
}
```

### Node Types

| Type | Description | Default Style |
|------|-------------|---------------|
| `box` | Generic container | Light gray fill, border |
| `boxNavy` | Navy container | Navy fill, white text |
| `boxAccent` | Highlighted container | Green pale fill, green border |
| `boxWarm` | Warm container | Amber pale fill, amber border |
| `phase` | Process phase (pill) | Navy fill, white text, full radius |
| `circle` | Circular node | Navy fill |
| `diamond` | Decision point | Navy fill, rotated |
| `card` | Content card | White fill, border, optional header |
| `label` | Text only | No background |

### Edge Types

| Type | Description |
|------|-------------|
| `arrow` | Solid line with arrowhead (navy) |
| `arrowAccent` | Solid line with arrowhead (green) |
| `arrowMuted` | Thin line with arrowhead (gray) |
| `line` | Solid line, no arrowhead |
| `dashed` | Dashed line |
| `curved` | Bezier curve with arrowhead |

### Updating Design Tokens

When brand elements change:

1. Edit `tokens.json` with new values
2. Run `npm run generate` to regenerate all assets
3. Commit updated outputs to GitHub
4. All diagrams now reflect new brand

---

## Generation Commands

```bash
# Generate all layouts, all formats
npm run generate

# Generate specific layout
npm run generate -- --layout=double-diamond

# Generate specific format only
npm run generate -- --format=svg

# Combine flags
npm run generate -- --layout=double-diamond --format=png
```

---

## Output Specifications

| Format | Details |
|--------|---------|
| **SVG** | Valid SVG 1.1, embedded fonts, optimized |
| **PNG** | 2× scale (3840×2160 for standard), retina-ready |
| **PPTX** | Single slide per diagram, theme colors mapped |

---

## Grid Position Reference

Grid positions use 1-indexed columns and rows:

```
     1    2    3    4    5    6    7    8    9   10   11   12
   ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
 1 │    │    │    │    │    │    │    │    │    │    │    │    │ ← Title zone
   ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
 2 │    │    │    │    │    │    │    │    │    │    │    │    │
   ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
 3 │    │    │    │    │    │    │    │    │    │    │    │    │ ← Content
   ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
 4 │    │    │    │    │    │    │    │    │    │    │    │    │    zone
   ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
 5 │    │    │    │    │    │    │    │    │    │    │    │    │
   ├────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┼────┤
 6 │    │    │    │    │    │    │    │    │    │    │    │    │ ← Caption zone
   └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘
```

Example positions:
- `{ "col": 1, "row": 1 }` → Top-left
- `{ "col": 6, "row": 3, "colSpan": 2 }` → Center, spanning 2 columns
- `{ "col": 10, "row": 6 }` → Bottom-right area

---

## File Naming

```
{diagram-id}.{format}
```

Examples:
- `double-diamond.svg`
- `build-measure-learn.png`
- `three-boxes.pptx`

---

## Manifest

After generation, `manifest.json` tracks all outputs:

```json
{
  "generated": "2025-01-15T10:30:00Z",
  "tokenVersion": "1.0.0",
  "outputs": [
    {
      "id": "double-diamond",
      "name": "Double Diamond Process",
      "files": {
        "svg": "outputs/svg/double-diamond.svg",
        "png": "outputs/png/double-diamond.png",
        "pptx": "outputs/pptx/double-diamond.pptx"
      }
    }
  ]
}
```

---

## Checklist: Adding a Diagram

- [ ] Create `layouts/{diagram-id}.json`
- [ ] Validate against schema
- [ ] Run `npm run generate -- --layout={diagram-id}`
- [ ] Verify SVG renders correctly
- [ ] Verify PNG is crisp at 2×
- [ ] Verify PPTX opens correctly
- [ ] Commit all outputs to GitHub
- [ ] Confirm manifest.json updated

---

## Related Resources

| Resource | Location |
|----------|----------|
| Full tokens specification | `hlv-asset-system/tokens.json` |
| Layout schema | `hlv-asset-system/layout-schema.json` |
| Example layout | `hlv-asset-system/layouts/double-diamond.json` |
