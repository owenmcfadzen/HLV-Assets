# Claude Guide: HLV Asset System

This guide helps Claude (or you) efficiently use the asset generation system.

## Quick Reference

### Creating a New Diagram

**Option 1: Template-based (recommended)**
```bash
cd hlv-asset-system
node cli.js new <type> "<name>"
node cli.js build diagrams/<id>.json
```

**Option 2: Direct JSON creation**
Create a JSON file in `diagrams/` following the spec format, then build.

### Available Commands

| Command | Purpose |
|---------|---------|
| `node cli.js types` | List all diagram types with descriptions |
| `node cli.js variants` | List box style variants |
| `node cli.js tokens` | Show current design token values |
| `node cli.js new <type> "<name>"` | Create diagram from template |
| `node cli.js build <file>` | Generate SVG + PNG + PPTX |
| `node cli.js build-all` | Rebuild all diagrams |
| `node cli.js validate <file>` | Check spec for errors |

---

## Workflow: User Describes a Diagram → Claude Generates

### Step 1: Understand the Request
When user says something like:
- "Create a diagram showing the 5 stages of design thinking"
- "Make a comparison of old vs new approach"
- "I need a flow chart for our onboarding process"

### Step 2: Choose Diagram Type

| User Request | Type | Variant |
|--------------|------|---------|
| "steps", "process", "flow" | `flow` | `horizontal` |
| "vs", "comparison", "before/after" | `comparison` | `before-after` |
| "cycle", "wheel", "connected concepts" | `wheel` | `segmented` |
| "matrix", "2x2", "quadrant" | `matrix` | `2x2` |
| "hierarchy", "org chart", "tree" | `hierarchy` | `top-down` |

### Step 3: Create the Diagram Spec

**For a flow diagram:**
```json
{
  "type": "flow",
  "canvas": "diagram_wide",
  "meta": {
    "id": "design-thinking-process",
    "name": "Design Thinking Process"
  },
  "content": {
    "title": "Design Thinking Process",
    "steps": [
      { "id": "empathize", "label": "Empathize", "variant": "default" },
      { "id": "define", "label": "Define", "variant": "default" },
      { "id": "ideate", "label": "Ideate", "variant": "highlight" },
      { "id": "prototype", "label": "Prototype", "variant": "default" },
      { "id": "test", "label": "Test", "variant": "primary" }
    ]
  },
  "export": { "svg": true, "png": true, "pptx": true }
}
```

### Step 4: Build & Verify
```bash
node cli.js build diagrams/design-thinking-process.json
```

---

## Box Variants Quick Reference

| Variant | Use For |
|---------|---------|
| `default` | Standard steps, neutral elements |
| `primary` | Key/hero elements (navy fill, white text) |
| `highlight` | Emphasis with green accent border |
| `muted` | Background/secondary elements (gray) |
| `success` | Positive outcomes (green border) |
| `error` | Problems, issues (red border) |

---

## Token Updates: Changing the Design System

When user wants to change colors, fonts, or spacing:

1. **Edit** `tokens.json` with new values
2. **Rebuild** all diagrams:
   ```bash
   node cli.js build-all
   ```
3. All SVG, PNG, and PPTX files regenerate with new tokens

**Example: Changing primary navy color**
```json
// In tokens.json
"colors": {
  "primary": {
    "navy": "#1A3A66"  // Changed from #182D53
  }
}
```

---

## Diagram Type Specs

### Flow (Implemented ✓)
```json
{
  "type": "flow",
  "content": {
    "title": "Process Title",
    "subtitle": "Optional description",
    "steps": [
      { "id": "step-1", "label": "Step Name", "variant": "default" }
    ]
  }
}
```

### Comparison (Implemented ✓)
```json
{
  "type": "comparison",
  "variant": "before-after",
  "content": {
    "title": "Comparison Title",
    "columns": [
      {
        "id": "left",
        "header": { "text": "Before", "variant": "error" },
        "flow": { "steps": [...] },
        "annotation": { "text": "Note text" }
      },
      {
        "id": "right",
        "header": { "text": "After", "variant": "success" },
        "flow": { "steps": [...] }
      }
    ],
    "divider": { "style": "vs", "label": "vs" }
  }
}
```

---

## Common Patterns

### "Show me the current tokens"
```bash
node cli.js tokens
```

### "What diagram types can you make?"
```bash
node cli.js types
```

### "Regenerate everything"
```bash
node cli.js build-all
```

### "Just make the SVG, not PPTX"
```bash
node cli.js build diagrams/my-diagram.json --svg
```

---

## File Locations

| Item | Path |
|------|------|
| Diagram specs | `hlv-asset-system/diagrams/*.json` |
| Generated SVGs | `hlv-asset-system/dist/svg/` |
| Generated PNGs | `hlv-asset-system/dist/png/` |
| Generated PPTXs | `hlv-asset-system/dist/pptx/` |
| Design tokens | `hlv-asset-system/tokens.json` |
| Component defs | `hlv-asset-system/components.json` |

---

## After Generating Assets

1. **Commit to repo:**
   ```bash
   git add hlv-asset-system/diagrams/ hlv-asset-system/dist/
   git commit -m "Add [diagram-name] diagram"
   git push
   ```

2. **Get raw URLs for Notion:**
   ```
   https://raw.githubusercontent.com/owenmcfadzen/HLV-Assets/main/hlv-asset-system/dist/svg/<id>.svg
   ```

---

## Not Yet Implemented

These diagram types have specs but no generator yet:
- `wheel` (circular/cycle diagrams)
- `matrix` (2x2 grids)
- `hierarchy` (tree structures)
- `funnel` (funnel charts)
- `timeline` (chronological)
- `stack` (layered diagrams)

Claude can add these by extending `svg-generator.js` and `pptx-generator.js`.
