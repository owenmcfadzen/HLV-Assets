# Apple Design Decision Framework
## For HLV Brand System Development

*Last updated: December 17, 2025*
*Synthesized from: Component Library, Typography System, Layout System*

---

# Overview

This document is the "when faced with X, choose Y because Z" guide. It connects the what (components, typography, layout) to the why (communication goals) through decision logic.

**Use this when:** You're designing something new and need to make consistent choices without referencing three separate documents.

---

# 1. The Master Decision Tree

## 1.1 Start Here: What Are You Communicating?

```
What's the primary job of this content?
│
├─► Making a statement/claim
│   └─► Go to: Section 2 (Headlines & Claims)
│
├─► Showing impact/results
│   └─► Go to: Section 3 (Stats & Metrics)
│
├─► Explaining how something works
│   └─► Go to: Section 4 (Features & Explanations)
│
├─► Providing social proof
│   └─► Go to: Section 5 (Quotes & Testimonials)
│
├─► Displaying options/specifications
│   └─► Go to: Section 6 (Technical & Reference)
│
├─► Communicating values/mission
│   └─► Go to: Section 7 (Values & Brand)
│
└─► Opening a page/major section
    └─► Go to: Section 8 (Heroes & Introductions)
```

---

# 2. Headlines & Claims

## 2.1 Decision: Single Weight or Weight Transition?

```
Is the headline making a claim that needs immediate context?
│
├─► Yes: Does it need explanation right after?
│   │
│   ├─► Yes: Use WEIGHT TRANSITION
│   │   • Bold claim (≤8 words) + regular continuation
│   │   • Period after the claim
│   │   • Example: "Power to change everything. Say hello to..."
│   │
│   └─► No: Use SINGLE-WEIGHT HEADLINE
│       • Full headline in semibold/bold
│       • Example: "Share an idea and watch it grow."
│
└─► No: Use SINGLE-WEIGHT HEADLINE
    • Semibold for section headlines
    • Bold for hero headlines
```

## 2.2 Decision: Gradient Accent or Plain Text?

```
Is this the single most important thing on the page?
│
├─► Yes: Is it a product name, key metric, or breakthrough feature?
│   │
│   ├─► Yes: Use GRADIENT TEXT (once per page maximum)
│   │   • Apply to the specific word/phrase
│   │   • Use brand-appropriate gradient
│   │
│   └─► No: Use PLAIN TEXT with hierarchy
│
└─► No: Use PLAIN TEXT
    • Hierarchy through size/weight, not decoration
```

## 2.3 Decision: What Size?

| Content Type | Size Token | Typical px |
|--------------|------------|------------|
| Page title/hero | `hero` | 80-96px |
| Major section opener | `display-1` | 56-80px |
| Section headline | `headline-1` | 32-40px |
| Feature headline | `headline-2` | 28-32px |
| Card/component headline | `headline-3` | 24-28px |

---

# 3. Stats & Metrics

## 3.1 Decision: How to Display Numbers?

```
How impressive is the number on its own?
│
├─► Very impressive (stands alone)
│   └─► Use MASSIVE STAT CALLOUT
│       • Number: 56-96px
│       • Label: 12-14px below
│       • Let the number speak
│
├─► Needs context to be meaningful
│   └─► Use STAT WITH CONTEXT
│       • "Up to" or qualifier above
│       • Number prominent but not massive
│       • Explanation alongside
│
└─► Part of a set/comparison
    └─► How many stats?
        │
        ├─► 2 stats: Use STAT PAIR
        │   • Side by side, equal weight
        │   • 48-80px gap between
        │
        ├─► 3-4 stats: Use STAT ROW
        │   • Horizontal row, equal columns
        │   • Consistent structure
        │
        └─► 5+ stats: Use SPEC GRID
            • Tabular layout
            • Light background (#F5F5F7)
```

## 3.2 Decision: Stat Styling?

| Context | Number Color | Background |
|---------|--------------|------------|
| Performance/impact | White or gradient | Dark |
| General metrics | Primary text | Light |
| Comparison winner | Accent color | Either |
| Supporting data | Secondary text | Light |

---

# 4. Features & Explanations

## 4.1 Decision: Layout for Feature Content?

