---
name: hlv-design-system
description: "Master skill for HLV Design System. Use when creating any HLV materials—slides, documents, copy, web content, curriculum. Orchestrates design decisions, references system documentation, and ensures quality consistency across all outputs."
---

# HLV Design System — AI Operations Skill

The master guide for creating HLV materials with consistent quality and design integrity.

---

## When to Use This Skill

**Trigger phrases:**
- "Create a slide/presentation/deck"
- "Write copy for..." 
- "Design a page/document/worksheet"
- "Make this look like HLV"
- "Apply the design system"
- "Create GEC/HLV content"
- Any request involving HLV visual or written materials

**This skill orchestrates.** For specific tasks, it may hand off to:
- `hlv-slide-design` → Slide-specific spacing, typography, patterns
- `hlv-asset-generator` → Diagrams, icons, illustrations
- `hlv-slides-generator` → Google Slides templates
- `hlv-design-system-updater` → Token changes

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHILOSOPHY & STRATEGY                        │
│                    Why we design this way                       │
│                    The binding document                         │
├─────────────────────────────────────────────────────────────────┤
│                    DECISION FRAMEWORK                           │
│                    When to use what                             │
│                    Start here for any new design                │
├──────────────────┬──────────────────┬───────────────────────────┤
│   COMPONENT      │   TYPOGRAPHY     │      LAYOUT               │
│   LIBRARY        │   SYSTEM         │      SYSTEM               │
│                  │                  │                           │
│   What patterns  │   How type       │      How space            │
│   exist          │   works          │      works                │
└──────────────────┴──────────────────┴───────────────────────────┘
```

### Document Locations

| Document | Location | Purpose |
|----------|----------|---------|
| Philosophy & Strategy | Project knowledge / Notion | Why and for whom — read first |
| Decision Framework | Project knowledge / Notion | When to use what — navigation layer |
| Component Library | Project knowledge / Notion | What patterns exist — reference |
| Typography System | Project knowledge / Notion | How type works — implementation |
| Layout System | Project knowledge / Notion | How space works — implementation |

### When to Consult What

| Situation | Start Here |
|-----------|------------|
| Starting any new design | Decision Framework |
| Making a judgment call | Philosophy & Strategy |
| Choosing a component | Decision Framework → Component Library |
| Setting type styles | Typography System |
| Determining spacing/layout | Layout System |
| Evaluating quality | Philosophy (craft principles) |
| Understanding the "why" | Philosophy & Strategy |

---

## Core Design Tokens

### Colors

```
Primary:
  navy: '#182D53'        — Primary brand, headers, text
  emerald: '#00D866'     — Accent, highlights, CTAs
  white: '#FFFFFF'       — Backgrounds, text on dark

Neutrals:
  gray100: '#F5F5F7'     — Subtle backgrounds
  gray500: '#86868B'     — Secondary text (dark mode)
  gray600: '#6E6E73'     — Secondary text (light mode)
  gray900: '#1D1D1F'     — Primary text (light mode)

Semantic:
  link-light: '#0066CC'  — Links on light backgrounds
  link-dark: '#2997FF'   — Links on dark backgrounds
```

### Typography

```
Font: Manrope (fallback: system-ui, sans-serif)

Scale:
  hero:       80px  — Page titles
  display-1:  64px  — Section heroes  
  display-2:  48px  — Major headlines
  display-3:  40px  — Section headlines
  headline-1: 32px  — Feature headlines
  headline-2: 28px  — Card headlines
  headline-3: 24px  — Component headlines
  title-1:    21px  — Large body, pull quotes
  title-2:    18px  — Medium emphasis
  body:       16px  — Standard body copy
  callout:    14px  — Secondary text, labels
  caption:    12px  — Metadata, footnotes

Weights:
  400 — Regular (body copy)
  500 — Medium (UI elements)
  600 — Semibold (headlines, emphasis)
  700 — Bold (hero headlines)
  800 — Extrabold (display headlines)

Line Heights:
  Headlines: 1.05-1.15 (tight)
  Body: 1.47-1.5 (relaxed)
```

### Spacing

```
Base unit: 8px

Tokens:
  xs:   8px   — Minimum spacing
  sm:   16px  — Tight element spacing
  md:   24px  — Standard spacing
  lg:   32px  — Component padding
  xl:   48px  — Component gaps
  xxl:  64px  — Section internal
  section: 100px — Section padding (desktop)

