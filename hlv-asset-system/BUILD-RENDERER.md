# HLV Asset System — Build Task

## Overview

Build a programmatic design system that generates visual assets (SVG, PNG, PPTX) from declarative JSON layout definitions combined with design tokens.

## Repository

- **GitHub:** `owenmcfadzen/HLV-Assets`
- **GitHub PAT:** Stored in Claude memory (request from user or retrieve from memory if available)

## Existing Files (already in repo)

These files define the design specification — read them first:

```
hlv-asset-system/
├── tokens.json           # Design tokens (colors, typography, spacing, components)
├── layout-schema.json    # JSON schema that layouts must follow
└── layouts/
    └── double-diamond.json  # Example layout to test with
```

## What You Need to Build

### 1. Directory Structure

Create this structure in the repo:

```
hlv-asset-system/
├── tokens.json              # EXISTS
├── layout-schema.json       # EXISTS
├── layouts/                 # EXISTS
│   └── double-diamond.json  # EXISTS
├── renderer/
│   ├── index.js            # Main entry point
│   ├── generate.js         # Generation orchestrator
│   ├── svg-renderer.js     # SVG output
│   ├── png-renderer.js     # PNG output (sharp, 2x scale)
│   ├── pptx-renderer.js    # PPTX output (pptxgenjs)
│   ├── utils.js            # Token resolution, grid calculations
│   └── validate.js         # Layout validation against schema
├── package.json            # Dependencies and scripts
└── README.md               # Documentation
outputs/
├── svg/
├── png/
└── pptx/
manifest.json               # Generated: tracks all outputs
```

### 2. Core Functionality

#### Token Resolution (`utils.js`)

```javascript
// Resolve nested token paths: "primary.navy" → "#182D53"
function resolveToken(path, tokens) { }

// Resolve text style to CSS-like object
function resolveTextStyle(styleName, tokens) { }

// Resolve component style (node, edge, card, etc.)
function resolveComponentStyle(componentType, componentName, tokens) { }

// Convert grid position to pixel coordinates
function gridToPixels(gridPosition, canvasType, tokens) {
  // Input: { col: 3, row: 2, colSpan: 2, rowSpan: 1, align: 'center' }
  // Output: { x, y, width, height }
}
```

#### SVG Renderer (`svg-renderer.js`)

- Generate valid SVG 1.1
- Embed Manrope font via Google Fonts import or inline
- Render in order: shapes → nodes → edges → annotations
- Handle all node types: box, phase, circle, diamond, card, label
- Handle all edge types: arrow, line, dashed, curved
- Support style overrides per element

#### PNG Renderer (`png-renderer.js`)

- Use `sharp` library
- Render SVG to PNG at 2x scale (3840×2160 for standard canvas)
- Ensure font rendering works (may need to convert text to paths)

#### PPTX Renderer (`pptx-renderer.js`)

- Use `pptxgenjs` library
- Create single slide per diagram
- Map tokens to PPTX theme colors where possible
- Preserve visual fidelity as closely as possible

#### Generator (`generate.js`)

```javascript
// CLI interface
// npm run generate              → all layouts, all formats
// npm run generate -- --layout=double-diamond
// npm run generate -- --format=svg
// npm run generate -- --layout=double-diamond --format=png
```

### 3. package.json

```json
{
  "name": "hlv-asset-system",
  "version": "1.0.0",
  "description": "Programmatic design system for HLV educational materials",
  "main": "renderer/index.js",
  "scripts": {
    "generate": "node renderer/generate.js",
    "validate": "node renderer/validate.js"
  },
  "dependencies": {
    "sharp": "^0.33.0",
    "pptxgenjs": "^3.12.0"
  },
  "devDependencies": {
    "ajv": "^8.12.0"
  }
}
```

### 4. Manifest Output

After generation, create `manifest.json` at repo root:

```json
{
  "generated": "2025-01-15T10:30:00Z",
  "tokenVersion": "1.0.0",
  "outputs": [
    {
      "id": "double-diamond",
      "name": "Double Diamond Process",
      "category": "framework",
      "files": {
        "svg": "outputs/svg/double-diamond.svg",
        "png": "outputs/png/double-diamond.png",
        "pptx": "outputs/pptx/double-diamond.pptx"
      },
      "dimensions": { "width": 1920, "height": 1080 }
    }
  ]
}
```

## Key Implementation Details

### Grid Calculation

For standard canvas (1920×1080):
- Margin: 80px
- Gutter: 24px  
- Content area: 1760×920
- Column width: (1760 - 11×24) / 12 ≈ 124px
- Row height: (920 - 5×24) / 6 ≈ 133px

Grid position (col, row) → pixel position:
```
x = margin + (col - 1) × (columnWidth + gutter)
y = margin + (row - 1) × (rowHeight + gutter)
```

### Shape Rendering

For shapes with grid-based points (like the diamond polygons), convert each point's col/row to x/y pixels, then render as SVG polygon.

### Text Handling

- Use textStyles from tokens for consistent typography
- Center text in nodes by default
- Support textAnchor: start, middle, end

### Arrows

Arrow heads should be:
- Filled triangles
- Size defined in component tokens (headSize, headLength)
- Rotate to match line direction

## Acceptance Criteria

1. `npm install` completes without errors
2. `npm run generate` produces:
   - `outputs/svg/double-diamond.svg` — valid, renders correctly
   - `outputs/png/double-diamond.png` — 3840×2160, crisp
   - `outputs/pptx/double-diamond.pptx` — opens in PowerPoint
3. `manifest.json` is generated with correct metadata
4. All files committed to GitHub

## After Building

1. Show me the generated SVG for double-diamond
2. Confirm all files are committed to GitHub
3. Show me the manifest.json
4. Run through one complete regeneration to verify the pipeline works