```
Does the feature have a strong visual component?
│
├─► Yes: How prominent should the visual be?
│   │
│   ├─► Visual is primary (product shot, demo)
│   │   └─► Use SPLIT LAYOUT (60% visual / 40% text)
│   │       • Visual on right (typically)
│   │       • Text left-aligned on left
│   │       • Can alternate sides across sections
│   │
│   ├─► Visual and text equal importance
│   │   └─► Use SPLIT LAYOUT (50/50)
│   │       • Balanced columns
│   │       • Vertical divider optional
│   │
│   └─► Visual is supporting
│       └─► Use STACKED LAYOUT
│           • Text above, image below (or vice versa)
│           • Text constrained to narrow width
│
└─► No: Text-only feature
    └─► Use CENTERED TEXT BLOCK
        • Narrow container (692px max)
        • Weight transition headline
        • Body copy below
```

## 4.2 Decision: Dark or Light Background?

```
What type of feature is this?
│
├─► Technical/performance feature
│   └─► DARK BACKGROUND
│       • Creates focus
│       • Signals "serious" content
│       • Use for: chips, internals, benchmarks
│
├─► User benefit/lifestyle feature
│   └─► LIGHT BACKGROUND
│       • Creates approachability
│       • Signals "human" content
│       • Use for: daily use, accessibility, convenience
│
├─► Explanation of how something works
│   └─► LIGHT BACKGROUND (usually)
│       • Educational content
│       • Unless explaining internal tech → then dark
│
└─► Environmental/values feature
    └─► COLORED BACKGROUND or LIGHT
        • Green for environmental
        • Light for general values
```

## 4.3 Decision: Information Density?

```
How much detail does the user need?
│
├─► Overview/introduction
│   └─► EXPANSIVE MODE
│       • 20% content, 80% space
│       • Large type, minimal elements
│       • One key message
│
├─► Understanding/comprehension
│   └─► BALANCED MODE
│       • 40% content, 60% space
│       • Weight transition headlines
│       • Supporting body copy
│
└─► Reference/comparison
    └─► DENSE MODE
        • 60% content, 40% space
        • Structured grids
        • Scannable organization
```

---

# 5. Quotes & Testimonials

## 5.1 Decision: Quote Presentation?

```
What's the context for this quote?
│
├─► Case study/success story
│   └─► Use QUOTE CARD (full treatment)
│       • Image + quote + attribution + stats
│       • Dark background for gravitas
│       • Split layout (image | quote+stats)
│
├─► Expert endorsement
│   └─► Use QUOTE BLOCK
│       • Quote + attribution only
│       • Can be on light or dark
│       • Centered or in column layout
│
├─► Pull quote within content
│   └─► Use INLINE QUOTE
│       • Larger text than body
│       • Subtle styling (no heavy borders)
│       • Attribution smaller, below
│
└─► Multiple testimonials
    └─► Use QUOTE GRID or CAROUSEL
        • Consistent card structure
        • 2-3 visible at once
        • Navigation if needed
```

## 5.2 Quote Specifications

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Quote text | 21-28px, #1D1D1F | 21-28px, #FFFFFF |
| Quote marks | Curly, same color as text | Curly, same color |
| Name | 14-17px, semibold | 14-17px, semibold |
| Title | 14px, regular, secondary color | 14px, regular, #86868B |

---

# 6. Technical & Reference Content

## 6.1 Decision: How to Structure Specs?

```
What are users doing with this information?
│
├─► Comparing options/configurations
│   └─► Use TAB NAVIGATION + SPEC GRID
│       • Tabs for each option
│       • Grid below shows specs for selected
│       • Light background (#F5F5F7)
│
├─► Understanding capabilities
│   └─► Use SPEC ROW or FEATURE LIST
│       • 3-4 key specs in row
│       • Large values, small labels
│       • Can include icons
│
├─► Detailed reference
│   └─► Use STRUCTURED TABLE
│       • Clear headers
│       • Consistent columns
│       • Adequate row spacing
│
└─► Learning a process/controls
    └─► Use ICON + TEXT LIST
        • Icon/visual on left
        • Explanation on right
        • Grouped by category
```

## 6.2 Decision: Visualization for Data?

```
What story does the data tell?
│
├─► "We're better than competition"
│   └─► Use PERFORMANCE CHART
│       • Gradient line for your product
│       • Gray line for competitor
│       • Stat callouts alongside
│
├─► "Here's the relative performance"
│   └─► Use BENCHMARK BARS
│       • Horizontal bars
│       • Baseline labeled
│       • Multiplier callouts
│
├─► "Here's how it's built"
│   └─► Use EXPLODED DIAGRAM
│       • Layers separated
│       • Navigation optional
│       • Educational tone
│
└─► "Here are the components"
    └─► Use ANNOTATED IMAGE
        • Product image with callouts
        • Lines/hotspots to details
        • Clean, minimal labels
```

