# Apple Layout System
## For HLV Brand System Development

*Last updated: December 17, 2025*
*Source: Extracted CSS tokens + 53 reference screenshots*

---

# Overview

This document codifies the spatial logic that creates Apple's "structural confidence"—the invisible scaffolding that tells your eye where to go and signals that someone competent made this.

**Core principle:** The grid serves content, not the other way around. Optical alignment trumps mathematical alignment.

---

# 1. The Base Unit

## 1.1 The 8px Foundation

Everything is built on multiples of 8px:

| Multiple | Value | Common Use |
|----------|-------|------------|
| 1× | 8px | Minimum spacing, icon padding |
| 2× | 16px | Tight element spacing |
| 3× | 24px | Standard element spacing |
| 4× | 32px | Component internal padding |
| 5× | 40px | Section element gaps |
| 6× | 48px | Component gaps |
| 8× | 64px | Section internal padding |
| 10× | 80px | Section vertical padding (tablet) |
| 12× | 96px | Large gaps |
| 12.5× | 100px | Section vertical padding (desktop) |

## 1.2 Why 8px?

- Divides evenly into common screen widths
- Creates consistent rhythm at any scale
- Simple mental math (double, halve, quarter)
- Aligns with default browser/OS spacing

## 1.3 When to Break the Grid

Break the 8px grid only for:
- Optical alignment adjustments (±1-2px)
- Text baseline alignment
- Centering odd-pixel elements

Never break it for:
- "It looks better" without specific rationale
- Arbitrary designer preference
- Matching external assets that don't align

---

# 2. Container Widths

## 2.1 Max-Width Tiers

Apple uses three primary container widths:

| Tier | Max-Width | Use Case |
|------|-----------|----------|
| Narrow | 692px | Body text, focused reading |
| Default | 980px | Standard content, most sections |
| Wide | 1200px | Full-width imagery, expansive layouts |

## 2.2 Container Logic

**Narrow (692px)**
- Optimal line length for body text (65-75 characters)
- Single-column focused content
- Reading-heavy sections
- Quotes and testimonials

**Default (980px)**
- Most section content
- 2-column layouts
- Feature explanations with imagery
- Balanced information density

**Wide (1200px)**
- Full-bleed imagery
- Product hero shots
- Immersive visual sections
- Multi-column grids (3-4 columns)

## 2.3 Centering

Containers are always horizontally centered:

```css
.container {
  max-width: 980px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
}
```

## 2.4 HLV Translation

| Apple Tier | HLV Width | Notes |
|------------|-----------|-------|
| Narrow | 680px | Slightly narrower for Manrope |
| Default | 960px | Clean number |
| Wide | 1200px | Same |

---

# 3. Column Systems

## 3.1 Flexible Columns, Not Fixed Grid

Apple doesn't use a rigid 12-column grid. Instead, they use contextual column divisions:

| Layout | Ratio | Use Case |
|--------|-------|----------|
| Single | 100% | Hero headlines, focused content |
| Split | 50/50 | Equal comparisons, image pairs |
| Asymmetric | 40/60 | Text + larger image |
| Asymmetric | 60/40 | Larger image + text |
| Thirds | 33/33/33 | Stat rows, feature grids |
| Quarters | 25/25/25/25 | Spec grids, icon rows |

## 3.2 Column Gap

Standard gap between columns: **24px** (3× base unit)

For tighter layouts: **16px** (2× base unit)
For looser layouts: **32-48px** (4-6× base unit)

## 3.3 Split Layout Pattern

The most common layout: content on one side, visual on the other.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  [TEXT CONTENT]        │        [VISUAL]         │
│  ~~~~~~~~~~~~~~~~      │        ┌──────┐         │
│  ~~~~~~~~~~~~~~~~      │        │      │         │
│  ~~~~~~~~~~~~~~~~      │        │      │         │
│                        │        └──────┘         │
│  40%                   │           60%           │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Rules:**
- Text column: 40-45% width, max 500px
- Visual column: 55-60% width
- Text vertically centered or top-aligned
- Visual can bleed to edge or have padding

## 3.4 Three-Column Pattern

For stats, features, or comparisons:

```
┌────────────────────────────────────────────────┐
│                                                │
│  [STAT 1]      [STAT 2]      [STAT 3]         │
│  ────────      ────────      ────────         │
│                                                │
└────────────────────────────────────────────────┘
```