Containers:
  narrow:  680px  — Body text, focused reading
  default: 960px  — Standard content
  wide:    1200px — Full-width imagery
```

---

## The HLV Design Philosophy

### Core Principle: Confident Minimalism

Every element must earn its place. Restraint is respect for learner attention.

### The Five Pillars

1. **Earn Every Element** — If it doesn't have a job, remove it
2. **Let Content Breathe** — Generous space signals confidence
3. **Create Hierarchy Through Contrast** — Size, weight, color, space—not decoration
4. **Maintain Rhythm** — 8px grid, consistent patterns
5. **Sweat the Details** — Alignment, punctuation, typography

### Never Do

- Decorative elements (swooshes, patterns, shapes)
- Borders or boxes around content
- Drop shadows on text
- More than one gradient accent per composition
- Competing visual hierarchies
- Arbitrary spacing (off the 8px grid)
- Fill space for the sake of filling it

---

## Decision Logic

### Starting Any Design

```
1. What's the communication job?
   └─→ Check Decision Framework Section 1

2. Who's the audience?
   └─→ Students: Prioritize clarity, scannable
   └─→ Facilitators: Comprehensive but navigable
   └─→ Partners: Premium, credible

3. What's the content type?
   └─→ Check Decision Framework for component selection

4. Dark or light treatment?
   └─→ Technical/performance → Dark
   └─→ Educational/values → Light
   └─→ Mission/inspiration → Colored (Navy or Emerald tint)