---

# 7. Values & Brand Content

## 7.1 Decision: Values Section Treatment?

```
What's the emotional register?
│
├─► Inspiring/aspirational
│   └─► COLORED BACKGROUND
│       • Brand-appropriate color
│       • White text
│       • Human imagery
│       • Warmer typography
│
├─► Informational/factual
│   └─► LIGHT BACKGROUND
│       • Standard text colors
│       • Can include stats
│       • More structured layout
│
└─► Dramatic/impactful
    └─► DARK BACKGROUND
        • White text
        • Large imagery
        • Minimal copy
```

## 7.2 Values Content Patterns

| Goal | Layout | Elements |
|------|--------|----------|
| Mission statement | Centered, wide | Large headline, body, no image |
| Commitment showcase | Split | Text + quote | Human imagery |
| Impact metrics | Stats section | Large numbers, context |
| Story/narrative | Stacked | Images + extended copy |

---

# 8. Heroes & Introductions

## 8.1 Decision: Hero Type?

```
What's the page/section about?
│
├─► Product launch/announcement
│   └─► Use HERO SPLIT
│       • Product image prominent (60%)
│       • Text with eyebrow, headline, CTA
│       • Dark for drama, light for accessibility
│
├─► Feature/capability page
│   └─► Use CENTERED HERO
│       • Headline centered
│       • Subhead below
│       • Product/visual below or behind
│
├─► Values/about page
│   └─► Use TEXT-FOCUSED HERO
│       • Large headline, ample space
│       • Minimal or no imagery
│       • Colored or light background
│
└─► Campaign/marketing
    └─► Use IMMERSIVE HERO
        • Full-bleed imagery
        • Overlay text or below image
        • Maximum visual impact
```

## 8.2 Hero Specifications

| Element | Specification |
|---------|---------------|
| Eyebrow | 12-14px, semibold, secondary color |
| Headline | 56-96px, bold, primary color |
| Subhead | 21-28px, regular, secondary color |
| CTA | Text link with chevron, or button |
| Vertical padding | 120-200px (generous) |
| Container | Wide (1200px) for imagery, default for text |

---

# 9. Section Sequencing

## 9.1 Page Flow Patterns

**Product Page:**
```
1. [Dark hero - product reveal]
2. [Light feature - key benefit 1]
3. [Light feature - key benefit 2] (alternate side)
4. [Dark performance - stats/benchmarks]
5. [Light technical - specs grid]
6. [Light values - environmental]
7. [Light CTA - purchase/learn more]
```

**Values/About Page:**
```
1. [Light hero - mission statement]
2. [Colored values - commitment area 1]
3. [Light explanation - how we do it]
4. [Image pair - human impact]
5. [Stats - impact metrics]
6. [Quote - leadership voice]
```

**Feature Page:**
```
1. [Dark hero - feature announcement]
2. [Light explanation - how it works]
3. [Dark deep-dive - technical details]
4. [Light use cases - applications]
5. [Specs - reference grid]
```

## 9.2 Transition Rules