**Rules:**
- Equal column widths
- Consistent vertical alignment
- 24-48px gaps between columns
- Content centered within each column

---

# 4. Vertical Spacing

## 4.1 Section Padding

Vertical padding creates breathing room between sections:

| Viewport | Top/Bottom Padding |
|----------|-------------------|
| Desktop (1200px+) | 100px |
| Tablet (768-1199px) | 80px |
| Mobile (<768px) | 56px |

## 4.2 Element Spacing Within Sections

| Relationship | Spacing |
|--------------|---------|
| Eyebrow → Headline | 8-16px |
| Headline → Subhead | 16-24px |
| Headline → Body | 24-32px |
| Body paragraph → paragraph | 16-24px |
| Body → CTA | 24-32px |
| Content block → Content block | 48-64px |
| Text group → Image | 48-80px |

## 4.3 The Rhythm Principle

**Tight:** Related elements
**Medium:** Distinct elements within a group  
**Loose:** Separate groups or sections

```
[Eyebrow]          ← 8px
[HEADLINE]         ← 24px
[Body text...]     ← 24px
[CTA link]         

                   ← 64px (new content block)

[Next headline]
```

## 4.4 Vertical Rhythm Quick Reference

```css
--space-xs: 8px;    /* Eyebrow to headline */
--space-sm: 16px;   /* Tight relationships */
--space-md: 24px;   /* Standard spacing */
--space-lg: 32px;   /* Distinct elements */
--space-xl: 48px;   /* Content blocks */
--space-2xl: 64px;  /* Major separations */
--space-3xl: 80px;  /* Section padding (tablet) */
--space-4xl: 100px; /* Section padding (desktop) */
```

---

# 5. Section Types

## 5.1 Hero Section

**Purpose:** Establish page identity, make primary statement

**Structure:**
```
┌────────────────────────────────────────────────────┐
│                                                    │
│  [Eyebrow]                                         │
│  [LARGE HEADLINE]                    [PRODUCT      │
│  [subhead or body]                    IMAGE]       │
│  [CTA]                                             │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Specifications:**
- Full viewport height or generous padding (120-200px)
- Headline: hero or display-1 size
- Background: dark for drama, light for approachability
- Image: often partial crop, creating intrigue

---

## 5.2 Feature Section

**Purpose:** Explain a specific capability or benefit

**Structure:**
```
┌────────────────────────────────────────────────────┐
│                                                    │
│  [Weight transition headline]                      │
│  [Body explanation]              [FEATURE          │
│  [Optional CTA]                   VISUAL]          │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Specifications:**
- 40/60 or 50/50 split layout
- Weight transition headline typical
- Visual demonstrates the feature
- Can alternate left/right across sections

---

## 5.3 Stats Section

**Purpose:** Communicate impact through numbers

**Structure:**
```
┌────────────────────────────────────────────────────┐
│                                                    │
│        [STAT 1]    [STAT 2]    [STAT 3]           │
│        ────────    ────────    ────────           │
│                                                    │
└────────────────────────────────────────────────────┘
```

or with context:

```
┌────────────────────────────────────────────────────┐
│                                                    │
│  [Headline introducing stats]                      │
│  [Optional body]                                   │
│                                                    │
│        [STAT 1]    [STAT 2]    [STAT 3]           │
│        ────────    ────────    ────────           │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Specifications:**
- 2-4 stats per row
- Stats visually dominant (large numbers)
- Often on dark background for impact
- Paired with explanatory headline

---

## 5.4 Quote Section

**Purpose:** Social proof, human voice

**Structure:**
```
┌────────────────────────────────────────────────────┐
│                                                    │
│  [LIFESTYLE         │  "[Quote text that           │
│   IMAGE]            │   captures the insight.]"    │
│                     │                              │
│                     │  [Name]                      │
│                     │  [Title]                     │
│                     │                              │
│                     │  [STAT 1]    [STAT 2]       │
│                     │  ────────    ────────       │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Specifications:**
- Image on one side (often lifestyle/context)
- Quote + attribution on other
- Stats below quote reinforce credibility
- Often dark background for gravitas

---

## 5.5 Grid Section

**Purpose:** Display multiple related items

