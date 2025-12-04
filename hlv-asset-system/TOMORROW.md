# Tomorrow's Priorities: Build the Asset System

**Date:** Thursday, December 5, 2025  
**Focus:** Build and test the token-driven asset pipeline

---

## The Test We're Running

**Hypothesis:** A token-driven system can generate assets to SVG, PNG, and native PPTX, and when tokens change, all outputs update correctly.

**Success criteria:**
1. ✅ Generate one diagram from spec → SVG
2. ✅ Generate PNG from SVG
3. ✅ Generate PPTX slide with native shapes
4. ✅ Change Navy color in tokens.json
5. ✅ Rebuild → all three outputs reflect the change
6. ✅ No manual editing required

---

## Morning Block: Build the Generator (2-3 hours)

### 1. Set Up Project in Claude Code
```bash
# Initialize the project
cd hlv-asset-system
npm init -y
npm install pptxgenjs sharp
```

**Files to bring in:**
- `tokens.json` (design values)
- `grid.json` (canvas/spacing)
- `components.json` (box/connector definitions)
- `diagram-types.json` (layout rules)
- `slide-export.json` (PPTX mapping)
- `diagrams/reframing-process-flow.json` (test diagram)

---

### 2. Build Core Modules

**Token Resolver** (`lib/tokens.js`)
- Load tokens.json
- Resolve `@colors.primary.navy` → `#182D53`
- Handle nested references

**SVG Generator** (`lib/svg-generator.js`)
- Take diagram spec + resolved tokens
- Output SVG string
- Apply grid/spacing rules

**PNG Converter** (`lib/png-converter.js`)
- Take SVG → output PNG at 2x
- Use Sharp or similar

**PPTX Generator** (`lib/pptx-generator.js`)
- Take diagram spec + resolved tokens
- Use pptxgenjs to create native shapes
- Map components per slide-export.json

---

### 3. Build CLI Entry Point

```bash
# Generate all formats for a diagram
hlv-assets build diagrams/reframing-process-flow.json

# Output:
# ✓ dist/svg/reframing-process-flow.svg
# ✓ dist/png/reframing-process-flow.png
# ✓ dist/pptx/reframing-process-flow.pptx
```

---

## Afternoon Block: Test the Update Pipeline (1-2 hours)

### 4. Run the First Build
- Generate all three outputs
- Open PPTX - verify shapes are editable (not images!)
- Verify colors match tokens

### 5. Change a Token
Edit `tokens.json`:
```json
"navy": "#182D53"  →  "navy": "#1A3A66"
```

### 6. Rebuild and Verify
```bash
hlv-assets build diagrams/reframing-process-flow.json
```

- [ ] SVG has new color
- [ ] PNG has new color  
- [ ] PPTX has new color
- [ ] No manual editing required

**If this works, the system is proven.**

---

## End of Day: Document & Plan

### 7. Capture Learnings
- What worked?
- What was harder than expected?
- Any spec changes needed?

### 8. Plan Asset Batch
If the pipeline works, list the next diagrams to build:
- [ ] Six Reframing Strategies Wheel
- [ ] Elevator Problem Comparison
- [ ] Strategy Icons (6)
- [ ] Reframing Canvas Template

---

## Files Ready for Tomorrow

```
hlv-asset-system/
├── tokens.json              ✅ Created
├── grid.json                ✅ Created
├── components.json          ✅ Created
├── diagram-types.json       ✅ Created
├── slide-export.json        ✅ Created
├── diagrams/
│   └── reframing-process-flow.json  ✅ Created
├── lib/                     🔨 Build tomorrow
│   ├── tokens.js
│   ├── svg-generator.js
│   ├── png-converter.js
│   └── pptx-generator.js
├── cli.js                   🔨 Build tomorrow
└── dist/                    📦 Generated output
    ├── svg/
    ├── png/
    └── pptx/
```

---

## Quick Reference

| Token | Current Value |
|-------|---------------|
| Navy | `#182D53` |
| Emerald | `#00D866` |
| Font | Manrope |
| Grid unit | 8px |
| Box radius | 8px |
| Standard box | 160×80px |

---

## Time Estimate

| Task | Duration |
|------|----------|
| Project setup | 15 min |
| Token resolver | 30 min |
| SVG generator (basic) | 60-90 min |
| PNG converter | 15 min |
| PPTX generator | 60-90 min |
| CLI wrapper | 15 min |
| Testing & verification | 30 min |
| **Total** | ~4-5 hours |

This is a full day of focused coding. The payoff is a system that scales.