```

### Weight Transition Technique

The signature HLV typographic move:

```
[BOLD CLAIM]. [Regular continuation that provides context...]
```

**Rules:**
- Bold portion: 600-700 weight, primary color
- Regular portion: 400 weight, secondary color (#6E6E73)
- Period after the claim (it's a complete thought)
- Claim should be ≤8 words
- Same font size for both portions

**Use when:**
- Introducing features or concepts
- Making claims that need context
- Opening sections with explanatory content
- Headlines that would otherwise be too long

### Gradient Accent

Reserved for "the news" — the single most important thing.

**Rules:**
- One per page maximum
- Apply to product names, key metrics, breakthrough features
- Use emerald-based gradient for HLV
- Never on body copy, only display text

---

## Production Workflows

### Creating Slides

1. Consult Decision Framework for slide types needed
2. Apply Layout System for spacing and structure
3. Use Component Library patterns (hero, stats, features, quotes)
4. Apply Typography System for text styling
5. Check against quality checklist
6. Hand off to `hlv-slides-generator` for template implementation if needed

### Writing Copy

1. Check Philosophy for voice and tone
2. Reference audience (students vs facilitators vs partners)
3. Apply headline patterns from Typography System
4. Use weight transitions where appropriate
5. Keep sentences short, active voice
6. Check against copy principles:
   - Clear, not clever
   - Confident, not arrogant
   - Concrete over abstract
   - Respect the reader

### Creating Documents

1. Determine document type (curriculum, guide, worksheet, report)
2. Apply Layout System containers and spacing
3. Use Typography System scale and hierarchy
4. Apply Component Library patterns (callouts, tables, sections)
5. Check information density mode:
   - Expansive (20/80): Heroes, statements
   - Balanced (40/60): Features, explanations
   - Dense (60/40): Specs, reference

### Creating Web Content

1. Apply same principles as documents
2. Reference Layout System for responsive behavior
3. Consider dark/light section sequencing
4. Use Component Library for UI patterns
5. Ensure 8px grid compliance

---

## Quality Evaluation Checklist

Before finalizing any output:

### Hierarchy
- [ ] Immediately clear what's most important
- [ ] Eye flows naturally through content
- [ ] No competing elements at same level

### Restraint
- [ ] Can anything be removed without losing meaning?
- [ ] Every element has a job
- [ ] No decorative elements

### Consistency
- [ ] Follows established HLV patterns
- [ ] Spacing on 8px grid
- [ ] Similar elements look similar

### Craft
- [ ] Alignments are precise
- [ ] Typography correctly applied
- [ ] Weight transitions used appropriately
- [ ] Period punctuation on claims

### Purpose
- [ ] Serves learner attention
- [ ] Students would find this clear
- [ ] Embodies what HLV teaches

### Technical
- [ ] Correct color values used
- [ ] Font is Manrope
- [ ] Line heights appropriate for content type
- [ ] Container widths from system

---

## Handling Edge Cases

When specifications don't cover a situation:

1. **Identify closest pattern** — What documented component is most similar?
2. **Apply philosophy** — What would confident minimalism suggest?
3. **Prioritize function** — What does this element need to do?
4. **Default to restraint** — When uncertain, do less
5. **Note for future** — Flag edge case for system documentation

### Priority Order

When documents conflict:
1. Philosophy (does it align with HLV purpose?)
2. Audience needs (does it serve users?)
3. System consistency (does it follow patterns?)
4. Technical specification (does it match values?)

A philosophically aligned design that bends a specification may be right.
A technically correct design that violates philosophy is wrong.

---

## Integration with Other Skills

### hlv-asset-generator
- Use for: Diagrams, icons, illustrations
- This skill provides: Design context, quality standards
- Asset generator provides: Technical pipeline, GitHub workflow

### hlv-slides-generator
- Use for: Google Slides template implementation
- This skill provides: Content structure, slide types, copy
- Slides generator provides: Template mechanics, export

### hlv-design-system-updater
- Use for: Changing design tokens
- This skill provides: When changes are appropriate
- Updater provides: Technical propagation

---

## System Evolution

### When to Update Documentation

- New component patterns emerge
- Edge cases get resolved
- Specifications prove wrong in practice
- HLV needs evolve

### How to Propose Updates

1. Note what's missing or wrong
2. Document the solution used
3. Add to Design System Backlog (Notion)
4. Flag for human review

### Version Control

Design system documents should be versioned. Major changes require:
- Changelog entry
- Backlog item marked complete
- Communication to team

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│  HLV DESIGN SYSTEM — QUICK REFERENCE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  COLORS                                                     │
│  Navy: #182D53    Emerald: #00D866    Gray: #6E6E73        │
│                                                             │
│  TYPOGRAPHY                                                 │
│  Font: Manrope                                              │
│  Headlines: 600-700 weight, tight line-height (1.05-1.15)  │
│  Body: 400 weight, relaxed line-height (1.47-1.5)          │
│                                                             │
│  SPACING                                                    │
│  Base: 8px — Everything is multiples                        │
│  Section padding: 100px (desktop), 80px (tablet)           │
│  Containers: 680px (narrow), 960px (default), 1200px (wide)│
│                                                             │
│  KEY TECHNIQUES                                             │
│  • Weight transition: Bold claim + period + regular rest   │
│  • Gradient accent: One per page, on "the news"            │
│  • Dark/light: Tech=dark, education=light, values=colored  │
│                                                             │
│  NEVER                                                      │
│  • Decorative elements                                      │
│  • Borders/boxes around content                             │
│  • Multiple gradients                                       │
│  • Arbitrary spacing                                        │
│  • Competing hierarchies                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Notion Resources

| Resource | Location |
|----------|----------|
| Design System Backlog | `collection://ff653e3f-419c-4aad-80c1-530a4839532d` |
| Asset Library | `collection://83ff611e-7b33-4f52-8026-b728fc116340` |
| Curriculum Hub | `collection://9bf9fa9e-d7ef-43a3-b424-6c72d25d8d5f` |

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.1 | 2025-12-17 | Added hlv-slide-design skill reference, learnings log |
| 1.0 | 2025-12-17 | Initial creation from Apple design research synthesis |

---

## Learnings Log

*Production insights that inform system evolution. Batch into source documents when patterns stabilize.*

### 2025-12-17: Slide Spacing
- **Context:** Problem Reframing deck production
- **Issue:** Content felt cramped, minimalism lost
- **Learning:** Slides need 60-70% whitespace. One idea per slide. Split rather than cram.
- **Action:** Created `hlv-slide-design.skill` with spacing rules

### 2025-12-17: Gap vs Line Height
- **Issue:** Stacked text blocks too far apart on slides
- **Learning:** Use explicit `gap` values (16-24px) for related text, not line-height
- **Action:** Documented in `hlv-slide-design.skill`

### 2025-12-17: Decorative Number Alignment
- **Issue:** Large numbers (01, 02) misaligned with text
- **Learning:** Use `alignItems: flex-start` with `marginTop` optical adjustment
- **Action:** Documented pattern in `hlv-slide-design.skill`

---

*This skill is the entry point for all HLV design work. When in doubt, consult Philosophy & Strategy for principles, Decision Framework for choices.*