**Structure:**
```
┌────────────────────────────────────────────────────┐
│                                                    │
│  [Section headline]                                │
│                                                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │ [Card]  │  │ [Card]  │  │ [Card]  │           │
│  │         │  │         │  │         │           │
│  └─────────┘  └─────────┘  └─────────┘           │
│                                                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐           │
│  │ [Card]  │  │ [Card]  │  │ [Card]  │           │
│  │         │  │         │  │         │           │
│  └─────────┘  └─────────┘  └─────────┘           │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Specifications:**
- 2-4 columns depending on content
- Consistent card structure within grid
- 24px gaps between cards
- Cards on subtle background (#F5F5F7) or transparent

---

## 5.6 Technical/Spec Section

**Purpose:** Dense information display

**Structure:**
```
┌────────────────────────────────────────────────────┐
│                                                    │
│  [Tab navigation: Option 1 | Option 2 | Option 3] │
│  ─────────────────                                 │
│                                                    │
│  [Value 1]   [Value 2]   [Value 3]   [Value 4]   │
│  [label]     [label]     [label]     [label]     │
│                                                    │
│  ┌─────────────────────────────────────────────┐  │
│  │ [Benchmark visualization]                    │  │
│  │                                              │  │
│  └─────────────────────────────────────────────┘  │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Specifications:**
- Tab navigation for configurations
- Spec grid below tabs
- Optional visualization/chart
- Light background (#F5F5F7) typical
- Dense but structured

---

## 5.7 Values/Mission Section

**Purpose:** Communicate brand values, human impact

**Structure:**
```
┌────────────────────────────────────────────────────┐
│  [COLORED BACKGROUND]                              │
│                                                    │
│  [Headline about values]     │  [Quote or         │
│  [Body explaining            │   supporting        │
│   commitment...]             │   statement]        │
│                              │                     │
│                              │  [Attribution]      │
│                                                    │
│  ┌──────────────┐  ┌──────────────┐               │
│  │ [Lifestyle   │  │ [Lifestyle   │               │
│  │  image 1]    │  │  image 2]    │               │
│  └──────────────┘  └──────────────┘               │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Specifications:**
- Colored background (green for environmental, etc.)
- White text for contrast
- Human/lifestyle imagery
- Image pairs common
- Warmer, more approachable tone

---

# 6. Dark/Light Mode Logic

## 6.1 When to Use Dark

**Dark backgrounds for:**
- Hardware revelations (chips, internals, cutaways)
- Performance data and charts
- Professional/pro-user content
- Cinematic drama, premium positioning
- Technology deep-dives
- Stats requiring impact

**Dark specifications:**
- Background: #000000 or #1D1D1F
- Primary text: #FFFFFF
- Secondary text: #86868B
- Accent: gradient or brand color
- Links: #2997FF

## 6.2 When to Use Light

**Light backgrounds for:**
- Values and mission content
- Environmental/sustainability messaging
- Text-heavy explanations
- Human/lifestyle contexts
- Educational content
- Approachable, welcoming sections

**Light specifications:**
- Background: #FFFFFF or #F5F5F7
- Primary text: #1D1D1F
- Secondary text: #6E6E73
- Accent: brand color
- Links: #0066CC

## 6.3 Transition Patterns

Sections typically alternate:
```
[Dark hero]
    ↓
[Light features]
    ↓
[Dark performance/stats]
    ↓
[Light explanation]
    ↓
[Colored values section]
```

The rhythm prevents monotony while dark sections create focus punctuation.

## 6.4 HLV Application

| Apple Context | HLV Context | Mode |
|---------------|-------------|------|
| Hardware reveal | Methodology reveal | Dark |
| Performance stats | Program outcomes | Dark |
| Values/mission | HLV philosophy | Light or Colored |
| Feature explanation | Curriculum detail | Light |
| Technical specs | Program structure | Light (#F5F5F7) |

---

# 7. Information Density Modes

## 7.1 The Spectrum

Apple operates across a density spectrum:

| Mode | Content/Space Ratio | Use Case |
|------|---------------------|----------|
| Expansive | 20% content, 80% space | Heroes, dramatic statements |
| Balanced | 40% content, 60% space | Feature sections, explanations |
| Dense | 60% content, 40% space | Specs, comparisons, reference |

## 7.2 Expansive Mode

**Characteristics:**
- Maximum whitespace
- Single focal point
- Large typography
- Minimal elements

**When to use:**
- Page openings
- Major statements
- Product reveals
- Emotional impact moments

**Example:**
```
┌────────────────────────────────────────────────────┐
│                                                    │
│                                                    │
│                                                    │
│              [HEADLINE]                            │
│              [subhead]                             │
│                                                    │
│                                                    │
│                                                    │
└────────────────────────────────────────────────────┘
```

## 7.3 Balanced Mode

**Characteristics:**
- Comfortable whitespace
- Clear hierarchy
- Multiple elements but not crowded
- Reading-friendly

**When to use:**
- Feature explanations
- Body content sections
- Standard content pages

**Example:**
```
┌────────────────────────────────────────────────────┐
│                                                    │
│  [Headline]                    [Visual]            │
│  [body text body text                              │
│   body text body text]                             │
│  [CTA]                                             │
│                                                    │
└────────────────────────────────────────────────────┘
```

## 7.4 Dense Mode

**Characteristics:**
- Compact spacing
- Multiple data points
- Structured layouts (grids, tables)
- Scannable organization

**When to use:**
- Technical specifications
- Comparison tables
- Reference content
- Configuration options

**Example:**
```
┌────────────────────────────────────────────────────┐
│ [Tab 1] [Tab 2] [Tab 3] [Tab 4] [Tab 5]          │
│ ─────────                                          │
│ [Val 1]  [Val 2]  [Val 3]  [Val 4]               │
│ [lbl]    [lbl]    [lbl]    [lbl]                 │
│                                                    │
│ [App 1]  ━━━━━━━━━━━━━━━━ [result]               │
│ [App 2]  ━━━━━━━━━━━ [result]                    │
│ [App 3]  ━━━━━━ [baseline]                       │
└────────────────────────────────────────────────────┘
```

## 7.5 Density Transitions

Moving from expansive to dense (or vice versa) should be gradual:

```
[EXPANSIVE - Hero]
    ↓
[BALANCED - Feature 1]
    ↓
[BALANCED - Feature 2]
    ↓
[DENSE - Specs/comparison]
    ↓
[BALANCED - Closing section]
```

Avoid jumping directly from expansive to dense—it's jarring.

---

# 8. Alignment & Optical Adjustments

## 8.1 Text Alignment

**Left-align:**
- Body text (always)
- Headlines in split layouts
- Lists and structured content

**Center-align:**
- Standalone headlines
- Short taglines
- Stats and their labels
- Single-column focused content

**Never right-align** body text or headlines (except in RTL languages).

## 8.2 Optical Centering

Mathematical center ≠ visual center.

**Adjustments needed for:**
- Text with ascenders/descenders
- Images with visual weight off-center
- Icons within containers

General rule: Move 2-5% toward visual center of mass.

## 8.3 Baseline Alignment

When elements sit side-by-side at different sizes, align baselines, not tops:

```
✓ Correct:
   [Large text]  [small text]
   ───────────────────────────

✗ Incorrect:
   [Large text]
   [small text]
```

## 8.4 Edge Alignment

In split layouts, text and images don't share the same edge:

```
┌────────────────────────────────────────┐
│                                        │
│    [Text block]  ←gap→  [Image]       │
│    aligned to            bleeds to     │
│    content edge          section edge  │
│                                        │
└────────────────────────────────────────┘
```

The gap creates breathing room and visual hierarchy.

---

# 9. Responsive Behavior

## 9.1 Breakpoint Strategy

| Breakpoint | Width | Layout Behavior |
|------------|-------|-----------------|
| Large | 1200px+ | Full layouts, wide containers |
| Medium | 768-1199px | Reduced padding, tighter grids |
| Small | <768px | Single column, stacked elements |

## 9.2 Column Collapse

```
Desktop (3-col):
[Col 1]  [Col 2]  [Col 3]

Tablet (2-col):
[Col 1]  [Col 2]
[Col 3]

Mobile (1-col):
[Col 1]
[Col 2]
[Col 3]
```

## 9.3 Split Layout Collapse

```
Desktop:
[Text 40%] [Image 60%]

Mobile:
[Image 100%]
[Text 100%]
```

Image typically moves above text on mobile (visual hook first).

## 9.4 Spacing Reduction

| Spacing Type | Desktop | Tablet | Mobile |
|--------------|---------|--------|--------|
| Section padding | 100px | 80px | 56px |
| Element gaps | 48px | 40px | 32px |
| Component padding | 32px | 24px | 20px |
| Side margins | 48px | 32px | 24px |

## 9.5 Typography Scaling

See Typography System document for responsive type scales.

---

# 10. The "UI Scaffolding" Principle

## 10.1 What Creates Structural Confidence

The "invisible UI" that signals competence:

**Consistent alignment**
- Elements snap to implicit grid lines
- Nothing feels arbitrary or floating
- Related items share alignment axes

**Subtle containment**
- Light backgrounds (#F5F5F7) define zones without borders
- Cards group related content without outlines
- Whitespace creates separation without dividers

**Navigation patterns**
- Tab interfaces for options
- Chevrons for progression
- Underlines for active states

**Typographic hierarchy**
- Clear 1st, 2nd, 3rd reading order
- Weight and color create structure
- No competing hierarchies

## 10.2 What to Avoid

**Explicit scaffolding:**
- Visible borders around content
- Box shadows for containment
- Decorative dividers
- Background patterns

**Competing structures:**
- Multiple alignment systems
- Inconsistent spacing
- Mixed navigation patterns
- Unclear hierarchy

## 10.3 The Test

If you removed all color and imagery, would the layout still feel organized? If yes, the scaffolding is working.

---

# 11. Layout Checklist

Before finalizing any layout:

**Grid & Containers**
- [ ] Using defined max-widths (692/980/1200)
- [ ] Consistent column ratios
- [ ] 8px-based spacing throughout

**Vertical Rhythm**
- [ ] Section padding appropriate for viewport
- [ ] Element spacing follows relationship rules
- [ ] No arbitrary gaps

**Section Logic**
- [ ] Appropriate section type for content
- [ ] Dark/light mode matches content type
- [ ] Density mode appropriate

**Alignment**
- [ ] Consistent text alignment
- [ ] Baseline alignment for mixed sizes
- [ ] Optical adjustments where needed

**Responsive**
- [ ] Graceful column collapse
- [ ] Appropriate spacing reduction
- [ ] Mobile-first content order

**Scaffolding**
- [ ] Implicit structure, not explicit
- [ ] No decorative containers
- [ ] Clear visual hierarchy

---

# 12. HLV Implementation

## 12.1 CSS Custom Properties

```css
:root {
  /* Containers */
  --container-narrow: 680px;
  --container-default: 960px;
  --container-wide: 1200px;
  
  /* Spacing */
  --space-unit: 8px;
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-2xl: 64px;
  --space-3xl: 80px;
  --space-4xl: 100px;
  
  /* Section Padding */
  --section-padding-desktop: 100px;
  --section-padding-tablet: 80px;
  --section-padding-mobile: 56px;
  
  /* Column Gaps */
  --gap-tight: 16px;
  --gap-default: 24px;
  --gap-loose: 48px;
  
  /* Backgrounds */
  --bg-dark: #0A0F1C;
  --bg-light: #FFFFFF;
  --bg-subtle: #F5F5F7;
  --bg-navy: #182D53;
}
```

## 12.2 Utility Classes

```css
/* Containers */
.container { max-width: var(--container-default); margin: 0 auto; padding: 0 24px; }
.container--narrow { max-width: var(--container-narrow); }
.container--wide { max-width: var(--container-wide); }

/* Sections */
.section { padding: var(--section-padding-desktop) 0; }
.section--dark { background: var(--bg-dark); color: white; }
.section--light { background: var(--bg-light); }
.section--subtle { background: var(--bg-subtle); }

/* Layouts */
.split { display: grid; grid-template-columns: 40% 60%; gap: var(--gap-default); align-items: center; }
.split--reverse { grid-template-columns: 60% 40%; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gap-default); }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gap-default); }

/* Responsive */
@media (max-width: 768px) {
  .section { padding: var(--section-padding-mobile) 0; }
  .split, .split--reverse { grid-template-columns: 1fr; }
  .grid-3, .grid-4 { grid-template-columns: 1fr; }
}
```

## 12.3 Component Patterns

See Component Library for specific component implementations within these layout structures.

---

*This document pairs with the Component Library and Typography System for complete implementation guidance.*

---

**Next deliverable:** Decision Framework document synthesizing when-to-use rules across all systems.