| From | To | Transition |
|------|-----|------------|
| Dark | Light | Clean break, adequate padding |
| Light | Dark | Clean break, adequate padding |
| Light | Light | Subtle background shift (white ↔ #F5F5F7) |
| Dark | Dark | Avoid unless necessary; use divider line |
| Light | Colored | Clean break |
| Colored | Light | Clean break |

---

# 10. Component Selection Quick Reference

## 10.1 "I need to show..."

| I need to show... | Use this component |
|-------------------|-------------------|
| A major claim | Weight transition headline |
| The "news" | Gradient text marker |
| An impressive number | Massive stat callout |
| Two related metrics | Stat pair |
| Multiple specs | Spec grid |
| A feature + visual | Feature card or split layout |
| Someone's words | Quote card/block |
| User options | Tab menu |
| A link to more | Text link CTA |
| Performance comparison | Performance chart |
| How something's built | Exploded diagram |
| Product options | Grid section |
| Values/mission | Colored section |

## 10.2 "The content is..."

| The content is... | Use this treatment |
|-------------------|-------------------|
| Technical/performance | Dark background |
| Human/lifestyle | Light background |
| Values/mission | Light or colored background |
| Educational/explanation | Light background |
| High-density reference | Light with subtle gray (#F5F5F7) |

## 10.3 "The user needs to..."

| The user needs to... | Use this pattern |
|----------------------|------------------|
| Understand quickly | Expansive mode, large type |
| Learn in detail | Balanced mode, weight transitions |
| Reference/compare | Dense mode, structured grids |
| Choose an option | Tab navigation |
| Take action | CTA with icon |
| See proof | Quote + stats |

---

# 11. Common Mistakes & Corrections

## 11.1 Typography Mistakes

| Mistake | Correction |
|---------|------------|
| Weight transition with no period after claim | Always use period after bold claim |
| Claim too long (>8 words) | Shorten claim, move detail to continuation |
| Multiple gradients per page | One gradient maximum per page |
| Body text at wrong size | Body is always 16-17px |
| Tight line-height on body | Body line-height: 1.47-1.5 |

## 11.2 Layout Mistakes

| Mistake | Correction |
|---------|------------|
| Arbitrary spacing | Use 8px multiples only |
| Too many elements in expansive mode | Expansive = one focal point |
| Dense content on dark background | Dense content needs light background |
| Jumping expansive → dense directly | Transition through balanced mode |
| Visible borders/boxes | Use whitespace and subtle backgrounds |

## 11.3 Component Mistakes

| Mistake | Correction |
|---------|------------|
| Stats without context | Include label explaining what the number means |
| Quote without attribution | Always include name + title |
| Feature card without visual | Cards need image/icon or use text block instead |
| Multiple CTAs competing | One primary CTA per section |
| Tab menu for 2 options | Use toggle or simple choice, not tabs |

---

# 12. HLV-Specific Decision Guide

## 12.1 Program Content

| HLV Content | Component Choice | Background |
|-------------|------------------|------------|
| Program name/launch | Gradient text in hero | Dark |
| Program outcomes | Stat pair or row | Dark |
| Module explanation | Weight transition + split layout | Light |
| Methodology framework | Exploded diagram | Light |
| Student testimonial | Quote card | Dark |
| Facilitator guide content | Balanced mode, text-focused | Light |
| Curriculum overview | Tab navigation + grid | Light (#F5F5F7) |
| Values/philosophy | Colored section | Navy or Emerald |

## 12.2 HLV Color Decisions

| Context | Background | Text | Accent |
|---------|------------|------|--------|
| Hero/dramatic | Dark (#0A0F1C) | White | Emerald gradient |
| Standard content | White | Navy (#182D53) | Emerald |
| Reference/specs | Subtle (#F5F5F7) | Navy | — |
| Values | Navy (#182D53) | White | Emerald |
| Environmental | Emerald-tinted | White | — |

## 12.3 HLV Typography Decisions

| Content | Size | Weight | Treatment |
|---------|------|--------|-----------|
| Program name | 64-80px | Bold | Gradient optional |
| Section headline | 32px | Semibold | Weight transition |
| Module headline | 24-28px | Semibold | Plain or weight transition |
| Body copy | 16px | Regular | — |
| Stat number | 48-64px | Bold | — |
| Stat label | 12-14px | Regular | Secondary color |

---

# 13. The One-Page Cheat Sheet

## Typography
- **Weight transition:** Bold claim + period + regular continuation
- **Gradient:** One per page, on "the news"
- **Scale:** 96 → 80 → 56 → 48 → 40 → 32 → 28 → 24 → 21 → 17 → 14 → 12
- **Line-height:** Headlines tight (1.05-1.15), body relaxed (1.47-1.5)

## Layout
- **Base unit:** 8px (everything is multiples)
- **Containers:** 692px (narrow), 980px (default), 1200px (wide)
- **Section padding:** 100px desktop, 80px tablet, 56px mobile
- **Column gaps:** 16px tight, 24px default, 48px loose

## Sections
- **Dark:** Performance, tech, drama
- **Light:** Education, human, values
- **Colored:** Mission, inspiration

## Density
- **Expansive:** 20/80 — heroes, statements
- **Balanced:** 40/60 — features, explanations
- **Dense:** 60/40 — specs, reference

## Never
- Decorative elements
- Borders/boxes around content
- Multiple gradients
- Competing hierarchies
- Arbitrary spacing

---

*This framework synthesizes the Component Library, Typography System, and Layout System into actionable decision logic.*

---

**Research deliverables complete:**

| Document | Purpose |
|----------|---------|
| Component Library | What patterns exist |
| Typography System | How type works |
| Layout System | How space works |
| Decision Framework | When to use what |

**Next phase:** Apply to HLV brand system development.
