# HLV Assets

Visual asset repository for Hudson Lab Ventures curriculum materials. This repo serves as the single source of truth for images, diagrams, icons, and templates used across HLV and GEC programs.

## 🔗 Integration with Notion

Assets stored here are embedded in Notion pages via raw.githubusercontent.com URLs:

```
https://raw.githubusercontent.com/owenmcfadzen/HLV-Assets/main/{path}/{filename}
```

**Example:**
```markdown
<image source="https://raw.githubusercontent.com/owenmcfadzen/HLV-Assets/main/diagrams/double-diamond.png">Double Diamond Process</image>
```

## 📁 Folder Structure

| Folder | Type | Description |
|--------|------|-------------|
| `/diagrams/` | Diagram | Process flows, frameworks, concept maps |
| `/illustrations/` | Illustration | Explanatory visuals, scene illustrations |
| `/icons/` | Icon | Small visual elements, symbols |
| `/templates/` | Template | Worksheets, forms, canvases |
| `/slide-decks/` | Slide Deck | Presentation exports, slide images |
| `/photos/` | Photo | Photography, real-world images |

This structure mirrors the **Type** property in the Notion Asset Library database.

## 📝 Naming Convention

```
{concept}-{variant}.{format}
```

Examples:
- `double-diamond-process.png`
- `five-whys-diagram.svg`  
- `lean-canvas-template.pdf`
- `empathy-interview-icon.png`

**Rules:**
- Lowercase with hyphens (no spaces or underscores)
- Descriptive but concise
- Include variant suffix if multiple versions exist (e.g., `-light`, `-dark`, `-v2`)

## 🎨 Format Guidelines

| Use Case | Recommended Format |
|----------|-------------------|
| Diagrams, icons | SVG (scalable) or PNG (if complex) |
| Photos | JPG or PNG |
| Templates | PDF (printable) or PNG (embeddable) |
| Animations | GIF or MP4 |

**Resolution:** Minimum 2x for retina displays (e.g., 1600px wide for a 800px display width)

## 🔄 Workflow

1. **Claude creates/processes** an image
2. **Claude commits** to this repo via GitHub API
3. **Claude embeds** the raw URL in Notion
4. **You can update** any image later — same URL, new content

## 📋 Notion Asset Library Sync

Each asset in this repo should have a corresponding entry in the [Notion Asset Library](https://www.notion.so/2443cbc622eb425ca2224ac27526bb8f) with:
- **Asset Name:** Matches filename (without extension)
- **Type:** Matches folder name
- **Format:** PNG, SVG, PDF, etc.
- **File Link:** Raw GitHub URL
- **Status:** Done (once committed)

---

*Maintained by Owen McFadzen & Claude*
